# Passive Component Article Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the resistor, capacitor, inductor, and ferrite-bead interview-review articles with selected high-resolution course images, worked examples, and fuller engineering explanations while preserving all existing routes and unrelated articles.

**Architecture:** Keep article metadata in `src/knowledge/articles.js` and article-specific copy in the four existing JSX files. Add two reusable presentation components for grouped figures and worked examples, generate deterministic WebP/JPEG crops from the 44 source pages, and validate content and assets with the existing Node test suite.

**Tech Stack:** React 19, Vite 6, native CSS, Node `node:test`, Python Pillow for deterministic image preparation, Playwright CLI for local preview.

## Global Constraints

- Work on `codex/passive-article-enhancement`; do not push or create a PR.
- Preserve `#/knowledge/resistor`, `#/knowledge/capacitor`, `#/knowledge/inductor`, `#/knowledge/ferrite-bead`, `#/knowledge/capacitor-inductor`, and `#/knowledge/diode`.
- Do not modify the homepage structure, primary navigation, project cards, contact paths, or `DiodeArticle.jsx`.
- Do not add npm runtime dependencies, Markdown/MDX, a lightbox library, or a routing library.
- Publish only selected crops, never the 44 full-page JPG files.
- Every published crop needs a WebP body image, an `-hd.jpg` high-resolution partner, non-empty alt text, a functional caption, and source-page metadata.
- Keep the existing dark theme, cyan accent, radius system, keyboard focus states, reduced-motion behavior, and mobile single-column fallback.
- Visible copy must use normal hyphens for ranges and separators, not em dashes.

---

### Task 1: Add shared figure-group and worked-example components

**Files:**
- Create: `src/knowledge/ArticleFigureGroup.jsx`
- Create: `src/knowledge/WorkedExample.jsx`
- Modify: `src/knowledge/ArticleFigure.jsx`
- Modify: `tests/knowledge-content.test.mjs`

**Interfaces:**
- Produces: `ArticleFigureGroup({ figures: Array<{src, fullSrc, alt, caption, sourcePage}> })`
- Produces: `WorkedExample({ title, given: string[], calculation: string[], verification: string[], answer: string })`
- Keeps: `ArticleFigure({ src, fullSrc, alt, caption, sourcePage })`

- [ ] **Step 1: Add failing component-contract tests**

Add tests asserting that `ArticleFigureGroup.jsx` maps each item through `ArticleFigure`, `WorkedExample.jsx` renders the four labels `已知条件`, `计算过程`, `器件校核`, `面试回答`, and `ArticleFigure.jsx` places `查看高清图` inside `figcaption` instead of `.article-figure-link`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test --test-name-pattern="figure-group|worked example|article figures" tests/knowledge-content.test.mjs`

Expected: FAIL because the two new modules do not exist and the current high-resolution action overlays the image.

- [ ] **Step 3: Implement the reusable components**

`ArticleFigureGroup` must render a `<div className="article-figure-group">` and pass every object directly to `<ArticleFigure key={figure.src} {...figure} />`. `WorkedExample` must render a `<section className="worked-example" aria-labelledby={id}>`, where `id` is derived from `title`, with four labeled blocks; `given`, `calculation`, and `verification` render ordered or unordered lists, while `answer` renders a paragraph.

Move the existing `<Maximize2 /> 查看高清图` action from the image link overlay into the right side of `figcaption`. Keep the image itself linked to the high-resolution file and preserve its accessible label.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `node --test --test-name-pattern="figure-group|worked example|article figures" tests/knowledge-content.test.mjs`

Expected: all matching tests PASS.

- [ ] **Step 5: Commit the shared article primitives**

```powershell
git add src/knowledge/ArticleFigure.jsx src/knowledge/ArticleFigureGroup.jsx src/knowledge/WorkedExample.jsx tests/knowledge-content.test.mjs
git commit -m "feat: add long-form article primitives"
```

---

### Task 2: Generate selected high-resolution course crops

**Files:**
- Create: `scripts/build_passive_article_assets.py`
- Create: `public/images/knowledge/passive-components/resistor-package.{webp,jpg}` using `resistor-package.webp` and `resistor-package-hd.jpg`
- Create: 11 additional WebP/JPEG pairs under `public/images/knowledge/passive-components/`
- Modify: `tests/knowledge-content.test.mjs`

**Interfaces:**
- Consumes: one positional source directory containing exactly 44 JPG pages at `4762x6735`.
- Produces: named crops with a maximum body dimension of 1400px and maximum HD dimension of 2200px.

- [ ] **Step 1: Add failing asset-contract tests**

Extend the asset test with these exact base names:

```js
const enhancedAssets = [
  "resistor-package",
  "resistor-power-current",
  "resistor-applications",
  "zero-ohm-applications",
  "capacitor-functions",
  "capacitor-pump-timing",
  "capacitor-selection",
  "capacitor-pdn",
  "inductor-dcr",
  "inductor-current",
  "ferrite-applications",
  "ferrite-comparison"
];
```

For every base name, assert that `<base>.webp` and `<base>-hd.jpg` exist. Also assert that no file matching `加水印第一章*.jpg` exists under `public/`.

- [ ] **Step 2: Run the asset test and verify RED**

Run: `node --test --test-name-pattern="enhanced passive-component assets" tests/knowledge-content.test.mjs`

Expected: FAIL because the 12 crop pairs do not exist.

- [ ] **Step 3: Implement the deterministic crop script**

Use Pillow and this exact page/box map, where page numbers are one-based and boxes are `(left, top, right, bottom)` pixels:

```python
CROPS = {
    "resistor-package": (4, (620, 420, 4160, 3500)),
    "resistor-power-current": (6, (620, 420, 4160, 3900)),
    "resistor-applications": (11, (620, 420, 4160, 5700)),
    "zero-ohm-applications": (16, (620, 420, 4160, 5700)),
    "capacitor-functions": (21, (620, 380, 4160, 5900)),
    "capacitor-pump-timing": (24, (620, 380, 4160, 5900)),
    "capacitor-selection": (28, (620, 350, 4160, 4700)),
    "capacitor-pdn": (35, (620, 300, 4160, 6100)),
    "inductor-dcr": (38, (620, 350, 4160, 6100)),
    "inductor-current": (39, (620, 350, 4160, 5800)),
    "ferrite-applications": (42, (620, 300, 4160, 6100)),
    "ferrite-comparison": (43, (620, 300, 4160, 6100)),
}
```

Sort source JPGs by filename, reject any source count other than 44, crop each page, create an RGB image, resize with `Image.Resampling.LANCZOS`, save WebP at quality 84 and HD progressive JPEG at quality 92. Output to a required second positional argument so the script never assumes the repository path.

- [ ] **Step 4: Generate the assets from the extracted folder**

Run with the bundled Python interpreter:

```powershell
& 'C:\Users\ASUS\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\build_passive_article_assets.py `
  'C:\Users\ASUS\OneDrive\图文课件-第一章-无源器件\第一章.无源器件-电容电阻电感磁珠20260605\第一章.无源器件-电容电阻电感磁珠20260605' `
  'public\images\knowledge\passive-components'
```

Expected: 24 files written, each body image no larger than 1400px on its longest side and each HD image no larger than 2200px.

- [ ] **Step 5: Run the asset test and verify GREEN**

Run: `node --test --test-name-pattern="enhanced passive-component assets" tests/knowledge-content.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit the asset pipeline and crops**

```powershell
git add scripts/build_passive_article_assets.py public/images/knowledge/passive-components tests/knowledge-content.test.mjs
git commit -m "feat: add passive component course figures"
```

---

### Task 3: Expand the resistor article

**Files:**
- Modify: `src/knowledge/articles/ResistorArticle.jsx`
- Modify: `src/knowledge/articles.js`
- Modify: `tests/knowledge-content.test.mjs`

**Interfaces:**
- Consumes: `ArticleFigureGroup`, `WorkedExample`, and the four resistor crop pairs.
- Produces: resistor article metadata with `readingTime: "约 18 分钟"`.

- [ ] **Step 1: Add a failing resistor-content test**

Assert that the article contains `工作电压`, `过载电压`, `脉冲功率`, `温度系数`, `功率降额`, `开路失效`, `端接匹配`, `泄放电阻`, and `Kelvin` and uses exactly one `<WorkedExample title="ADC 分压与功耗校核"`. Assert references to the four new resistor image base names.

- [ ] **Step 2: Run the resistor test and verify RED**

Run: `node --test --test-name-pattern="expanded resistor" tests/knowledge-content.test.mjs`

Expected: FAIL on the missing worked example and image references.

- [ ] **Step 3: Expand the article copy and figures**

Add:

- A parameter hierarchy explaining package, tolerance, working/overload voltage, continuous/pulse power, allowed current, TCR, derating, and failure modes.
- A grouped figure containing `resistor-package` and `resistor-power-current` after the parameter hierarchy.
- Application explanations for divider loading error, series attenuation, source/load termination, pull-up/down timing, Kelvin current sensing, current limiting, discharge, and debug isolation.
- A grouped figure containing `resistor-applications` and `zero-ohm-applications` after the application explanations.
- Worked example: 12V input, 3.0V ADC full-scale, choose 30kΩ/10kΩ; calculate 3.0V output, 0.3mA divider current, 2.7mW upper-resistor power, 0.9mW lower-resistor power; verify ADC source impedance and use 1% or better matched resistors; interview answer must mention loading, tolerance, voltage rating, and sampling capacitor settling.
- Update the selection checklist and interview questions to cover pulse rating and why 0Ω resistors are not fuses.

- [ ] **Step 4: Run the resistor test and verify GREEN**

Run: `node --test --test-name-pattern="expanded resistor" tests/knowledge-content.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the resistor enhancement**

```powershell
git add src/knowledge/articles/ResistorArticle.jsx src/knowledge/articles.js tests/knowledge-content.test.mjs
git commit -m "feat: expand resistor interview notes"
```

---

### Task 4: Expand the capacitor article

**Files:**
- Modify: `src/knowledge/articles/CapacitorArticle.jsx`
- Modify: `src/knowledge/articles.js`
- Modify: `tests/knowledge-content.test.mjs`

**Interfaces:**
- Consumes: existing capacitor figures plus `capacitor-functions`, `capacitor-pump-timing`, `capacitor-selection`, and `capacitor-pdn`.
- Produces: capacitor article metadata with `readingTime: "约 22 分钟"`.

- [ ] **Step 1: Add a failing capacitor-content test**

Assert that the article contains `交流耦合`, `旁路`, `电荷泵`, `自举`, `RC 定时`, `介质吸收`, `纹波电流`, `直流偏压`, `自谐振频率`, `反谐振`, and `目标阻抗` and uses one `<WorkedExample title="去耦电容与有效容值校核"`. Assert references to all four new capacitor image names.

- [ ] **Step 2: Run the capacitor test and verify RED**

Run: `node --test --test-name-pattern="expanded capacitor" tests/knowledge-content.test.mjs`

Expected: FAIL on the missing worked example and new figures.

- [ ] **Step 3: Expand the article copy and figures**

Add:

- A functional circuit section using `capacitor-functions` and `capacitor-pump-timing` for coupling, decoupling, bypass, filtering, storage, bootstrap/charge pump, resonance, and timing.
- A selection section using `capacitor-selection`, distinguishing C0G/NP0, X7R/X5R, tantalum, aluminum electrolytic, polymer, and film by stability, ESR, polarity, lifetime, and application.
- A non-ideal section covering tolerance, temperature, DC bias, aging, ESR, ESL, leakage, dielectric absorption, ripple current, and self-resonance.
- A PDN section using `capacitor-pdn`, explaining target impedance, mounting inductance, parallel resonances, and why nominal capacitance alone is insufficient.
- Worked example: a 3.3V rail with a 10µF X5R rated at 6.3V; assume the datasheet DC-bias curve leaves 45% capacitance and tolerance/temperature leave another 80%; calculate 3.6µF effective capacitance, reject it for a 6µF minimum, and choose a larger package/voltage rating or two verified parts. The interview answer must state that the BOM value is not the in-circuit value.

- [ ] **Step 4: Run the capacitor test and verify GREEN**

Run: `node --test --test-name-pattern="expanded capacitor" tests/knowledge-content.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the capacitor enhancement**

```powershell
git add src/knowledge/articles/CapacitorArticle.jsx src/knowledge/articles.js tests/knowledge-content.test.mjs
git commit -m "feat: expand capacitor interview notes"
```

---

### Task 5: Expand the inductor and ferrite-bead articles

**Files:**
- Modify: `src/knowledge/articles/InductorArticle.jsx`
- Modify: `src/knowledge/articles/FerriteBeadArticle.jsx`
- Modify: `src/knowledge/articles.js`
- Modify: `tests/knowledge-content.test.mjs`

**Interfaces:**
- Consumes: `inductor-dcr`, `inductor-current`, `ferrite-applications`, and `ferrite-comparison` plus existing figures.
- Produces: inductor reading time `约 14 分钟`; ferrite-bead reading time `约 12 分钟`.

- [ ] **Step 1: Add failing content tests for both articles**

For the inductor article, assert `电感纹波`, `峰值电流`, `DCR 铜损`, `饱和电流`, `RMS 电流`, `磁芯损耗`, and one `<WorkedExample title="Buck 功率电感选型">`. For the ferrite article, assert `目标噪声频段`, `阻性分量`, `直流偏置`, `π 型滤波`, `谐振峰`, and one `<WorkedExample title="磁珠电源滤波选型">`. Assert all four new figure names.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `node --test --test-name-pattern="expanded inductor|expanded ferrite" tests/knowledge-content.test.mjs`

Expected: FAIL on the missing worked examples and new figures.

- [ ] **Step 3: Expand the inductor article**

Use `inductor-dcr` and `inductor-current` in a figure group. Explain average, peak, and RMS current separately; calculate DCR copper loss with RMS current; distinguish Isat from temperature-rise current; describe shielded, unshielded, ferrite, powder-core, and molded structures. Worked example: 12V to 5V Buck, 3A load, 400kHz, 30% ripple target; calculate approximately 6.1µH and select 6.8µH, calculate 3.45A peak current, require Isat above 4.1A with margin, and verify Irms, DCR, core loss, temperature, and self-resonance.

- [ ] **Step 4: Expand the ferrite article**

Use `ferrite-applications` and `ferrite-comparison` in a figure group. Explain impedance decomposition, target frequency, DC-bias degradation, DCR/voltage drop, temperature rise, capacitor interaction, and damping. Worked example: suppress a measured 100MHz rail spur on a 300mA load; choose a bead whose resistive impedance remains useful at 100MHz under 300mA bias, verify DCR drop and temperature, place local capacitors on the load side, and confirm the result with a spectrum measurement rather than the nominal `600Ω@100MHz` label alone.

- [ ] **Step 5: Run the focused tests and verify GREEN**

Run: `node --test --test-name-pattern="expanded inductor|expanded ferrite" tests/knowledge-content.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit both magnetic-component enhancements**

```powershell
git add src/knowledge/articles/InductorArticle.jsx src/knowledge/articles/FerriteBeadArticle.jsx src/knowledge/articles.js tests/knowledge-content.test.mjs
git commit -m "feat: expand magnetic component interview notes"
```

---

### Task 6: Style the enhanced long-form content

**Files:**
- Modify: `src/knowledge/knowledge.css`
- Modify: `tests/knowledge-content.test.mjs`

**Interfaces:**
- Consumes: `.article-figure-group`, `.worked-example`, and the revised `.article-figure` markup.
- Produces: desktop two-column figure groups and mobile single-column groups.

- [ ] **Step 1: Add a failing layout-contract test**

Assert CSS includes `.article-figure-group`, `grid-template-columns: repeat(2, minmax(0, 1fr))`, `.worked-example`, `.worked-example-grid`, and a `max-width: 768px` rule that sets both figure and example grids to one column. Assert `.article-figure-link > span` no longer exists.

- [ ] **Step 2: Run the layout test and verify RED**

Run: `node --test --test-name-pattern="enhanced long-form layouts" tests/knowledge-content.test.mjs`

Expected: FAIL because the new selectors are absent.

- [ ] **Step 3: Implement the styles**

Use the existing 10px content radius and cyan focus treatment. Figure groups use a two-column grid with 18px gap. Worked examples use one outer border, four internal regions, restrained tinted backgrounds, monospaced calculation lines, and no automatic animation. On mobile, both become one column and figures keep `height: auto`; no horizontal overflow is allowed outside existing formula/table wrappers.

- [ ] **Step 4: Run content tests and build**

Run: `node --test tests/knowledge-content.test.mjs`

Run: `npm run build`

Expected: all content tests PASS and Vite exits 0.

- [ ] **Step 5: Commit the long-form layout**

```powershell
git add src/knowledge/knowledge.css tests/knowledge-content.test.mjs
git commit -m "style: refine passive article layouts"
```

---

### Task 7: Full verification and local browser preview

**Files:**
- Verify only: `src/knowledge/`
- Verify only: `public/images/knowledge/passive-components/`
- Verify only: `tests/*.test.mjs`

**Interfaces:**
- Consumes: Vite development server and six knowledge routes.
- Produces: local preview evidence only; no deployment or push.

- [ ] **Step 1: Run the complete automated suite**

Run: `node --test tests/*.test.mjs`

Expected: 0 failures, including all existing diode, route, homepage, responsive, and project-evidence tests.

- [ ] **Step 2: Run the production build and whitespace audit**

Run: `npm run build`

Run: `git diff --check`

Expected: Vite exits 0 and `git diff --check` emits no errors.

- [ ] **Step 3: Start the local preview server**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite prints a local URL, normally `http://127.0.0.1:5173/`.

- [ ] **Step 4: Inspect the desktop routes with Playwright**

Open and snapshot:

```text
http://127.0.0.1:5173/#knowledge
http://127.0.0.1:5173/#/knowledge/resistor
http://127.0.0.1:5173/#/knowledge/capacitor
http://127.0.0.1:5173/#/knowledge/inductor
http://127.0.0.1:5173/#/knowledge/ferrite-bead
```

Verify every route has a single H1, intact table of contents, readable figures, visible source pages, a working high-resolution link, and one worked example. Confirm `#/knowledge/diode` still renders.

- [ ] **Step 5: Inspect 390px mobile width**

Set the viewport to 390x844 and revisit the four enhanced routes. Verify figure groups and worked-example grids collapse to one column, formulas/tables scroll only inside their wrappers, and the page has no horizontal overflow.

- [ ] **Step 6: Run the frontend pre-flight audit**

Check visible copy for accidental em dashes, overlay labels, broken captions, repeated CTA intent, inconsistent radii, missing focus styles, and unreadable button contrast. Confirm the page remains dark throughout and uses cyan as its only accent.

- [ ] **Step 7: Report without pushing**

Run: `git status -sb`

Report the local branch, preview URL, test count, build status, created image count, and any remaining visual limitations. Do not run `git push` or create a PR.

---

## Completion Criteria

- The four articles contain the confirmed new engineering topics and one worked example each.
- Twelve new crop pairs and the six existing crop pairs render with alt text, captions, source pages, and unobstructed high-resolution links.
- The four reading times are 18, 22, 14, and 12 minutes.
- Desktop and 390px layouts are readable with no page-level horizontal overflow.
- Existing legacy and diode routes remain functional.
- Full tests, Vite build, and `git diff --check` pass.
- Work remains local and unpushed for user review.
