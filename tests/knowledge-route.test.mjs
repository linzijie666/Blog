import assert from "node:assert/strict";
import test from "node:test";
import {
  ARTICLE_HASH,
  ARTICLE_HASHES,
  DIODE_ARTICLE_HASH,
  resetArticleScroll,
  resolveKnowledgeRoute,
  scrollToHomeAnchor,
  scrollToArticleSection
} from "../src/knowledge/route.js";

test("the capacitor and inductor article has a stable hash route", () => {
  assert.equal(ARTICLE_HASH, "#/knowledge/capacitor-inductor");
  assert.equal(resolveKnowledgeRoute(ARTICLE_HASH), "capacitor-inductor");
});

test("the review articles have stable hash routes", () => {
  assert.deepEqual(ARTICLE_HASHES, {
    resistor: "#/knowledge/resistor",
    capacitor: "#/knowledge/capacitor",
    inductor: "#/knowledge/inductor",
    "ferrite-bead": "#/knowledge/ferrite-bead",
    diode: "#/knowledge/diode",
    triode: "#/knowledge/triode",
    optocoupler: "#/knowledge/optocoupler",
    mosfet: "#/knowledge/mosfet",
    "capacitor-inductor": "#/knowledge/capacitor-inductor"
  });

  for (const [slug, hash] of Object.entries(ARTICLE_HASHES)) {
    assert.equal(resolveKnowledgeRoute(hash), slug);
  }
});

test("the diode article keeps its remote hash route after integration", () => {
  assert.equal(DIODE_ARTICLE_HASH, "#/knowledge/diode");
  assert.equal(resolveKnowledgeRoute(DIODE_ARTICLE_HASH), "diode");
});

test("home anchors and unknown hashes safely resolve to the homepage", () => {
  assert.equal(resolveKnowledgeRoute(""), null);
  assert.equal(resolveKnowledgeRoute("#knowledge"), null);
  assert.equal(resolveKnowledgeRoute("#/knowledge/unknown"), null);
});

test("article entry resets the viewport to the top", () => {
  let receivedOptions;
  const viewport = {
    scrollTo(options) {
      receivedOptions = options;
    }
  };

  resetArticleScroll(viewport);

  assert.deepEqual(receivedOptions, { top: 0, left: 0, behavior: "instant" });
});

test("article table of contents scrolls within the current document", () => {
  let receivedOptions;
  const target = {
    scrollIntoView(options) {
      receivedOptions = options;
    }
  };
  const root = {
    getElementById(id) {
      return id === "capacitor" ? target : null;
    }
  };

  assert.equal(scrollToArticleSection("capacitor", root), true);
  assert.deepEqual(receivedOptions, { behavior: "instant", block: "start" });
  assert.equal(scrollToArticleSection("missing", root), false);
});

test("home rerender restores the requested knowledge anchor", () => {
  let receivedOptions;
  let receivedFocusOptions;
  const target = {
    scrollIntoView(options) {
      receivedOptions = options;
    },
    focus(options) {
      receivedFocusOptions = options;
    }
  };
  const root = {
    getElementById(id) {
      return id === "knowledge" ? target : null;
    }
  };

  assert.equal(scrollToHomeAnchor("#knowledge", root), true);
  assert.deepEqual(receivedOptions, { behavior: "instant", block: "start" });
  assert.deepEqual(receivedFocusOptions, { preventScroll: true });
  assert.equal(scrollToHomeAnchor("#/knowledge/unknown", root), false);
});
