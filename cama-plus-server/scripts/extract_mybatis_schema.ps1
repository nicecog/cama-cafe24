# MyBatis mapper XML에서 테이블명을 추출해 draft SQL 헤더를 생성합니다.
param(
    [string]$MapperDir = "$PSScriptRoot\..\src\main\resources\mapper",
    [string]$OutFile = "$PSScriptRoot\..\docs\cama_schema_draft.sql"
)

$outDir = Split-Path $OutFile -Parent
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

$files = Get-ChildItem -Path $MapperDir -Filter '*.xml' -Recurse
$tables = @{}

foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    $matches = [regex]::Matches($content, '(?i)(?:from|join|into|update)\s+([a-z][a-z0-9_\.]*)')
    foreach ($m in $matches) {
        $t = $m.Groups[1].Value.ToLower()
        if ($t -in @('select', 'where', 'set', 'values', 'dual')) { continue }
        if (-not $tables.ContainsKey($t)) { $tables[$t] = @() }
        if ($tables[$t] -notcontains $f.Name) { $tables[$t] += $f.Name }
    }
}

$lines = @(
    '-- Cama schema draft (auto-extracted from MyBatis mappers)',
    "-- Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm')",
    '-- Review column types from Java entities and mapper resultMaps.',
    ''
)

foreach ($t in ($tables.Keys | Sort-Object)) {
    $refs = $tables[$t] -join ', '
    $lines += "-- Table: $t (refs: $refs)"
    $lines += "-- CREATE TABLE $t (...);"
    $lines += ''
}

$lines | Set-Content -Path $OutFile -Encoding UTF8
Write-Host "Wrote $($tables.Count) table names to $OutFile"
