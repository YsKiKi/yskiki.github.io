# 需要管理员权限运行此脚本
# 检查是否以管理员权限运行
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "此脚本需要管理员权限运行。正在尝试以管理员身份重新启动..." -ForegroundColor Yellow
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "开始执行注册表配置..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# 任务1: 在HKLM下创建Windows Update暂停天数设置
Write-Host "`n[任务1] 设置Windows Update最大暂停天数..." -ForegroundColor Green
try {
    $regPath = "HKLM:\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings"
    
    # 确保注册表路径存在
    if (-not (Test-Path $regPath)) {
        New-Item -Path $regPath -Force | Out-Null
        Write-Host "  创建注册表路径: $regPath" -ForegroundColor Yellow
    }
    
    # 创建DWORD值
    Set-ItemProperty -Path $regPath -Name "FlightSettingsMaxPauseDays" -Value 65535 -Type DWord -Force
    Write-Host "  ✓ 成功设置 FlightSettingsMaxPauseDays = 65535 (十进制)" -ForegroundColor Green
}
catch {
    Write-Host "  ✗ 错误: $_" -ForegroundColor Red
    exit 1
}

# 任务2: 修改文件资源管理器设置并重启explorer
Write-Host "`n[任务2] 配置文件资源管理器注册表项..." -ForegroundColor Green
try {
    # 执行reg add命令
    $regCmd = 'reg add "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /ve /d "" /f'
    $result = Invoke-Expression $regCmd 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ 成功修改注册表项" -ForegroundColor Green
    }
    else {
        Write-Host "  ✗ 注册表修改失败: $result" -ForegroundColor Red
        exit 1
    }
    
    # 重启文件资源管理器
    Write-Host "`n  正在重启文件资源管理器..." -ForegroundColor Yellow
    
    # 结束explorer进程
    Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    
    # 启动explorer
    Start-Process explorer.exe
    
    Write-Host "  ✓ 文件资源管理器已重启" -ForegroundColor Green
}
catch {
    Write-Host "  ✗ 错误: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "所有任务已完成！" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# 暂停以查看结果
Write-Host "`n按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
