#Requires -Version 5.1
$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding $false
$base = 'http://127.0.0.1:8080'

$loginBody = [System.Text.Encoding]::UTF8.GetBytes('{"principal":"localpatient","credentials":"Test1234!","firebase":null}')
$login = Invoke-RestMethod -Method Post -Uri "$base/api/auth" -ContentType 'application/json; charset=utf-8' -Body $loginBody
$token = $login.response.apiToken

$resp = Invoke-WebRequest -Uri "$base/api/hospital/list" -Headers @{ api_key = "Bearer $token" } -UseBasicParsing
$json = [System.Text.Encoding]::UTF8.GetString($resp.RawContentStream.ToArray())
if (-not $json) { $json = $resp.Content }
$data = $json | ConvertFrom-Json

Write-Host "hospital count: $($data.response.Count)"
foreach ($h in $data.response) {
    Write-Host "  [$($h.seq)] $($h.name)"
}

$search = [char]0xC911 + [char]0xC559  # 중앙 UTF-16 from codepoints - actually use string literal in UTF8 file
$search = '중앙'
$matches = @($data.response | Where-Object { $_.name.Contains($search) })
Write-Host "search '$search' => $($matches.Count) match(es)"
if ($matches.Count -lt 1) { throw 'no match for 중앙' }
if ($matches[0].name -match '\?{2,}') { throw 'garbled hospital name' }
Write-Host 'API OK' -ForegroundColor Green
