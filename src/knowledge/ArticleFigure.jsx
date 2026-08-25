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
        <span>
          <Maximize2 size={16} />
          查看高清图
        </span>
      </a>
      <figcaption>
        <span>{caption}</span>
        <small>课件第 {sourcePage} 页</small>
      </figcaption>
    </figure>
  );
}
