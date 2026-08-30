import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function CapacitorArticle() {
  return (
    <>
      <section id="principle">
        <h2>电容的核心关系</h2>
        <p>电容用电场储能，电压不能突变。电流由电压变化率决定：i = C·du/dt。正弦稳态下 <FormulaText text="Z_C = 1/(jωC)" />，频率升高时理想容抗减小。</p>
        <div className="formula-block"><figcaption>储能与容抗</figcaption><div className="formula"><FormulaText text="E = ½CU²　|Z_C| = 1/(2πfC)" /></div><p>公式给出理想趋势，实际器件还要叠加 ESR、ESL、漏电和介质效应。</p></div>
        <aside className="article-callout"><strong>面试主线：</strong>先回答电容在这个位置承担什么功能，再说明需要的容量、频段、电压和非理想参数。</aside>
      </section>

      <section id="functions">
        <h2>七类典型功能</h2>
        <div className="application-list">
          <article><h3>交流耦合</h3><p>串联电容隔离两级直流偏置，让目标交流频段通过。它与前后级等效电阻共同决定低频截止点。</p></article>
          <article><h3>去耦与旁路</h3><p>去耦减少不同负载通过电源网络互相影响，旁路为高频噪声提供就近回流路径，两者在芯片供电中常共同出现。</p></article>
          <article><h3>滤波</h3><p>电容与电阻或电感构成低通、高通和带通网络。器件有效值与寄生参数决定真实截止频率。</p></article>
          <article><h3>储能</h3><p>大容量电容在负载突变期间供能，降低母线跌落和低频纹波。需要核对 ESR、纹波电流、寿命和浪涌。</p></article>
          <article><h3>自举与电荷泵</h3><p>自举电容随开关节点抬升高边驱动电压，电荷泵通过交替充放电生成高于或低于电源轨的电压。</p></article>
          <article><h3>谐振</h3><p>电容与电感决定 LC 谐振频率，可用于选频、阻抗变换或开关电源谐振，但损耗和寄生参数会改变 Q 值。</p></article>
          <article><h3>RC 定时</h3><p>RC 网络决定延时、软启动和振荡周期。阈值误差、漏电和介质吸收会使长时间常数偏离理想值。</p></article>
        </div>
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/passive-components/capacitor-functions.webp", fullSrc: "images/knowledge/passive-components/capacitor-functions-hd.jpg", alt: "电容去耦旁路和滤波应用电路", caption: "去耦、旁路和滤波的共同点是建立受控的交流电流路径。", sourcePage: "21" },
          { src: "images/knowledge/passive-components/capacitor-pump-timing.webp", fullSrc: "images/knowledge/passive-components/capacitor-pump-timing-hd.jpg", alt: "电容电荷泵和 RC 定时应用电路", caption: "电荷泵依靠电荷转移，RC 定时依靠充放电达到阈值。", sourcePage: "24" }
        ]} />
      </section>

      <section id="types">
        <h2>介质类型与应用选择</h2>
        <div className="selection-grid">
          <article><h3>C0G/NP0</h3><p>温度稳定、损耗低、几乎没有直流偏压效应，适合高频、谐振和精密定时，但容量通常较小。</p></article>
          <article><h3>X7R/X5R</h3><p>容量密度高，适合通用去耦。需要检查温度范围、直流偏压、老化和容差后的有效容值。</p></article>
          <article><h3>钽与聚合物</h3><p>容量密度高、ESR 可控，适合电源储能。必须注意极性、浪涌、额定电压降额和失效模式。</p></article>
          <article><h3>铝电解</h3><p>大容量和成本优势明显，适合低频储能与整流滤波。寿命受温度和纹波电流影响显著。</p></article>
          <article><h3>薄膜</h3><p>损耗低、稳定性和脉冲能力好，常见于高压、交流、谐振和吸收电路，但体积较大。</p></article>
          <article><h3>超级电容</h3><p>能量密度高、充放电次数多，适合短时备电。漏电、均压、额定电压和充电电流是主要约束。</p></article>
        </div>
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/passive-components/capacitor-types.webp", fullSrc: "images/knowledge/passive-components/capacitor-types-hd.jpg", alt: "贴片陶瓷电解和薄膜电容的外形及结构对比", caption: "不同介质在容量密度、损耗、稳定性、寿命和极性方面各有取舍。", sourcePage: "26-27" },
          { src: "images/knowledge/passive-components/capacitor-selection.webp", fullSrc: "images/knowledge/passive-components/capacitor-selection-hd.jpg", alt: "不同电容介质特性和应用场景选型表", caption: "先按应用约束选介质，再在对应介质中确定容量、电压和封装。", sourcePage: "28" }
        ]} />
      </section>

      <section id="mlcc">
        <h2>MLCC 的温度与偏压效应</h2>
        <p>X5R、X7R、C0G 描述温度范围和容量变化等级，不代表封装或耐压。Ⅱ类陶瓷电容存在明显的直流偏压和老化效应，额定电压越接近实际偏置，有效容值越可能大幅下降。</p>
        <ArticleFigure src="images/knowledge/passive-components/mlcc-bias.webp" fullSrc="images/knowledge/passive-components/mlcc-bias-hd.jpg" alt="MLCC 容量随温度与直流偏压变化的曲线" caption="标称容量不是工作点的有效容量，必须读取具体料号的 DC Bias 曲线。" sourcePage="29-30" />

        <WorkedExample
          title="去耦电容与有效容值校核"
          given={["3.3V 电源轨，计划使用 10µF、6.3V、X5R MLCC", "数据手册显示 3.3V 直流偏压下剩余 45% 容量", "再按容差与温度保留 80%"]}
          calculation={["直流偏压后的容量：10µF × 45% = 4.5µF", "加入容差与温度：4.5µF × 80% = 3.6µF", "系统最低要求为 6µF，因此当前料号不满足要求"]}
          verification={["选择更高额定电压或更大封装以减轻直流偏压效应", "改用更大标称容量，或并联两颗经过曲线校核的器件", "检查 ESR、ESL、自谐振频率和贴装回路电感", "在目标温度与偏置下验证有效容值"]}
          answer="去耦设计不能只报 BOM 上的 10µF。我会根据具体料号的直流偏压、温度、容差和老化曲线计算有效容值，再检查寄生参数和布局，确认它在目标频段内满足阻抗要求。"
        />
      </section>

      <section id="high-frequency">
        <h2>高频 RLC 模型</h2>
        <p>实际电容可等效为理想 C、串联 ESR 和 ESL。自谐振频率以下以容性为主，谐振点阻抗接近 ESR，超过自谐振频率后 ESL 主导，器件表现得更像电感。</p>
        <div className="formula-block"><figcaption>实际电容阻抗</figcaption><div className="formula">Z ≈ ESR + jωESL + 1/(jωC)</div><p>更小封装和更短回路通常降低 ESL，但也可能加剧 MLCC 的直流偏压降容。</p></div>
        <p>除 ESR 与 ESL 外，还要关注漏电流、介质吸收、纹波电流和温升。介质吸收会让已经放电的电容重新出现少量电压，影响采样保持、积分和长时间常数电路。</p>
        <ArticleFigure src="images/knowledge/passive-components/capacitor-impedance.webp" fullSrc="images/knowledge/passive-components/capacitor-impedance-hd.jpg" alt="电容 ESR ESL 等效模型与阻抗频率曲线" caption="阻抗谷值附近是自谐振区域，频率继续升高后寄生电感开始主导。" sourcePage="31-33" />
      </section>

      <section id="pdn">
        <h2>并联电容与 PDN</h2>
        <p>PDN 设计的目标是在关心的频段内，把电源网络阻抗压到目标阻抗以下。目标阻抗可用允许纹波除以瞬态电流估算。并联不同容量不是简单的“小电容滤高频、大电容滤低频”，封装、过孔、平面和安装电感会共同塑造阻抗曲线。</p>
        <div className="formula-block"><figcaption>目标阻抗</figcaption><div className="formula"><FormulaText text="Z_{target} = ΔV_{allow} / ΔI_{step}" /></div><p>如果网络某个反谐振峰超过目标阻抗，负载阶跃可能在该频段放大电源噪声。</p></div>
        <ArticleFigure src="images/knowledge/passive-components/capacitor-pdn.webp" fullSrc="images/knowledge/passive-components/capacitor-pdn-hd.jpg" alt="并联去耦电容选型表和 PDN 阻抗曲线" caption="并联方案要结合安装电感、ESR 和反谐振，而不是只比较标称容量。" sourcePage="35" />
        <aside className="article-callout"><strong>布局重点：</strong>去耦电流回路面积比“看起来离芯片很近”更重要。电源脚、去耦电容、地之间的路径应短而宽。</aside>
      </section>

      <section id="workflow">
        <h2>选型流程与易错点</h2>
        <ol className="summary-list">
          <li>先按耦合、去耦、储能、定时或谐振功能确定容量范围、介质和频段。</li>
          <li>核对额定电压、浪涌和极性，并按工作电压与温度做降额。</li>
          <li>由温度、直流偏压、容差和老化估算有效容值。</li>
          <li>核对 ESR、ESL、纹波电流、自谐振频率、漏电、介质吸收和寿命。</li>
          <li>在 PCB 与 PDN 模型中验证布局、目标阻抗和并联组合。</li>
        </ol>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>去耦和旁路有什么共同点与区别？</summary><p>二者都提供交流低阻抗路径。去耦更强调隔离电源网络中的相互影响，旁路更强调把高频噪声就近引到参考节点。</p></details>
          <details><summary>为什么 10µF MLCC 上板后可能只剩几微法？</summary><p>Ⅱ类陶瓷介质受直流偏压、温度、老化和容差共同影响，必须查具体料号的 DC Bias 曲线。</p></details>
          <details><summary>并联 100nF 与 10µF 一定更好吗？</summary><p>不一定。封装和走线寄生参数可能产生反谐振峰，应以目标阻抗、实际布局和频率响应验证。</p></details>
          <details><summary>电解电容选型为什么要看纹波电流？</summary><p>纹波流过 ESR 会产生热。纹波电流超限会加速电解液老化、升高 ESR 并缩短寿命。</p></details>
        </div>
      </section>
    </>
  );
}
