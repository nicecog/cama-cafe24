$base = 'http://127.0.0.1:8080'
$login = Invoke-RestMethod -Method Post -Uri "$base/api/auth" -ContentType 'application/json' -Body '{"principal":"vmtest01","credentials":"Test123!@","firebase":null}'
Write-Host "login success=$($login.success)"
Write-Host ($login | ConvertTo-Json -Depth 4)
$token = $login.response.apiToken
$headers = @{ 'api_key' = "Bearer $token"; 'Content-Type' = 'application/json' }

function Test-Api($name, $method, $uri, $body) {
    try {
        if ($method -eq 'GET') {
            $r = Invoke-WebRequest -Method Get -Uri "$base$uri" -Headers $headers -TimeoutSec 15
        } else {
            $r = Invoke-WebRequest -Method Post -Uri "$base$uri" -Headers $headers -Body $body -TimeoutSec 15
        }
        Write-Host "OK $name $($r.StatusCode)"
    } catch {
        $code = $_.Exception.Response.StatusCode.value__
        Write-Host "FAIL $name code=$code"
    }
}

Test-Api 'hospital' 'GET' '/api/account/hospital' ''
Test-Api 'track-check' 'GET' '/api/track/service/check' ''
Test-Api 'track-info' 'GET' '/api/track/service' ''
Test-Api 'coaching' 'POST' '/api/coaching/service/getCoachingProgressList' '{"loginId":"vmtest01","categoryCd":"","stepDayCd":"","progressTypeCd":""}'
Test-Api 'schedule' 'GET' '/api/schedule?d=2026-05-31' ''
Test-Api 'track-list' 'POST' '/api/track/service/info' '{"day":1,"diseaseSeq":1,"hospitalSeq":1}'
