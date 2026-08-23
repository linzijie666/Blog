export const ARTICLE_HASH = "#/knowledge/capacitor-inductor";

export function resolveKnowledgeRoute(hash) {
  return hash === ARTICLE_HASH ? "capacitor-inductor" : null;
}

export function resetArticleScroll(viewport = window) {
  viewport.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

export function scrollToArticleSection(sectionId, root = document) {
  const section = root.getElementById(sectionId);
  if (!section) return false;

  section.scrollIntoView({ behavior: "instant", block: "start" });
  return true;
}

export function scrollToHomeAnchor(hash, root = document) {
  if (hash !== "#knowledge") return false;

  const section = root.getElementById("knowledge");
  if (!section) return false;

  section.scrollIntoView({ behavior: "instant", block: "start" });
  section.focus({ preventScroll: true });
  return true;
}
