$ResultsDir = "./allure-results"
$ReportDir = "./allure-report"
$HistoryFile = "./history.jsonl"

# Check results
if (-not (Test-Path $ResultsDir)) {
    Write-Host "Error: '$ResultsDir' not found." -ForegroundColor Red
    exit 1
}

Write-Host "Generating Allure report..." -ForegroundColor Cyan
npx allure awesome $ResultsDir --output $ReportDir --history-path $HistoryFile

if ($LASTEXITCODE -eq 0) {
    Write-Host "Report generated!" -ForegroundColor Green
    Write-Host "Opening report..." -ForegroundColor Cyan
    
    # Check for /awesome subfolder (Allure 3 structure)
    $AwesomePath = Join-Path $ReportDir "awesome"
    if (Test-Path $AwesomePath) {
        npx allure open $AwesomePath
    } elseif (Test-Path $ReportDir) {
        # Fallback: open report root
        npx allure open $ReportDir
    } else {
        Write-Host "Warning: Report folder not found. Try running test first." -ForegroundColor Yellow
    }
} else {
    Write-Host "Failed to generate report." -ForegroundColor Red
    exit $LASTEXITCODE
}