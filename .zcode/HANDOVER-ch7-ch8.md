# 交接文档：知识专栏第七章（高速接口）+ 第八章（SI&PI）新增 12 篇文章

> 交接时间：2026-09-01。本文档写给接手本任务的 AI 代理（Codex），假定你从零开始读这个仓库。
> 工作目录：`C:\Users\ASUS\Desktop\blog`（React + Vite 个人博客，硬件面试复习知识专栏，现有六章 26 篇文章）。

---

## 1. 任务目标（计划已获用户批准，按此执行，勿改方案）

从 OneDrive 两章课件新增：

- **第七章 `high-speed-interfaces`「高速接口」**（源课件 66 页）6 篇文章
- **第八章 `si-pi`「信号完整性与电源完整性」**（源课件 98 页）6 篇文章

每篇文章 = 课件内容提炼的正文组件 + 课件页面裁切配图（webp + hd.jpg 成对）+ 注册表元数据；每章一个完整课件 PDF 供下载。完整复刻现有六章的模式。

### 第七章文章规划（slug / 组件 / 课件页码）

| slug | 组件文件 | 页码 | 内容 |
|---|---|---|---|
| `iic-spi` | IicSpiArticle.jsx | p4–19 | IIC 协议/开漏/上拉、电平转换、隔离、SPI 四模式、电路设计、多从扩展 |
| `setup-hold-time` | SetupHoldTimeArticle.jsx | p19–24 | 建立/保持时间定义与测量、示波器 vs 逻辑分析仪 |
| `rs232-rs485` | Rs232Rs485Article.jsx | p25–33 | RS232/RS485 电平、电路（SP3232E/SP3485）、波形、接口对比 |
| `lvds` | LvdsArticle.jsx | p34–44 | 差分 vs 单端、常见差分接口、LVDS 电气标准、等长、长距离均衡中继 |
| `gigabit-ethernet` | GigabitEthernetArticle.jsx | p45–54 | 拓扑、PHY（YT8531）、RGMII 2ns、MDIO、MDI PAM5、RJ45 线序、网变、PCB |
| `hdmi-pcie-usb` | HdmiPcieUsbArticle.jsx | p55–66 | HDMI 架构/速率/PCB、PCIE 金手指/电源、USB3 电路/限流、PCB 对比 |

### 第八章文章规划（页码范围，内容尚未阅读）

| slug | 组件文件 | 页码 |
|---|---|---|
| `pi-pdn` | PiPdnArticle.jsx | p4–20（SI/PI 定义、PDN、VRM、去耦、PI 问题） |
| `transmission-line-termination` | TransmissionLineTerminationArticle.jsx | p20–36（传输线、特征阻抗、反射、各类端接、ODT） |
| `si-measurement` | SiMeasurementArticle.jsx | p36–44（带宽与高速判断、插损 VNA、TDR） |
| `length-matching` | LengthMatchingArticle.jsx | p45–67（等长基准、单端/差分等长、蛇形实现） |
| `si-routing` | SiRoutingArticle.jsx | p67–87（阻抗连续、参考平面、伴地孔、背钻/HDI、玻纤效应） |
| `eye-diagram-jitter` | EyeDiagramJitterArticle.jsx | p88–98（眼图、模板、ISI、抖动、均衡、预加重/去加重） |

---

## 2. 源素材路径（已在本地，非 OneDrive 占位符）

- 第七章 PDF（66 页，纯图片无文本层）：
  `C:\Users\ASUS\OneDrive\图文课件-第七章-高速接口\第七章.单板接口电路-正式版-20260103.pdf`
- 第七章页面 JPG（66 张，4762×6735，与 PDF 页一一对应）：
  `C:\Users\ASUS\OneDrive\图文课件-第七章-高速接口\第七章.单板接口电路-正式版-20260103\第七章.单板接口电路-20260103\加水印第七章.单板接口电路-已套模版20260103_01.jpg` … `_66.jpg`
- 第七章附加文档（**有文本层**，用于充实千兆网文章：RGMII 12 线/125MHz DDR/2ns、MDIO 上拉 1.5~10K、Bob Smith 端接、PHY 电源架构、LED 限流）：
  `C:\Users\ASUS\OneDrive\图文课件-第七章-高速接口\千兆网接口1000BASE-T电路设计20250329.pdf`（31 页，建议 pymupdf 提取文本）
- 第八章 PDF（98 页）：
  `C:\Users\ASUS\OneDrive\图文课件-第八章-SIPI信号完整性与电源完整性\第八章 SI&PI 信号完整性与电源完整性 20260214.pdf`
- 第八章页面 JPG（98 张，4762×6735，**目录名和文件名里有双空格，bash 命令务必加引号**）：
  `C:\Users\ASUS\OneDrive\图文课件-第八章-SIPI信号完整性与电源完整性\第八章 SI&PI 信号完整性与电源完整性  20260214\第八章 SI&PI 信号完整性与电源完整性  20260214\加水印  第八章 SI&PI 信号完整性与电源完整性  20260214_01.jpg` … `_98.jpg`

**读图硬约束：Read 工具一次最多并行读 3 张图片。** 一批 6 张时全部会被媒体预算丢弃（不可见）。批量读页用 3 张/批。

---

## 3. 当前进度（截至交接）

### 已完成
1. 章 PDF 已就位：`public/downloads/high-speed-interfaces-review.pdf`（8.3MB/66页）、`public/downloads/si-pi-review.pdf`（9.6MB/98页）
2. 图片目录已建：`public/images/knowledge/high-speed-interfaces/`、`public/images/knowledge/si-pi/`
3. **第七章 66 页已全部逐页人工阅读**，完整技术内容笔记（数值/公式/表格/配图候选，写文章的唯一内容依据）：`.zcode/ch7-notes.md`
4. 第七章裁切脚本已写好并跑通：`scripts/build_high_speed_interface_article_assets.py`（55 组 CROPS，页数校验=66，webp 长边 1400 q84 + `-hd.jpg` 长边 2200 q92）
5. **55 组配图已生成并经三轮接触表目检修正，全部合格**（修正记录：首批 53 张中 17 处坐标修正 + 新增 `rs485-threshold-table`、`pcie-ac-coupling` 2 张；最后 4 处微调已复验通过，接触表 `.zcode/ch7-fixcheck2.png`）

### 未开始
- 第七章 6 篇正文组件（内容笔记已备齐，可直接写）
- 第八章全部工作（读页→笔记→脚本→配图→6 篇正文）
- 注册表/组件接线/测试/README 更新
- 测试与构建验证、视觉验收

---

## 4. 配图管线工作法（照此操作）

1. **读页**：`Read` 工具读课件 JPG（3 张/批），边读边把技术要点写进 `.zcode/ch8-notes.md`（防止上下文压缩丢失细节）。**写文章必须忠于课件数值**——本专栏历史上有过因数值与配图红框不符被返工的教训（见 `.zcode/plans/plan-sess_c7861ec9-*.md`）。
2. **定裁切框**：页面原始尺寸 4762×6735。Read 显示的页面约 1072×1470，坐标按比例换算：`x×4762/1072`、`y×6735/1470`。
3. **精确定位法**：拿不准图的位置时，用 PIL 给整页加 10% 红色网格线生成 700×990 缩略图再 Read，按网格读坐标（`.zcode/grid-*.png` 就是这么生成的，脚本思路见下）。
4. **批量目检法**：裁切后把多张 `-hd.jpg` 用 PIL 拼 4 列标注接触表存 `.zcode/*.png` 再 Read，一次检查几十张。
5. 脚本改 CROPS → 重跑 → 再拼接触表复验，循环直到全部合格。

```bash
# 运行裁切脚本（第七章示例）
python scripts/build_high_speed_interface_article_assets.py \
  "C:\Users\ASUS\OneDrive\图文课件-第七章-高速接口\第七章.单板接口电路-正式版-20260103\第七章.单板接口电路-20260103" \
  public/images/knowledge/high-speed-interfaces
```

网格/接触表的内联 python 模板（改参数即用）：

```python
from PIL import Image, ImageDraw
# 网格页：整页缩略 700x990，画 10% 红线并标数字
im = Image.open(src).convert('RGB'); im.thumbnail((700, 990))
d = ImageDraw.Draw(im); w, h = im.size
for fx in range(1, 10):
    x = w*fx//10; d.line([(x,0),(x,h)], fill=(255,0,0)); d.text((x+2,2), str(fx), fill=(255,0,0))
# 同理画横线；最后 im.save(...)
# 接触表：glob 目标 -hd.jpg，4 列、每格 360x300、PIL paste + 文件名标注
```

**硬性要求**：`ArticleFigure` 的 `src`/`fullSrc` 指向的文件必须真实存在（测试会逐一 access）；图片目录中**不允许出现整页课件图**（测试断言目录里不得有「加水印」开头的文件名）。

---

## 5. 文章写作规范（照现有文章抄结构）

参考范本：`src/knowledge/articles/OpampBasicsArticle.jsx`（标准结构）、`PcbRoutingArticle.jsx`。

- 顶层 `<> <section id="...">…</section> … </>`；**section id 必须与注册表 `sections` 数组完全一致**（TOC 依赖）。
- 每篇最后一个 section 固定为 `<section id="interview">`「面试自测」，用 `<details><summary>问题</summary><p>答案</p></details>`，**至少 3 组**（测试断言）。
- 配图：`<ArticleFigure src="images/knowledge/<章目录>/<name>.webp" fullSrc="images/knowledge/<章目录>/<name>-hd.jpg" alt="..." caption="..." sourcePage="<课件页码>" />`，**五个属性缺一不可**；多图并排用 `<ArticleFigureGroup figures={[{src, fullSrc, alt, caption, sourcePage}, ...]} />`。caption 描述要和图内红框/内容一致。
- 公式：`<FormulaText text="V_{IN+}=V_{IN-}" />` 或 `.formula-block` 容器。**FormulaText 只支持极小 LaTeX 子集（`_x`/`_{xx}` 下标、`^x` 上标），且 `_{...}` 语法只能出现在字符串属性里**，不能写在 JSX 文本节点。
- 计算例题：`<WorkedExample title="..." given={[...]} calculation={[...]} verification={[...]} answer="..." />`（已知条件/计算过程/器件校核/面试回答四栏），每篇 0–2 个。
- 版式组件：`.application-list`（卡片小节）、`.article-callout`（要点提示）、`<table className="comparison-table">`（对照表，包在 `.comparison-table-wrap` 里；表头 `<th scope="col">`、行头 `<th scope="row">`）。
- 语言风格：中文技术叙述，直接给工程结论+数值，段落短。标题句式参考注册表现有 title。

### 第七章六篇的 sections 规划（注册表与正文 id 必须一一对应）

1. **iic-spi**（约 20 分钟）：`iic-principle`「IIC 协议与信号定义」/ `iic-circuits`「物理连接、电平转换与隔离」/ `iic-open-drain`「开漏输出与上拉电阻选择」/ `spi-principle`「SPI 协议与四种模式」/ `spi-circuits`「SPI 电路设计与多从扩展」/ `compare`「IIC 与 SPI 对比」/ `interview`
2. **setup-hold-time**（约 10 分钟）：`definition`「什么是建立时间与保持时间」/ `measure`「用示波器测量建立保持时间」/ `scope-vs-la`「示波器与逻辑分析仪」/ `workflow`「软硬件联合调试步骤」/ `interview`
3. **rs232-rs485**（约 15 分钟）：`rs232-intro`「RS232 接口与电平」/ `rs232-circuits`「RS232 电路设计：SP3232E」/ `rs232-waveform`「RS232 波形解读」/ `rs485-intro`「RS485 接口与差分电平」/ `rs485-circuits`「RS485 电路设计：SP3485」/ `rs485-waveform`「RS485 波形解读」/ `compare`「四类接口对比」/ `interview`
4. **lvds**（约 18 分钟）：`differential-basics`「差分信号与单端的区别」/ `differential-interfaces`「常见差分接口一览」/ `lvds-standard`「LVDS 电气标准与电平」/ `clock-data`「时钟与数据的关系」/ `length-matching`「LVDS 等长设计」/ `long-distance`「长距离衰减与均衡中继」/ `interview`
5. **gigabit-ethernet**（约 20 分钟）：`phy-topology`「千兆网拓扑与 PHY 架构」/ `rgmii`「RGMII 接口与 2ns 延时」/ `mdio`「MDIO 管理接口」/ `mdi-pam5`「MDI 接口与 PAM5 编码」/ `rj45`「RJ45 线序与网络变压器」/ `speed-diff`「十兆/百兆/千兆的区别」/ `pcb-design`「千兆网 PCB 设计」/ `interview`
6. **hdmi-pcie-usb**（约 20 分钟）：`hdmi-arch`「HDMI 接口架构与 TMDS 电平」/ `hdmi-speed`「HDMI 速率等级与其他引脚」/ `hdmi-pcb`「HDMI 的 PCB 设计」/ `pcie`「PCIE 接口与电路设计」/ `usb`「USB 接口与电路设计」/ `usb-pcie-pcb`「PCIE 与 USB 的 PCB 设计对比」/ `interview`

### 可用配图速查（55 张已生成，均在 `public/images/knowledge/high-speed-interfaces/`）

按前缀分组：`iic-`（7 张：threshold-table/frame-protocol/start-stop-wave/data-valid-wave/multi-at24c256/nsi8100/rc-model）、`spi-`（7 张：connection/cpol-cpha/ad5683-block/w5500-block/w5500-timing/stm32-w25q/multi-slave）、`setup-hold-`（2）+ `scope-logic-analyzer`、`rs232-`（3）、`rs485-`（4）、`diff-`（3）、`lvds-`（7）、`gige-`（11）、`hdmi-`（4）、`pcie-`（4：gen-table/edge-schematic/power-table/ac-coupling）、`usb-`（3）。每篇选 4–7 张即可，`sourcePage` 填课件 PDF 页码（CROPS 表里都有）。

---

## 6. 注册表与接线（精确改动点）

### 6.1 `src/knowledge/articles.js`

章定义追加到 `knowledgeChapters` 末尾（对象插入顺序 = 展示顺序）：

```js
"high-speed-interfaces": {
  id: "high-speed-interfaces",
  index: "第七章",
  title: "高速接口",
  description: "按 IIC/SPI 总线、建立保持时间与测量仪器、RS232/RS485、差分与 LVDS、千兆网、HDMI/PCIE/USB 六类整理接口电平、协议时序、电路设计与 PCB 规则。",
  downloadHref: "downloads/high-speed-interfaces-review.pdf",
  downloadPages: 66
},
"si-pi": {
  id: "si-pi",
  index: "第八章",
  title: "信号完整性与电源完整性",
  description: "（读完第八章课件后按实际内容概括，句式参考其他章）",
  downloadHref: "downloads/si-pi-review.pdf",
  downloadPages: 98
}
```

12 篇文章定义追加到 `reviewArticleDefinitions` 末尾（`vref-precision` 之后）。**数组顺序 = 上一篇/下一篇链条**，7 章在 8 章前。每篇字段：`slug, chapter, title, summary, readingTime, sections`（`download`/`hash`/`category`/`previousSlug`/`nextSlug` 是派生字段，不要手写）。

### 6.2 `src/knowledge/ReviewArticle.jsx`

顶部 import 12 个新组件 + `articleBodies` 里加 12 条 `slug: Component`。

### 6.3 `src/knowledge/KnowledgeSection.jsx`

- `articleIcons` 加 12 条。建议（**用前先确认 lucide-react 里有导出**，build 会因不存在的图标失败）：`iic-spi→Network`、`setup-hold-time→Timer`、`rs232-rs485→RadioTower`、`lvds→ArrowLeftRight`、`gigabit-ethernet→Globe`、`hdmi-pcie-usb→HdmiPort`（不存在就换 `Monitor`）、`pi-pdn→Power`、`transmission-line-termination→Signal`、`si-measurement→ScanLine`、`length-matching→MoveHorizontal`、`si-routing→Milestone`、`eye-diagram-jitter→Eye`。已占用图标别重复：Activity/ArrowUpRight/Binary/BookOpen/CircuitBoard/Clock/Crosshair/Cpu/Download/Lightbulb/Magnet/MemoryStick/PlugZap/Radio/Route/TimerReset/ToggleLeft/Triangle/Waves/Workflow/Blend/Layers/Waypoints/Ruler/Gauge/Cable/AudioLines/Zap/BatteryCharging。
- 顶部简介「面向硬件面试复习，**分六章**整理…」改为「分八章」并补两章主题。

---

## 7. 测试更新（三个文件，全是硬断言，漏一处就红）

### 7.1 `tests/knowledge-registry.test.mjs`
1. slug 全序列数组：追加 12 个新 slug（在 `vref-precision` 后、`capacitor-inductor` 前）
2. 章名测试：`Object.keys(knowledgeChapters)` 数组追加 `"high-speed-interfaces", "si-pi"`
3. `(chapter, slug)` 配对数组：追加 12 行
4. prev/next 链数组：追加 12 行（`vref-precision.nextSlug` 从 `null` 改为 `"iic-spi"`；最后一篇 `eye-diagram-jitter` 的 `nextSlug: null`）
5. PDF 断言：追加两章 `assert.match(...downloadHref, /high-speed-interfaces-review\.pdf$/)` + `downloadPages 66`、`si-pi-review.pdf` + `98`

### 7.2 `tests/knowledge-content.test.mjs`
1. `"the knowledge column groups articles into six chapters"` → 改名 `eight chapters`，追加 `index: "第七章"/title: "高速接口"`、`index: "第八章"/title: "信号完整性与电源完整性"` 断言，slug 图标循环数组追加 12 个新 slug
2. `"the downloadable course PDFs..."` 追加 2 行 `access(...)`
3. `"every referenced article image..."` 的 `sources` 数组追加 12 个新文章文件路径
4. 新增两个 "enhanced ... assets exist without publishing full course pages" 测试（照抄现有模式）：资产名清单逐个 access `.webp` 与 `-hd.jpg`；目录反断言用 `startsWith("加水印")` 通用判断（第八章文件名带空格，别用「加水印第八章」全匹配）
5. 每篇新文章写内容覆盖测试（照抄现有模式：关键词正则循环 + FormulaText 公式断言 + WorkedExample 数量 + 5 个配图名 + registry 的 readingTime）

### 7.3 `tests/knowledge-route.test.mjs`
`ARTICLE_HASHES` 映射追加 12 条 `slug: "#/knowledge/<slug>"`。

### 7.4 README.md（改动 5 处）
1. L12 专栏简介：六章 → 八章，补两章文章清单
2. L21–26 文章清单：补第七、八章两行
3. L138–164 hash 清单：追加 12 行
4. L167 段落：图片目录说明补两个新目录；PDF 列表补 `high-speed-interfaces-review.pdf`（66 页）、`si-pi-review.pdf`（98 页）
5. L172–181+ 裁切脚本命令：补两个脚本各一条（含源 JPG 目录写法，注意第八章路径双空格）

---

## 8. 收尾验证（全部通过才算完成）

```bash
node --test tests/     # package.json 没有 test script，直接这样跑，全部测试必须绿
npm run build          # 生产构建通过（也能暴露不存在的 lucide 图标导入）
```

最后按交付协议渲染新文章页面 PNG 交 judge 做视觉验收（重点：配图裁切质量与红框一致性、图注页码、TOC 锚点、表格版式）。

---

## 9. 已知坑与注意事项

1. **git 工作区有前几章遗留的未提交改动**（`articles.js`、`README.md`、`ReviewArticle.jsx`、`KnowledgeSection.jsx`、若干旧文章与测试文件是 M 状态，还有大量未跟踪的新文章文件）——这些是第六章等已完成工作的产物，**不要还原、不要提交**，本任务的改动直接叠加其上；除非用户明确要求，否则不要做任何 git commit。
2. Read 图片一次最多 3 张/批，超了整批不可见（白读）。
3. 第八章路径与文件名含**双空格**，所有 bash 命令加引号。
4. `FormulaText` 的 `_{}` 只能放字符串属性；`ArticleFigure` 少一个属性测试就挂。
5. slug 顺序、注册表数组、prev/next 链、测试断言四处必须同步改。
6. `articleIcons` 缺 slug 会让首页渲染直接崩（`Icon` 为 undefined）。
7. 章 PDF 沿用既有模式直接发布带水印课件（与现有六章一致），不用处理。
8. 工作笔记（本文档、ch7-notes.md、接触表、网格图）都在 `.zcode/` 下，属临时产物，完成后可清理；`.zcode/plans/` 里另有 3 份历史计划文档，是以前会话的修复方案，仅供了解历史教训，与本任务无关。
