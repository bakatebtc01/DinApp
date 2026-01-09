Write-Host 'Starting DinApp Portable Sandbox...'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $scriptDir) { $scriptDir = '.' }
$dotEnv = Join-Path $scriptDir 'backend\.env'
$dotEnvExample = Join-Path $scriptDir 'backend\.env.example'
if (-not (Test-Path $dotEnv)) {
    if (Test-Path $dotEnvExample) {
        Copy-Item $dotEnvExample $dotEnv
        Write-Host 'Created backend/.env from template.'
    }
}
Start-Process powershell -ArgumentList '-NoExit', '-Command', "cd '$scriptDir/backend'; npm install; npm run dev"
Start-Process powershell -ArgumentList '-NoExit', '-Command', "cd '$scriptDir/frontend'; npm install; npm run dev"
Write-Host 'Services started in separate windows.'
Write-Host 'Press any key to exit this launcher...'
$null = [System.Console]::ReadKey($true)
