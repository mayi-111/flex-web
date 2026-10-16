@echo off
chcp 65001 >nul
title RHINE LAB OS // 一键打包生产版本并本地预览
color 0F

echo =========================================================================
echo    RHINE LAB TERMINAL OS // GARGANTUA BLACK HOLE ENGINE
echo    一键生产打包与预览验证 (Production Build & Preview)
echo =========================================================================
echo.

:: 1. 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js 环境！
    pause
    exit /b 1
)

:: 2. 检查依赖
if not exist "node_modules\" (
    echo [*] 正在安装依赖...
    call npm install
)

:: 3. 执行生产打包
echo [1/2] 正在进行 Vite 生产级编译打包 (npm run build)...
call npm run build
if %errorlevel% neq 0 (
    echo [错误] 生产打包失败！
    pause
    exit /b 1
)
echo       打包成功！生成文件存放在 dist/ 目录。
echo.

:: 4. 启动本地生产预览服务器
echo [2/2] 正在启动生产预览服务器并自动打开浏览器...
echo       预览地址: http://localhost:4173/
echo       提示: 此时运行的是用于部署到 GitHub Pages 的完整静态生产制品。
echo.
echo -------------------------------------------------------------------------
call npx vite preview --open

pause
