import { ArrowUpRight, BookOpen, CircleDot, Radio, Waves, Zap } from "lucide-react";
import { ARTICLE_HASH, DIODE_ARTICLE_HASH } from "./route.js";

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

        <div className="knowledge-card-grid">
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
          <a className="knowledge-card knowledge-card-diode" href={DIODE_ARTICLE_HASH}>
            <div className="knowledge-card-copy">
              <span className="knowledge-meta">
                <Zap size={17} />
                模拟电子技术 · 秋招速复 · 30 至 45 分钟
              </span>
              <h3>二极管：从 PN 结到整流、限幅与稳压</h3>
              <p>
                串起伏安特性、电流方程、电容效应、击穿与动态参数，配合等效模型和高频题型快速建立完整框架。
              </p>
              <strong>
                开始复习
                <ArrowUpRight size={18} />
              </strong>
            </div>
            <div className="knowledge-card-visual" aria-hidden="true">
              <div>
                <CircleDot size={28} />
                <span>I = I_S(e^(V_D/nV_T)-1)</span>
              </div>
              <div>
                <Zap size={28} />
                <span>r_d ≈ nV_T/I_D</span>
              </div>
              <p>正偏导通　|　反偏截止　|　击穿可控</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
