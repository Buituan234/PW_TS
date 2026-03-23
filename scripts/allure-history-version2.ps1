$ResultsDir = "allure-results"
$ReportDir = "allure-report"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ALLURE REPORT GENERATOR" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan

# BƯỚC 1: Copy history từ report cũ
if (Test-Path "$ReportDir\history") {
    Write-Host "[1/3] Copying history..." -ForegroundColor Yellow
    if (-not (Test-Path $ResultsDir)) { 
        New-Item -ItemType Directory -Path $ResultsDir | Out-Null 
    }
    if (Test-Path "$ResultsDir\history") { 
        Remove-Item -Recurse -Force "$ResultsDir\history" 
    }
    Copy-Item -Recurse "$ReportDir\history" "$ResultsDir\history"
    Write-Host "      Done!" -ForegroundColor Green
} else {
    Write-Host "[1/3] No history (first run)" -ForegroundColor Gray
}

# BƯỚC 2: Xóa report cũ trước khi generate mới (thay cho --clean)
if (Test-Path $ReportDir) {
    Write-Host "[2/3] Cleaning old report..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $ReportDir
    Write-Host "      Done!" -ForegroundColor Green
} else {
    Write-Host "[2/3] No old report to clean" -ForegroundColor Gray
}

# BƯỚC 3: Generate report (Allure 3 syntax)
Write-Host "[3/3] Generating report..." -ForegroundColor Yellow
# dành cho phiên bản ver 2.0
npx allure-commandline generate $ResultsDir -o $ReportDir --clean

if ($LASTEXITCODE -eq 0) {
    Write-Host "      Done!" -ForegroundColor Green
} else {
    Write-Host "      Failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Open: allure open $ReportDir" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""