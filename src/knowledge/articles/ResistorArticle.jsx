import ArticleFigure from "../ArticleFigure.jsx";
import CircuitDiagram from "../CircuitDiagram.jsx";

export default function ResistorArticle() {
  return (
    <>
      <section id="principle">
        <h2>先建立电阻的工程直觉</h2>
        <p>电阻把电压与电流约束为 U = IR，并把电能以热的形式消耗。面试中真正重要的不是背阻值，而是判断它承受的电压、电流和功耗是否同时落在安全工作区。</p>
        <div className="formula-block"><figcaption>欧姆定律与功耗</figcaption><div className="formula">U = IR　P = UI = I²R = U²/R</div><p>计算功耗后仍需留出环境温度、脉冲和器件散差对应的余量。</p></div>
        <aside className="article-callout"><strong>快速判断：</strong>高阻值更容易受耐压限制，低阻值更容易受电流和功率限制。</aside>
      </section>

      <section id="parameters">
        <h2>选型参数与降额</h2>
        <p>先看封装和阻值，再核对精度、耐压、额定功率、允许电流、温度系数与工作温度。额定功率通常以特定环境温度为前提，超过拐点温度必须按曲线降额；脉冲负载还要核对单次能量和峰值电压。</p>
        <div className="selection-grid">
          <article><h3>精度与温漂</h3><p>分压基准和采样电阻同时关注初始精度与 ppm/℃ 温度系数，不能只看 1% 或 0.1%。</p></article>
          <article><h3>耐压与功率</h3><p>串联多颗电阻可同时分摊电压和功耗，但要考虑阻值偏差导致的分配不均。</p></article>
          <article><h3>失效模式</h3><p>过热会引起阻值漂移、焊点疲劳，严重时开路；高压还可能造成表面闪络。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/passive-components/resistor-selection.webp" fullSrc="images/knowledge/passive-components/resistor-selection-hd.jpg" alt="电阻功率降额与选型参数示意表" caption="额定功率、环境温度与降额区间要一起核对。" sourcePage="7–8" />
      </section>

      <section id="circuits">
        <h2>八类典型电路</h2>
        <CircuitDiagram variant="divider" />
        <div className="application-list">
          <article><h3>分压与衰减</h3><p>VOUT = VIN × R2/(R1+R2)。后级输入阻抗会与 R2 并联，必须纳入误差预算。</p></article>
          <article><h3>端接匹配</h3><p>串联或并联端接吸收反射，阻值应围绕传输线特性阻抗与驱动端阻抗选择。</p></article>
          <article><h3>上拉与下拉</h3><p>在高阻态时建立默认逻辑，同时平衡静态功耗、抗扰度与边沿速度。</p></article>
          <article><h3>电流采样</h3><p>采样电阻越大信号越强，但压降与损耗也越大；Kelvin 引线可减少走线误差。</p></article>
          <article><h3>限流与发热</h3><p>LED、栅极和浪涌回路常用电阻限制瞬态电流，脉冲能力比平均功耗更关键。</p></article>
          <article><h3>泄放与测试</h3><p>泄放电阻确保掉电后电容安全放电；预留串联电阻方便断开、测流和调试。</p></article>
        </div>
      </section>

      <section id="zero-ohm">
        <h2>0Ω 电阻为什么存在</h2>
        <p>0Ω 电阻并非理想短路，它有毫欧级电阻、有限额定电流和寄生电感。它常用于单点连接、模拟/数字地隔离策略、配置选项、模块间隔断、走线跨接以及替代跳线，优点是可以进入标准贴片工艺并方便返修。</p>
        <aside className="article-callout"><strong>不建议：</strong>把 0Ω 电阻当作保险丝。其熔断电流和熔断时间没有保险器件那样受控。</aside>
      </section>

      <section id="workflow">
        <h2>选型流程与易错点</h2>
        <ol className="summary-list">
          <li>由功能确定阻值、允许误差与温漂。</li>
          <li>计算最坏情况下的电压、电流、连续功耗和脉冲能量。</li>
          <li>按环境温度曲线降额，并核对工作电压与过载电压。</li>
          <li>确认封装散热、PCB 爬电距离和可制造性。</li>
          <li>采样与精密分压要把输入偏置、走线和匹配误差纳入预算。</li>
        </ol>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>为什么 0603 电阻不能只按额定功率选型？</summary><p>还要核对最高工作电压、环境温度降额、脉冲承受能力和 PCB 散热条件。高阻值器件常常先碰到耐压上限。</p></details>
          <details><summary>采样电阻为什么常用四线 Kelvin 连接？</summary><p>让测量端避开大电流焊盘和铜箔压降，使放大器看到的电压更接近电阻本体压降。</p></details>
          <details><summary>0Ω 电阻和铜皮短接有什么区别？</summary><p>0Ω 电阻便于贴片、配置、调试和返修，但存在阻值、额定电流与寄生参数，不能视为绝对短路。</p></details>
        </div>
      </section>
    </>
  );
}
