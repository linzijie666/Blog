import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const registryUrl = new URL("../src/knowledge/articles.js", import.meta.url);

test("the article registry module exists", () => {
  assert.equal(existsSync(fileURLToPath(registryUrl)), true);
});

test("the article registry describes unique complete article metadata", async () => {
  const { articleRegistry, getArticleBySlug } = await import(registryUrl);
  const slugs = articleRegistry.map((article) => article.slug);
  const hashes = articleRegistry.map((article) => article.hash);

  assert.deepEqual(slugs, [
    "resistor",
    "capacitor",
    "inductor",
    "ferrite-bead",
    "diode",
    "triode",
    "optocoupler",
    "mosfet",
    "capacitor-inductor"
  ]);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(new Set(hashes).size, hashes.length);

  for (const article of articleRegistry) {
    assert.ok(article.title);
    assert.ok(article.summary);
    assert.ok(article.readingTime);
    assert.ok(article.sections.length >= 4);
    assert.ok(article.download.href.startsWith("downloads/"));
    assert.ok(Number.isInteger(article.download.pages));
    assert.equal(getArticleBySlug(article.slug), article);
  }

  assert.equal(getArticleBySlug("unknown"), null);
});

test("the review articles are organized into the two knowledge chapters", async () => {
  const { knowledgeChapters, reviewArticles } = await import(registryUrl);

  assert.deepEqual(Object.keys(knowledgeChapters), ["passive", "semiconductor"]);
  assert.deepEqual(
    reviewArticles.map((article) => [article.chapter, article.slug]),
    [
      ["passive", "resistor"],
      ["passive", "capacitor"],
      ["passive", "inductor"],
      ["passive", "ferrite-bead"],
      ["semiconductor", "diode"],
      ["semiconductor", "triode"],
      ["semiconductor", "optocoupler"],
      ["semiconductor", "mosfet"]
    ]
  );

  for (const article of reviewArticles) {
    const chapter = knowledgeChapters[article.chapter];
    assert.ok(chapter);
    assert.equal(article.category, `${chapter.index} · ${chapter.title} / 硬件面试复习`);
    assert.equal(article.download.href, chapter.downloadHref);
    assert.equal(article.download.pages, chapter.downloadPages);
  }

  assert.match(knowledgeChapters.passive.downloadHref, /passive-components-review\.pdf$/);
  assert.equal(knowledgeChapters.passive.downloadPages, 44);
  assert.match(knowledgeChapters.semiconductor.downloadHref, /semiconductor-devices-review\.pdf$/);
  assert.equal(knowledgeChapters.semiconductor.downloadPages, 60);
});

test("the review articles expose stable previous and next relationships", async () => {
  const { reviewArticles } = await import(registryUrl);

  assert.deepEqual(
    reviewArticles.map(({ slug, previousSlug, nextSlug }) => ({
      slug,
      previousSlug,
      nextSlug
    })),
    [
      { slug: "resistor", previousSlug: null, nextSlug: "capacitor" },
      { slug: "capacitor", previousSlug: "resistor", nextSlug: "inductor" },
      { slug: "inductor", previousSlug: "capacitor", nextSlug: "ferrite-bead" },
      { slug: "ferrite-bead", previousSlug: "inductor", nextSlug: "diode" },
      { slug: "diode", previousSlug: "ferrite-bead", nextSlug: "triode" },
      { slug: "triode", previousSlug: "diode", nextSlug: "optocoupler" },
      { slug: "optocoupler", previousSlug: "triode", nextSlug: "mosfet" },
      { slug: "mosfet", previousSlug: "optocoupler", nextSlug: null }
    ]
  );
});
