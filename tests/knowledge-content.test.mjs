import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (filePath) => readFile(new URL(`../${filePath}`, import.meta.url), "utf8");

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

test("the diode article covers the PN junction and interview essentials", async () => {
  const article = await read("src/knowledge/DiodeArticle.jsx");

  assert.match(article, /PN 结如何形成/);
  assert.match(article, /I_D.*I_S.*exp.*V_D.*nV_T/s);
  assert.match(article, /V_T.*25\.9 mV/s);
  assert.match(article, /势垒电容/);
  assert.match(article, /扩散电容/);
  assert.match(article, /齐纳击穿/);
  assert.match(article, /桥式全波整流/);
  assert.match(article, /限幅/);
  assert.match(article, /稳压/);
  assert.match(article, /t_rr/);
  assert.match(article, /Q_rr/);
  assert.match(article, /Shockley/);
  assert.match(article, /DIODE_ARTICLE_HASH/);
});

test("the diode article preserves article accessibility hooks", async () => {
  const article = await read("src/knowledge/DiodeArticle.jsx");

  assert.match(article, /href="\.\/\#knowledge"/);
  assert.match(article, /mailto:\$\{email\}/);
  assert.match(article, /aria-label="文章目录"/);
  assert.match(article, /useLayoutEffect/);
  assert.match(article, /resetArticleScroll/);
  assert.match(article, /ref=\{mainRef\}/);
  assert.match(article, /tabIndex="-1"/);
});

test("the article exposes clear return and contact paths", async () => {
  const article = await read("src/knowledge/KnowledgeArticle.jsx");

  assert.match(article, /href="\.\/#knowledge"/);
  assert.match(article, /mailto:\$\{email\}/);
  assert.match(article, /<article/);
  assert.match(article, /aria-label="文章目录"/);
  assert.match(article, /useLayoutEffect/);
  assert.match(article, /resetArticleScroll/);
});

test("the client-side article route announces the new view", async () => {
  const article = await read("src/knowledge/KnowledgeArticle.jsx");

  assert.match(article, /useRef/);
  assert.match(article, /ref=\{mainRef\}/);
  assert.match(article, /tabIndex="-1"/);
  assert.match(article, /document\.title\s*=/);
  assert.match(article, /focus\(\{ preventScroll: true \}\)/);
});

test("the article table of contents preserves the article hash route", async () => {
  const article = await read("src/knowledge/KnowledgeArticle.jsx");

  assert.match(article, /href=\{ARTICLE_HASH\}/);
  assert.match(article, /scrollToArticleSection/);
  assert.doesNotMatch(article, /href=\{`#\$\{id\}`\}/);
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
  assert.match(section, /ARTICLE_HASH/);
  assert.match(section, /阅读全文/);
  assert.match(section, /DIODE_ARTICLE_HASH/);
  assert.match(section, /二极管：从 PN 结到整流、限幅与稳压/);
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
  assert.match(css, /\.knowledge-card-grid/);
  assert.match(css, /\.knowledge-article/);
  assert.match(css, /\.formula-block/);
  assert.match(css, /@media\s*\(max-width:\s*768px\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(css, /min-width:\s*1180px/);
});
