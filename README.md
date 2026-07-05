# LzjEngineer Embedded Blog

这是一个面向硬件工程师 / 嵌入式工程师的个人作品集网站，使用 React + Vite 构建。整体风格是暗色、克制、偏工程作品集，用来展示硬件项目、嵌入式固件、调试记录和联系方式。

当前版本重点展示真实项目：

- 电子蝴蝶：ESP-01S 物联网呼吸灯装置
- STM32G474 同步整流 Buck-Boost 数字电源
- 小智 AI 设计工程

## 技术栈

- React 19
- Vite 6
- Motion
- GSAP
- Lucide React
- 原生 CSS

## 页面结构

- 全屏首页 Hero：视频背景、打字开屏文本、导航栏和联系按钮。
- 个人经历模块：人物视觉、个人介绍、联系方式、项目数据。
- 精选项目模块：单列大卡片展示项目封面，点击后打开详情面板。
- 项目详情面板：包含软件方案、硬件方案、物料选型、成本、技术栈、实际效果、GitHub / 项目链接。
- 个人优势模块：展示硬件 bring-up、固件架构、信号调试、通信协议、可靠性设计等能力。
- 底部联系模块：整屏收尾页，突出邮箱和 GitHub。

## 本地开发

进入项目目录：

```bash
cd C:\Users\ASUS\Desktop\博客
```

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

默认访问：

```text
http://127.0.0.1:5173/
```

生产构建：

```bash
npm run build
```

本地预览生产版本：

```bash
npm run preview
```

## 内容维护

主要内容在 `src/App.jsx` 中维护。

### 修改开屏文本

搜索：

```jsx
text="欢迎来到LzjEngineer的Blog！很高兴见到你!"
```

改成你想展示的欢迎语即可。

### 修改邮箱

搜索：

```jsx
const email = "850207333@qq.com";
```

替换成新的邮箱。

### 新增或修改项目

搜索：

```jsx
const projects = [
```

每个项目对象包含：

- `title`：项目标题
- `type`：项目类型 / 技术方向
- `image`：项目封面
- `description`：项目一句话介绍
- `tags`：项目标签
- `github`：GitHub 链接
- `source`：可选，项目页面链接，例如 OSHWHub
- `sourceLabel`：可选，第二个按钮的显示名称
- `detail.software`：软件方案
- `detail.hardware`：硬件方案
- `detail.bom`：物料选型
- `detail.cost`：成本
- `detail.stack`：技术栈
- `detail.result`：实际效果文字说明

### 替换项目图片

项目图片放在：

```text
public/images/projects/
```

推荐使用 JPG / PNG / WebP，图片宽度建议不小于 1200px。替换图片后，在 `src/App.jsx` 中确认项目的 `image` 指向正确文件。

### 修改头像 / 人物图

默认人物图：

```text
public/images/profile.svg
```

可以替换成自己的头像、工程照、工作台照片或更正式的人物图。

### 修改 Hero 视频

搜索：

```jsx
const heroVideoUrl =
```

替换成你自己的公开视频地址。如果想使用本地视频，可以把视频放到 `public/videos/`，再用 `assetPath("videos/xxx.mp4")` 引用。

## 部署上线方案

推荐优先使用 Vercel。它对 Vite 项目支持最好，部署简单，后续绑定域名也方便。

## 方案一：部署到 Vercel（推荐）

### 1. 准备 GitHub 仓库

在 GitHub 新建一个仓库，例如：

```text
embedded-blog
```

然后在项目目录执行：

```bash
git init
git add .
git commit -m "Initial embedded portfolio blog"
git branch -M main
git remote add origin https://github.com/你的GitHub用户名/embedded-blog.git
git push -u origin main
```

如果本地已经有 Git 仓库，只需要确认远程地址正确，然后提交并推送：

```bash
git add .
git commit -m "Update portfolio blog"
git push
```

### 2. 导入 Vercel

打开 Vercel，新建项目，选择刚才的 GitHub 仓库。

配置保持默认即可：

- Framework Preset：Vite
- Install Command：`npm install`
- Build Command：`npm run build`
- Output Directory：`dist`

然后点击 Deploy。

### 3. 更新网站

以后每次修改项目后：

```bash
git add .
git commit -m "Update portfolio content"
git push
```

Vercel 会自动重新部署。

### 4. 绑定自定义域名（可选）

在 Vercel 项目的 Domains 中添加你的域名，例如：

```text
blog.yourdomain.com
```

然后按照 Vercel 给出的提示，在域名服务商那里添加 DNS 记录。

## 方案二：部署到 GitHub Pages

GitHub Pages 完全免费，适合和 GitHub 仓库绑定使用。这里推荐用 GitHub Actions 自动部署。

### 1. 判断部署地址类型

如果仓库名是：

```text
你的GitHub用户名.github.io
```

网站地址会是：

```text
https://你的GitHub用户名.github.io/
```

这种情况 `base` 使用默认 `/`。

如果仓库名是普通项目名，例如：

```text
embedded-blog
```

网站地址会是：

```text
https://你的GitHub用户名.github.io/embedded-blog/
```

这种情况构建时需要设置：

```text
VITE_BASE=/embedded-blog/
```

项目的 `vite.config.js` 已经支持这个环境变量。

### 2. 新建 GitHub Actions 工作流

在项目中新建文件：

```text
.github/workflows/deploy.yml
```

如果你的仓库名是 `你的GitHub用户名.github.io`，使用：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

如果你的仓库名是普通项目名，例如 `embedded-blog`，把构建步骤改成：

```yaml
      - run: npm run build
        env:
          VITE_BASE: /embedded-blog/
```

完整文件里只需要替换这一段即可。

### 3. 打开 GitHub Pages

进入 GitHub 仓库：

```text
Settings -> Pages
```

Source 选择：

```text
GitHub Actions
```

保存后，推送代码：

```bash
git add .
git commit -m "Deploy portfolio blog"
git push
```

稍等 Actions 跑完，就能访问 GitHub Pages 地址。

## 上线前检查清单

部署前建议先本地执行：

```bash
npm run build
npm run preview
```

然后检查：

- 首页 Hero 是否正常显示视频背景和欢迎文本。
- 导航锚点是否能跳转到 Experience / Projects / Capabilities / Contact。
- 三个项目卡片是否正常显示封面。
- 点击项目卡片后详情面板是否能打开和关闭。
- 邮箱链接是否打开邮件客户端。
- GitHub / OSHWHub 链接是否能打开。
- 页面刷新后没有空白页。
- 浏览器控制台没有资源 404。

## 常见问题

### 部署后图片不显示

如果使用 GitHub Pages 的普通仓库路径，例如 `/embedded-blog/`，请确认构建时设置了：

```text
VITE_BASE=/embedded-blog/
```

Vercel 一般不需要设置。

### 部署后页面空白

先检查构建是否成功：

```bash
npm run build
```

再检查部署平台的输出目录是否是：

```text
dist
```

### 修改后线上没有变化

确认已经提交并推送：

```bash
git status
git add .
git commit -m "Update site"
git push
```

Vercel 和 GitHub Pages 都需要等自动部署完成后才会更新。
