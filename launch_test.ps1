Write-Host "--- DinApp New Year's Eve Launch Sequence ---" -ForegroundColor Cyan

# 1. Cleanup
Write-Host "Ensuring clean environment..."
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue 2>$null
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue 2>$null

# 2. Start Backend
Write-Host "Step 1: Launching Backend API..." -ForegroundColor Gold
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# 3. Server Stabilization Wait (The requested 30s)
Write-Host "Backend Initializing. Waiting 30 seconds for DB and API stabilization..." -ForegroundColor White
for ($i = 30; $i -gt 0; $i--) {
    Write-Progress -Activity "Backend Warmup" -Status "$i seconds remaining..." -PercentComplete ((30 - $i) / 30 * 100)
    Start-Sleep -Seconds 1
}

# 4. Start Frontend
Write-Host "Step 2: Launching Frontend Application..." -ForegroundColor Gold
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

# 5. Final App Stabilization
Write-Host "Frontend Starting. Finalizing setup (10s)..." -ForegroundColor White
Start-Sleep -Seconds 10

# 6. Secure Launch in Chrome
Write-Host "Step 3: Opening DinApp Dashboard in Chrome..." -ForegroundColor Cyan
$chromePath = "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe"
$chromePath86 = "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"

if (Test-Path $chromePath) {
    Start-Process $chromePath -ArgumentList "http://localhost:3000"
}
elseif (Test-Path $chromePath86) {
    Start-Process $chromePath86 -ArgumentList "http://localhost:3000"
}
else {
    Write-Host "Chrome binary not found. Falling back to default browser." -ForegroundColor Yellow
    Start-Process "http://localhost:3000"
}

Write-Host "--- LAUNCH SEQUENCE COMPLETE ---" -ForegroundColor Green
Write-Host "Access Admin with: +67573067659 / 1234567q / OTP 030323" -ForegroundColor White
