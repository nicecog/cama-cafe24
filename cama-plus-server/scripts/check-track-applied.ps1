$base = 'http://127.0.0.1:8080'
$login = Invoke-RestMethod -Method Post -Uri "$base/api/auth" -ContentType 'application/json' -Body '{"principal":"vmtest01","credentials":"Test123!@","firebase":null}'
$h = @{ api_key = "Bearer $($login.response.apiToken)" }
$r = Invoke-RestMethod -Uri "$base/api/track/service" -Headers $h
Write-Host "diseaseSeq=$($r.response.diseaseSeq) days=$($r.response.days)"
