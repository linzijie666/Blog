import ArticleShell from "./ArticleShell.jsx";
import { getArticleBySlug } from "./articles.js";
import CapacitorArticle from "./articles/CapacitorArticle.jsx";
import DiodeArticle from "./articles/DiodeArticle.jsx";
import FerriteBeadArticle from "./articles/FerriteBeadArticle.jsx";
import InductorArticle from "./articles/InductorArticle.jsx";
import MosfetArticle from "./articles/MosfetArticle.jsx";
import OptocouplerArticle from "./articles/OptocouplerArticle.jsx";
import ResistorArticle from "./articles/ResistorArticle.jsx";
import TriodeArticle from "./articles/TriodeArticle.jsx";

const articleBodies = {
  resistor: ResistorArticle,
  capacitor: CapacitorArticle,
  inductor: InductorArticle,
  "ferrite-bead": FerriteBeadArticle,
  diode: DiodeArticle,
  triode: TriodeArticle,
  optocoupler: OptocouplerArticle,
  mosfet: MosfetArticle
};

export default function ReviewArticle({ slug, email }) {
  const article = getArticleBySlug(slug);
  const ArticleBody = articleBodies[slug];
  if (!article || !ArticleBody) return null;

  return (
    <ArticleShell article={article} email={email}>
      <ArticleBody />
    </ArticleShell>
  );
}
