# 新增第五章「PCB Layout」（7 篇）与第六章「模拟器件」（5 篇），共 12 篇文章

沿用现有四章的完整工作流：裁图脚本 → 注册 → 文章组件 → 测试 → README。

## 一、文章结构（定稿）

**第五章 slug `pcb-layout`，标题「PCB Layout」，图库 `public/images/knowledge/pcb-layout/`，PDF `public/downloads/pcb-layout-review.pdf`（32 页）**

| # | slug | 标题 | 课件小节 | sections（id） |
|---|------|------|------|------|
| 1 | `pcb-routing` | 走线规则：3W、参考平面与跨分割 | 1~5 | three-w / orthogonal / reference-return / split-crossing / corners / interview |
| 2 | `pcb-decoupling` | 去耦电容与时钟设计 | 6~7 | decoupling-layout / decoupling-radius / crystal-circuit / clock-routing / interview |
| 3 | `pcb-copper-pour` | 铺铜与包地处理 | 8~10 | copper-pour / guard-traces / isolation-keepout / interview |
| 4 | `pcb-ground-design` | 接地设计：焊盘、地分割与 20H | 11~13 | thermal-relief / agnd-dgnd / 20h-rule / interview |
| 5 | `pcb-high-speed` | 高速设计：绕等长、叠层与阻抗 | 14~16 | length-tuning / stackup / impedance / interview |
| 6 | `pcb-fab-hdi` | 加工工艺与板型选择 | 17~18 | fab-limits / cost-balance / via-hdi / interview |
| 7 | `pcb-power-layout` | 电源 Layout 与通流设计 | 19~20 | switch-layout / loop-filter / current-capacity / interview |

**第六章 slug `analog-devices`，标题「模拟器件」，图库 `public/images/knowledge/analog-devices/`，PDF `public/downloads/analog-devices-review.pdf`（51 页）**

| # | slug | 标题 | 课件大节 | sections |
|---|------|------|------|------|
| 8 | `opamp-basics` | 运放基础：虚短虚断与参数选型 | 一、二 | virtual-short-ground / calc-applications / parameters / ideal-vs-real / interview |
| 9 | `opamp-circuits` | 运放基本运算电路 | 三 | follower / non-inverting / inverting / sum-diff / diff-integral / interview |
| 10 | `opamp-apps` | 运放应用：恒流源与 ADC/DAC 接口 | 四 | constant-current / signal-range / adc-op / dac-op / current-loop / interview |
| 11 | `adc-primer` | ADC：转换过程、架构与选型 | 五、六、七 | conversion / architectures / resolution-lsb / sampling-interface / interview |
| 12 | `vref-precision` | ADC 精度设计与基准源 | 八、九 | accuracy-methods / signal-conditioning / vref-applications / vref-circuits / interview |

图标（已验证 lucide-react 0.468.0 均存在）：Route、Clock、Blend、Layers、Waypoints、Ruler、Gauge、Triangle、Workflow、Cable、AudioLines、Crosshair。

## 二、素材准备（临时目录，不入库）
1. 解压第五章 ZIP（32 张 ~4762×6735 整页 JPG）到临时目录；用 `C:\Program Files\WinRAR\UnRAR.exe` 解压第六章 RAR（51 张整页 JPG）。
2. 复制两份 PDF 到 `public/downloads/pcb-layout-review.pdf`、`analog-devices-review.pdf`。

## 三、裁图脚本（仿照现有 build_digital_article_assets.py 模式）
3. 逐页降采样浏览两章共 83 页，为每篇文章挑 6~10 张有讲解价值的配图（PCB 走线截图、去耦布局、叠层/通流表格、运放电路、ADC 架构框图等），记录裁剪框（沿用 x 620→4160 全宽竖带取法，y 按图定；ch6 页面尺寸先实测）。
4. 新建 `scripts/build_pcb_layout_article_assets.py`（断言 32 页）和 `scripts/build_analog_article_assets.py`（断言 51 页），输出 `<name>.webp`（1400px/q84）+ `<name>-hd.jpg`（2200px/q92）到对应图库目录。
5. 运行脚本并抽查生成图确认裁剪完整，必要时微调坐标重跑。

## 四、代码改动
6. `src/knowledge/articles.js`：追加 2 个章节条目（第五章/第六章、downloadHref、页数 32/51、description）+ 12 个文章定义（slug/chapter/title/summary/readingTime/sections），追加在 reset-watchdog 之后，prev/next 链自动延伸。
7. `src/knowledge/ReviewArticle.jsx`：新增 12 个 import + articleBodies 映射。
8. `src/knowledge/KnowledgeSection.jsx`：articleIcons 增加 12 项；简介「分四章整理…」改为「分六章整理无源器件、基础半导体器件、电源类、主控芯片、PCB Layout 与模拟器件…」。
9. 新建 12 个文章组件 `src/knowledge/articles/*.jsx`（PcbRoutingArticle、PcbDecouplingArticle、PcbCopperPourArticle、PcbGroundDesignArticle、PcbHighSpeedArticle、PcbFabHdiArticle、PcbPowerLayoutArticle、OpampBasicsArticle、OpampCircuitsArticle、OpampAppsArticle、AdcPrimerArticle、VrefPrecisionArticle），按 McuArticle 骨架编写：section id 与注册表一致、ArticleFigure（webp+hd+sourcePage）、FormulaText 公式块（如微带阻抗 Z0、同相增益 1+R2/R1、LSB=FSR/2^N）、每篇 1~2 个 WorkedExample、面试要点 callout、≥3 条 review-questions 自测。内容依据逐页读图后改写为复习笔记风格（与现有四章一致）。

## 五、测试与文档
10. `tests/knowledge-registry.test.mjs`：slug 顺序 +12、chapter 键序 +2、[chapter, slug] 对 +12、prev/next 链、两章 PDF 正则与页数（32/51）。
11. `tests/knowledge-route.test.mjs`：ARTICLE_HASHES +12 条。
12. `tests/knowledge-content.test.mjs`：12 个文章内容断言块（主题串、公式正则、WorkedExample 数量与标题、图片 base 名、readingTime）；ArticleFigure 源文件清单 +12；两章资产测试块（枚举全部 base 名）；PDF access +2；KnowledgeSection slug 键检查。
13. `README.md`：功能概览、当前展示内容、hash 路由清单（15→27）、修改知识专栏（新脚本 CLI 示例、页数）、上线检查清单（六章、6 份 PDF）。

## 六、验证
14. `npm run build` 全绿；`node --test` 4 个测试文件全过。
15. 启动预览逐篇目检 12 个新页面：图片裁剪完整无切断、公式渲染正确、TOC 锚点与 sections 一致、上一篇/下一篇链接贯通。

## 说明
- 源课件为带水印的图片扫描（无文字层），文章内容为逐页读图后改写的复习笔记，配图为从高清原图裁出的局部，与既有四章做法一致。
- 临时解压的整页水印原图放在系统临时目录，不会提交进仓库（现有测试也有「不得发布原始加水印整页图」的守卫）。