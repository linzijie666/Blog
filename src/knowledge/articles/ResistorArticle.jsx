import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function ResistorArticle() {
  return (
    <>
      <section id="principle">
        <h2>先建立电阻的工程直觉</h2>
        <p>电阻把电压与电流约束为 U = IR，并把电能转化为热。工程选型不是找到一个阻值就结束，而是要让阻值、误差、电压、电流、功耗、温度和瞬态能力同时落在安全工作区。</p>
        <div className="formula-block"><figcaption>欧姆定律与功耗</figcaption><div className="formula">U = IR　P = UI = I²R = U²/R</div><p>高阻值器件常先受到工作电压限制，低阻值器件常先受到额定电流和功率限制。</p></div>
        <aside className="article-callout"><strong>面试主线：</strong>先说明电路功能，再计算最坏工况，最后核对数据手册的连续额定值、脉冲曲线和降额条件。</aside>
      </section>

      <section id="parameters">
        <h2>选型参数与降额</h2>
        <p>封装尺寸影响散热、寄生参数和可承受电压，但不同厂商同封装的额定值并不完全相同。必须回到具体料号的数据手册，不能仅凭 0402、0603 或 0805 推断能力。</p>
        <div className="selection-grid">
          <article><h3>精度与温度系数</h3><p>初始精度描述室温误差，温度系数以 ppm/℃ 描述阻值随温度的变化。精密分压还要关注两颗电阻的匹配温漂。</p></article>
          <article><h3>工作电压与过载电压</h3><p>工作电压允许长期施加，过载电压只允许短时间承受。即使 P = U²/R 很小，也不能超过器件最高工作电压。</p></article>
          <article><h3>连续功率与脉冲功率</h3><p>额定功率用于稳定热平衡，脉冲功率由持续时间、重复率和单次能量决定，不能用平均功率替代脉冲曲线。</p></article>
          <article><h3>允许电流</h3><p>低阻值电阻和 0Ω 电阻通常存在独立的额定电流限制。焊盘、铜箔和热点也会限制实际电流。</p></article>
          <article><h3>功率降额</h3><p>额定功率通常在 70℃ 环境附近开始下降，到最高工作温度时降为零。密闭外壳或邻近热源会提前消耗温升余量。</p></article>
          <article><h3>失效模式</h3><p>持续过热可能造成阻值漂移、焊点疲劳和开路失效；高压可能引发保护层击穿、表面闪络或局部烧蚀。</p></article>
        </div>
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/passive-components/resistor-package.webp", fullSrc: "images/knowledge/passive-components/resistor-package-hd.jpg", alt: "电阻料号选型信息与结构封装示意", caption: "阻值、精度、功率、温漂和封装通常共同编码在料号与规格书中。", sourcePage: "4" },
          { src: "images/knowledge/passive-components/resistor-power-current.webp", fullSrc: "images/knowledge/passive-components/resistor-power-current-hd.jpg", alt: "不同贴片封装的额定功率和允许电流资料", caption: "封装只是筛选起点，最终额定值以具体厂商的数据手册为准。", sourcePage: "6" }
        ]} />
        <ArticleFigure src="images/knowledge/passive-components/resistor-selection.webp" fullSrc="images/knowledge/passive-components/resistor-selection-hd.jpg" alt="电阻温度系数功率降额与选型参数表" caption="温度系数、环境温度和功率降额要一起进入误差与热设计。" sourcePage="7-8" />
      </section>

      <section id="circuits">
        <h2>八类典型电路</h2>
        <div className="application-list">
          <article><h3>分压</h3><p>VOUT = VIN × R2/(R1+R2)。ADC 输入、偏置电流和后级阻抗会与 R2 并联，造成负载误差。</p></article>
          <article><h3>串联衰减</h3><p>串联电阻可限制信号电流、减缓边沿或与输入电容组成低通，但会增加噪声和源阻抗。</p></article>
          <article><h3>端接匹配</h3><p>源端串联或负载端并联端接用于吸收反射。阻值要结合驱动器输出阻抗和传输线特性阻抗确定。</p></article>
          <article><h3>上拉与下拉</h3><p>在高阻态建立默认逻辑。小阻值抗干扰更强但静态功耗更高，大阻值功耗低但边沿更慢。</p></article>
          <article><h3>电流采样</h3><p>采样电阻越大，检测信号越强，但压降与 I²R 损耗越大。四线 Kelvin 连接可避开焊盘和铜箔压降。</p></article>
          <article><h3>限流与阻尼</h3><p>LED、MOS 栅极和浪涌回路常用电阻限制瞬态电流。高速节点还会利用串联电阻降低振铃和 EMI。</p></article>
          <article><h3>泄放电阻</h3><p>泄放电阻在掉电后释放电容储能。既要满足规定放电时间，也要核对上电时的持续功耗。</p></article>
          <article><h3>测试与调试</h3><p>预留串联电阻可方便断开电源域、测量支路电流或替换阻值，是成本很低的调试接口。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/passive-components/resistor-applications.webp" fullSrc="images/knowledge/passive-components/resistor-applications-hd.jpg" alt="电阻上下拉端接匹配和电流采样应用电路" caption="上下拉、端接和采样电路都需要同时考虑功能、信号完整性和功耗。" sourcePage="11" />

        <WorkedExample
          title="ADC 分压与功耗校核"
          given={["输入电压 12V，ADC 满量程 3.0V", "选择上臂 30kΩ、下臂 10kΩ", "先忽略 ADC 输入漏电与采样电容"]}
          calculation={["分压输出：12V × 10kΩ/(30kΩ + 10kΩ) = 3.0V", "分压电流：12V/40kΩ = 0.3mA", "上臂功耗：0.3mA² × 30kΩ = 2.7mW", "下臂功耗：0.3mA² × 10kΩ = 0.9mW"]}
          verification={["核对 ADC 推荐的最大源阻抗和采样时间", "核对 30kΩ 电阻的工作电压与封装余量", "使用 1% 或更高精度，并评估两颗电阻的匹配温漂", "必要时在 ADC 前增加缓冲或延长采样时间"]}
          answer="我先按量程确定 3:1 分压比，再计算最坏输入下的输出、电流和功耗。随后检查 ADC 采样电容的建立时间、输入漏电、分压电阻精度与匹配温漂，以及单颗电阻的工作电压。"
        />
      </section>

      <section id="zero-ohm">
        <h2>0Ω 电阻为什么存在</h2>
        <p>0Ω 电阻并非理想短路，它具有毫欧级阻值、额定电流和寄生电感。它能进入标准贴片工艺，常用于单点连接、模拟地和数字地策略、模块隔离、配置选项、信号调试、兼容设计以及替代跳线。</p>
        <ArticleFigure src="images/knowledge/passive-components/zero-ohm-applications.webp" fullSrc="images/knowledge/passive-components/zero-ohm-applications-hd.jpg" alt="0Ω 电阻单点连接和 EMC 隔离应用" caption="0Ω 电阻适合配置和隔离，不适合作为没有受控熔断特性的保险丝。" sourcePage="16" />
        <aside className="article-callout"><strong>不建议：</strong>不要把 0Ω 电阻当作保险丝。其熔断电流、熔断时间和失效形态没有保险器件那样受控。</aside>
      </section>

      <section id="workflow">
        <h2>选型流程与易错点</h2>
        <ol className="summary-list">
          <li>由电路功能确定阻值、允许误差、噪声和温度系数。</li>
          <li>计算最坏情况下的电压、电流、连续功率、脉冲功率和单次能量。</li>
          <li>按实际环境温度做功率降额，并分别核对工作电压与过载电压。</li>
          <li>确认封装散热、PCB 爬电距离、焊盘温升和可制造性。</li>
          <li>精密分压与采样把输入偏置、走线压降、Kelvin 连接和匹配误差纳入预算。</li>
        </ol>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>为什么 0603 电阻不能只按额定功率选型？</summary><p>还要核对工作电压、过载电压、环境温度降额、脉冲功率和 PCB 散热。高阻值器件可能先碰到耐压上限。</p></details>
          <details><summary>平均功耗很小，为什么脉冲仍可能烧坏电阻？</summary><p>短脉冲会在电阻膜层局部产生很高的瞬态温升。必须查看脉冲持续时间、重复率和允许能量曲线。</p></details>
          <details><summary>采样电阻为什么常用四线 Kelvin 连接？</summary><p>让测量端避开大电流焊盘和铜箔压降，使放大器看到的电压更接近电阻本体压降。</p></details>
          <details><summary>0Ω 电阻和保险丝有什么区别？</summary><p>0Ω 电阻用于连接、配置和调试，它没有受控的熔断特性，额定电流也不等于保险动作电流。</p></details>
        </div>
      </section>
    </>
  );
}
