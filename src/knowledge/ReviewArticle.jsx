import ArticleShell from "./ArticleShell.jsx";
import { getArticleBySlug } from "./articles.js";
import CapacitorArticle from "./articles/CapacitorArticle.jsx";
import FerriteBeadArticle from "./articles/FerriteBeadArticle.jsx";
import InductorArticle from "./articles/InductorArticle.jsx";
import ResistorArticle from "./articles/ResistorArticle.jsx";

const articleBodies = {
  resistor: ResistorArticle,
  capacitor: CapacitorArticle,
  inductor: InductorArticle,
  "ferrite-bead": FerriteBeadArticle
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
