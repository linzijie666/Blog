import { Maximize2 } from "lucide-react";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export default function ArticleFigure({ src, fullSrc = src, alt, caption, sourcePage }) {
  return (
    <figure className="article-figure">
      <a
        className="article-figure-link"
        href={assetPath(fullSrc)}
        target="_blank"
        rel="noreferrer"
        aria-label={`查看高清图：${alt}`}
      >
        <img src={assetPath(src)} alt={alt} loading="lazy" />
      </a>
      <figcaption>
        <span>{caption}</span>
        <span className="article-figure-meta">
          <small>课件第 {sourcePage} 页</small>
          <a href={assetPath(fullSrc)} target="_blank" rel="noreferrer">
            <Maximize2 size={15} />
            查看高清图
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
