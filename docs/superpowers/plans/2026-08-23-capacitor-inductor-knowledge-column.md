# 电容与电感知识专栏实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用知识专栏替换首页 Contact 大区块，并新增一篇可通过 Hash 地址独立访问的电容与电感课堂笔记文章。

**Architecture:** 首页继续由 `App.jsx` 装配，新增纯函数解析 Hash 路由，并将首页知识栏目与独立文章拆入 `src/knowledge/`。文章和首页栏目共享一份局部 CSS；未知 Hash 回退首页，现有邮箱入口保持可用。

**Tech Stack:** React 19、Vite 6、原生 CSS、Lucide React、Node.js `node:test`

## Global Constraints

- 文章地址固定为 `#/knowledge/capacitor-inductor`，不得增加 React Router 或其他运行时依赖。
- 首页底部 Contact 大区块替换为知识专栏；页头邮箱按钮和右下角邮箱快捷入口保留。
- 顶部导航标签由 `Contact` 改为 `Knowledge`，目标为 `#knowledge`。
- 文章深度为课堂笔记型，预计阅读时间 5 至 8 分钟。
- 页面保持现有深色工程风格，唯一强调色继续使用现有青色变量 `--cyan`。
- 公式使用可访问文本和 HTML，不引入 MathJax、KaTeX 或图片公式。
- 兼容 GitHub Pages 子路径部署和直接刷新。
- 保持 `prefers-reduced-motion` 支持和移动端无水平溢出。
- 当前 `src/App.jsx`、`src/styles.css`、`tests/ui-contracts.test.mjs` 与项目图片包含用户未提交改动。不得回退、覆盖或批量格式化这些文件。
- 实施阶段不自动提交共享源码文件；每个任务以精确差异检查点代替提交，避免把既有用户改动混入新提交。

---

## File Map

- Create: `src/knowledge/route.js`，保存文章 Hash 常量和纯路由解析函数。
- Create: `src/knowledge/KnowledgeSection.jsx`，渲染首页知识专栏及首篇文章卡片。
- Create: `src/knowledge/KnowledgeArticle.jsx`，渲染独立课堂笔记文章和文章页导航。
- Create: `src/knowledge/knowledge.css`，只负责知识专栏和文章页样式。
- Create: `tests/knowledge-route.test.mjs`，验证 Hash 路由行为。
- Create: `tests/knowledge-content.test.mjs`，验证文章结构、核心公式和首页入口契约。
- Modify: `src/App.jsx`，接入 Hash 状态、知识专栏和文章视图，移除 Contact 大区块。
- Modify: `src/styles.css`，删除不再使用的 Contact 大区块样式，调整浮动邮箱入口语义所需的小范围样式；不改动现有项目详情样式。

---

### Task 1: 建立可独立测试的 Hash 路由

**Files:**
- Create: `src/knowledge/route.js`
- Create: `tests/knowledge-route.test.mjs`

**Interfaces:**
- Produces: `ARTICLE_HASH: string`
- Produces: `resolveKnowledgeRoute(hash: string): "capacitor-inductor" | null`
- Consumes: 浏览器的 `window.location.hash` 字符串

- [ ] **Step 1: 写失败的路由测试**

创建 `tests/knowledge-route.test.mjs`：

```js
import assert from "node:assert/strict";
import test from "node:test";
import { ARTICLE_HASH, resolveKnowledgeRoute } from "../src/knowledge/route.js";

test("the capacitor and inductor article has a stable hash route", () => {
  assert.equal(ARTICLE_HASH, "#/knowledge/capacitor-inductor");
  assert.equal(resolveKnowledgeRoute(ARTICLE_HASH), "capacitor-inductor");
});

test("home anchors and unknown hashes safely resolve to the homepage", () => {
  assert.equal(resolveKnowledgeRoute(""), null);
  assert.equal(resolveKnowledgeRoute("#knowledge"), null);
  assert.equal(resolveKnowledgeRoute("#/knowledge/unknown"), null);
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `node --test tests/knowledge-route.test.mjs`

Expected: FAIL，错误包含 `ERR_MODULE_NOT_FOUND`，因为 `src/knowledge/route.js` 尚不存在。

- [ ] **Step 3: 实现最小路由模块**

创建 `src/knowledge/route.js`：

```js
export const ARTICLE_HASH = "#/knowledge/capacitor-inductor";

export function resolveKnowledgeRoute(hash) {
  return hash === ARTICLE_HASH ? "capacitor-inductor" : null;
}
```

- [ ] **Step 4: 运行路由测试并确认通过**

Run: `node --test tests/knowledge-route.test.mjs`

Expected: 2 tests PASS，0 tests FAIL。

- [ ] **Step 5: 检查本任务差异，不提交共享源码**

Run: `git diff --check -- src/knowledge/route.js tests/knowledge-route.test.mjs`

Expected: 无输出，退出码为 0。

---

### Task 2: 编写独立课堂笔记文章

**Files:**
- Create: `src/knowledge/KnowledgeArticle.jsx`
- Create: `tests/knowledge-content.test.mjs`

**Interfaces:**
- Consumes: `email: string`
- Produces: `KnowledgeArticle({ email }): JSX.Element`
- Uses: `ARTICLE_HASH` 仅由首页卡片使用；文章返回链接固定为 `./#knowledge`

- [ ] **Step 1: 写失败的内容契约测试**

创建 `tests/knowledge-content.test.mjs`，先只检查文章文件：

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the article teaches the time-domain and frequency-domain models", async () => {
  const article = await read("src/knowledge/KnowledgeArticle.jsx");

  assert.match(article, /电容“隔直通交”与电感“通直隔交”的原理/);
  assert.match(article, /i.*=.*C.*du.*dt/s);
  assert.match(article, /u.*=.*L.*di.*dt/s);
  assert.match(article, /Z.*C.*=.*1.*j.*ω.*C/s);
  assert.match(article, /Z.*L.*=.*j.*ω.*L/s);
  assert.match(article, /通信工程中的典型应用/);
  assert.match(article, /自谐振频率/);
});

test("the article exposes clear return and contact paths", async () => {
  const article = await read("src/knowledge/KnowledgeArticle.jsx");

  assert.match(article, /href="\.\/#knowledge"/);
  assert.match(article, /mailto:\$\{email\}/);
  assert.match(article, /<article/);
  assert.match(article, /aria-label="文章目录"/);
});
```

- [ ] **Step 2: 运行内容测试并确认失败**

Run: `node --test tests/knowledge-content.test.mjs`

Expected: FAIL，错误包含 `ENOENT`，因为文章组件尚不存在。

- [ ] **Step 3: 创建文章页组件和语义结构**

创建 `src/knowledge/KnowledgeArticle.jsx`。组件必须包含以下完整结构和可见内容：

```jsx
import { ArrowLeft, Mail } from "lucide-react";

const sections = [
  ["intuition", "先纠正一句口诀"],
  ["capacitor", "电容为什么隔直流、通交流"],
  ["inductor", "电感为什么通直流、隔交流"],
  ["comparison", "电容与电感的对偶关系"],
  ["applications", "通信工程中的典型应用"],
  ["nonideal", "真实器件并不理想"],
  ["summary", "最后记住这四句话"]
];

function Formula({ label, children, note }) {
  return (
    <figure className="formula-block">
      <figcaption>{label}</figcaption>
      <div className="formula" aria-label={`${label}：${children}`}>{children}</div>
      <p>{note}</p>
    </figure>
  );
}

export default function KnowledgeArticle({ email }) {
  return (
    <div className="article-page">
      <header className="article-site-header">
        <a className="brand" href="./#hero" aria-label="返回博客首页">
          <span className="brand-mark">LZJ</span>
          <span><strong>LzjEngineer</strong><small>Knowledge Notes</small></span>
        </a>
        <a className="header-contact" href={`mailto:${email}`}><Mail size={17} />Contact</a>
      </header>

      <main className="article-layout">
        <article className="knowledge-article">
          <header className="article-hero">
            <a className="article-back" href="./#knowledge"><ArrowLeft size={18} />返回知识专栏</a>
            <p className="eyebrow">电路基础 / 课堂笔记 / 约 5 至 8 分钟</p>
            <h1>电容“隔直通交”与电感“通直隔交”的原理</h1>
            <p className="article-lead">从时域微分关系和频域阻抗两条线，理解这两句口诀成立的条件、暂态过程以及在通信电路中的真实用法。</p>
          </header>

          <nav className="article-toc" aria-label="文章目录">
            {sections.map(([id, title]) => <a href={`#${id}`} key={id}>{title}</a>)}
          </nav>

          <section id="intuition">
            <h2>先纠正一句口诀</h2>
            <p>“隔”和“通”不是理想开关。更准确地说，电容阻碍恒定电压建立持续电流，电感阻碍电流发生变化。口诀描述的是理想元件在直流稳态和正弦稳态下的极限表现。</p>
            <aside className="article-callout"><strong>本质：</strong>电容电压不能突变，电感电流不能突变。</aside>
          </section>

          <section id="capacitor">
            <h2>电容为什么隔直流、通交流</h2>
            <p>电容通过两块极板储存电场能量。接入直流的一瞬间，极板开始充电，外部电路存在充电电流；充满后的电压不再变化，理想电容电流降为零，因此直流稳态下等效开路。</p>
            <Formula label="电容的时域关系" note="电压变化越快，电流越大；电压恒定时，电流为零。">i = C du/dt</Formula>
            <p>交流电压持续改变方向和大小，电容反复充放电，所以外部导线中持续出现交变电流。电子并没有穿过绝缘介质，而是极板电荷的反复重新分布形成了电路电流。</p>
            <Formula label="电容的复阻抗" note="频率 f 越高，容抗越小；f = 0 时阻抗趋于无穷大。">Z_C = 1/(jωC)，|Z_C| = 1/(2πfC)</Formula>
          </section>

          <section id="inductor">
            <h2>电感为什么通直流、隔交流</h2>
            <p>线圈中的电流产生磁场。电流一旦变化，磁通量也变化，电感依据楞次定律产生感应电压，方向总是阻碍原电流的变化。因此电感表现出“电流惯性”。</p>
            <Formula label="电感的时域关系" note="电流变化越快，需要的电感电压越大；电流恒定时，理想电感电压为零。">u = L di/dt</Formula>
            <p>接入直流的一瞬间，电感阻碍电流从零突然上升；进入稳态后电流不再变化，理想电感两端电压为零，等效为短路。交流频率越高，电流变化越快，电感的阻碍越强。</p>
            <Formula label="电感的复阻抗" note="频率 f 越高，感抗越大；f = 0 时理想感抗为零。">Z_L = jωL，|Z_L| = 2πfL</Formula>
          </section>

          <section id="comparison">
            <h2>电容与电感的对偶关系</h2>
            <div className="comparison-table" role="table" aria-label="电容与电感特性比较">
              <div role="row"><strong role="columnheader">特性</strong><strong role="columnheader">电容</strong><strong role="columnheader">电感</strong></div>
              <div role="row"><span>不能突变</span><span>电压</span><span>电流</span></div>
              <div role="row"><span>直流稳态</span><span>开路</span><span>短路</span></div>
              <div role="row"><span>频率升高</span><span>阻抗减小</span><span>阻抗增大</span></div>
              <div role="row"><span>储能形式</span><span>电场，W = Cu²/2</span><span>磁场，W = Li²/2</span></div>
            </div>
            <p>需要区分接通瞬间和稳态。刚加上直流时，电容会充电，电感电流会爬升；只有时间足够长后，才分别近似开路和短路。</p>
          </section>

          <section id="applications">
            <h2>通信工程中的典型应用</h2>
            <div className="application-list">
              <article><h3>耦合电容</h3><p>串联在放大器级间，阻断前一级直流偏置，只把信号的交流分量送往下一级。</p></article>
              <article><h3>去耦与旁路电容</h3><p>并联在电源与地之间，为高频噪声提供低阻抗回路，同时不把直流电源短路。</p></article>
              <article><h3>射频扼流圈</h3><p>串联在偏置供电线上，让直流进入射频电路，同时用较高感抗阻止射频信号窜回电源。</p></article>
              <article><h3>LC 滤波与选频</h3><p>利用容抗下降和感抗上升的频率特性构造低通、高通、带通与谐振网络。</p></article>
            </div>
          </section>

          <section id="nonideal">
            <h2>真实器件并不理想</h2>
            <p>实际电容具有 ESR、ESL 和漏电流，超过自谐振频率后可能表现得更像电感；实际电感具有绕组直流电阻、寄生电容和磁芯损耗，超过自谐振频率后也不再保持理想感性。</p>
            <aside className="article-callout">选择器件时不仅要看 C 或 L，还要检查工作频率、自谐振频率、额定电压或电流、损耗和封装寄生参数。</aside>
          </section>

          <section id="summary">
            <h2>最后记住这四句话</h2>
            <ol className="summary-list">
              <li>电容电压不能突变，电感电流不能突变。</li>
              <li>直流稳态下，理想电容开路，理想电感短路。</li>
              <li>频率越高，电容阻抗越小，电感阻抗越大。</li>
              <li>“通”和“隔”都是相对阻抗，不代表现实器件的绝对开路或短路。</li>
            </ol>
          </section>
        </article>
      </main>
    </div>
  );
}
```

- [ ] **Step 4: 运行内容测试并确认通过**

Run: `node --test tests/knowledge-content.test.mjs`

Expected: 2 tests PASS，0 tests FAIL。

- [ ] **Step 5: 检查文章语义与差异**

Run: `git diff --check -- src/knowledge/KnowledgeArticle.jsx tests/knowledge-content.test.mjs`

Expected: 无输出，退出码为 0。

---

### Task 3: 用知识专栏替换首页 Contact 大区块

**Files:**
- Create: `src/knowledge/KnowledgeSection.jsx`
- Modify: `src/App.jsx:1-35`
- Modify: `src/App.jsx:353-631`
- Modify: `tests/knowledge-content.test.mjs`

**Interfaces:**
- Consumes: `ARTICLE_HASH` from `src/knowledge/route.js`
- Produces: `KnowledgeSection(): JSX.Element`
- Consumes: `KnowledgeArticle({ email })`
- Consumes: `resolveKnowledgeRoute(window.location.hash)`

- [ ] **Step 1: 扩展失败的首页集成契约测试**

追加到 `tests/knowledge-content.test.mjs`：

```js
test("the homepage replaces the contact finale with the knowledge column", async () => {
  const [app, section] = await Promise.all([
    read("src/App.jsx"),
    read("src/knowledge/KnowledgeSection.jsx")
  ]);

  assert.match(app, /label: "Knowledge", href: "#knowledge"/);
  assert.match(app, /<KnowledgeSection/);
  assert.doesNotMatch(app, /className="contact-finale/);
  assert.match(app, /<KnowledgeArticle email=\{email\}/);
  assert.match(section, /id="knowledge"/);
  assert.match(section, /ARTICLE_HASH/);
  assert.match(section, /阅读全文/);
});

test("the floating shortcut remains an email contact path", async () => {
  const app = await read("src/App.jsx");

  assert.match(app, /className="floating-link" href=\{`mailto:\$\{email\}`\}/);
  assert.match(app, /aria-label="发送邮件联系我"/);
});
```

- [ ] **Step 2: 运行测试并确认集成测试失败**

Run: `node --test tests/knowledge-content.test.mjs`

Expected: 前两个文章测试 PASS，新增集成测试 FAIL，因为栏目组件和首页接入尚不存在。

- [ ] **Step 3: 创建首页知识栏目组件**

创建 `src/knowledge/KnowledgeSection.jsx`：

```jsx
import { ArrowUpRight, BookOpen, Radio, Waves } from "lucide-react";
import { ARTICLE_HASH } from "./route.js";

export default function KnowledgeSection() {
  return (
    <section className="knowledge-finale section-screen" id="knowledge">
      <div className="wide-container knowledge-inner">
        <div className="knowledge-heading">
          <div>
            <p className="eyebrow">Knowledge Column</p>
            <h2>把工程问题讲到公式背后的物理直觉。</h2>
          </div>
          <p>记录通信、电路、嵌入式与硬件调试中的核心概念，既保留推导，也关注它们在真实系统里的边界条件。</p>
        </div>

        <a className="knowledge-card" href={ARTICLE_HASH}>
          <div className="knowledge-card-copy">
            <span className="knowledge-meta"><BookOpen size={17} />电路基础 · 课堂笔记 · 5 至 8 分钟</span>
            <h3>电容“隔直通交”与电感“通直隔交”的原理</h3>
            <p>从时域微分关系和频域阻抗两条线，理解两句口诀成立的条件、暂态过程与通信电路应用。</p>
            <strong>阅读全文 <ArrowUpRight size={18} /></strong>
          </div>
          <div className="knowledge-card-visual" aria-hidden="true">
            <div><Waves size={28} /><span>Z_C = 1/(jωC)</span></div>
            <div><Radio size={28} /><span>Z_L = jωL</span></div>
            <p>f ↑　|Z_C| ↓　|Z_L| ↑</p>
          </div>
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 在 App 中接入 Hash 状态和文章视图**

在 `src/App.jsx` 顶部增加：

```jsx
import KnowledgeArticle from "./knowledge/KnowledgeArticle.jsx";
import KnowledgeSection from "./knowledge/KnowledgeSection.jsx";
import { resolveKnowledgeRoute } from "./knowledge/route.js";
import "./knowledge/knowledge.css";
```

把 `navItems` 的 Contact 项替换为：

```jsx
{ label: "Knowledge", href: "#knowledge" }
```

在 `App()` 中加入 Hash 状态和监听，必须保留现有两个状态与视频 `useEffect`：

```jsx
const [locationHash, setLocationHash] = useState(() => window.location.hash);

useEffect(() => {
  const updateHash = () => setLocationHash(window.location.hash);
  window.addEventListener("hashchange", updateHash);
  return () => window.removeEventListener("hashchange", updateHash);
}, []);

const knowledgeRoute = resolveKnowledgeRoute(locationHash);
if (knowledgeRoute === "capacitor-inductor") {
  return <KnowledgeArticle email={email} />;
}
```

用以下组件替换完整的 `<section className="contact-finale ...">...</section>`：

```jsx
<KnowledgeSection />
```

把浮动入口改为直接邮箱链接：

```jsx
<a className="floating-link" href={`mailto:${email}`} aria-label="发送邮件联系我">
  <Mail size={20} />
</a>
```

从 Lucide 导入中移除不再使用的 `MessageCircle`；保留 `ArrowUpRight`，它仍用于项目详情链接。

- [ ] **Step 5: 运行路由和内容测试**

Run: `node --test tests/knowledge-route.test.mjs tests/knowledge-content.test.mjs`

Expected: 6 tests PASS，0 tests FAIL。

- [ ] **Step 6: 精确检查 App 差异**

Run: `git diff --check -- src/App.jsx src/knowledge/KnowledgeSection.jsx tests/knowledge-content.test.mjs`

Expected: 无空白错误。随后运行 `git diff -- src/App.jsx`，确认既有 DC-DC 项目指标和图库改动仍然存在，且本任务只新增路由、栏目装配、导航替换和浮动邮箱入口。

---

### Task 4: 完成知识专栏和文章页响应式样式

**Files:**
- Create: `src/knowledge/knowledge.css`
- Modify: `src/styles.css:1040-1165`
- Modify: `tests/knowledge-content.test.mjs`

**Interfaces:**
- Consumes: 现有 CSS 变量 `--bg`、`--panel`、`--line`、`--text`、`--muted`、`--soft`、`--cyan`、`--green`
- Produces: `.knowledge-finale`、`.knowledge-card`、`.article-page`、`.knowledge-article`、`.formula-block`、`.comparison-table` 等样式契约

- [ ] **Step 1: 添加失败的样式契约测试**

追加到 `tests/knowledge-content.test.mjs`：

```js
test("knowledge layouts are responsive and motion-safe", async () => {
  const css = await read("src/knowledge/knowledge.css");

  assert.match(css, /\.knowledge-finale/);
  assert.match(css, /\.knowledge-card/);
  assert.match(css, /\.knowledge-article/);
  assert.match(css, /\.formula-block/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(css, /min-width:\s*1180px/);
});
```

- [ ] **Step 2: 运行测试并确认样式测试失败**

Run: `node --test tests/knowledge-content.test.mjs`

Expected: 4 个已有测试 PASS，新增样式测试 FAIL，错误包含 `ENOENT`。

- [ ] **Step 3: 创建知识页面局部样式**

创建 `src/knowledge/knowledge.css`，按以下明确规则实现：

```css
.knowledge-finale {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-top: 1px solid var(--line);
  scroll-margin-top: 120px;
  background: radial-gradient(circle at 78% 28%, rgba(93, 225, 255, 0.16), transparent 32rem), #05070c;
}

.knowledge-inner { position: relative; z-index: 1; padding-block: 120px; }
.knowledge-heading { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(300px, .55fr); gap: 48px; align-items: end; }
.knowledge-heading h2 { max-width: 900px; margin: 16px 0 0; font-size: clamp(42px, 5vw, 78px); line-height: 1.02; }
.knowledge-heading > p { margin: 0; color: var(--muted); font-size: 17px; line-height: 1.8; }
.knowledge-card { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(320px, .7fr); overflow: hidden; margin-top: 54px; border: 1px solid var(--line-strong); border-radius: 10px; background: rgba(16, 23, 34, .78); transition: transform 180ms ease, border-color 180ms ease; }
.knowledge-card:hover { transform: translateY(-4px); border-color: rgba(93, 225, 255, .52); }
.knowledge-card-copy { padding: clamp(28px, 4vw, 58px); }
.knowledge-meta { display: inline-flex; align-items: center; gap: 9px; color: var(--cyan); font-size: 13px; font-weight: 800; }
.knowledge-card h3 { max-width: 900px; margin: 22px 0 0; font-size: clamp(30px, 3.4vw, 56px); line-height: 1.08; }
.knowledge-card-copy > p { max-width: 780px; margin: 22px 0 0; color: var(--muted); font-size: 16px; line-height: 1.8; }
.knowledge-card-copy > strong { display: inline-flex; align-items: center; gap: 8px; margin-top: 32px; color: var(--cyan); }
.knowledge-card-visual { display: grid; align-content: center; gap: 16px; border-left: 1px solid var(--line); padding: 42px; background: linear-gradient(145deg, rgba(93, 225, 255, .13), rgba(124, 255, 196, .035)); }
.knowledge-card-visual div { display: flex; align-items: center; gap: 14px; color: var(--soft); }
.knowledge-card-visual span, .knowledge-card-visual p, .formula { font-family: "JetBrains Mono", "SFMono-Regular", Consolas, monospace; }
.knowledge-card-visual p { margin: 16px 0 0; color: var(--green); }

.article-page { min-height: 100dvh; background: radial-gradient(circle at 78% 10%, rgba(93, 225, 255, .11), transparent 30rem), var(--bg); }
.article-site-header { display: flex; width: min(calc(100% - 48px), 1120px); margin: 0 auto; align-items: center; justify-content: space-between; padding: 24px 0; }
.article-layout { width: min(calc(100% - 48px), 1120px); margin: 0 auto; padding: 68px 0 120px; }
.knowledge-article { width: min(100%, 820px); margin: 0 auto; }
.article-hero h1 { margin: 22px 0 0; font-size: clamp(42px, 6vw, 76px); line-height: 1.03; }
.article-back { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 46px; color: var(--cyan); font-weight: 800; }
.article-lead { margin: 26px 0 0; color: var(--soft); font-size: 19px; line-height: 1.85; }
.article-toc { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 28px; margin: 54px 0; border-block: 1px solid var(--line); padding: 26px 0; }
.article-toc a { color: var(--muted); line-height: 1.5; }
.knowledge-article section { scroll-margin-top: 28px; margin-top: 72px; }
.knowledge-article h2 { margin: 0; font-size: clamp(28px, 4vw, 42px); }
.knowledge-article h3 { margin: 0; font-size: 18px; }
.knowledge-article section > p, .application-list p { color: var(--soft); font-size: 17px; line-height: 1.9; }
.formula-block, .article-callout { margin: 28px 0; border: 1px solid rgba(93, 225, 255, .28); border-radius: 8px; background: rgba(93, 225, 255, .065); padding: 24px; }
.formula-block figcaption { color: var(--muted); font-size: 13px; }
.formula { overflow-x: auto; margin-top: 14px; color: #fff; font-size: clamp(20px, 3vw, 30px); white-space: nowrap; }
.formula-block p { margin: 14px 0 0; color: var(--muted); line-height: 1.7; }
.comparison-table { overflow-x: auto; margin-top: 28px; border: 1px solid var(--line); border-radius: 8px; }
.comparison-table [role="row"] { display: grid; min-width: 620px; grid-template-columns: 1fr 1.2fr 1.2fr; }
.comparison-table [role="row"] + [role="row"] { border-top: 1px solid var(--line); }
.comparison-table span, .comparison-table strong { padding: 16px; color: var(--soft); }
.application-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-top: 28px; }
.application-list article { border: 1px solid var(--line); border-radius: 8px; padding: 22px; background: var(--panel); }
.summary-list { padding-left: 1.4rem; }
.summary-list li { margin: 14px 0; color: var(--soft); font-size: 17px; line-height: 1.75; }

@media (max-width: 768px) {
  .knowledge-inner { padding-block: 88px; }
  .knowledge-heading, .knowledge-card { grid-template-columns: 1fr; }
  .knowledge-card-visual { border-top: 1px solid var(--line); border-left: 0; padding: 28px; }
  .article-site-header, .article-layout { width: calc(100% - 32px); }
  .article-layout { padding-top: 42px; }
  .article-toc, .application-list { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .article-site-header .brand small { display: none; }
  .article-site-header .header-contact { padding-inline: 12px; }
  .article-hero h1 { font-size: clamp(38px, 12vw, 54px); }
  .formula-block, .article-callout { padding: 18px; }
}

@media (prefers-reduced-motion: reduce) {
  .knowledge-card { transition: none; }
  .knowledge-card:hover { transform: none; }
}
```

- [ ] **Step 4: 清理失效的 Contact 大区块样式**

在 `src/styles.css` 删除仅由旧区块使用的选择器：`.contact-finale`、`.contact-finale::before`、`.finale-inner`、`.contact-finale h2`、`.contact-finale p:not(.eyebrow)` 和 `.finale-actions`。同时从移动端组合选择器中移除 `.finale-actions` 与 `.contact-finale`，保留所有通用按钮和其他区块样式。

- [ ] **Step 5: 运行全部 Node 测试**

Run: `node --test tests/*.test.mjs`

Expected: 现有 6 个 UI contract tests 加新增 7 个 knowledge tests 全部 PASS，0 tests FAIL。

- [ ] **Step 6: 检查样式差异和无效选择器**

Run: `rg -n "contact-finale|finale-inner|finale-actions" src`

Expected: 无匹配。

Run: `git diff --check -- src/styles.css src/knowledge/knowledge.css tests/knowledge-content.test.mjs`

Expected: 无输出，退出码为 0。

---

### Task 5: 构建与浏览器验收

**Files:**
- Verify only: `src/App.jsx`
- Verify only: `src/knowledge/KnowledgeSection.jsx`
- Verify only: `src/knowledge/KnowledgeArticle.jsx`
- Verify only: `src/knowledge/knowledge.css`
- Verify only: `tests/*.test.mjs`

**Interfaces:**
- Consumes: Vite production build and browser Hash navigation
- Produces: 可部署的 `dist/` 构建产物和验收证据

- [ ] **Step 1: 运行完整自动化测试**

Run: `node --test tests/*.test.mjs`

Expected: 13 tests PASS，0 tests FAIL。

- [ ] **Step 2: 运行生产构建**

Run: `npm run build`

Expected: Vite 构建成功，输出 `dist/index.html` 和带 Hash 的静态资源文件，无 error。

- [ ] **Step 3: 启动本地预览并检查首页**

Run: `npm run dev -- --host 127.0.0.1`

使用真实浏览器检查 `http://127.0.0.1:5173/`：

- 顶部显示 `Knowledge`，点击后滚动到 `#knowledge`。
- 首页底部显示知识专栏，不再显示 Contact 大区块。
- 页头 Contact 按钮和右下角邮件按钮仍使用 `mailto:`。
- 既有项目卡片、项目详情图库和 Capabilities 区域未发生回归。

- [ ] **Step 4: 检查独立文章和 Hash 刷新**

在浏览器打开 `http://127.0.0.1:5173/#/knowledge/capacitor-inductor`：

- 刷新后仍显示文章，不出现空白页。
- 文章目录锚点可跳转，公式没有撑破正文。
- 返回知识专栏链接回到首页 `#knowledge`。
- 未知地址 `#/knowledge/unknown` 安全显示首页。

- [ ] **Step 5: 检查移动端与低动态偏好**

在 390×844 视口检查首页栏目和文章页：

- 卡片为单列，右侧公式视觉排列在正文之后。
- 文章目录和应用案例为单列。
- 对比表可横向滚动，整页没有水平溢出。
- 启用 reduced motion 后卡片不发生位移动画。

- [ ] **Step 6: 最终差异审计**

Run: `git status --short`

Run: `git diff --check`

Run: `git diff --stat`

Expected: 只出现本功能的新文件和对 `App.jsx`、`styles.css`、测试的局部修改，以及实施前已存在的 DC-DC 图片和对应用户改动；无空白错误，不自动提交共享源码。

---

## Completion Criteria

- 首页 Contact 大区块已被知识专栏替换。
- 首页文章卡片能进入 `#/knowledge/capacitor-inductor`。
- 独立文章完整覆盖时域、频域、暂态、通信应用和非理想器件。
- 页头与浮动邮箱入口仍可使用。
- 未知 Hash 安全回退首页。
- 桌面端、390 px 移动端和 reduced motion 检查通过。
- 所有 Node 测试和 `npm run build` 通过。
- 实施前已有的未提交改动未被覆盖或意外提交。
