import ArticleFigure from "../ArticleFigure.jsx";
import CircuitDiagram from "../CircuitDiagram.jsx";

export default function CapacitorArticle() {
  return (
    <>
      <section id="principle">
        <h2>电容的核心关系</h2>
        <p>电容用电场储能，电压不能突变。电流由电压变化率决定：i = C·du/dt；正弦稳态下 ZC = 1/(jωC)，频率升高时理想容抗减小。</p>
        <div className="formula-block"><figcaption>储能与容抗</figcaption><div className="formula">E = ½CU²　|ZC| = 1/(2πfC)</div><p>理想关系只在远离寄生参数主导的频段成立。</p></div>
      </section>

      <section id="functions">
        <h2>七类典型功能</h2>
        <CircuitDiagram variant="decoupling" />
        <div className="application-list">
          <article><h3>耦合</h3><p>隔离两级直流偏置，让目标频段的交流信号通过。</p></article>
          <article><h3>去耦与旁路</h3><p>为芯片瞬态电流提供局部低阻抗回路，并把高频噪声旁路到参考地。</p></article>
          <article><h3>滤波</h3><p>与电阻或电感构成低通、高通和带通网络，塑造频率响应。</p></article>
          <article><h3>储能</h3><p>在负载突变期间供能，降低母线跌落和纹波。</p></article>
          <article><h3>自举与电荷泵</h3><p>利用充放电抬升栅极或生成高于、低于电源轨的辅助电压。</p></article>
          <article><h3>谐振与定时</h3><p>与电感决定谐振频率，或与电阻构成 RC 延时和振荡网络。</p></article>
        </div>
      </section>

      <section id="types">
        <h2>介质类型与应用选择</h2>
        <p>C0G/NP0 稳定、损耗低，适合高频和精密网络；X7R、X5R 容量密度高，适合通用去耦；电解和聚合物电容容量大，适合低频储能与电源输出，但要注意极性、ESR、寿命和纹波电流。</p>
        <ArticleFigure src="images/knowledge/passive-components/capacitor-types.webp" fullSrc="images/knowledge/passive-components/capacitor-types-hd.jpg" alt="贴片陶瓷、电解和薄膜电容的外形及结构对比" caption="不同介质在容量密度、损耗、稳定性和极性方面各有取舍。" sourcePage="26–27" />
      </section>

      <section id="mlcc">
        <h2>MLCC 的温度与偏压效应</h2>
        <p>X5R、X7R、C0G 描述温度范围和容量变化等级，不代表封装或耐压。Ⅱ类陶瓷电容还存在明显的直流偏压效应：外加直流电压越接近额定值，有效容值可能下降得越多。</p>
        <ArticleFigure src="images/knowledge/passive-components/mlcc-bias.webp" fullSrc="images/knowledge/passive-components/mlcc-bias-hd.jpg" alt="MLCC 容量随温度与直流偏压变化的曲线" caption="标称容量不等于实际工作点的有效容量。" sourcePage="29–30" />
      </section>

      <section id="high-frequency">
        <h2>高频 RLC 模型</h2>
        <p>实际电容可等效为理想 C、串联 ESR 和 ESL。自谐振频率以下以容性为主，谐振点阻抗接近 ESR，超过自谐振频率后 ESL 主导，器件表现得更像电感。</p>
        <div className="formula-block"><figcaption>实际电容阻抗</figcaption><div className="formula">Z ≈ ESR + jωESL + 1/(jωC)</div><p>封装更小、回路更短通常意味着更低 ESL 和更高自谐振频率。</p></div>
        <ArticleFigure src="images/knowledge/passive-components/capacitor-impedance.webp" fullSrc="images/knowledge/passive-components/capacitor-impedance-hd.jpg" alt="电容 ESR ESL 等效模型与阻抗频率曲线" caption="阻抗谷值附近是器件最接近纯电阻的自谐振区域。" sourcePage="31–33" />
      </section>

      <section id="pdn">
        <h2>并联电容与 PDN</h2>
        <p>并联不同容量和封装是为了在宽频段压低电源分配网络阻抗，而不是简单地认为“小电容滤高频、大电容滤低频”。布局、过孔和电源平面寄生参数会重塑阻抗曲线，并可能产生反谐振峰。</p>
        <aside className="article-callout"><strong>布局重点：</strong>去耦电流回路面积比“电容离芯片看起来很近”更重要，电源脚—电容—地回路应短而宽。</aside>
      </section>

      <section id="workflow">
        <h2>选型流程与易错点</h2>
        <ol className="summary-list"><li>先按功能确定容量范围、介质和频段。</li><li>核对额定电压并留出浪涌和降额余量。</li><li>由温度、直流偏压与老化估算有效容值。</li><li>核对 ESR、纹波电流、自谐振频率与寿命。</li><li>在 PCB 与 PDN 模型中验证布局和并联组合。</li></ol>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>去耦和旁路有什么共同点与区别？</summary><p>二者都提供交流低阻抗路径；去耦更强调隔离电源网络中的相互影响，旁路更强调把噪声引到参考节点，工程上经常交叉使用。</p></details>
          <details><summary>为什么 10µF MLCC 上板后可能只剩几微法？</summary><p>Ⅱ类陶瓷介质受直流偏压、温度、老化和容差共同影响，必须查数据手册的 DC Bias 曲线。</p></details>
          <details><summary>并联 100nF 与 10µF 一定更好吗？</summary><p>不一定。封装和走线寄生参数可能产生反谐振峰，应以目标阻抗和实际布局验证。</p></details>
        </div>
      </section>
    </>
  );
}
