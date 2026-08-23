import { ArrowUpRight, BookOpen, Radio, Waves } from "lucide-react";
import { ARTICLE_HASH } from "./route.js";

export default function KnowledgeSection() {
  return (
    <section className="knowledge-finale section-screen" id="knowledge" tabIndex="-1">
      <div className="wide-container knowledge-inner">
        <div className="knowledge-heading">
          <div>
            <p className="eyebrow">Knowledge Column</p>
            <h2>把工程问题讲到公式背后的物理直觉。</h2>
          </div>
          <p>
            记录通信、电路、嵌入式与硬件调试中的核心概念，既保留推导，也关注它们在真实系统里的边界条件。
          </p>
        </div>

        <a className="knowledge-card" href={ARTICLE_HASH}>
          <div className="knowledge-card-copy">
            <span className="knowledge-meta">
              <BookOpen size={17} />
              电路基础 · 课堂笔记 · 5 至 8 分钟
            </span>
            <h3>电容“隔直通交”与电感“通直隔交”的原理</h3>
            <p>
              从时域微分关系和频域阻抗两条线，理解两句口诀成立的条件、暂态过程与通信电路应用。
            </p>
            <strong>
              阅读全文
              <ArrowUpRight size={18} />
            </strong>
          </div>
          <div className="knowledge-card-visual" aria-hidden="true">
            <div>
              <Waves size={28} />
              <span>Z_C = 1/(jωC)</span>
            </div>
            <div>
              <Radio size={28} />
              <span>Z_L = jωL</span>
            </div>
            <p>f ↑　|Z_C| ↓　|Z_L| ↑</p>
          </div>
        </a>
      </div>
    </section>
  );
}
