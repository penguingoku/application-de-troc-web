# PowerShell script to help update Node.js
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Node.js Update Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$currentVersion = node -v
Write-Host "Current Node.js version: $currentVersion" -ForegroundColor Yellow
Write-Host ""
Write-Host "Angular CLI 20.3.9 requires Node.js v20.19+ or v22.12+" -ForegroundColor Red
Write-Host ""

Write-Host "Options to update Node.js:" -ForegroundColor Green
Write-Host "1. Download from https://nodejs.org/ (Recommended)" -ForegroundColor White
Write-Host "   - Download the LTS version (v20.x or v22.x)" -ForegroundColor Gray
Write-Host "   - Run the installer" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Use NVM for Windows (if installed):" -ForegroundColor White
Write-Host "   nvm install 20.19.0" -ForegroundColor Gray
Write-Host "   nvm use 20.19.0" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Check if NVM is installed:" -ForegroundColor White
$nvmInstalled = Get-Command nvm -ErrorAction SilentlyContinue
if ($nvmInstalled) {
    Write-Host "   ✓ NVM is installed!" -ForegroundColor Green
    Write-Host "   Run: nvm install 20.19.0" -ForegroundColor Yellow
} else {
    Write-Host "   ✗ NVM is not installed" -ForegroundColor Red
    Write-Host "   Download from: https://github.com/coreybutler/nvm-windows/releases" -ForegroundColor Gray
}
Write-Host ""
Write-Host "After updating Node.js, run: npm start" -ForegroundColor Cyan

