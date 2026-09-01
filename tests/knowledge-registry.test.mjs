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
    "eye-diagram-jitter",
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

test("the review articles are organized into eight knowledge chapters", async () => {
  const { knowledgeChapters, reviewArticles } = await import(registryUrl);

  assert.deepEqual(Object.keys(knowledgeChapters), ["passive", "semiconductor", "power", "digital", "pcb-layout", "analog-devices", "high-speed-interfaces", "si-pi"]);
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
      ["semiconductor", "mosfet"],
      ["power", "switching-regulator"],
      ["power", "linear-regulator"],
      ["digital", "mcu"],
      ["digital", "fpga"],
      ["digital", "ddr"],
      ["digital", "reset-watchdog"],
      ["pcb-layout", "pcb-routing"],
      ["pcb-layout", "pcb-decoupling"],
      ["pcb-layout", "pcb-copper-pour"],
      ["pcb-layout", "pcb-ground-design"],
      ["pcb-layout", "pcb-high-speed"],
      ["pcb-layout", "pcb-fab-hdi"],
      ["pcb-layout", "pcb-power-layout"],
      ["analog-devices", "opamp-basics"],
      ["analog-devices", "opamp-circuits"],
      ["analog-devices", "opamp-apps"],
      ["analog-devices", "adc-primer"],
      ["analog-devices", "vref-precision"],
      ["high-speed-interfaces", "iic-spi"],
      ["high-speed-interfaces", "setup-hold-time"],
      ["high-speed-interfaces", "rs232-rs485"],
      ["high-speed-interfaces", "lvds"],
      ["high-speed-interfaces", "gigabit-ethernet"],
      ["high-speed-interfaces", "hdmi-pcie-usb"],
      ["si-pi", "pi-pdn"],
      ["si-pi", "transmission-line-termination"],
      ["si-pi", "si-measurement"],
      ["si-pi", "length-matching"],
      ["si-pi", "si-routing"],
      ["si-pi", "eye-diagram-jitter"]
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
  assert.match(knowledgeChapters.power.downloadHref, /power-supplies-review\.pdf$/);
  assert.equal(knowledgeChapters.power.downloadPages, 56);
  assert.match(knowledgeChapters.digital.downloadHref, /digital-chips-review\.pdf$/);
  assert.equal(knowledgeChapters.digital.downloadPages, 66);
  assert.match(knowledgeChapters["pcb-layout"].downloadHref, /pcb-layout-review\.pdf$/);
  assert.equal(knowledgeChapters["pcb-layout"].downloadPages, 32);
  assert.match(knowledgeChapters["analog-devices"].downloadHref, /analog-devices-review\.pdf$/);
  assert.equal(knowledgeChapters["analog-devices"].downloadPages, 51);
  assert.match(knowledgeChapters["high-speed-interfaces"].downloadHref, /high-speed-interfaces-review\.pdf$/);
  assert.equal(knowledgeChapters["high-speed-interfaces"].downloadPages, 66);
  assert.match(knowledgeChapters["si-pi"].downloadHref, /si-pi-review\.pdf$/);
  assert.equal(knowledgeChapters["si-pi"].downloadPages, 98);
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
      { slug: "mosfet", previousSlug: "optocoupler", nextSlug: "switching-regulator" },
      { slug: "switching-regulator", previousSlug: "mosfet", nextSlug: "linear-regulator" },
      { slug: "linear-regulator", previousSlug: "switching-regulator", nextSlug: "mcu" },
      { slug: "mcu", previousSlug: "linear-regulator", nextSlug: "fpga" },
      { slug: "fpga", previousSlug: "mcu", nextSlug: "ddr" },
      { slug: "ddr", previousSlug: "fpga", nextSlug: "reset-watchdog" },
      { slug: "reset-watchdog", previousSlug: "ddr", nextSlug: "pcb-routing" },
      { slug: "pcb-routing", previousSlug: "reset-watchdog", nextSlug: "pcb-decoupling" },
      { slug: "pcb-decoupling", previousSlug: "pcb-routing", nextSlug: "pcb-copper-pour" },
      { slug: "pcb-copper-pour", previousSlug: "pcb-decoupling", nextSlug: "pcb-ground-design" },
      { slug: "pcb-ground-design", previousSlug: "pcb-copper-pour", nextSlug: "pcb-high-speed" },
      { slug: "pcb-high-speed", previousSlug: "pcb-ground-design", nextSlug: "pcb-fab-hdi" },
      { slug: "pcb-fab-hdi", previousSlug: "pcb-high-speed", nextSlug: "pcb-power-layout" },
      { slug: "pcb-power-layout", previousSlug: "pcb-fab-hdi", nextSlug: "opamp-basics" },
      { slug: "opamp-basics", previousSlug: "pcb-power-layout", nextSlug: "opamp-circuits" },
      { slug: "opamp-circuits", previousSlug: "opamp-basics", nextSlug: "opamp-apps" },
      { slug: "opamp-apps", previousSlug: "opamp-circuits", nextSlug: "adc-primer" },
      { slug: "adc-primer", previousSlug: "opamp-apps", nextSlug: "vref-precision" },
      { slug: "vref-precision", previousSlug: "adc-primer", nextSlug: "iic-spi" },
      { slug: "iic-spi", previousSlug: "vref-precision", nextSlug: "setup-hold-time" },
      { slug: "setup-hold-time", previousSlug: "iic-spi", nextSlug: "rs232-rs485" },
      { slug: "rs232-rs485", previousSlug: "setup-hold-time", nextSlug: "lvds" },
      { slug: "lvds", previousSlug: "rs232-rs485", nextSlug: "gigabit-ethernet" },
      { slug: "gigabit-ethernet", previousSlug: "lvds", nextSlug: "hdmi-pcie-usb" },
      { slug: "hdmi-pcie-usb", previousSlug: "gigabit-ethernet", nextSlug: "pi-pdn" },
      { slug: "pi-pdn", previousSlug: "hdmi-pcie-usb", nextSlug: "transmission-line-termination" },
      { slug: "transmission-line-termination", previousSlug: "pi-pdn", nextSlug: "si-measurement" },
      { slug: "si-measurement", previousSlug: "transmission-line-termination", nextSlug: "length-matching" },
      { slug: "length-matching", previousSlug: "si-measurement", nextSlug: "si-routing" },
      { slug: "si-routing", previousSlug: "length-matching", nextSlug: "eye-diagram-jitter" },
      { slug: "eye-diagram-jitter", previousSlug: "si-routing", nextSlug: null }
    ]
  );
});
