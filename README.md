# mayi-111 // RHINE LAB OS TERMINAL
### GARGANTUA 相对论克尔黑洞视界 · 纯白工业美学交互主页

[![GitHub stars](https://img.shields.io/github/stars/mayi-111/GARGANTUA-Blackhole-demo?style=flat-square&color=e53935&label=GARGANTUA%20Demo)](https://github.com/mayi-111/GARGANTUA-Blackhole-demo)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)](#)
[![Single-File Architecture](https://img.shields.io/badge/Flagship-123%20KB%20Zero--Dependency-orange.svg?style=flat-square)](#)

> **mayi-111** 个人档案与开源项目视界终端。基于《明日方舟》《终末地》与鹰角网络工业美学构建，主打代表作 **GARGANTUA 广义相对论克尔黑洞实时物理渲染引擎**，融合纯白可交互 3D 参数化曲面雕塑、轴测三维卡匣抽拉交互阵列与整屏物理滑动画卷。

---

## ⚡ 一键极速启动 (Quick Start)

本项目内置开箱即用的双击脚本，无需复杂命令行配置：

### Windows 用户 (推荐)
- **开发调试 (热重载)**：直接双击运行根目录下的 **`一键启动.bat`**
  - 自动检测 Node.js 环境（若未安装会给出下载指引）
  - 自动检查并安装项目依赖 (`npm install`)
  - 启动 Vite 本地开发服务器并**自动唤起默认浏览器**打开 `http://localhost:3000/`
- **生产打包验证**：双击运行 **`一键打包并预览.bat`**
  - 执行 Vite 生产编译（产物自动放入 `dist/`，耗时仅 ~200ms）
  - 启动生产环境本地预览服务器 `http://localhost:4173/`

### macOS / Linux 用户
在终端中执行：
```bash
chmod +x start.sh
./start.sh
```

### 通用命令行运行
```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 生产打包
npm run build

# 4. 本地预览生产构建产物
npm run preview
```

---

## 🚀 如何上传到 GitHub 并部署到 GitHub Pages

项目已预先配置好 **`base: './'`** 与 **`.github/workflows/deploy.yml`** 自动化部署流水线，推送到 GitHub 后即可实现零配置自动化上线！

### 第 1 步：在 GitHub 上创建新仓库
1. 登录您的 GitHub 账号（`@mayi-111`）；
2. 点击右上角 **New repository**；
3. 仓库名例如：`flexible-web` 或 `mayi-111.github.io`；
4. 设为 **Public**，不要勾选 "Initialize this repository with a README"（本地已有完整代码）。

### 第 2 步：初始化本地 Git 并推送代码
在项目根目录下打开终端（PowerShell 或 Git Bash），执行以下命令：
```bash
# 1. 初始化 Git 仓库
git init

# 2. 添加所有文件（已配置好 .gitignore，自动过滤 node_modules 与 dist）
git add .

# 3. 提交初始版本
git commit -m "feat: initial commit for mayi-111 terminal & GARGANTUA black hole showcase"

# 4. 将主分支命名为 main
git branch -M main

# 5. 关联您的 GitHub 远端仓库（请将下方 URL 替换为您创建的实际仓库地址）
git remote add origin https://github.com/mayi-111/flexible-web.git

# 6. 推送到 GitHub
git push -u origin main
```

### 第 3 步：开启 GitHub Pages 自动部署
1. 打开 GitHub 仓库页面，点击顶部的 **Settings**（设置）；
2. 在左侧菜单中找到 **Pages**；
3. 在 **Build and deployment** 下方的 **Source** 下拉菜单中，选择 **GitHub Actions**；
4. 此时 GitHub Actions 会自动触发 `.github/workflows/deploy.yml`，在几十秒内自动完成编译并生成可在公网访问的专属网址：
   `https://mayi-111.github.io/flexible-web/`

---

## 🌟 核心体系架构与板块设计

### 1. 00 // 总览 (HERO OVERVIEW)
- 巨幅标题 `BUILD WITH. INTENT` 与工业级状态徽章。
- 直观呈现开发者核心标识 `@mayi-111` 与代表作 **GARGANTUA** 核心规格（WebGL 2.0 / GLSL · 123 KB · 零依赖交付）。
- 直达仓库链接与 3D 档案库快捷跳转。

### 2. 01 // 档案 (ARCHIVE & GLASS CARD)
- 开发者个人理念与纯浏览器环境极限工程定位。
- **高拟真磨砂玻璃机密档案卡片**（复刻参考图）：
  - 动态激光扫描网点剪影（`PHOTO CLASSIFIED`）、动态系统时钟。
  - **授权口令校验系统**：支持输入 `mayi`、`gargantua`、`kerr`、`doctor`、`admin` 等密钥解密核心信令。
  - **硬切警报拦截机制**：输错口令时，输入框即刻标红震颤，并触发全屏 **WARNING 2.6 秒故障警报**与倒计时自动复原。

### 3. 02 // 架构 (ARCHITECTURE MATRIX)
真实呈现 GARGANTUA 引擎与前端工程底层技术能力矩阵：
- **数理与相对论**：克尔度规 (Kerr Metric)、零测地线方程 (Null Geodesic)、RK4 数值自适应步进积分器、多普勒集束与频移、能层与光子球动力学。
- **着色器与管线**：WebGL 2.0 原生管线、GLSL 着色器语言、光线步进 (Raymarching)、Three.js 场景调度、黑体辐射光谱积分。
- **轻量交付**：123 KB 单文件打包、零外部网络/CDN依赖、60 FPS 严格性能预算、原生 ESNext、Vite 生产优化。
- **交互与体验**：3D 轴测卡匣抽拉交互、Web Audio 程序音效、拟态硬件物理触感、整屏物理滑动画卷、全键盘与无障碍支持。

### 4. 03 // 作品 (3D ARCHIVE CASSETTE SHELF)
- **轴测三维卡匣库**（深度复刻 Bilibili PV 概念与参考图）：
  - 远距离高视角三维轴测（Axonometric）卡匣机库，数百枚精细档案卡匣工整排列。
  - 每一枚卡匣均支持**点击丝滑向上抽拉拉起**并伴随阻尼弹簧物理动效。
  - 悬浮 HUD 实时投影对齐拉起的卡匣，解密显示对应核心物理模块。
  - **7 大广义相对论核心模块全覆盖**：
    1. `X-001`: GARGANTUA 相对论克尔黑洞实时引擎
    2. `X-002`: 克尔测地线四阶龙格库塔数值积分
    3. `X-003`: 极端相对论多普勒集束与频移（β≈0.72c）
    4. `X-004`: 爱因斯坦光子球与阴影边界
    5. `X-005`: 克尔能层与时空拖拽效应（愣色-蒂尔林效应）
    6. `X-006`: Novikov-Thorne 几何薄吸积盘多温辐射模型
    7. `X-007`: 123 KB 单文件零依赖极致交付架构
  - 点击卡匣或按 ENTER 呼出详细档案弹窗，实时运行 **广义相对论吸积盘粒子流与光子球动态遥测**，一键直达 GitHub 代码。
  - 全键盘导航支持：`←` `→` 切换模块列，`↑` `↓` 切换卡匣，`ENTER` 调阅档案，鼠标拖拽可任意旋转 3D 视角。

### 5. 04 // 留言 (FEEDBACK SIGNAL IN)
- 纯前端本地加密密封信令表单。
- 内置强类型输入校验与**拒绝反馈机制**：未按要求填写时，输入框即刻红色高亮、触发警告提示与故障警报音。

### 6. 05 // 通联 (TRANSMISSION LINK & SAY HI)
- 倒角工业科技质感 `SAY HI` 交互按钮，点击在全屏背景激起同心物理冲击波。
- 快捷直达 GitHub 个人主页与 GARGANTUA 项目仓库。

---

## 🎛️ 独立视效控制系统

- **纯白 3D 参数化肋板曲面雕塑**：随鼠标产生平滑的 3D 惯性俯仰与偏航转动，名片按键敲击时激起空间能量光环脉冲。
- **动态物理碰撞波纹画布**：光标划过时等高线产生真实的排斥形变。
- **右上角拟态昼夜硬件开关**：精准还原金属滑道与微米级滚花旋钮，伴随继电器声学反馈。
- **3D 控制台侧边栏 (Ctrl+B)**：可实时调整莫比乌斯扭角、肋板网格密度、回旋转速与波纹排斥力。
- **整屏滑动控制器**：滑动手势以整块完整屏幕为物理单位精准吸附。

---

## 📦 项目文件结构

```
flexible-web/
├── 一键启动.bat            # Windows 一键启动开发服务器（自动安装依赖+自动开浏览器）
├── 一键打包并预览.bat       # Windows 一键生产编译并本地启动预览
├── start.sh               # macOS / Linux 启动脚本
├── .gitignore             # Git 忽略配置（已忽略 node_modules、dist 等）
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Pages 自动部署 Actions 流水线
├── index.html             # 单页应用入口（6 大整屏完整板块）
├── vite.config.js         # Vite 构建配置（相对路径基准、Three.js 代码分割）
├── package.json           # 项目包配置
├── src/
│   ├── main.js            # 主程序入口调度
│   ├── style.css          # 工业级设计系统样式表（浅色纯白 + 深色高对比）
│   └── components/
│       ├── archive3DShelf.js   # 3D 档案卡匣库（Three.js + 测地线/吸积盘渲染）
│       ├── sculptureScene.js   # 纯白参数化肋板曲面 3D 雕塑
│       ├── waveBackground.js   # 物理波纹碰撞画布
│       ├── fullpageScroll.js   # 整屏物理单位吸附滑动引擎
│       ├── glassProfileCard.js # 磨砂玻璃卡片与 2.6s 警报封锁系统
│       ├── neumorphicSwitch.js # 拟态昼夜物理开关
│       ├── soundEngine.js      # Web Audio 程序化交互音效合成器
│       ├── feedbackForm.js     # 本地信令校验表单
│       ├── footerContact.js    # 通联与 Say Hi 交互
│       └── sidebarControls.js  # 3D 视效参数控制台
```

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源发布。
欢迎自由用于个人展示与技术交流，欢迎 Star 关注代表作 [GARGANTUA Blackhole Demo](https://github.com/mayi-111/GARGANTUA-Blackhole-demo)！
