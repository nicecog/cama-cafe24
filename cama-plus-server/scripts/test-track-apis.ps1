$base = 'http://127.0.0.1:8080'
foreach ($acct in @('vmtest01', 'happycog')) {
    Write-Host "`n=== $acct ===" -ForegroundColor Cyan
    $login = Invoke-RestMethod -Method Post -Uri "$base/api/auth" -ContentType 'application/json' -Body (@{ principal = $acct; credentials = 'Test123!@'; firebase = $null } | ConvertTo-Json)
    $headers = @{ 'api_key' = "Bearer $($login.response.apiToken)"; 'Content-Type' = 'application/json' }
    foreach ($ep in @(
        @{ n = 'track-info'; m = 'GET'; u = '/api/track/service'; b = $null },
        @{ n = 'track-list'; m = 'POST'; u = '/api/track/service/info'; b = '{"day":1,"diseaseSeq":2,"hospitalSeq":1}' },
        @{ n = 'track-done'; m = 'POST'; u = '/api/track/service/done'; b = '{"day":7,"diseaseSeq":2,"hospitalSeq":1}' }
    )) {
        try {
            if ($ep.m -eq 'GET') { $r = Invoke-WebRequest -Method Get -Uri "$base$($ep.u)" -Headers $headers -TimeoutSec 15 }
            else { $r = Invoke-WebRequest -Method Post -Uri "$base$($ep.u)" -Headers $headers -Body $ep.b -TimeoutSec 15 }
            Write-Host "OK $($ep.n) $($r.StatusCode) len=$($r.Content.Length)"
        } catch {
            Write-Host "FAIL $($ep.n) code=$($_.Exception.Response.StatusCode.value__)"
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host $reader.ReadToEnd()
        }
    }
}
