import { knowledgeChapters, reviewArticles } from "./articles.js";
import { KNOWLEDGE_INDEX_HASH } from "./route.js";

export default function KnowledgeSection() {
  return <section className="knowledge-teaser" id="knowledge" tabIndex="-1">
    <div className="wide-container knowledge-teaser-inner">
      <div><p className="eyebrow">Knowledge Library</p><h2>把工程问题，逐个弄明白。</h2><p>器件、电源、接口与 SI/PI，系统整理的硬件复习笔记。</p><p className="teaser-stats">{Object.keys(knowledgeChapters).length} Chapters / {reviewArticles.length} Articles</p></div>
      <a className="primary-button" href={KNOWLEDGE_INDEX_HASH}>进入知识库 <span aria-hidden="true">↗</span></a>
    </div>
  </section>;
}
