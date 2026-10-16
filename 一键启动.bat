@echo off
chcp 65001 >nul
title RHINE LAB OS // 一键启动终端开发服务器
color 0F

echo =========================================================================
echo    RHINE LAB TERMINAL OS // GARGANTUA BLACK HOLE ENGINE
echo    MAYI-111 个人档案与相对论黑洞视界 · 一键启动程序
echo =========================================================================
echo.

:: 1. 检查 Node.js 是否已安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js 环境！
    echo 请先前往 Node.js 官网下载并安装 LTS 版本: https://nodejs.org/
    echo 安装完成后，重新双击此脚本即可。
    echo.
    pause
    exit /b 1
)

:: 显示 Node.js 与 NPM 版本
echo [1/3] Node.js 环境检测正常:
for /f "tokens=*" %%i in ('node -v') do echo        Node 版本: %%i
for /f "tokens=*" %%i in ('npm -v') do echo        NPM  版本: %%i
echo.

:: 2. 检查依赖 node_modules 是否存在
if not exist "node_modules\" (
    echo [2/3] 首次启动，正在自动安装项目依赖 (npm install)...
    echo       这可能需要几十秒钟，请稍候...
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败，请检查网络连接后重试！
        pause
        exit /b 1
    )
    echo       依赖安装完成！
) else (
    echo [2/3] 依赖检查完成 (node_modules 已就绪)。
)
echo.

:: 3. 启动 Vite 开发服务器并自动弹出浏览器
echo [3/3] 正在启动开发服务器并自动打开浏览器...
echo       本地地址: http://localhost:3000/
echo       提示: 在终端按 Ctrl+C 可停止运行。
echo.
echo -------------------------------------------------------------------------
call npm run dev -- --open

pause
