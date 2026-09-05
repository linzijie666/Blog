import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const read = (filePath) => readFile(new URL(`../${filePath}`, import.meta.url), "utf8");

test("the article teaches the time-domain and frequency-domain models", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/KnowledgeArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);
  const articleSource = `${registry}\n${article}`;

  assert.match(articleSource, /电容“隔直通交”与电感“通直隔交”的原理/);
  assert.match(articleSource, /i.*=.*C.*du.*dt/s);
  assert.match(articleSource, /u.*=.*L.*di.*dt/s);
  assert.match(articleSource, /Z.*C.*=.*1.*j.*ω.*C/s);
  assert.match(articleSource, /Z.*L.*=.*j.*ω.*L/s);
  assert.match(articleSource, /通信工程中的典型应用/);
  assert.match(articleSource, /自谐振频率/);
});

test("the article exposes clear return and contact paths", async () => {
  const article = await read("src/knowledge/KnowledgeArticle.jsx");

  assert.match(article, /import ArticleShell/);
  assert.match(article, /legacyArticle/);
  assert.match(article, /<ArticleShell article=\{legacyArticle\} email=\{email\}>/);
});

test("the client-side article route announces the new view", async () => {
  const shell = await read("src/knowledge/ArticleShell.jsx");

  assert.match(shell, /useRef/);
  assert.match(shell, /ref=\{mainRef\}/);
  assert.match(shell, /tabIndex="-1"/);
  assert.match(shell, /document\.title\s*=/);
  assert.match(shell, /focus\(\{ preventScroll: true \}\)/);
});

test("the article table of contents preserves the article hash route", async () => {
  const shell = await read("src/knowledge/ArticleShell.jsx");

  assert.match(shell, /href=\{article\.hash\}/);
  assert.match(shell, /scrollToArticleSection/);
  assert.doesNotMatch(shell, /href=\{`#\$\{id\}`\}/);
});

test("the capacitor and inductor comparison uses native table semantics", async () => {
  const article = await read("src/knowledge/KnowledgeArticle.jsx");

  assert.match(article, /<table className="comparison-table">/);
  assert.match(article, /<th scope="col">/);
  assert.match(article, /<th scope="row">/);
  assert.match(article, /<td>/);
  assert.doesNotMatch(article, /role="table"/);
});

test("the homepage replaces the contact finale with the knowledge column", async () => {
  const [app, section] = await Promise.all([
    read("src/App.jsx"),
    read("src/knowledge/KnowledgeSection.jsx")
  ]);

  assert.match(app, /label: "Knowledge", href: "#\/knowledge"/);
  assert.match(app, /<KnowledgeSection/);
  assert.doesNotMatch(app, /className="contact-finale/);
  assert.match(app, /<KnowledgeArticle email=\{email\}/);
  assert.match(app, /scrollToHomeAnchor\(locationHash\)/);
  assert.match(section, /id="knowledge"/);
  assert.match(section, /tabIndex="-1"/);
  assert.match(section, /KNOWLEDGE_INDEX_HASH/);
  assert.match(section, /进入知识库/);
});

test("the floating shortcut remains an email contact path", async () => {
  const app = await read("src/App.jsx");

  assert.match(app, /className="floating-link" href=\{`mailto:\$\{email\}`\}/);
  assert.match(app, /aria-label="发送邮件联系我"/);
});

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

test("the shared article shell owns navigation, metadata and the chapter PDF download", async () => {
  const shell = await read("src/knowledge/ArticleShell.jsx");

  assert.match(shell, /article-site-header/);
  assert.match(shell, /aria-label="文章目录"/);
  assert.match(shell, /上一篇/);
  assert.match(shell, /下一篇/);
  assert.match(shell, /返回知识专栏/);
  assert.match(shell, /article\.download\.href/);
  assert.match(shell, /下载 \{article\.download\.pages\} 页原始复习资料/);
  assert.match(shell, /下载完整复习课件/);
  assert.match(shell, /resetArticleScroll/);
});

test("the four passive component articles cover the agreed interview-review content", async () => {
  const files = {
    resistor: await read("src/knowledge/articles/ResistorArticle.jsx"),
    capacitor: await read("src/knowledge/articles/CapacitorArticle.jsx"),
    inductor: await read("src/knowledge/articles/InductorArticle.jsx"),
    ferrite: await read("src/knowledge/articles/FerriteBeadArticle.jsx")
  };

  for (const topic of ["精度", "耐压", "功率", "温度系数"]) {
    assert.match(files.resistor, new RegExp(topic));
  }
  assert.match(files.resistor, /分压.*端接匹配.*电流采样.*0Ω/s);
  assert.match(files.capacitor, /耦合.*去耦.*滤波.*储能.*自举.*谐振.*定时/s);
  assert.match(files.capacitor, /X5R.*X7R.*C0G.*直流偏压/s);
  assert.match(files.capacitor, /ESR.*ESL.*PDN/s);
  assert.match(files.inductor, /DCR.*饱和电流.*RMS.*温升/s);
  assert.match(files.inductor, /磁芯.*封装.*选型流程/s);
  assert.match(files.ferrite, /阻抗曲线.*额定电流.*直流偏置/s);
  assert.match(files.ferrite, /磁珠和电感的异同/);

  for (const source of Object.values(files)) {
    assert.ok((source.match(/<details/g) ?? []).length >= 3);
    assert.match(source, /<summary>/);
  }
});

test("article figures require accessible descriptions, captions and source pages", async () => {
  const figure = await read("src/knowledge/ArticleFigure.jsx");
  const imageLink = figure.match(/className="article-figure-link"[\s\S]*?<\/a>/)?.[0] ?? "";
  const caption = figure.match(/<figcaption>[\s\S]*?<\/figcaption>/)?.[0] ?? "";

  assert.match(figure, /alt/);
  assert.match(figure, /caption/);
  assert.match(figure, /sourcePage/);
  assert.match(figure, /查看高清图/);
  assert.match(figure, /loading="lazy"/);
  assert.doesNotMatch(imageLink, /<span>/);
  assert.match(caption, /查看高清图/);
});

test("enhanced long-form layouts support figure groups and worked examples", async () => {
  const css = await read("src/knowledge/knowledge.css");

  assert.match(css, /\.article-figure-group/);
  assert.match(css, /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(css, /\.worked-example/);
  assert.match(css, /\.worked-example-grid/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.article-figure-group[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.worked-example-grid[\s\S]*?grid-template-columns:\s*1fr/);
  assert.doesNotMatch(css, /\.article-figure-link\s*>\s*span/);
});

test("the expanded resistor article covers ratings, applications and an ADC example", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/ResistorArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of [
    "工作电压",
    "过载电压",
    "脉冲功率",
    "温度系数",
    "功率降额",
    "开路失效",
    "端接匹配",
    "泄放电阻",
    "Kelvin"
  ]) {
    assert.match(article, new RegExp(topic));
  }

  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 1);
  assert.match(article, /title="ADC 分压与功耗校核"/);
  for (const image of [
    "resistor-package",
    "resistor-power-current",
    "resistor-applications",
    "zero-ohm-applications"
  ]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "resistor"[\s\S]*?readingTime: "约 18 分钟"/);
});

test("the expanded capacitor article covers practical functions and effective capacitance", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/CapacitorArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of [
    "交流耦合",
    "旁路",
    "电荷泵",
    "自举",
    "RC 定时",
    "介质吸收",
    "纹波电流",
    "直流偏压",
    "自谐振频率",
    "反谐振",
    "目标阻抗"
  ]) {
    assert.match(article, new RegExp(topic));
  }

  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 1);
  assert.match(article, /title="去耦电容与有效容值校核"/);
  for (const image of [
    "capacitor-functions",
    "capacitor-pump-timing",
    "capacitor-selection",
    "capacitor-pdn"
  ]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "capacitor"[\s\S]*?readingTime: "约 22 分钟"/);
});

test("the expanded inductor article covers current limits, loss and Buck selection", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/InductorArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["电感纹波", "峰值电流", "DCR 铜损", "饱和电流", "RMS 电流", "磁芯损耗"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 1);
  assert.match(article, /title="Buck 功率电感选型"/);
  assert.match(article, /inductor-dcr/);
  assert.match(article, /inductor-current/);
  assert.match(registry, /slug: "inductor"[\s\S]*?readingTime: "约 14 分钟"/);
});

test("the expanded ferrite article covers bias, resonance and measured-noise selection", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/FerriteBeadArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["目标噪声频段", "阻性分量", "直流偏置", "π 型滤波", "谐振峰"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 1);
  assert.match(article, /title="磁珠电源滤波选型"/);
  assert.match(article, /ferrite-applications/);
  assert.match(article, /ferrite-comparison/);
  assert.match(registry, /slug: "ferrite-bead"[\s\S]*?readingTime: "约 12 分钟"/);
});

test("the figure-group primitive delegates every item to ArticleFigure", async () => {
  const group = await read("src/knowledge/ArticleFigureGroup.jsx");

  assert.match(group, /className="article-figure-group"/);
  assert.match(group, /figures\.map/);
  assert.match(group, /<ArticleFigure key=\{figure\.src\} \{\.\.\.figure\} \/>/);
});

test("the worked example primitive exposes the four review stages", async () => {
  const example = await read("src/knowledge/WorkedExample.jsx");

  assert.match(example, /className="worked-example"/);
  assert.match(example, /已知条件/);
  assert.match(example, /计算过程/);
  assert.match(example, /器件校核/);
  assert.match(example, /面试回答/);
  assert.match(example, /aria-labelledby/);
});

test("the hub exposes all review articles while preserving the legacy article", async () => {
  const [app, section] = await Promise.all([
    read("src/App.jsx"),
    read("src/knowledge/KnowledgeHub.jsx")
  ]);

  assert.match(app, /<ReviewArticle slug=\{knowledgeRoute\}/);
  assert.match(app, /knowledgeRoute === "capacitor-inductor"/);
  assert.match(section, /results\.filter/);
  assert.match(section, /knowledgeChapters/);
  assert.match(section, /延伸阅读/);
  assert.match(section, /下载\{chapter\.index\}完整课件/);
});

test("the knowledge column groups articles into eight chapters", async () => {
  const [registry, section, css] = await Promise.all([
    read("src/knowledge/articles.js"),
    read("src/knowledge/KnowledgeHub.jsx"),
    read("src/knowledge/knowledge.css")
  ]);

  assert.match(registry, /knowledgeChapters/);
  assert.match(registry, /index: "第一章"/);
  assert.match(registry, /title: "无源器件"/);
  assert.match(registry, /index: "第二章"/);
  assert.match(registry, /title: "基础半导体器件"/);
  assert.match(registry, /index: "第三章"/);
  assert.match(registry, /title: "电源类"/);
  assert.match(registry, /index: "第四章"/);
  assert.match(registry, /title: "主控芯片"/);
  assert.match(registry, /index: "第五章"/);
  assert.match(registry, /title: "PCB Layout"/);
  assert.match(registry, /index: "第六章"/);
  assert.match(registry, /title: "模拟器件"/);
  assert.match(registry, /index: "第七章"/);
  assert.match(registry, /title: "高速接口"/);
  assert.match(registry, /index: "第八章"/);
  assert.match(registry, /title: "信号完整性与电源完整性"/);
  assert.match(section, /chapter\.index/);
  assert.match(section, /chapter\.title/);
  assert.match(section, /开始复习/);
  for (const slug of [
    "resistor",
    "capacitor",
    "inductor",
    "ferrite-bead",
    "diode",
    "triode",
    "optocoupler",
    "mosfet",
    "switching-regulator",
    "linear-regulator",
    "mcu",
    "fpga",
    "ddr",
    "reset-watchdog",
    "pcb-routing",
    "pcb-decoupling",
    "pcb-copper-pour",
    "pcb-ground-design",
    "pcb-high-speed",
    "pcb-fab-hdi",
    "pcb-power-layout",
    "opamp-basics",
    "opamp-circuits",
    "opamp-apps",
    "adc-primer",
    "vref-precision",
    "iic-spi",
    "setup-hold-time",
    "rs232-rs485",
    "lvds",
    "gigabit-ethernet",
    "hdmi-pcie-usb",
    "pi-pdn",
    "transmission-line-termination",
    "si-measurement",
    "length-matching",
    "si-routing",
    "eye-diagram-jitter"
  ]) {
    assert.match(section, new RegExp(`["']?${slug}["']?: `));
  }
  assert.match(css, /\.knowledge-chapter/);
  assert.match(css, /\.knowledge-chapter-heading/);
});

test("the diode article is organized into the semiconductor chapter", async () => {
  const [registry, review, route, app] = await Promise.all([
    read("src/knowledge/articles.js"),
    read("src/knowledge/ReviewArticle.jsx"),
    read("src/knowledge/route.js"),
    read("src/App.jsx")
  ]);

  assert.match(registry, /slug: "diode"/);
  assert.match(registry, /二极管：从 PN 结到整流、限幅与稳压/);
  assert.match(registry, /chapter: "semiconductor"/);
  assert.match(review, /diode: DiodeArticle/);
  assert.match(route, /DIODE_ARTICLE_HASH/);
  assert.match(route, /getArticleBySlug\("diode"\)/);
  assert.doesNotMatch(route, /if \(hash === DIODE_ARTICLE_HASH\)/);
  assert.doesNotMatch(app, /knowledgeRoute === "diode"/);
});

test("the diode article body keeps its long-form content under the shared shell", async () => {
  const diode = await read("src/knowledge/articles/DiodeArticle.jsx");

  assert.match(diode, /Shockley PN 结电流方程/);
  assert.match(diode, /反向恢复/);
  assert.match(diode, /FormulaText/);
  assert.match(diode, /images\/knowledge\/semiconductor-devices\/diode-rectifier\.webp/);
  assert.match(diode, /images\/knowledge\/semiconductor-devices\/diode-zener-reference\.webp/);
});

test("the downloadable course PDFs are published as static resources", async () => {
  await access(new URL("../public/downloads/passive-components-review.pdf", import.meta.url));
  await access(new URL("../public/downloads/semiconductor-devices-review.pdf", import.meta.url));
  await access(new URL("../public/downloads/power-supplies-review.pdf", import.meta.url));
  await access(new URL("../public/downloads/digital-chips-review.pdf", import.meta.url));
  await access(new URL("../public/downloads/pcb-layout-review.pdf", import.meta.url));
  await access(new URL("../public/downloads/analog-devices-review.pdf", import.meta.url));
  await access(new URL("../public/downloads/high-speed-interfaces-review.pdf", import.meta.url));
  await access(new URL("../public/downloads/si-pi-review.pdf", import.meta.url));
});

test("every referenced article image has a web and high-resolution asset", async () => {
  const sources = await Promise.all([
    read("src/knowledge/articles/ResistorArticle.jsx"),
    read("src/knowledge/articles/CapacitorArticle.jsx"),
    read("src/knowledge/articles/InductorArticle.jsx"),
    read("src/knowledge/articles/FerriteBeadArticle.jsx"),
    read("src/knowledge/articles/DiodeArticle.jsx"),
    read("src/knowledge/articles/TriodeArticle.jsx"),
    read("src/knowledge/articles/OptocouplerArticle.jsx"),
    read("src/knowledge/articles/MosfetArticle.jsx"),
    read("src/knowledge/articles/SwitchingRegulatorArticle.jsx"),
    read("src/knowledge/articles/LinearRegulatorArticle.jsx"),
    read("src/knowledge/articles/McuArticle.jsx"),
    read("src/knowledge/articles/FpgaArticle.jsx"),
    read("src/knowledge/articles/DdrArticle.jsx"),
    read("src/knowledge/articles/ResetWatchdogArticle.jsx"),
    read("src/knowledge/articles/PcbRoutingArticle.jsx"),
    read("src/knowledge/articles/PcbDecouplingArticle.jsx"),
    read("src/knowledge/articles/PcbCopperPourArticle.jsx"),
    read("src/knowledge/articles/PcbGroundDesignArticle.jsx"),
    read("src/knowledge/articles/PcbHighSpeedArticle.jsx"),
    read("src/knowledge/articles/PcbFabHdiArticle.jsx"),
    read("src/knowledge/articles/PcbPowerLayoutArticle.jsx"),
    read("src/knowledge/articles/OpampBasicsArticle.jsx"),
    read("src/knowledge/articles/OpampCircuitsArticle.jsx"),
    read("src/knowledge/articles/OpampAppsArticle.jsx"),
    read("src/knowledge/articles/AdcPrimerArticle.jsx"),
    read("src/knowledge/articles/VrefPrecisionArticle.jsx"),
    read("src/knowledge/articles/IicSpiArticle.jsx"),
    read("src/knowledge/articles/SetupHoldTimeArticle.jsx"),
    read("src/knowledge/articles/Rs232Rs485Article.jsx"),
    read("src/knowledge/articles/LvdsArticle.jsx"),
    read("src/knowledge/articles/GigabitEthernetArticle.jsx"),
    read("src/knowledge/articles/HdmiPcieUsbArticle.jsx"),
    read("src/knowledge/articles/PiPdnArticle.jsx"),
    read("src/knowledge/articles/TransmissionLineTerminationArticle.jsx"),
    read("src/knowledge/articles/SiMeasurementArticle.jsx"),
    read("src/knowledge/articles/LengthMatchingArticle.jsx"),
    read("src/knowledge/articles/SiRoutingArticle.jsx"),
    read("src/knowledge/articles/EyeDiagramJitterArticle.jsx")
  ]);
  const figures = sources.flatMap((source) => [...source.matchAll(/<ArticleFigure\s+([^>]+)\/>/g)]);

  assert.ok(figures.length >= 6);
  for (const [, attributes] of figures) {
    const src = attributes.match(/src="([^"]+)"/)?.[1];
    const fullSrc = attributes.match(/fullSrc="([^"]+)"/)?.[1];
    const alt = attributes.match(/alt="([^"]+)"/)?.[1];
    const caption = attributes.match(/caption="([^"]+)"/)?.[1];
    const sourcePage = attributes.match(/sourcePage="([^"]+)"/)?.[1];

    assert.ok(src && fullSrc && alt && caption && sourcePage);
    await access(new URL(`../public/${src}`, import.meta.url));
    await access(new URL(`../public/${fullSrc}`, import.meta.url));
  }
});

test("enhanced passive-component assets exist without publishing full course pages", async () => {
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

  for (const baseName of enhancedAssets) {
    await access(new URL(`../public/images/knowledge/passive-components/${baseName}.webp`, import.meta.url));
    await access(new URL(`../public/images/knowledge/passive-components/${baseName}-hd.jpg`, import.meta.url));
  }

  const publicImages = await readdir(new URL("../public/images/knowledge/passive-components/", import.meta.url));
  assert.equal(publicImages.some((name) => name.startsWith("加水印第一章")), false);
});

test("enhanced semiconductor assets exist without publishing full course pages", async () => {
  const semiconductorAssets = [
    "diode-rectifier",
    "diode-schottky-anti-reverse",
    "diode-freewheel-circuits",
    "diode-zener-reference",
    "diode-tvs-protection",
    "bjt-switch-inverter",
    "bjt-level-shift",
    "bjt-tl431-reference",
    "bjt-linear-regulator",
    "bjt-common-emitter-qpoint",
    "bjt-small-signal",
    "bjt-voltage-bias-qpoint",
    "bjt-bypass-compare",
    "optocoupler-ctr",
    "optocoupler-circuits",
    "oc-od-wired-and",
    "mos-iic-level-shift",
    "mos-pmos-soft-start",
    "mos-vs-bjt-temperature",
    "mos-soft-start-simulation",
    "mos-switching-loss",
    "mos-soa",
    "mos-soa-selection"
  ];

  for (const baseName of semiconductorAssets) {
    await access(new URL(`../public/images/knowledge/semiconductor-devices/${baseName}.webp`, import.meta.url));
    await access(new URL(`../public/images/knowledge/semiconductor-devices/${baseName}-hd.jpg`, import.meta.url));
  }

  const publicImages = await readdir(new URL("../public/images/knowledge/semiconductor-devices/", import.meta.url));
  assert.equal(publicImages.some((name) => name.startsWith("加水印第二章")), false);
});
test("enhanced power-supply assets exist without publishing full course pages", async () => {
  const powerAssets = [
    "dcdc-components",
    "dcdc-design-rt8279",
    "dcdc-design-rt6253",
    "dcdc-design-waveform",
    "buck-loop-charge",
    "buck-loop-freewheel",
    "buck-waveform",
    "boost-loop-charge",
    "boost-loop-freewheel",
    "ccm-dcm-waveforms",
    "psm-light-load-ripple",
    "volt-second-waveform",
    "volt-second-buck-circuit",
    "volt-second-buck-equiv",
    "cap-charge-curve",
    "sequencing-rc-circuit",
    "sequencing-chip-circuit",
    "sequencing-gpio-circuit",
    "ripple-cause-parts",
    "ripple-probe-setup",
    "ripple-measure-point",
    "fccm-psm-scope",
    "mode-scope-compare",
    "ripple-inductance-sim",
    "ripple-fsw-sim",
    "ripple-esr-esl-parts",
    "ripple-measure-chain",
    "ldo-nmos-block",
    "ldo-fb-divider",
    "ldo-nmos-iv",
    "ldo-pmos-topology",
    "ldo-pmos-iv",
    "ldo-thermal-calc",
    "ldo-selection-table",
    "ldo-fixed-circuit",
    "ldo-dropout-psrr",
    "ldo-params-table",
    "ldo-power-circuit",
    "dcdc-ldo-model"
  ];

  for (const baseName of powerAssets) {
    await access(new URL(`../public/images/knowledge/power-supplies/${baseName}.webp`, import.meta.url));
    await access(new URL(`../public/images/knowledge/power-supplies/${baseName}-hd.jpg`, import.meta.url));
  }

  const publicImages = await readdir(new URL("../public/images/knowledge/power-supplies/", import.meta.url));
  assert.equal(publicImages.some((name) => name.startsWith("加水印第三章")), false);
});

test("enhanced digital-chip assets exist without publishing full course pages", async () => {
  const digitalAssets = [
    "mcu-minimal-system",
    "mcu-power-circuit",
    "mcu-crystal-circuit",
    "mcu-reset-circuit",
    "mcu-boot-swd",
    "mcu-por-waveform",
    "mcu-hse-params",
    "mcu-boot-modes",
    "mcu-swd-pins",
    "mcu-datasheet-page",
    "mcu-clock-tree",
    "crystal-photos",
    "crystal-params",
    "soc-block-diagram",
    "fpga-7series-table",
    "fpga-zynq-architecture",
    "fpga-artix-power",
    "fpga-cyclone-power",
    "fpga-jtag-circuit",
    "fpga-master-spi",
    "fpga-config-arch",
    "fpga-mode-table",
    "fpga-mode-circuit",
    "fpga-done-circuit",
    "fpga-clock-region",
    "fpga-clock-hdmi",
    "ddr-command-table",
    "ddr-mode-register",
    "ddr-ball-table",
    "ddr-address-table",
    "ddr-internal-block",
    "ddr-capacity-sdram",
    "ddr-capacity-ddr3",
    "ddr-capacity-ddr4",
    "ddr-speedbin",
    "ddr-routing-schematic",
    "ddr-pin-swap",
    "reset-rc-internal",
    "max809-timing",
    "max809-table",
    "reset-cascade",
    "watchdog-cn825-circuit",
    "watchdog-tpv6823-app",
    "watchdog-timing",
    "watchdog-design-circuit",
    "osc-active-circuit",
    "quartz-params",
    "clock-buffer-diagram"
  ];

  for (const baseName of digitalAssets) {
    await access(new URL(`../public/images/knowledge/digital-chips/${baseName}.webp`, import.meta.url));
    await access(new URL(`../public/images/knowledge/digital-chips/${baseName}-hd.jpg`, import.meta.url));
  }

  const publicImages = await readdir(new URL("../public/images/knowledge/digital-chips/", import.meta.url));
  assert.equal(publicImages.some((name) => name.startsWith("加水印第四章")), false);
});

test("enhanced pcb-layout assets exist without publishing full course pages", async () => {
  const pcbLayoutAssets = [
    "routing-3w-definition",
    "routing-crosstalk-cases",
    "routing-perpendicular-layers",
    "routing-return-path",
    "routing-return-current-density",
    "routing-cross-split-tdr",
    "routing-stitching-cap",
    "routing-right-angle-width",
    "routing-arc-45deg",
    "decoupling-stm32-placement",
    "decoupling-via-connection-abcd",
    "decoupling-bga-backside",
    "decoupling-radius-layers",
    "clock-oscillator-schematic",
    "clock-osc-params",
    "clock-xtal-temp-curve",
    "clock-crosstalk-glitch",
    "clock-edge-overshoot",
    "clock-emi-125mhz",
    "copper-pour-reference-plane",
    "copper-edge-plating",
    "copper-exposed-thermal-vias",
    "copper-antenna-keepout",
    "guard-trace-via-spacing",
    "guard-coplanar-serdes",
    "isolation-transformer-photos",
    "isolation-transformer-keepout",
    "ground-thermal-relief-pad",
    "ground-thermal-spoke-detail",
    "ground-solder-quality",
    "ground-agnd-0ohm-schematic",
    "ground-agnd-single-point",
    "ground-20h-diagram",
    "ground-6layer-stackup-table",
    "ground-20h-flux-containment",
    "hs-mipi-skew-table",
    "hs-ddr-serpentine",
    "hs-serpentine-3w-spacing",
    "hs-local-vs-remote-matching",
    "hs-eye-diagram-compare",
    "hs-diffpair-s1-2s",
    "hs-eda-serpentine-constant-gap",
    "hs-jlc-4layer-stackup",
    "hs-jlc-6layer-stackup",
    "hs-microstrip-model",
    "fab-via-inner-outer",
    "fab-min-hole-tables",
    "fab-min-trace-tables",
    "fab-trace-spacing-labels",
    "fab-bga-through-fanout",
    "fab-hi3559-hdi",
    "fab-hdi-blind-buried",
    "fab-via-types-3d",
    "power-rt6253-guidelines",
    "power-rt6253-layout-fig14",
    "power-trace-current-calc",
    "power-via-current-sharing"
  ];

  for (const baseName of pcbLayoutAssets) {
    await access(new URL(`../public/images/knowledge/pcb-layout/${baseName}.webp`, import.meta.url));
    await access(new URL(`../public/images/knowledge/pcb-layout/${baseName}-hd.jpg`, import.meta.url));
  }

  const publicImages = await readdir(new URL("../public/images/knowledge/pcb-layout/", import.meta.url));
  assert.equal(publicImages.some((name) => name.startsWith("加水印第五章")), false);
});

test("enhanced analog-device assets exist without publishing full course pages", async () => {
  const analogAssets = [
    "opamp-lm358-pinout",
    "opamp-lm358-vos-datasheet",
    "opamp-lt1678-vos-datasheet",
    "opamp-lt1678-cover",
    "opamp-openloop-gain",
    "opamp-openloop-bode",
    "opamp-bias-current-table",
    "opamp-slew-rate-response",
    "opamp-cmrr-psrr-freq",
    "gain-voltage-follower",
    "gain-noninverting-amp",
    "gain-inverting-amp",
    "gain-summing-amp",
    "gain-difference-amp",
    "gain-differentiator",
    "gain-differentiator-wave",
    "gain-integrator",
    "gain-integrator-wave",
    "app-cc-source-opamp",
    "app-cc-source-mos",
    "app-range-shift-tl431",
    "app-stm32-rain-table",
    "app-ntc-rain-error",
    "app-ad5683-drive",
    "app-dac-opamp-follower",
    "adc-sh-quantize-encode",
    "adc-sampling-quantize-diagram",
    "adc-transfer-curve-12bit",
    "adc-sar-architecture",
    "adc-flash-architecture",
    "adc-pipeline-architecture",
    "adc-sigma-delta-architecture",
    "adc-architecture-compare",
    "adc-lsb-fsr-table",
    "adc-offset-gain-error",
    "adc-enob-table",
    "adc-bandwidth-vs-rate",
    "adc-channel-interface",
    "adc-input-impedance",
    "vref-analog-digital-partition",
    "vref-ldo-psrr",
    "vref-single-vs-differential",
    "vref-kelvin-ina240",
    "vref-rc-filter-ad7980",
    "vref-offset-1p65-thevenin",
    "vref-flyback-tlv431",
    "vref-digipot-lt6220",
    "vref-pwm-rc-scope",
    "vref-tl431-pinout-app",
    "vref-tl431-internal",
    "vref-tl431-12v-5v",
    "vref-resistor-package-table",
    "vref-adr34xx-application"
  ];

  for (const baseName of analogAssets) {
    await access(new URL(`../public/images/knowledge/analog-devices/${baseName}.webp`, import.meta.url));
    await access(new URL(`../public/images/knowledge/analog-devices/${baseName}-hd.jpg`, import.meta.url));
  }

  const publicImages = await readdir(new URL("../public/images/knowledge/analog-devices/", import.meta.url));
  assert.equal(publicImages.some((name) => name.startsWith("加水印第六章")), false);
});

test("the pcb routing article covers spacing, reference planes and splits", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/PcbRoutingArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["3W", "串扰", "垂直走线", "返回路径", "跨分割", "缝合电容", "1.414", "45°"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 1);
  assert.match(article, /title="电源平面分割区的走线处理"/);
  for (const image of ["routing-3w-definition", "routing-return-current-density", "routing-cross-split-tdr", "routing-stitching-cap", "routing-right-angle-width"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "pcb-routing"[\s\S]*?readingTime: "约 15 分钟"/);
});

test("the pcb decoupling article covers placement rules, decoupling radius and clock routing", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/PcbDecouplingArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["单独分配", "引线尽可能短", "BGA", "去耦半径", "磁珠", "22Ω", "0.35", "87.5", "包地"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.match(article, /d_\{decap\}≈λ\/40~λ\/50.*经验估算/);
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 2);
  assert.match(article, /title="100nF 去耦电容为什么必须贴着引脚放"/);
  assert.match(article, /title="产品辐射超标，定位时钟问题"/);
  for (const image of ["decoupling-stm32-placement", "decoupling-radius-layers", "clock-oscillator-schematic", "clock-xtal-temp-curve", "clock-emi-125mhz"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "pcb-decoupling"[\s\S]*?readingTime: "约 14 分钟"/);
});

test("the pcb copper pour article covers pour rules, guard traces and isolation keepouts", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/PcbCopperPourArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["参考平面", "法拉第笼", "孤铜", "包地线", "共面参考", "HGND", "挖空", "λ/10"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 0);
  for (const image of ["copper-pour-reference-plane", "copper-edge-plating", "copper-antenna-keepout", "guard-trace-via-spacing", "isolation-transformer-keepout"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "pcb-copper-pour"[\s\S]*?readingTime: "约 10 分钟"/);
});

test("the pcb ground article covers thermal relief, agnd split and the 20H rule", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/PcbGroundDesignArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["热风焊盘", "十字花", "虚焊", "地弹", "AGND", "连续地平面", "寄生阻抗", "20H", "21.65", "433"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 2);
  assert.match(article, /title="ADC 采样值抖动，检查地处理"/);
  assert.match(article, /title="计算六层板的 20H 内缩量"/);
  for (const image of ["ground-thermal-relief-pad", "ground-agnd-0ohm-schematic", "ground-agnd-single-point", "ground-20h-diagram", "ground-20h-flux-containment"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "pcb-ground-design"[\s\S]*?readingTime: "约 11 分钟"/);
});

test("the pcb high-speed article covers length tuning, stackups and impedance", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/PcbHighSpeedArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["蛇形线", "±5mil", "MIPI", "就近补偿", "眼图", "S1", "微带线", "4.28", "21.65", "DDR3"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.match(article, /Z_0 ≈ 87\/√\(ε_r\+1\.41\)/);
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 1);
  assert.match(article, /title="MIPI 屏时钟线的等长控制"/);
  for (const image of ["hs-mipi-skew-table", "hs-ddr-serpentine", "hs-eye-diagram-compare", "hs-jlc-6layer-stackup", "hs-microstrip-model"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "pcb-high-speed"[\s\S]*?readingTime: "约 15 分钟"/);
});

test("the pcb fab article covers fabrication limits, cost balance and HDI boards", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/PcbFabHdiArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["0.15mm", "0.075mm", "6mil", "3mil", "6/6mil", "4/4mil", "12mil", "盲孔", "埋孔", "HDI", "爬电"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 1);
  assert.match(article, /title="给一块通用 4 层板定设计规则"/);
  for (const image of ["fab-min-hole-tables", "fab-via-inner-outer", "fab-min-trace-tables", "fab-bga-through-fanout", "fab-via-types-3d"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "pcb-fab-hdi"[\s\S]*?readingTime: "约 10 分钟"/);
});

test("the pcb power layout article covers switch-mode rules and current capacity", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/PcbPowerLayoutArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["环路面积", "SW", "thermal pad", "355", "FB", "RT6253", "10K", "40mil", "108.9", "2.44A", "200mA"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.match(article, /I = k × ΔT\^0\.44 × A\^0\.725/);
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 2);
  assert.match(article, /title="评审一块 BUCK 电源的布局"/);
  assert.match(article, /title="给 4A 电源走线定线宽与过孔"/);
  for (const image of ["power-rt6253-guidelines", "power-rt6253-layout-fig14", "power-trace-current-calc", "power-via-current-sharing"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "pcb-power-layout"[\s\S]*?readingTime: "约 8 分钟"/);
});

test("the opamp basics article covers virtual short, parameters and selection", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/OpampBasicsArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["虚短", "虚断", "虚地", "LM358", "LT1678", "轨到轨", "GBP", "压摆率", "CMRR", "PSRR", "1.1MHz"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.match(article, /V_\{IN\+}=V_\{IN-\}/);
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 2);
  assert.match(article, /title="反相放大器输出计算"/);
  assert.match(article, /title="先判断 100kHz 放大需求能否实现"/);
  for (const image of ["opamp-lm358-pinout", "opamp-lm358-vos-datasheet", "opamp-lt1678-cover", "opamp-openloop-bode", "opamp-slew-rate-response"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "opamp-basics"[\s\S]*?readingTime: "约 18 分钟"/);
});

test("the opamp circuits article derives every basic op-amp stage", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/OpampCircuitsArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["跟随", "同相比例", "反相比例", "加法", "减法", "差分", "微分", "积分", "虚地"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.match(article, /V_\{OUT\}=V_\{IN\}×\(1\+R_f\/R_g\)/);
  assert.match(article, /V_\{OUT\}=-V_\{IN\}×R_f\/R_g/);
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 1);
  assert.match(article, /title="差分放大输出计算（叠加定理）"/);
  for (const image of ["gain-voltage-follower", "gain-noninverting-amp", "gain-inverting-amp", "gain-summing-amp", "gain-difference-amp", "gain-integrator-wave"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "opamp-circuits"[\s\S]*?readingTime: "约 12 分钟"/);
});

test("the opamp applications article covers current sources, range shift and ADC/DAC buffers", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/OpampAppsArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["恒流源", "2.5mA", "MOS", "TL431", "RAIN", "50kΩ", "NTC", "AD5683", "4-20mA", "±5V"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.match(article, /I=V_\{ref\}\/R=2\.5V\/1kΩ=2\.5mA/);
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 2);
  assert.match(article, /title="设计 2A 恒流源"/);
  assert.match(article, /title="DAC 输出经长线缆驱动负载"/);
  for (const image of ["app-cc-source-opamp", "app-cc-source-mos", "app-range-shift-tl431", "app-stm32-rain-table", "app-ad5683-drive"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "opamp-apps"[\s\S]*?readingTime: "约 14 分钟"/);
});

test("the adc primer article covers conversion stages, architectures and parameters", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/AdcPrimerArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["香农", "混叠", "SAR", "FLASH", "流水线", "Σ-Δ", "LSB", "FSR", "量化", "INL", "ENOB", "LVDS", "300MHz"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.match(article, /LSB=FSR\/2\^N/);
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 2);
  assert.match(article, /title="SAR 二分逼近推码"/);
  assert.match(article, /title="选一颗采集电池电压的 ADC"/);
  for (const image of ["adc-sh-quantize-encode", "adc-sar-architecture", "adc-flash-architecture", "adc-pipeline-architecture", "adc-sigma-delta-architecture", "adc-architecture-compare", "adc-lsb-fsr-table", "adc-input-impedance"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "adc-primer"[\s\S]*?readingTime: "约 20 分钟"/);
});

test("the vref precision article covers the accuracy checklist and reference designs", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/VrefPrecisionArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["七步", "开尔文", "TL431", "ADR3425", "8ppm", "LDO", "PSRR", "戴维南", "1.65V", "680Ω", "8.78mA"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.match(article, /V_\{KA\}=V_\{ref\}×\(1\+R_1\/R_2\)\+I_\{ref\}×R_1/);
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 1);
  assert.match(article, /title="TL431 设计：12V→5V 参考源"/);
  for (const image of ["vref-analog-digital-partition", "vref-single-vs-differential", "vref-kelvin-ina240", "vref-tl431-internal", "vref-tl431-12v-5v", "vref-adr34xx-application"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "vref-precision"[\s\S]*?readingTime: "约 18 分钟"/);
});

test("the switching regulator article covers topologies, modes and ripple control", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/SwitchingRegulatorArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["同步 BUCK", "BOOST", "CCM", "DCM", "PSM/PFM", "伏秒平衡", "上电时序", "纹波", "LM3881"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.match(article, /伏秒平衡.*V_\{OUT\}\/V_\{IN\}=D|V_\{OUT\}\/V_\{IN\}=D/s);
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 2);
  assert.match(article, /title="12V→5V\/3A BUCK 的电感与纹波校核"/);
  for (const image of ["dcdc-components", "buck-loop-charge", "volt-second-waveform", "ripple-measure-point", "ripple-inductance-sim"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "switching-regulator"[\s\S]*?readingTime: "约 25 分钟"/);
});

test("the linear regulator article covers LDO principle, thermal and power tree", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/LinearRegulatorArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["误差放大器", "NMOS", "PMOS", "Dropout", "PSRR", "静态电流", "温升", "电源树", "TPS7A8001"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.match(article, /V_\{OUT\}=V_\{REF\}\times\(1\+R_1\/R_2\)|V_{OUT}=V_{REF}/s);
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 1);
  assert.match(article, /title="AMS1117 5V→3.3V\/500mA 温升校核"/);
  for (const image of ["ldo-nmos-block", "ldo-pmos-topology", "ldo-thermal-calc", "ldo-power-circuit", "dcdc-ldo-model"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "linear-regulator"[\s\S]*?readingTime: "约 18 分钟"/);
});

test("the mcu article covers minimal system, crystal load capacitance and debugging", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/McuArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["STM32F103RBT6", "去耦电容", "负载电容", "32.768kHz", "复位", "BOOT0", "SWD", "时钟树", "datasheet"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.match(article, /C_L=\(C_1×C_2\)\/\(C_1\+C_2\)\+C_\{stray\}/);
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 2);
  assert.match(article, /title="25MHz 晶振的负载电容配置"/);
  assert.match(article, /title="最小系统上电无响应的排查思路"/);
  for (const image of ["mcu-minimal-system", "mcu-crystal-circuit", "mcu-reset-circuit", "mcu-boot-modes", "mcu-clock-tree"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "mcu"[\s\S]*?readingTime: "约 22 分钟"/);
});

test("the fpga article covers soc comparison, power sequencing and configuration", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/FpgaArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["RK3588", "ZYNQ", "VCCINT", "VCCAUX", "VCCO", "JTAG", "主模式 SPI", "M\\[2:0\\]", "MRCC", "有源晶振"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 1);
  assert.match(article, /title="FPGA 上电不加载的排查"/);
  for (const image of ["soc-block-diagram", "fpga-artix-power", "fpga-master-spi", "fpga-mode-table", "fpga-clock-region"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "fpga"[\s\S]*?readingTime: "约 18 分钟"/);
});

test("the ddr article covers operations, capacity math and routing rules", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/DdrArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["激活", "预充电", "自动刷新", "模式寄存器", "行地址", "列地址", "BANK", "等长", "DQ", "DQS", "Bank Group"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.match(article, /2\^\{\(13\+9\+2\)}\times16|容量 = 2\^\{/);
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 1);
  assert.match(article, /title="判断开发板 DDR3 颗粒的总容量"/);
  for (const image of ["ddr-command-table", "ddr-mode-register", "ddr-ball-table", "ddr-capacity-sdram", "ddr-pin-swap"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "ddr"[\s\S]*?readingTime: "约 20 分钟"/);
});

test("the reset and watchdog article covers reset sources and watchdog design", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/ResetWatchdogArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["上电复位", "POR", "手动复位", "看门狗", "MAX809", "级联复位", "喂狗", "WDI", "NRST"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 1);
  assert.match(article, /title="外置看门狗的喂狗周期校核"/);
  for (const image of ["reset-rc-internal", "max809-timing", "reset-cascade", "watchdog-tpv6823-app", "watchdog-design-circuit"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "reset-watchdog"[\s\S]*?readingTime: "约 15 分钟"/);
});

test("the expanded triode article covers switching, amplification and working-point calculations", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/TriodeArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["饱和", "静态工作点", "微变等效电路", "共射", "共集", "共基", "电平转换", "温度"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.match(article, /title="分压偏置共射电路的静态工作点校核"/);
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 1);
  for (const image of [
    "bjt-switch-inverter",
    "bjt-level-shift",
    "bjt-tl431-reference",
    "bjt-linear-regulator",
    "bjt-common-emitter-qpoint",
    "bjt-small-signal",
    "bjt-voltage-bias-qpoint",
    "bjt-bypass-compare"
  ]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "triode"[\s\S]*?readingTime: "约 18 分钟"/);
});

test("the expanded optocoupler article covers CTR, circuit design and wired-AND logic", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/OptocouplerArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["CTR", "隔离", "限流", "上拉", "OC 门", "OD 门", "线与", "IIC"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.match(article, /title="3.3V GPIO 隔离驱动 12V 输出的光耦校核"/);
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 1);
  for (const image of ["optocoupler-ctr", "optocoupler-circuits", "oc-od-wired-and"]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "optocoupler"[\s\S]*?readingTime: "约 12 分钟"/);
});

test("the expanded mosfet article covers functions, losses, parallel use and SOA", async () => {
  const [article, registry] = await Promise.all([
    read("src/knowledge/articles/MosfetArticle.jsx"),
    read("src/knowledge/articles.js")
  ]);

  for (const topic of ["RDS", "缓启动", "并联", "损耗", "SOA", "电平转换", "开关电源", "结温"]) {
    assert.match(article, new RegExp(topic));
  }
  assert.match(article, /title="Buck 功率级 MOS 管损耗校核"/);
  assert.equal((article.match(/<WorkedExample/g) ?? []).length, 1);
  for (const image of [
    "mos-iic-level-shift",
    "mos-pmos-soft-start",
    "mos-vs-bjt-temperature",
    "mos-soft-start-simulation",
    "mos-switching-loss",
    "mos-soa",
    "mos-soa-selection"
  ]) {
    assert.match(article, new RegExp(image));
  }
  assert.match(registry, /slug: "mosfet"[\s\S]*?readingTime: "约 20 分钟"/);
});
