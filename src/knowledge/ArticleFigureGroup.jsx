import ArticleFigure from "./ArticleFigure.jsx";

export default function ArticleFigureGroup({ figures }) {
  return (
    <div className="article-figure-group">
      {figures.map((figure) => (
        <ArticleFigure key={figure.src} {...figure} />
      ))}
    </div>
  );
}
