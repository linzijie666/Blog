import { useLayoutEffect, useRef } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import FormulaText, { formulaPlainText } from "./FormulaText.jsx";
import { DIODE_ARTICLE_HASH, resetArticleScroll, scrollToArticleSection } from "./route.js";

const sections = [
  ["semiconductor", "先把半导体方向理清"],
  ["pn-junction", "PN 结如何形成"],
  ["iv-curve", "伏安特性与电流方程"],
  ["models", "等效模型与小信号"],
  ["capacitance", "PN 结的电容效应"],
  ["breakdown", "击穿与稳压"],
  ["circuits", "典型电路与题型"],
  ["dynamic", "动态参数与器件选型"],
  ["interview", "秋招高频题与一页速记"]
];

function Formula({ label, children, note }) {
  return (
    <figure className="formula-block">
      <figcaption>{label}</figcaption>
      <div className="formula" aria-label={`${label}：${formulaPlainText(children)}`}>
        <FormulaText text={children} />
      </div>
      <p><FormulaText text={note} /></p>
    </figure>
  );
}

function ComparisonTable({ caption, headers, rows }) {
  return (
    <div className="comparison-table-wrap">
      <table className="comparison-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              <th scope="row"><FormulaText text={row[0]} /></th>
              {row.slice(1).map((cell) => <td key={cell}><FormulaText text={cell} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DiodeArticle({ email }) {
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    const previousTitle = document.title;
    document.title = "二极管秋招速复：从 PN 结到整流、限幅与稳压 | LzjEngineer";
    resetArticleScroll();
    mainRef.current?.focus({ preventScroll: true });
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <div className="article-page diode-article-page">
      <header className="article-site-header">
        <a className="brand" href="./#hero" aria-label="返回博客首页">
          <span className="brand-mark">LZJ</span>
          <span><strong>LzjEngineer</strong><small>Knowledge Notes</small></span>
        </a>
        <a className="header-contact" href={`mailto:${email}`}><Mail size={17} />Contact</a>
      </header>

      <main className="article-layout" ref={mainRef} tabIndex="-1">
        <article className="knowledge-article">
          <header className="article-hero">
            <a className="article-back" href="./#knowledge"><ArrowLeft size={18} />返回知识专栏</a>
            <p className="eyebrow">模拟电子技术 / 秋招速复 / 约 30 至 45 分钟</p>
            <h1>二极管：从 PN 结到整流、限幅与稳压</h1>
            <p className="article-lead">
              用一条主线串起“载流子运动 → 伏安方程 → 等效模型 → 典型电路”。先理解 PN 结，再用模型解决面试和笔试题。
            </p>
          </header>

          <nav className="article-toc" aria-label="文章目录">
            {sections.map(([id, title]) => (
              <a href={DIODE_ARTICLE_HASH} key={id} onClick={(event) => {
                event.preventDefault();
                scrollToArticleSection(id);
              }}>{title}</a>
            ))}
          </nav>

          <section id="semiconductor">
            <h2>先把半导体方向理清</h2>
            <p>
              本征半导体中电子和空穴数量相等。掺入施主杂质得到 N 型半导体，多数载流子是电子；掺入受主杂质得到 P 型半导体，多数载流子是空穴。电子和空穴都能参与导电，但“多数/少数”取决于掺杂类型。
            </p>
            <aside className="article-callout"><strong>面试抓手：</strong>不要把 P 型理解成“只有空穴”，也不要把 N 型理解成“没有空穴”。热平衡下两类载流子都存在。</aside>
          </section>

          <section id="pn-junction">
            <h2>PN 结如何形成</h2>
            <p>
              P 区空穴向 N 区扩散，N 区电子向 P 区扩散；交界处留下不能移动的离子，形成空间电荷区。空间电荷区建立内建电场，电场引起的漂移运动最终抵消扩散运动，达到动态平衡。
            </p>
            <Formula label="内建电势（突变结近似）" note="温度、掺杂浓度和材料决定内建电势；外加偏置会改变势垒和耗尽层宽度。">
              {"V_{bi} = V_T ln(N_A N_D / n_i²)"}
            </Formula>
            <ComparisonTable caption="PN 结偏置对比" headers={["状态", "势垒", "耗尽层", "电流"]} rows={[
              ["正向偏置", "降低", "变窄", "指数增大"],
              ["反向偏置", "升高", "变宽", "接近反向饱和电流"],
              ["反向击穿", "被强电场破坏", "载流子倍增", "急剧增大"]
            ]} />
          </section>

          <section id="iv-curve">
            <h2>伏安特性与电流方程</h2>
            <p>
              正向电压超过拐点后，电流随电压呈指数增长；反向偏置时只有少量少数载流子形成的反向电流，达到击穿电压后电流急剧增加。硅管常用“约 0.7 V”作为大电流下的工程近似，而不是物理常数。
            </p>
            <Formula label="Shockley PN 结电流方程" note="n 为发射系数，理想扩散电流 n≈1，复合主导时 n≈2；I_S 对温度很敏感。">
              I_D = I_S [exp(V_D / nV_T) - 1]
            </Formula>
            <Formula label="热电压" note="室温 27°C 时 V_T≈25.9 mV；温度升高时 V_T 略升，但 I_S 增长更显著。">
              V_T = kT/q ≈ 25.9 mV (300 K)
            </Formula>
            <aside className="article-callout"><strong>数量级估算：</strong>正向电压增加约 60 mV（n=1、室温），电流大约增加 10 倍。反过来，电流变化 10 倍，正向压降只变化约 60 mV。</aside>
          </section>

          <section id="models">
            <h2>等效模型与小信号</h2>
            <p>先判断题目要求的精度，再选模型。直流工作点用大信号模型，叠加小交流信号时在线性化工作点附近使用动态电阻。</p>
            <ComparisonTable caption="二极管等效模型" headers={["模型", "假设", "适用场景"]} rows={[
              ["理想模型", "正向短路，反向开路", "逻辑判断、极性分析"],
              ["恒压降模型", "硅管导通压降约 0.7 V", "整流、限幅、稳压粗算"],
              ["折线模型", "V_γ + r_f I_D", "需要考虑导通电阻的直流计算"],
              ["小信号模型", "工作点附近用 r_d 替代", "交流增益、纹波和信号分析"]
            ]} />
            <Formula label="小信号动态电阻" note="I_D 用安培代入，室温下 I_D=1 mA 时 r_d 约 26 Ω（n=1）。">
              r_d = dV_D/dI_D ≈ nV_T/I_D
            </Formula>
          </section>

          <section id="capacitance">
            <h2>PN 结的电容效应</h2>
            <p>二极管不是纯粹的电阻开关。耗尽层电荷和正偏时的少数载流子存储都会造成电容，直接影响高速开关、检波和高频响应。</p>
            <ComparisonTable caption="PN 结电容对比" headers={["类型", "物理来源", "主要偏置", "变化趋势"]} rows={[
              ["势垒电容 C_j", "耗尽层两侧的空间电荷", "反偏为主", "反偏增大时通常减小"],
              ["扩散电容 C_d", "正偏下少数载流子存储", "正偏为主", "正向电流增大时显著增大"],
              ["总电容", "C_j 与 C_d 共同作用", "取决于工作区", "决定充放电和频响速度"]
            ]} />
            <Formula label="结电容的工程近似" note="反偏越大，耗尽层越宽，势垒电容越小；具体指数由结结构决定。">
              C_j ≈ C_0 / (1 + V_R/V_0)^m
            </Formula>
            <aside className="article-callout"><strong>判断口诀：</strong>反偏看势垒电容，正偏看扩散电容；高速开关要特别关注存储电荷和反向恢复。</aside>
          </section>

          <section id="breakdown">
            <h2>击穿与稳压</h2>
            <p>
              齐纳击穿发生在较强电场下的隧穿效应，通常对应较低击穿电压；雪崩击穿由碰撞电离和载流子倍增造成，通常对应更高击穿电压。两者在器件允许的反向电流范围内都可以作为稳压工作区。
            </p>
            <Formula label="稳压管串联限流的基本关系" note="必须同时满足反向击穿工作、电流范围和功耗限制，不能把稳压管直接并到理想电源上。">
              I_Z ≈ (V_S - V_Z) / R_S - I_L
            </Formula>
            <p>稳压管功耗为 <FormulaText text="P_Z = V_Z I_Z" />。设计时检查最小输入、最大输入、最小负载和最大负载四个边界，并留出安全余量。</p>
          </section>

          <section id="circuits">
            <h2>典型电路与题型</h2>
            <div className="application-list">
              <article><h3>整流</h3><p>半波整流只保留一个半周；桥式全波整流每个半周都有电流，平均输出更高，但电流路径通常经过两只二极管。电容滤波会提高平均值、降低纹波。</p></article>
              <article><h3>限幅</h3><p>利用二极管在某一极性下导通，把输出限制在参考电压附近。先假设导通状态，再用 KVL/KCL 验证假设是否自洽。</p></article>
              <article><h3>钳位与检波</h3><p>钳位电路改变直流基准而尽量保留波形形状；峰值检波利用二极管给电容充电，再由负载缓慢放电提取包络。</p></article>
              <article><h3>稳压</h3><p>稳压管反向击穿并联在负载两端，串联电阻承担输入与稳压值的压差。输入变化和负载变化都要落在允许电流区间内。</p></article>
            </div>
            <aside className="article-callout"><strong>通用解题流程：</strong>标出阳极/阴极 → 假设每只管导通或截止 → 用对应模型列方程 → 求出电压/电流 → 检查导通条件与反向耐压。</aside>
          </section>

          <section id="dynamic">
            <h2>动态参数与器件选型</h2>
            <p>普通整流二极管适合低频整流；快恢复二极管用较短的反向恢复时间换取更高频率；肖特基没有明显少数载流子存储，正向压降低、反向恢复快，但反向漏电通常更大、耐压选择受限；TVS 专门用于瞬态过压钳位。</p>
            <ComparisonTable caption="常见二极管类型" headers={["类型", "优势", "主要限制", "常见应用"]} rows={[
              ["普通整流", "耐压/电流覆盖广、成本低", "速度慢", "工频整流、电源输入"],
              ["快恢复", "t_{rr} 较短", "反向恢复损耗和 EMI", "开关电源、PFC"],
              ["肖特基", "V_F 低、几乎无存储恢复", "漏电较大、耐压有限", "低压高频整流"],
              ["TVS", "浪涌时快速钳位", "持续功耗有限", "ESD、接口和电源保护"]
            ]} />
            <Formula label="反向恢复关注点" note="开关频率越高，反向恢复电荷造成的损耗和尖峰越不能忽略。">
              {"t_{rr}，Q_{rr}，V_{RRM}，I_F(AV)，P_D"}
            </Formula>
          </section>

          <section id="interview">
            <h2>秋招高频题与一页速记</h2>
            <p>遇到计算题优先判断工作区，再选择模型。遇到开放题，按“物理原因—电路表现—工程权衡”三步回答。</p>
            <ol className="summary-list">
              <li>PN 结平衡：扩散与漂移相等；正偏降势垒，反偏升势垒。</li>
              <li><FormulaText text="核心方程：I_D = I_S[exp(V_D/nV_T)-1]，V_T≈26 mV，r_d≈nV_T/I_D。" /></li>
              <li>正偏指数导通，反偏近似截止，超过击穿电压后反向电流急增。</li>
              <li><FormulaText text="反偏主要是势垒电容，正偏主要是扩散电容；高速场景看 t_{rr} 和 Q_{rr}。" /></li>
              <li>整流看导通路径，限幅看阈值，稳压看电流范围和功耗。</li>
              <li>温度升高通常使硅二极管正向压降下降、反向漏电上升。</li>
            </ol>
            <aside className="article-callout"><strong>最后自测：</strong>能否解释“为什么桥式整流每个半周有两只管导通”？能否由 2 mA 工作电流估算小信号电阻？能否说明肖特基为何适合低压高频整流？</aside>
          </section>
        </article>
      </main>
    </div>
  );
}
