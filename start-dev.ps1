$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $root "frontend"

Write-Host "Levantando stack de microservicios con Docker..." -ForegroundColor Cyan
docker compose up -d --build

Write-Host "Iniciando frontend en $frontendDir..." -ForegroundColor Cyan
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendDir'; npm install; npm run dev -- --host 0.0.0.0" -WorkingDirectory $root | Out-Null

Write-Host "" 
Write-Host "La aplicación quedó disponible en:" -ForegroundColor Green
Write-Host "- Gateway: http://localhost:8080"
Write-Host "- Frontend: http://localhost:3000"
Write-Host "- Eureka: http://localhost:8761"
Write-Host "- Spring Boot Admin: http://localhost:9090"
Write-Host "- Usuario Admin: admin / admin123"
