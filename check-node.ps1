# Quick Node.js Version Checker
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Node.js Version Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

try {
    $nodeVersion = node -v
    Write-Host "Current Node.js version: $nodeVersion" -ForegroundColor Yellow
    
    # Extract version numbers
    if ($nodeVersion -match 'v(\d+)\.(\d+)\.(\d+)') {
        $major = [int]$matches[1]
        $minor = [int]$matches[2]
        
        Write-Host ""
        
        if ($major -ge 22) {
            Write-Host "✅ Your Node.js version is compatible!" -ForegroundColor Green
            Write-Host "You can run: npm start" -ForegroundColor Green
        } elseif ($major -eq 20 -and $minor -ge 19) {
            Write-Host "✅ Your Node.js version is compatible!" -ForegroundColor Green
            Write-Host "You can run: npm start" -ForegroundColor Green
        } else {
            Write-Host "❌ Node.js version is too old!" -ForegroundColor Red
            Write-Host ""
            Write-Host "Required: v20.19+ or v22.12+" -ForegroundColor Yellow
            Write-Host "Current:  $nodeVersion" -ForegroundColor Red
            Write-Host ""
            Write-Host "To update:" -ForegroundColor White
            Write-Host "1. Visit: https://nodejs.org/" -ForegroundColor Cyan
            Write-Host "2. Download the LTS version" -ForegroundColor Cyan
            Write-Host "3. Install it" -ForegroundColor Cyan
            Write-Host "4. Restart PowerShell and run this script again" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Opening Node.js download page..." -ForegroundColor Green
            Start-Sleep -Seconds 2
            Start-Process "https://nodejs.org/"
        }
    }
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Start-Process "https://nodejs.org/"
}

Write-Host ""

