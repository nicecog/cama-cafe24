# Gradle 빌드 시 JDK 17 사용 (Android Studio와 동일 권장 JDK)
# Android Studio: Settings → Build → Gradle → Gradle JDK → Microsoft JDK 17

$Jdk17 = "C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot"
if (-not (Test-Path "$Jdk17\bin\java.exe")) {
    Write-Error "JDK 17 not found: $Jdk17"
    exit 1
}

$env:JAVA_HOME = $Jdk17
$env:PATH = "$Jdk17\bin;$env:PATH"

Set-Location $PSScriptRoot
& .\gradlew.bat @args
