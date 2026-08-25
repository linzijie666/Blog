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
    "capacitor-inductor"
  ]);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(new Set(hashes).size, hashes.length);

  for (const article of articleRegistry) {
    assert.ok(article.title);
    assert.ok(article.summary);
    assert.ok(article.readingTime);
    assert.ok(article.sections.length >= 4);
    assert.equal(getArticleBySlug(article.slug), article);
  }

  assert.equal(getArticleBySlug("unknown"), null);
});

test("the four review articles expose stable previous and next relationships", async () => {
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
      { slug: "ferrite-bead", previousSlug: "inductor", nextSlug: null }
    ]
  );
});
