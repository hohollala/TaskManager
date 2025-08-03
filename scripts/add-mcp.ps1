param(
    [Parameter(Mandatory=$true)]
    [string]$ServerName
)

$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DistPath = Join-Path $CurrentDir "dist\index.js"

Write-Host "🔧 MCP 서버 '$ServerName' 추가 중..." -ForegroundColor Yellow
Write-Host "📁 경로: $DistPath" -ForegroundColor Cyan

# 기존 서버 제거 (에러 무시)
try {
    claude mcp remove $ServerName -s user 2>$null
    Write-Host "🗑️ 기존 $ServerName 서버 제거됨" -ForegroundColor Gray
} catch {
    # 서버가 존재하지 않는 경우 무시
}

# 새 서버 추가
$AddCommand = "claude mcp add $ServerName -s user -- node `"$DistPath`""
Write-Host "🔧 실행 중: $AddCommand" -ForegroundColor Cyan

try {
    Invoke-Expression $AddCommand
    
    Write-Host "✅ MCP 서버 '$ServerName' 추가 완료!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 현재 MCP 서버 상태:" -ForegroundColor Yellow
    claude mcp list
} catch {
    Write-Host "❌ MCP 서버 추가 실패: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} 