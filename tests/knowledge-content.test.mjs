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

  assert.match(app, /label: "Knowledge", href: "#knowledge"/);
  assert.match(app, /<KnowledgeSection/);
  assert.doesNotMatch(app, /className="contact-finale/);
  assert.match(app, /<KnowledgeArticle email=\{email\}/);
  assert.match(app, /scrollToHomeAnchor\(locationHash\)/);
  assert.match(section, /id="knowledge"/);
  assert.match(section, /tabIndex="-1"/);
  assert.match(section, /legacyArticle\.hash/);
  assert.match(section, /开始复习/);
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

test("the shared article shell owns navigation, metadata and the PDF download", async () => {
  const shell = await read("src/knowledge/ArticleShell.jsx");

  assert.match(shell, /article-site-header/);
  assert.match(shell, /aria-label="文章目录"/);
  assert.match(shell, /上一篇/);
  assert.match(shell, /下一篇/);
  assert.match(shell, /返回知识专栏/);
  assert.match(shell, /downloads\/passive-components-review\.pdf/);
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

test("the homepage and app expose all review articles while preserving the legacy article", async () => {
  const [app, section] = await Promise.all([
    read("src/App.jsx"),
    read("src/knowledge/KnowledgeSection.jsx")
  ]);

  assert.match(app, /<ReviewArticle slug=\{knowledgeRoute\}/);
  assert.match(app, /knowledgeRoute === "capacitor-inductor"/);
  assert.match(section, /reviewArticles\.map/);
  assert.match(section, /延伸阅读/);
  assert.match(section, /下载完整课件/);
});

test("the integrated homepage and app preserve the remote diode article", async () => {
  const [app, section, diode] = await Promise.all([
    read("src/App.jsx"),
    read("src/knowledge/KnowledgeSection.jsx"),
    read("src/knowledge/DiodeArticle.jsx")
  ]);

  assert.match(app, /import DiodeArticle/);
  assert.match(app, /knowledgeRoute === "diode"/);
  assert.match(app, /<DiodeArticle email=\{email\}/);
  assert.match(section, /DIODE_ARTICLE_HASH/);
  assert.match(section, /二极管：从 PN 结到整流、限幅与稳压/);
  assert.match(diode, /Shockley PN 结电流方程/);
  assert.match(diode, /反向恢复/);
});

test("the downloadable course PDF is published as a static resource", async () => {
  await access(new URL("../public/downloads/passive-components-review.pdf", import.meta.url));
});

test("every referenced article image has a web and high-resolution asset", async () => {
  const sources = await Promise.all([
    read("src/knowledge/articles/ResistorArticle.jsx"),
    read("src/knowledge/articles/CapacitorArticle.jsx"),
    read("src/knowledge/articles/InductorArticle.jsx"),
    read("src/knowledge/articles/FerriteBeadArticle.jsx")
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
