# Run App Script with Node.js Version Check
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Angular Application" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$nodeVersion = node -v
Write-Host "Current Node.js version: $nodeVersion" -ForegroundColor Yellow

# Extract major version number
$majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')

if ($majorVersion -lt 20) {
    Write-Host ""
    Write-Host "❌ ERROR: Node.js version is too old!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Required: Node.js v20.19+ or v22.12+" -ForegroundColor Yellow
    Write-Host "Current:  $nodeVersion" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please update Node.js:" -ForegroundColor White
    Write-Host "1. Download from: https://nodejs.org/" -ForegroundColor Cyan
    Write-Host "2. Install the LTS version (v20.x or v22.x)" -ForegroundColor Cyan
    Write-Host "3. Restart PowerShell and run this script again" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or run: .\update-node.ps1" -ForegroundColor Green
    exit 1
}

if ($majorVersion -eq 20) {
    $minorVersion = [int]($nodeVersion -replace 'v\d+\.(\d+)\..*', '$1')
    if ($minorVersion -lt 19) {
        Write-Host ""
        Write-Host "❌ ERROR: Node.js version is too old!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Required: Node.js v20.19+ or v22.12+" -ForegroundColor Yellow
        Write-Host "Current:  $nodeVersion" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please update Node.js to v20.19+ or v22.12+" -ForegroundColor White
        exit 1
    }
}

Write-Host "✅ Node.js version is compatible!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host "The app will be available at: http://localhost:4200/" -ForegroundColor Green
Write-Host ""

npm start

