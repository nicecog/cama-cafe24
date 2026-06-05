#Requires -Version 5.1
<#
.SYNOPSIS
  운영(또는 DEV) API에서 병원별 질환/옵션/치료시기 데이터를 로컬 PostgreSQL에 복사합니다.

.EXAMPLE
  cd F:\cama_pjt\cama-plus-server
  powershell -ExecutionPolicy Bypass -File .\scripts\import-hospital-diseases-from-prod.ps1

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File .\scripts\import-hospital-diseases-from-prod.ps1 `
    -ProdBaseUrl 'https://dev-api.camaplus.me' -ProdHospitalSeq 1 -LocalHospitalSeqs 1,2
#>
param(
    [string]$ProdBaseUrl = 'https://api.camaplus.me',
    [int]$ProdHospitalSeq = 1,
    [int[]]$LocalHospitalSeqs = @(1, 2),
    [string]$DockerContainer = 'cama-local-postgres',
    [string]$DbUser = 'cama',
    [string]$DbName = 'cama'
)

$ErrorActionPreference = 'Stop'

# prod cm_disease.seq -> local cm_disease.seq (이름 기준: 유방암/폐암/대장암/갑상선암)
$ProdToLocalDiseaseSeq = @{
    2 = 1  # 유방암
    3 = 2  # 폐암
    4 = 3  # 대장암
    6 = 5  # 갑상선암
}

function Escape-Sql([string]$s) {
    if ($null -eq $s) { return '' }
    return $s.Replace("'", "''")
}

function Invoke-LocalSql([string]$Sql) {
    docker exec $DockerContainer psql -U $DbUser -d $DbName -v ON_ERROR_STOP=1 -c $Sql | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "SQL failed: $Sql" }
}

function Get-LocalDiseaseMap {
    param([int[]]$Seqs)
    $map = @{}
    foreach ($seq in $Seqs) {
        $map[$seq] = $seq
    }
    return $map
}

Write-Host "Fetching prod diseases: $ProdBaseUrl/api/webview/hospital/$ProdHospitalSeq/disease/list" -ForegroundColor Cyan
$uri = "$ProdBaseUrl/api/webview/hospital/$ProdHospitalSeq/disease/list"
$jsonPath = Join-Path (Split-Path $PSScriptRoot -Parent) 'docs\_prod_hospital_diseases_cache.json'
try {
    $web = Invoke-WebRequest -Uri $uri -UseBasicParsing -TimeoutSec 60
    $utf8 = New-Object System.Text.UTF8Encoding $false
    $jsonText = $utf8.GetString($web.Content)
    [System.IO.File]::WriteAllText($jsonPath, $jsonText, $utf8)
}
catch {
    if (-not (Test-Path $jsonPath)) { throw }
    Write-Host "  (using cached JSON: $jsonPath)" -ForegroundColor Yellow
}
$resp = Get-Content -Path $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
if ($resp.response) {
    $diseases = @($resp.response)
}
else {
    $diseases = @($resp)
}
Write-Host "  prod diseases: $($diseases.Count)" -ForegroundColor Green

$diseaseMap = Get-LocalDiseaseMap -Seqs @($ProdToLocalDiseaseSeq.Values)
Write-Host "  mapped disease seqs: $($ProdToLocalDiseaseSeq.Values -join ', ')" -ForegroundColor Green

foreach ($hSeq in $LocalHospitalSeqs) {
    Write-Host "Importing into local hospital_seq=$hSeq ..." -ForegroundColor Cyan
    foreach ($d in $diseases) {
        $localDiseaseSeq = $ProdToLocalDiseaseSeq[[int]$d.diseaseSeq]
        if (-not $localDiseaseSeq) {
            Write-Host "  [skip] unmapped prod diseaseSeq=$($d.diseaseSeq)" -ForegroundColor Yellow
            continue
        }

        $exists = docker exec $DockerContainer psql -U $DbUser -d $DbName -t -A -c `
            "SELECT seq FROM hp_disease WHERE hospital_seq=$hSeq AND disease_seq=$localDiseaseSeq LIMIT 1;"
        $hpSeq = ($exists | Out-String).Trim()
        if ([string]::IsNullOrWhiteSpace($hpSeq)) {
            Invoke-LocalSql "INSERT INTO hp_disease (hospital_seq, disease_seq, is_enabled) VALUES ($hSeq, $localDiseaseSeq, true);"
            $hpSeq = (docker exec $DockerContainer psql -U $DbUser -d $DbName -t -A -c `
                "SELECT seq FROM hp_disease WHERE hospital_seq=$hSeq AND disease_seq=$localDiseaseSeq ORDER BY seq DESC LIMIT 1;" | Out-String).Trim()
        }
        Write-Host "  diseaseSeq $($d.diseaseSeq) -> local $localDiseaseSeq (hp_disease.seq=$hpSeq)" -ForegroundColor DarkGray

        $sortTr = 1
        foreach ($item in @($d.diseaseTreatment)) {
            if ($null -eq $item) { continue }
            $name = Escape-Sql $item.name
            $period = Escape-Sql $item.treatmentPeriod
            $cnt = (docker exec $DockerContainer psql -U $DbUser -d $DbName -t -A -c `
                "SELECT COUNT(*) FROM hp_disease_treatment WHERE hp_disease_seq=$hpSeq AND name='$name';" | Out-String).Trim()
            if ($cnt -eq '0') {
                Invoke-LocalSql "INSERT INTO hp_disease_treatment (hp_disease_seq, name, sort, is_enabled, treatment_period) VALUES ($hpSeq, '$name', $sortTr, true, '$period');"
                $sortTr++
            }
        }

        $sortOpt = 1
        foreach ($item in @($d.diseaseOption)) {
            if ($null -eq $item) { continue }
            $group = Escape-Sql $item.groupName
            $opt = Escape-Sql $item.optionName
            $cnt = (docker exec $DockerContainer psql -U $DbUser -d $DbName -t -A -c `
                "SELECT COUNT(*) FROM hp_disease_option WHERE hp_disease_seq=$hpSeq AND group_name='$group' AND option_name='$opt';" | Out-String).Trim()
            if ($cnt -eq '0') {
                Invoke-LocalSql "INSERT INTO hp_disease_option (hp_disease_seq, group_name, option_name, sort, is_enabled) VALUES ($hpSeq, '$group', '$opt', $sortOpt, true);"
                $sortOpt++
            }
        }
    }
}

Write-Host 'Done. Verify:' -ForegroundColor Green
docker exec $DockerContainer psql -U $DbUser -d $DbName -c `
    "SELECT hd.seq, hd.hospital_seq, ch.name AS hospital, cd.name AS disease, (SELECT COUNT(*) FROM hp_disease_option o WHERE o.hp_disease_seq=hd.seq) AS options, (SELECT COUNT(*) FROM hp_disease_treatment t WHERE t.hp_disease_seq=hd.seq) AS treatments FROM hp_disease hd JOIN cm_hospital ch ON ch.seq=hd.hospital_seq JOIN cm_disease cd ON cd.seq=hd.disease_seq ORDER BY hd.hospital_seq, hd.seq;"
