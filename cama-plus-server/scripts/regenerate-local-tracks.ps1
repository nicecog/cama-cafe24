#Requires -Version 5.1
<#
.SYNOPSIS
  콘텐츠 mig 이전에 생성된 빈 track_service.data 를 재생성합니다.
  ACTIVE 트랙 중 data 합계가 0인 건만 취소 후 동일 설정으로 다시 신청합니다.

.EXAMPLE
  cd F:\cama_pjt\cama-plus-server
  powershell -ExecutionPolicy Bypass -File .\scripts\regenerate-local-tracks.ps1
#>
param(
    [string]$BaseUrl = 'http://127.0.0.1:8080',
    [string]$DockerContainer = 'cama-local-postgres',
    [string]$LocalUser = 'cama',
    [string]$LocalDb = 'cama'
)

$ErrorActionPreference = 'Stop'

function Invoke-LocalPsqlQuery([string]$Sql) {
    docker exec $DockerContainer psql -U $LocalUser -d $LocalDb -t -A -F '|' -c $Sql
}

function Get-TrackInterestJson([long]$TrackSeq) {
    $raw = docker exec $DockerContainer psql -U $LocalUser -d $LocalDb -t -A -c "SELECT interest FROM track_service WHERE seq=$TrackSeq"
    return $raw.Trim()
}

function Get-HpDiseaseName([long]$HpDiseaseSeq) {
    $raw = docker exec $DockerContainer psql -U $LocalUser -d $LocalDb -t -A -c "SELECT cd.name FROM hp_disease hd JOIN cm_disease cd ON cd.seq = hd.disease_seq WHERE hd.seq = $HpDiseaseSeq;"
    return $raw.Trim()
}

function Get-TreatmentName([long]$TreatmentSeq) {
    $raw = docker exec $DockerContainer psql -U $LocalUser -d $LocalDb -t -A -c "SELECT name FROM care_time_type WHERE seq = $TreatmentSeq;"
    return $raw.Trim()
}

function Invoke-TrackApi([string]$Method, [string]$Path, $BodyObj) {
    $headers = @{ 'Content-Type' = 'application/json' }
    $json = if ($null -eq $BodyObj) { $null } else { $BodyObj | ConvertTo-Json -Depth 8 -Compress }
    if ($Method -eq 'GET') {
        return Invoke-RestMethod -Method Get -Uri "$BaseUrl$Path" -Headers $headers -TimeoutSec 30
    }
    return Invoke-RestMethod -Method Post -Uri "$BaseUrl$Path" -Headers $headers -Body $json -TimeoutSec 30
}

Write-Host '=== regenerate local track_service.data ===' -ForegroundColor Cyan

$rows = Invoke-LocalPsqlQuery @"
SELECT ts.seq,
       ts.account_seq,
       a.login_id,
       ts.hospital_seq,
       ts.days,
       (ts.disease->>'seq')::bigint AS hp_disease_seq,
       (ts.disease->'diseaseTreatment'->0->>'seq')::bigint AS treatment_seq,
       COALESCE(hd.disease_seq, ts.disease_seq) AS cm_disease_seq
FROM track_service ts
JOIN account a ON a.seq = ts.account_seq
LEFT JOIN hp_disease hd
  ON hd.seq = (ts.disease->>'seq')::bigint
 AND hd.hospital_seq = ts.hospital_seq
WHERE ts.status = 'ACTIVE'
  AND ts.is_enabled
  AND COALESCE((SELECT SUM(jsonb_array_length(value)) FROM jsonb_each(ts.data)), 0) = 0
ORDER BY ts.seq;
"@

if (-not $rows -or $rows.Count -eq 0 -or [string]::IsNullOrWhiteSpace($rows[0])) {
    Write-Host 'No empty ACTIVE tracks found.' -ForegroundColor Green
    exit 0
}

foreach ($line in $rows) {
    if ([string]::IsNullOrWhiteSpace($line)) { continue }
    $parts = $line -split '\|', 8
    $trackSeq = $parts[0]
    $accountSeq = [long]$parts[1]
    $loginId = $parts[2]
    $hospitalSeq = [long]$parts[3]
    $days = [long]$parts[4]
    $hpDiseaseSeq = [long]$parts[5]
    $treatmentSeq = [long]$parts[6]
    $cmDiseaseSeq = [long]$parts[7]

    Write-Host "`n[$loginId] track #$trackSeq (h=$hospitalSeq, disease=$cmDiseaseSeq, days=$days)" -ForegroundColor Cyan

    $interestRaw = Get-TrackInterestJson ([long]$trackSeq)
    try {
        $interest = $interestRaw | ConvertFrom-Json
    }
    catch {
        $interest = @('증상 알아보기')
        Write-Host '  interest JSON invalid/truncated -> using default' -ForegroundColor DarkYellow
    }

    $diseaseName = Get-HpDiseaseName $hpDiseaseSeq
    $treatmentName = Get-TreatmentName $treatmentSeq

    $optionRows = Invoke-LocalPsqlQuery @"
SELECT seq, group_name, option_name
FROM hp_disease_option
WHERE hp_disease_seq = $hpDiseaseSeq
ORDER BY seq;
"@
    $diseaseOptions = @()
    foreach ($optLine in $optionRows) {
        if ([string]::IsNullOrWhiteSpace($optLine)) { continue }
        $o = $optLine -split '\|', 3
        $diseaseOptions += @{
            seq        = [long]$o[0]
            groupName  = $o[1]
            optionName = $o[2]
        }
    }

    $disease = @{
        seq              = $hpDiseaseSeq
        name             = $diseaseName
        diseaseSeq       = $cmDiseaseSeq
        diseaseOption    = $diseaseOptions
        diseaseTreatment = @(@{ seq = $treatmentSeq; name = $treatmentName })
    }

    docker exec $DockerContainer psql -U $LocalUser -d $LocalDb -c `
        "UPDATE track_service SET status='CANCEL', updated_at=now() WHERE seq=$trackSeq;" | Out-Null

    $applyBody = @{
        acSeq      = $accountSeq
        days       = $days
        diseaseSeq = $cmDiseaseSeq
        interest   = @($interest)
        diseases   = $disease
    }

    try {
        $result = Invoke-TrackApi 'POST' '/api/webview/track/service' $applyBody
        if ($result) {
            $newData = Invoke-LocalPsqlQuery "SELECT COALESCE((SELECT SUM(jsonb_array_length(value)) FROM jsonb_each(data)),0) FROM track_service WHERE account_seq=(SELECT seq FROM account WHERE login_id='$loginId') AND status='ACTIVE';"
            Write-Host "  reapplied OK (content slots=$($newData.Trim()))" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "  apply failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nDone." -ForegroundColor Green
