# LzjEngineer Embedded Blog

面向硬件与嵌入式工程方向的个人作品集网站，使用 React + Vite 构建。网站以暗色、克制、偏工程化的视觉风格，展示电源硬件、板级调试、STM32 固件开发、竞赛经历与技术笔记。

## 功能概览

- **Hero 首页**：桌面端在用户未开启“减少动态效果”时播放视频背景，同时提供本地海报图作为降级方案。
- **个人经历**：展示教育背景、硬件实习、联系方式、项目数据与竞赛获奖情况。
- **精选项目**：展示 3 个硬件项目，点击卡片可打开项目详情面板。
- **工程证据**：100W 双向 DC-DC 项目包含实物、效率、振铃、驱动波形、采样原理图和 PCB 等图片。
- **能力与奖项**：覆盖 PCB、电源拓扑、仪器测量、STM32、通信接口和可靠性测试等方向。
- **Knowledge 专栏**：分八章组织硬件面试复习文章——前六章覆盖无源器件、基础半导体器件、电源、主控芯片、PCB Layout 与模拟器件，第七章整理 IIC/SPI、RS232/RS485、LVDS、千兆网和 HDMI/PCIE/USB，第八章整理 PDN、传输线、SI 测量、等长、传输路径与眼图，并保留电容 / 电感原理旧文作为延伸阅读。
- **独立文章路由**：使用轻量 Hash 路由，不依赖 React Router；文章支持目录、上一篇 / 下一篇和分章 PDF 课件下载。
- **LaTeX 风格公式**：公式使用 `Z_C`、`V_{GS}` 等 LaTeX 子集语法书写，渲染为真正的上下角标。

## 当前展示内容

- 电子蝴蝶：ESP-01S 物联网呼吸灯装置
- 100W 双向数字 DC-DC 变换器：STM32G474 / HRTIM / 4 层板 / 双环控制
- 小智 AI 设计工程：锂电池供电与 TP4056 充电管理
- 第一章无源器件面试复习：电阻选型、电容与 PDN、功率电感、磁珠与 EMI
- 第二章基础半导体器件复习：二极管速复、三极管开关与放大、光耦 CTR 与线与、MOS 管损耗与 SOA
- 第三章电源类复习：DC-DC 设计流程与 BUCK/BOOST 拓扑、伏秒平衡、上电时序、纹波噪声抑制、LDO 原理与电源树
- 第四章主控芯片复习：STM32 最小系统与晶振、FPGA 上电时序与配置加载、DDR 容量与等长设计、复位与看门狗
- 第五章 PCB Layout 复习：3W 与参考平面、去耦半径与时钟走线、铺铜包地与隔离挖空、接地与 20H、绕等长与阻抗、加工工艺与 HDI、开关电源布局与通流
- 第六章模拟器件复习：运放虚短虚断与参数选型、基本运算电路、恒流源与 ADC/DAC 接口、ADC 架构与选型、精度设计与基准源
- 第七章高速接口复习：IIC/SPI、建立保持时间、RS232/RS485、LVDS、千兆网、HDMI/PCIE/USB
- 第八章 SI&PI 复习：PDN、传输线与端接、VNA/TDR、等时设计、高速传输路径、眼图与均衡
- 电路基础延伸阅读：电容与电感的时域关系、频域阻抗、通信电路应用和真实器件边界

## 技术栈

- React 19
- Vite 6
- `motion`
- GSAP
- `lucide-react`
- 原生 CSS

## 项目结构

```text
.
├── public/
│   ├── downloads/              # 可公开下载的复习课件 PDF（八章各一份）
│   └── images/                 # Hero、项目图片和知识文章配图（按章分目录）
├── scripts/                    # 课件页裁切出图脚本（Python + Pillow）
├── src/
│   ├── components/             # 通用动效文本组件
│   ├── knowledge/              # 知识专栏、文章页和 Hash 路由
│   ├── App.jsx                 # 首页、项目数据和整体页面装配
│   ├── main.jsx                # React 入口
│   └── styles.css              # 首页全局样式
├── tests/                      # Node 原生测试
├── vite.config.js              # Vite 配置和部署路径配置
├── index.html
└── package.json
```

## 本地开发

进入项目目录并安装依赖：

```bash
cd C:\Users\ASUS\Desktop\博客
npm install
```

启动开发服务器：

```bash
npm run dev
```

默认访问地址：

```text
http://127.0.0.1:5173/
```

执行生产构建：

```bash
npm run build
```

本地预览生产版本：

```bash
npm run preview
```

运行项目测试：

```bash
node --test
```

## 内容维护

### 修改首页文案、经历和联系方式

首页主要内容集中在 `src/App.jsx`：

- `email`：邮箱地址。
- `heroVideoUrl`：Hero 视频地址。
- `navItems`：顶部导航及对应锚点。
- `stats`：首页数据卡片。
- `resumeHighlights`：教育背景和实习经历。
- `honors`：竞赛与获奖信息。
- `capabilities`：个人能力卡片。

开屏欢迎语位于 `TextType` 的 `text` 属性中，邮箱入口会同步使用 `email` 常量。

### 新增或修改项目

在 `src/App.jsx` 的 `projects` 数组中编辑项目对象。常用字段如下：

- `title`：项目标题。
- `type`：项目类型或技术方向。
- `date`：可选，项目时间。
- `image`：项目封面路径。
- `description`：项目简介。
- `tags`：项目标签。
- `github`：GitHub 链接。
- `source` / `sourceLabel`：可选的第二个项目链接及按钮名称。
- `metrics`：可选的关键测试数据。
- `gallery`：可选的工程图片列表。
- `detail.software`、`detail.hardware`、`detail.bom`、`detail.cost`、`detail.stack`、`detail.result`：项目详情内容。

项目图片放在 `public/images/projects/`，在代码中通过 `assetPath("images/projects/xxx")` 引用。替换图片后，需要同步更新项目对象中的 `image` 或 `gallery[].src`。

### 修改知识专栏

知识专栏按章组织，章定义与文章元数据集中在 `src/knowledge/articles.js`（`knowledgeChapters` + `reviewArticleDefinitions`），专栏首页的分组卡片位于 `src/knowledge/KnowledgeSection.jsx`，共享页面框架位于 `src/knowledge/ArticleShell.jsx`（按章节渲染对应 PDF 下载）。三十八篇复习文章正文都位于 `src/knowledge/articles/`，并在 `src/knowledge/ReviewArticle.jsx` 中映射；旧文章正文保留在 `src/knowledge/KnowledgeArticle.jsx`。

当前文章使用以下 Hash 地址：

```text
#/knowledge/resistor            # 第一章 · 电阻
#/knowledge/capacitor           # 第一章 · 电容
#/knowledge/inductor            # 第一章 · 电感
#/knowledge/ferrite-bead        # 第一章 · 磁珠
#/knowledge/diode               # 第二章 · 二极管
#/knowledge/triode              # 第二章 · 三极管
#/knowledge/optocoupler         # 第二章 · 光耦
#/knowledge/mosfet              # 第二章 · MOS 管
#/knowledge/switching-regulator # 第三章 · 开关电源
#/knowledge/linear-regulator    # 第三章 · 线性稳压源
#/knowledge/mcu                 # 第四章 · 单片机
#/knowledge/fpga                # 第四章 · FPGA
#/knowledge/ddr                 # 第四章 · DDR
#/knowledge/reset-watchdog      # 第四章 · 复位与看门狗
#/knowledge/pcb-routing         # 第五章 · 走线规则
#/knowledge/pcb-decoupling      # 第五章 · 去耦与时钟
#/knowledge/pcb-copper-pour     # 第五章 · 铺铜与包地
#/knowledge/pcb-ground-design   # 第五章 · 接地设计
#/knowledge/pcb-high-speed      # 第五章 · 高速设计
#/knowledge/pcb-fab-hdi         # 第五章 · 加工工艺与板型
#/knowledge/pcb-power-layout    # 第五章 · 电源 Layout 与通流
#/knowledge/opamp-basics        # 第六章 · 运放基础
#/knowledge/opamp-circuits      # 第六章 · 运算电路
#/knowledge/opamp-apps          # 第六章 · 运放应用
#/knowledge/adc-primer          # 第六章 · ADC
#/knowledge/vref-precision      # 第六章 · 精度设计与基准源
#/knowledge/iic-spi             # 第七章 · IIC 与 SPI
#/knowledge/setup-hold-time     # 第七章 · 建立保持时间
#/knowledge/rs232-rs485         # 第七章 · RS232 与 RS485
#/knowledge/lvds                # 第七章 · LVDS
#/knowledge/gigabit-ethernet    # 第七章 · 千兆网
#/knowledge/hdmi-pcie-usb       # 第七章 · HDMI / PCIE / USB
#/knowledge/pi-pdn              # 第八章 · PI 与 PDN
#/knowledge/transmission-line-termination # 第八章 · 传输线与端接
#/knowledge/si-measurement      # 第八章 · SI 测量
#/knowledge/length-matching     # 第八章 · 等长设计
#/knowledge/si-routing          # 第八章 · 高速传输路径
#/knowledge/eye-diagram-jitter  # 第八章 · 眼图与均衡
#/knowledge/capacitor-inductor  # 延伸阅读 · 旧文
```

新增文章时，先在 `src/knowledge/articles.js` 的对应章节下注册元数据（含 `chapter` 字段），再在 `src/knowledge/ReviewArticle.jsx` 绑定正文组件。课件裁切图按章存放于 `public/images/knowledge/` 下的 `passive-components/`、`semiconductor-devices/`、`power-supplies/`、`digital-chips/`、`pcb-layout/`、`analog-devices/`、`high-speed-interfaces/` 和 `si-pi/`；正文使用 WebP，高清查看链接使用对应的 `-hd.jpg`。公开 PDF 位于 `public/downloads/`，第七章 `high-speed-interfaces-review.pdf` 为 66 页，第八章 `si-pi-review.pdf` 为 98 页。

课件配图由脚本批量裁切生成：

```bash
# 第一章（44 页水印 JPG）
python scripts/build_passive_article_assets.py <第一章JPG目录> public/images/knowledge/passive-components

# 第二章（60 页水印 JPG）
python scripts/build_semiconductor_article_assets.py <第二章JPG目录> public/images/knowledge/semiconductor-devices

# 第三章（56 页水印 JPG）
python scripts/build_power_article_assets.py <第三章JPG目录> public/images/knowledge/power-supplies

# 第四章（66 页水印 JPG）
python scripts/build_digital_article_assets.py <第四章JPG目录> public/images/knowledge/digital-chips

# 第五章（32 页水印 JPG）
python scripts/build_pcb_layout_article_assets.py <第五章JPG目录> public/images/knowledge/pcb-layout

# 第六章（51 页水印 JPG）
python scripts/build_analog_article_assets.py <第六章JPG目录> public/images/knowledge/analog-devices

# 第七章（66 页水印 JPG）
python scripts/build_high_speed_interface_article_assets.py <第七章JPG目录> public/images/knowledge/high-speed-interfaces

# 第八章（98 页水印 JPG；源路径中的双空格必须保留）
python scripts/build_si_pi_article_assets.py "<第八章  双空格 JPG目录>" public/images/knowledge/si-pi
```

公式使用 `FormulaText` 组件渲染 LaTeX 子集：`_x` / `_{xx}` 生成下角标，`^x` / `^{xx}` 生成上角标，例如 `<FormulaText text="I_{BQ} = (V_{CC} - U_{BEQ})/R_b" />`。注意：花括号语法只能出现在字符串属性或 `{"..."}` 字符串表达式中，直接写在 JSX 子节点里会被当作 JS 表达式导致页面白屏。

### 替换头像和项目素材

- 头像：`public/images/profile.svg`
- Hero 海报：`public/images/hero-poster.svg`
- 项目封面与工程图片：`public/images/projects/`
- 网站图标：`public/favicon.svg`

本地视频可以放到 `public/videos/`，并使用 `assetPath("videos/xxx.mp4")` 生成兼容部署子路径的地址。

## 部署

### Vercel

Vercel 对 Vite 项目无需额外配置：

- Framework Preset：`Vite`
- Install Command：`npm install`
- Build Command：`npm run build`
- Output Directory：`dist`

导入 GitHub 仓库后点击 Deploy。之后推送到关联分支，Vercel 会自动重新构建和部署。

### GitHub Pages

项目的 `vite.config.js` 支持通过 `VITE_BASE` 配置部署在子路径下的站点。

如果仓库名为 `你的用户名.github.io`，使用默认路径 `/`。如果仓库名为普通项目名，例如 `embedded-blog`，构建时设置：

```text
VITE_BASE=/embedded-blog/
```

PowerShell 本地构建示例：

```powershell
$env:VITE_BASE="/embedded-blog/"
npm run build
```

GitHub Actions 可以使用以下构建步骤：

```yaml
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
```

普通项目仓库需要在构建步骤中补充环境变量：

```yaml
- run: npm run build
  env:
    VITE_BASE: /embedded-blog/
```

部署前在 GitHub 仓库的 `Settings -> Pages` 中将 Source 设置为 `GitHub Actions`。

## 上线前检查

先执行：

```bash
npm run build
node --test
```

然后手动确认：

- 首页 Hero、海报图和欢迎文案正常显示。
- `Experience`、`Projects`、`Capabilities`、`Knowledge` 导航可以正常跳转。
- 三个项目卡片图片正常，项目详情面板可以打开、关闭，并能访问 GitHub / OSHWHub 链接。
- Knowledge 专栏按八章分组展示，三十八篇复习文章及旧文章都能打开，目录、上一篇 / 下一篇和返回专栏入口可用。
- 专栏八章的下载按钮对应 8 份课件，其中第七章 `high-speed-interfaces-review.pdf` 为 66 页、第八章 `si-pi-review.pdf` 为 98 页；文章页尾下载文案与章节一致，正文配图可以打开高清版本。
- 邮箱链接可以打开邮件客户端。
- 部署后的图片、CSS、JS 等资源没有 404。
- 页面刷新后没有空白页，浏览器控制台没有运行时错误。

## 常见问题

### GitHub Pages 部署后图片或资源不显示

确认构建时设置了正确的仓库子路径，例如：

```text
VITE_BASE=/embedded-blog/
```

Vercel 部署通常保持默认的 `/` 即可。

### 部署后页面空白

确认构建命令执行成功，并检查部署平台的输出目录是否为：

```text
dist
```

如果是 GitHub Pages 普通项目仓库，还需要确认 `VITE_BASE` 与仓库名一致。

### 修改后线上没有变化

确认文件已经提交并推送：

```bash
git status
git add .
git commit -m "Update site"
git push
```

然后等待 Vercel 或 GitHub Actions 完成自动部署。
