# Start local HTTP server and open in browser
$port = 8000
$url = "http://localhost:$port"

Write-Host "Starting local server on $url" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start Python HTTP server
Set-Location (Split-Path $MyInvocation.MyCommand.Path)
Start-Process -FilePath "python" -ArgumentList "-m http.server $port" -NoNewWindow

# Wait a moment for server to start
Start-Sleep -Seconds 2

# Open in default browser (Chrome if available)
Write-Host "Opening in browser..." -ForegroundColor Green
Start-Process $url
