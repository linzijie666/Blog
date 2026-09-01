import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function PcbFabHdiArticle() {
  return (
    <>
      <section id="fab-limits">
        <h2>最小孔径与线宽线距</h2>
        <p>PCB 能做多细，由板厂加工能力决定。过孔钻孔能力（以华秋、嘉立创为例）：</p>
        <div className="application-list">
          <article><h3>机械钻孔</h3><p>最小内径 <strong>0.15mm（6mil）</strong>，最大约 6.35mm（更大的孔用扩孔/锣边加工）。6mil 钻针对板材和设备有要求，成本明显上升。</p></article>
          <article><h3>激光钻孔</h3><p>最小 <strong>0.075mm（3mil）</strong>，成本更高，一般用于高密度 HDI 板。</p></article>
          <article><h3>线宽线距</h3><p>外层 1oz 铜厚时极限约 3.5~4mil；铜厚越大最小线宽线距越大（2oz 双面板约 6.5mil、3.5oz 约 10mil），内层 0.5oz 可做到 2.5/3.0mil。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/pcb-layout/fab-min-hole-tables.webp" fullSrc="images/knowledge/pcb-layout/fab-min-hole-tables-hd.jpg" alt="两家板厂钻孔能力表" caption="华秋与嘉立创的机械/激光钻孔孔径范围：机械最小 0.15mm，激光最小 0.075mm。" sourcePage="27" />
        <ArticleFigure src="images/knowledge/pcb-layout/fab-min-trace-tables.webp" fullSrc="images/knowledge/pcb-layout/fab-min-trace-tables-hd.jpg" alt="两家板厂最小线宽线距表" caption="嘉立创/华秋线宽线距能力：1oz 常规 4mil 起做，铜厚越大能力越差。" sourcePage="27" />
        <ArticleFigure src="images/knowledge/pcb-layout/fab-via-inner-outer.webp" fullSrc="images/knowledge/pcb-layout/fab-via-inner-outer-hd.jpg" alt="过孔内径与外径示意" caption="过孔参数：钻孔内径（红）与环pad外径（橙），选孔时两个尺寸都要给。" sourcePage="27" />
        <ArticleFigure src="images/knowledge/pcb-layout/fab-trace-spacing-labels.webp" fullSrc="images/knowledge/pcb-layout/fab-trace-spacing-labels-hd.jpg" alt="线宽与线距标注" caption="线宽、线距与差分线距是三个不同的工艺参数，检查设计规则时逐一核对。" sourcePage="28" />
        <aside className="article-callout"><strong>面试要点：</strong>记住两个数——机械钻孔最小 0.15mm/6mil，激光孔最小 0.075mm/3mil；线宽线距极限 3/3~4/4mil。铜厚越大，可加工的最小线宽线距越大。</aside>
      </section>

      <section id="cost-balance">
        <h2>性能与成本的平衡</h2>
        <p>工艺参数不是越极限越好，核心是把<strong>器件密度、走线密度与通用性、良品率、成本</strong>放上天平：过孔越小、线宽线距越小，对板材和设备要求越高，加工费上涨、良品率下降，打样或量产都可能失败。</p>
        <p>工程推荐的取值：</p>
        <div className="application-list">
          <article><h3>过孔</h3><p>无 BGA、密度不大：<strong>内径 12mil / 外径 20mil（0.3/0.5mm）</strong>；有 BGA 或密度高：尽量不小于<strong>内径 8mil / 外径 12mil（0.2/0.3mm）</strong>。</p></article>
          <article><h3>线宽线距</h3><p>常规设计控制在 <strong>6/6mil 以上</strong>；只有 BGA 扇出困难的局部区域才做 4/4mil。</p></article>
          <article><h3>其他注意</h3><p>过孔与线宽还关系通流（电源孔要加大或加密，见电源 Layout 篇）；高湿、腐蚀或高压场景要加大线宽线距，高压注意电气间隙与爬电距离；焊盘到线、阻焊到线等间距参数同样要核对板厂工艺页。</p></article>
        </div>
        <WorkedExample
          title="给一块通用 4 层板定设计规则"
          given={["主控 + 常见接口，一颗 QFN，无 BGA", "板厂：嘉立创/华秋常规工艺"]}
          calculation={["过孔：内径 12mil / 外径 20mil（0.3/0.5mm）", "线宽线距：6/6mil 起步，电源线按通流加宽", "差分（USB/网口）按板厂阻抗表定线宽，参考层保持完整"]}
          verification={["DRC 检查无小于规则值的过孔与线距", "向板厂确认叠层与阻抗目标", "高电压走线核对爬电距离"]}
          answer="通用板选 12/20mil 过孔 + 6/6mil 线宽线距是良品率与成本的甜点位；只有 BGA 局部才收紧到 8/12mil 与 4/4mil。"
        />
      </section>

      <section id="via-hdi">
        <h2>通孔板与 HDI 板</h2>
        <p>普通 PCB 是<strong>通孔板</strong>：过孔从第一层一直打通到最后一层。优点是成本低、加工周期短、良品率高；缺点是每个通孔都在所有层占一个孔位（孔上不能走线、放焊盘），限制了布线密度，板子容易做大。</p>
        <p><strong>HDI 板</strong>（High Density Interconnector，高密度互联板）使用<strong>盲孔与埋孔</strong>：</p>
        <div className="application-list">
          <article><h3>盲孔（Blind Via）</h3><p>从表层打通到某一内层，不到底。如 6 层一阶 HDI 的 1-2 层、5-6 层间为盲孔。</p></article>
          <article><h3>埋孔（Buried Via）</h3><p>只连接内层与内层，表面完全看不到。如上例 2-5 层之间为埋孔。</p></article>
          <article><h3>阶数</h3><p>HDI 按压合次数分一阶/二阶等，阶数越高工艺越复杂，成本越高、周期越长、良率越低。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/pcb-layout/fab-hdi-blind-buried.webp" fullSrc="images/knowledge/pcb-layout/fab-hdi-blind-buried-hd.jpg" alt="HDI 板盲孔埋孔标注" caption="HDI 板过孔放大：1:3、1:2 为盲孔，3:6 为埋孔——通孔板只能做顶层到底层的全通孔。" sourcePage="30" />
        <ArticleFigure src="images/knowledge/pcb-layout/fab-via-types-3d.webp" fullSrc="images/knowledge/pcb-layout/fab-via-types-3d-hd.jpg" alt="通孔/盲孔/埋孔 3D 结构对比" caption="从左到右：HDI 一阶、HDI 二阶、通孔、HDI 一阶的 3D 剖面——盲孔不到底、埋孔藏在内层。" sourcePage="30" />
        <p>HDI 的价值在两点：<strong>密度</strong>——BGA 引脚间距小于 0.8mm 时扇出基本只能靠盲埋孔；<strong>信号质量</strong>——高速信号的过孔残桩（stub）更短，寄生参数更小。代价是成本高、周期长、良品率低。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/fab-bga-through-fanout.webp" fullSrc="images/knowledge/pcb-layout/fab-bga-through-fanout-hd.jpg" alt="pitch 1.0mm FPGA 通孔板扇出" caption="BGA 引脚间距 1.0mm 时，扇出通孔之间还能过 2 根走线——用通孔板即可控制成本。" sourcePage="29" />
        <ArticleFigure src="images/knowledge/pcb-layout/fab-hi3559-hdi.webp" fullSrc="images/knowledge/pcb-layout/fab-hi3559-hdi-hd.jpg" alt="海思 Hi3559 8 层二阶 HDI 设计" caption="海思 Hi3559 的 8 层二阶 HDI 板：走线密度可以做得非常高。" sourcePage="29" />
        <p>结论是相对的：器件不特别密、主芯片引脚间距大（如 1.0mm BGA）时，<strong>能用通孔板就用通孔板</strong>；只有高密度 BGA（pitch&lt;0.8mm）或极高速信号才上 HDI。</p>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>常规 PCB 加工的最小孔径和线宽线距是多少？</summary><p>机械钻孔最小内径 0.15mm（6mil），激光孔最小 0.075mm（3mil，用于 HDI）。线宽线距极限约 3/3~4/4mil，常规设计建议 6/6mil 以上，BGA 局部可做 4/4mil；铜厚越大，最小线宽线距越大。</p></details>
          <details><summary>如何平衡 PCB 性能与成本？</summary><p>按密度选工艺：无 BGA 用 12/20mil 过孔、6/6mil 线宽线距；BGA 或高密度时过孔不小于 8/12mil、局部 4/4mil。过小工艺会推高板材与加工费、降低良品率；高压/恶劣环境还要加大线距并核对爬电距离。</p></details>
          <details><summary>什么是通孔、盲孔、埋孔？通孔板和 HDI 板怎么选？</summary><p>通孔从顶层打通到底层；盲孔连表层与内层；埋孔只在內层之间。通孔板便宜、周期短、良率高，但孔占用所有层；HDI 用盲埋孔换取密度（BGA pitch&lt;0.8mm 基本必须 HDI）与更短的过孔残桩，成本高良率低。主芯片间距大时优先通孔板。</p></details>
          <details><summary>BGA 扇出时过孔和线宽怎么定？</summary><p>引脚间距 ≥1.0mm 的 BGA：通孔板 8/12mil 过孔即可扇出，孔间还能过线；pitch 更小时通孔间过不了线，只能转 HDI。扇出区线宽线距局部收紧到 4/4mil，其余区域维持 6/6mil。</p></details>
          <details><summary>为什么高压设计要加大线宽线距？</summary><p>高湿度凝露、腐蚀性环境或高电压下，小间距容易爬电击穿。高压设计要按工作电压加大线距，并核对电气间隙与爬电距离要求。</p></details>
        </div>
      </section>
    </>
  );
}
