# ========================================
# Allure Report với History Links
# ========================================

$ResultsDir = "./allure-results"
$ReportsRoot = "./allure-reports"
$HistoryFile = "./history.jsonl"
$ServerPort = 5500

# Kiểm tra thư mục kết quả
if (-not (Test-Path $ResultsDir)) {
    Write-Host "Error: Results directory '$ResultsDir' not found." -ForegroundColor Red
    exit 1
}

# Tạo folder riêng cho lần chạy này
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$ReportDir = Join-Path $ReportsRoot $Timestamp

Write-Host "`n=== Allure Report với History Links ===" -ForegroundColor Cyan
Write-Host "Report: $ReportDir" -ForegroundColor Gray

# Generate report
Write-Host "`nGenerating report..." -ForegroundColor Cyan
cmd /c "npx allure awesome $ResultsDir --output $ReportDir --history-path $HistoryFile"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to generate report." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "Report generated!" -ForegroundColor Green

# Debug: Check folder structure & FLATTEN
Write-Host "`nChecking folder structure..." -ForegroundColor Gray
$AwesomeFolder = Join-Path $ReportDir "awesome"
$IndexInAwesome = Join-Path $AwesomeFolder "index.html"

if (Test-Path $IndexInAwesome) {
    Write-Host "Found report in /awesome subfolder" -ForegroundColor Green
    
    # FLATTEN: Move everything from /awesome to parent, then create symlink
    # Allure code adds "/awesome" to URL, so we need:
    # /2025-12-31/awesome/index.html  ← Allure navigates here
    # Current structure is already correct!
    Write-Host "Structure OK - /awesome subfolder exists" -ForegroundColor Green
} else {
    Write-Host "Warning: index.html not found in /awesome" -ForegroundColor Yellow
    # Check what's in ReportDir
    Write-Host "Contents of $ReportDir :" -ForegroundColor Yellow
    Get-ChildItem $ReportDir | ForEach-Object { Write-Host "  - $($_.Name)" }
}

# ========== PATCH HISTORY.JSONL ==========
if (Test-Path $HistoryFile) {
    Write-Host "`nPatching history.jsonl..." -ForegroundColor Yellow
    
    # URL relative từ server root
    $ReportUrl = "http://localhost:$ServerPort/$Timestamp"
    
    $lines = @(Get-Content $HistoryFile -Encoding UTF8 | Where-Object { $_.Trim() -ne "" })
    
    if ($lines.Count -gt 0) {
        $lastLine = $lines[-1]
        if ($lastLine -is [string]) { $lastLine = $lastLine.Trim() }
        
        try {
            if ($lastLine.StartsWith("{") -and $lastLine.EndsWith("}")) {
                $entry = $lastLine | ConvertFrom-Json
                $entry.url = $ReportUrl
                $lines[-1] = ($entry | ConvertTo-Json -Compress -Depth 10)
                $lines | Out-File $HistoryFile -Encoding UTF8 -Force
                Write-Host "History patched! URL: $ReportUrl" -ForegroundColor Green
            }
        } catch {
            Write-Host "Warning: Could not patch history.jsonl" -ForegroundColor Yellow
        }
    }
}

# ========== SERVE & OPEN ==========
Write-Host "`nStarting server..." -ForegroundColor Cyan

$AbsoluteReportsRoot = (Resolve-Path $ReportsRoot).Path

# URL path - since server strips /awesome, always use base URL
$ReportUrl = "http://localhost:$ServerPort/$Timestamp/"

Write-Host "Server root: $AbsoluteReportsRoot" -ForegroundColor Gray
Write-Host "Report URL:  $ReportUrl" -ForegroundColor Gray
Write-Host "`nHistory links should now be clickable!" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop server`n" -ForegroundColor Yellow

# Mở browser sau 2 giây để server kịp start
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 2
    Start-Process $using:ReportUrl
} | Out-Null

# Copy server script nếu chưa có
$ServerScript = Join-Path $AbsoluteReportsRoot "server.cjs"
# Always recreate to ensure latest version
$ServerCode = @'
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5500;
const ROOT = '.';

const MIME = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff':'font/woff','.woff2':'font/woff2'};

http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  
  // IMPORTANT: Allure auto-appends /awesome to URLs, but our reports don't have that subfolder
  // Strip /awesome from path and redirect to parent
  if (url.endsWith('/awesome') || url.includes('/awesome/')) {
    url = url.replace('/awesome/', '/').replace('/awesome', '');
    if (url === '' || url === '/') url = '/';
  }
  
  let file = path.join(ROOT, url);
  
  console.log(`[${new Date().toISOString().slice(11,19)}] ${req.method} ${req.url} -> ${url}`);
  
  if (!fs.existsSync(file)) { 
    console.log('  -> 404 Not found');
    res.writeHead(404); res.end('Not found'); 
    return; 
  }
  if (fs.statSync(file).isDirectory()) {
    const idx = path.join(file, 'index.html');
    if (fs.existsSync(idx)) file = idx;
    else { res.writeHead(200,{'Content-Type':'text/html'}); res.end('<h1>Dir</h1>'); return; }
  }
  
  const ext = path.extname(file).toLowerCase();
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(500); res.end('Error'); return; }
    res.writeHead(200, {'Content-Type': MIME[ext]||'application/octet-stream','Access-Control-Allow-Origin':'*'});
    res.end(data);
  });
}).listen(PORT, () => console.log('\nServer: http://localhost:' + PORT + '\n'));
'@
$ServerCode | Out-File $ServerScript -Encoding UTF8 -Force
Write-Host "Server script updated (strips /awesome from URLs)" -ForegroundColor Gray

# Start server
Push-Location $AbsoluteReportsRoot
try {
    node server.cjs
} finally {
    Pop-Location
}