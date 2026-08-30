import { Activity, ArrowUpRight, BookOpen, CircuitBoard, Download, Lightbulb, Magnet, Radio, ToggleLeft, Waves, Zap } from "lucide-react";
import { knowledgeChapters, legacyArticle, reviewArticles } from "./articles.js";

const articleIcons = {
  resistor: CircuitBoard,
  capacitor: Waves,
  inductor: Radio,
  "ferrite-bead": Magnet,
  diode: Zap,
  triode: Activity,
  optocoupler: Lightbulb,
  mosfet: ToggleLeft
};

export default function KnowledgeSection() {
  return (
    <section className="knowledge-finale section-screen" id="knowledge" tabIndex="-1">
      <div className="wide-container knowledge-inner">
        <div className="knowledge-heading">
          <div>
            <p className="eyebrow">Knowledge Column</p>
            <h2>把器件的参数表，变成可回答的工程问题。</h2>
          </div>
          <div className="knowledge-heading-copy">
            <p>面向硬件面试复习，分两章整理无源器件与基础半导体器件的原理、参数、典型电路、选型流程与易错点。</p>
          </div>
        </div>

        {Object.values(knowledgeChapters).map((chapter) => {
          const chapterArticles = reviewArticles.filter((article) => article.chapter === chapter.id);
          const chapterDownload = `${import.meta.env.BASE_URL}${chapter.downloadHref}`;
          return (
            <div className="knowledge-chapter" key={chapter.id}>
              <header className="knowledge-chapter-heading">
                <div>
                  <p className="eyebrow">{chapter.index}</p>
                  <h3>{chapter.title}</h3>
                </div>
                <div className="knowledge-chapter-copy">
                  <p>{chapter.description}</p>
                  <a className="knowledge-download" href={chapterDownload} download>
                    <Download size={18} />下载{chapter.index}完整课件
                  </a>
                </div>
              </header>

              <div className="knowledge-grid">
                {chapterArticles.map((article, index) => {
                  const Icon = articleIcons[article.slug];
                  return (
                    <a className="knowledge-card" href={article.hash} key={article.slug}>
                      <div className="knowledge-card-copy">
                        <span className="knowledge-index">0{index + 1}</span>
                        <span className="knowledge-meta"><BookOpen size={16} />{article.readingTime}</span>
                        <Icon className="knowledge-card-icon" size={32} aria-hidden="true" />
                        <h4>{article.title}</h4>
                        <p>{article.summary}</p>
                        <strong>开始复习 <ArrowUpRight size={18} /></strong>
                      </div>
                    </a>
                  );
                })}
              </div>

              {chapter.id === "passive" && (
                <a className="knowledge-legacy" href={legacyArticle.hash}>
                  <span><small>延伸阅读</small><strong>{legacyArticle.title}</strong></span>
                  <span>{legacyArticle.readingTime}<ArrowUpRight size={18} /></span>
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
