import { ArrowUpRight, BookOpen, CircuitBoard, Download, Magnet, Radio, Waves, Zap } from "lucide-react";
import { legacyArticle, reviewArticles } from "./articles.js";
import { DIODE_ARTICLE_HASH } from "./route.js";

const articleIcons = {
  resistor: CircuitBoard,
  capacitor: Waves,
  inductor: Radio,
  "ferrite-bead": Magnet
};

const downloadHref = `${import.meta.env.BASE_URL}downloads/passive-components-review.pdf`;

export default function KnowledgeSection() {
  return (
    <section className="knowledge-finale section-screen" id="knowledge" tabIndex="-1">
      <div className="wide-container knowledge-inner">
        <div className="knowledge-heading">
          <div>
            <p className="eyebrow">Knowledge Column</p>
            <h2>把无源器件的参数表，变成可回答的工程问题。</h2>
          </div>
          <div className="knowledge-heading-copy">
            <p>面向硬件面试复习，按电阻、电容、电感和磁珠四类整理原理、参数、典型电路、选型流程与易错点。</p>
            <a className="knowledge-download" href={downloadHref} download><Download size={18} />下载完整课件</a>
          </div>
        </div>

        <div className="knowledge-grid">
          {reviewArticles.map((article, index) => {
            const Icon = articleIcons[article.slug];
            return (
              <a className="knowledge-card" href={article.hash} key={article.slug}>
                <div className="knowledge-card-copy">
                  <span className="knowledge-index">0{index + 1}</span>
                  <span className="knowledge-meta"><BookOpen size={16} />{article.readingTime}</span>
                  <Icon className="knowledge-card-icon" size={32} aria-hidden="true" />
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                  <strong>开始复习 <ArrowUpRight size={18} /></strong>
                </div>
              </a>
            );
          })}
        </div>

        <a className="knowledge-legacy knowledge-diode" href={DIODE_ARTICLE_HASH}>
          <span>
            <Zap size={20} />
            <small>半导体器件 / 秋招速复</small>
            <strong>二极管：从 PN 结到整流、限幅与稳压</strong>
          </span>
          <span>约 30–45 分钟<ArrowUpRight size={18} /></span>
        </a>

        <a className="knowledge-legacy" href={legacyArticle.hash}>
          <span><small>延伸阅读</small><strong>{legacyArticle.title}</strong></span>
          <span>{legacyArticle.readingTime}<ArrowUpRight size={18} /></span>
        </a>
      </div>
    </section>
  );
}
