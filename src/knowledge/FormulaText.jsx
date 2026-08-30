import { Fragment } from "react";

// LaTeX 子集：`_x` / `_{xx}` 渲染为下角标，`^x` / `^{xx}` 渲染为上角标。
const MARKER_PATTERN = /([_^])(?:\{([^}]*)\}|([^\s_^{}]))/g;

export function formulaPlainText(text) {
  if (typeof text !== "string") return text ?? "";
  return text.replace(MARKER_PATTERN, (_match, _marker, braced, single) => braced ?? single ?? "");
}

function renderSegments(text) {
  const pattern = new RegExp(MARKER_PATTERN.source, "g");
  const nodes = [];
  let cursor = 0;
  let key = 0;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      nodes.push(<Fragment key={key++}>{text.slice(cursor, match.index)}</Fragment>);
    }
    const content = match[2] ?? match[3];
    nodes.push(
      match[1] === "_"
        ? <sub key={key++}>{content}</sub>
        : <sup key={key++}>{content}</sup>
    );
    cursor = pattern.lastIndex;
  }
  if (cursor < text.length) {
    nodes.push(<Fragment key={key++}>{text.slice(cursor)}</Fragment>);
  }
  return nodes;
}

export default function FormulaText({ text }) {
  if (typeof text !== "string") return text;
  const nodes = renderSegments(text);
  if (nodes.length === 0) return null;
  return nodes;
}
