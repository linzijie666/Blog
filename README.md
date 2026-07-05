# 硬件/嵌入式工程师个人作品集

一个用 React + Vite 搭建的暗色系个人作品集网站，面向硬件工程师/嵌入式工程师的项目展示。

## 本地运行

```bash
npm install
npm run dev
```

## 页面模块

- 全屏 Hero：视频背景、大标题、导航栏和联系按钮。
- 个人经历：人物图、介绍、联系方式、项目数据。
- 精选项目：大卡片展示项目图片。
- 个人优势：能力卡片。
- 底部联系：整屏收尾页。

## 替换素材

- Hero 视频：替换 `src/App.jsx` 中 `heroVideoUrl`。
- 项目图片：替换 `public/images/projects/` 下的占位图。
- 头像/人物图：替换 `public/images/profile.svg`。

## 部署

推荐 Vercel：

1. 把项目推送到 GitHub。
2. 在 Vercel 导入仓库。
3. Framework Preset 选择 Vite，构建命令使用 `npm run build`，输出目录为 `dist`。
