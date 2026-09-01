import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function PcbHighSpeedArticle() {
  return (
    <>
      <section id="length-tuning">
        <h2>什么情况要绕等长</h2>
        <p>并行总线的多位信号必须同时到达接收端才能被正确采样，绕等长就是把走线长度差补齐。两种典型场景：</p>
        <div className="application-list">
          <article><h3>组内等长（单端/差分对之间）</h3><p>如 DDR 的 DQ0~DQ7 八根数据线与时钟差分对 DQS± 等长；HDMI 的三对数据差分对与时钟对 HDMI_CLK± 等长。控制精度按信号速率定，常见 ±20/±50/±100mil——DDR3 一般 ±50mil，DDR4 收紧到 ±20mil。</p></article>
          <article><h3>差分对内等长（P 与 N 之间）</h3><p>P/N 不等长会造成差模信号过零点偏移、抗干扰能力下降，一般按 <strong>±5mil</strong> 控制。MIPI 的量化要求更直观：对内偏斜 1ps ≈ 6mil，数据对与时钟的组内偏差 5ps ≈ 30mil（按 1ns ≈ 6000mil 传播速度折算）。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/pcb-layout/hs-mipi-skew-table.webp" fullSrc="images/knowledge/pcb-layout/hs-mipi-skew-table-hd.jpg" alt="MIPI 等长与阻抗要求表" caption="MIPI DSI/CSI 要求：差分阻抗 90-100Ω/单端 45-50Ω（±10%），对内偏斜 1ps、组内 5ps。" sourcePage="21" />
        <ArticleFigure src="images/knowledge/pcb-layout/hs-ddr-serpentine.webp" fullSrc="images/knowledge/pcb-layout/hs-ddr-serpentine-hd.jpg" alt="主芯片与 DDR 间绕等长布局" caption="DDR 地址/数据线用蛇形线补偿长度差，绕等长从布局阶段就要预留空间。" sourcePage="21" />
        <p>绕等长的载体是<strong>蛇形线</strong>，AD 和 Cadence 都支持交互式绕线。规则有五条：</p>
        <div className="application-list">
          <article><h3>规则 1：定基准</h3><p>以组内最长一根线为长度参考，其他线绕蛇形线向它看齐；最终评判时在 EDA 里以 CLK 时钟长度为基准，检查数据线与 CLK 的长度差是否在标准内。</p></article>
          <article><h3>规则 2：蛇线间距</h3><p>平行段中心距尽量取 3W~4W（W 为线宽），密度极高时不得小于 2W，否则蛇形线自身平行段耦合，产生串扰与自耦合。</p></article>
          <article><h3>规则 3：就近补偿</h3><p>哪里产生了长度差就在哪里绕，不要把补偿都堆在线的远端——仿真眼图显示就近补偿的方案 1 在 5G/10Gbps 下眼高、眼宽均优于远端一次性补偿的方案 2。</p></article>
          <article><h3>规则 4：等长为了等时</h3><p>信号在过孔和内/外层传播速度不同，同组信号应走相同传输层、换层也一起换，才能真正「等时」。</p></article>
          <article><h3>规则 5：蛇线尽量少绕</h3><p>过长过密的蛇形线自耦合串扰、占面积、增大衰减；等长问题要从布局阶段解决，蛇形线只是兜底手段。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/pcb-layout/hs-serpentine-3w-spacing.webp" fullSrc="images/knowledge/pcb-layout/hs-serpentine-3w-spacing-hd.jpg" alt="蛇形线 3W/2W 间距要求" caption="蛇形线平行段中心距 ≥3W（最低 2W），振幅不宜过大。" sourcePage="22" />
        <ArticleFigure src="images/knowledge/pcb-layout/hs-local-vs-remote-matching.webp" fullSrc="images/knowledge/pcb-layout/hs-local-vs-remote-matching-hd.jpg" alt="就近补偿与远端补偿对比" caption="上：就近补偿（正确✓）；下：在远离差异处补偿（错误✗）。" sourcePage="22" />
        <ArticleFigure src="images/knowledge/pcb-layout/hs-eye-diagram-compare.webp" fullSrc="images/knowledge/pcb-layout/hs-eye-diagram-compare-hd.jpg" alt="就近补偿与远端补偿的眼图对比" caption="图 4-25：5Gbps 与 10Gbps 下，方案 1（就近）眼高 0.599/0.337 均优于方案 2 的 0.545/0.262。" sourcePage="23" />
        <ArticleFigure src="images/knowledge/pcb-layout/hs-diffpair-s1-2s.webp" fullSrc="images/knowledge/pcb-layout/hs-diffpair-s1-2s-hd.jpg" alt="差分对绕等长线距规则" caption="差分对内部紧耦合，绕等长后 P-N 线距 S1 不要超过原线距 S 的 2 倍。" sourcePage="23" />
        <p>差分对绕等长还要注意 <strong>S1 &lt; 2S</strong>：差分线内部是紧耦合，绕等长时 P-N 间距拉得太开会破坏耦合、改变阻抗。现代 EDA 支持保持 P-N 间距不变的绕线方式，优先使用。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/hs-eda-serpentine-constant-gap.webp" fullSrc="images/knowledge/pcb-layout/hs-eda-serpentine-constant-gap-hd.jpg" alt="EDA 中保持 P-N 间距的差分绕等长" caption="品红色差分对蛇形线：P-N 间距全程保持不变。" sourcePage="24" />
        <WorkedExample
          title="MIPI 屏时钟线的等长控制"
          given={["MIPI DSI 接口，数据速率 750Mbps/lane，差分阻抗 90-100Ω", "时钟对与数据对的组内偏斜要求 5ps，对内 1ps"]}
          calculation={["按 1ns ≈ 6000mil 折算：1ps ≈ 6mil，5ps ≈ 30mil", "对内等长 ±5mil（优于 6mil 要求）", "组内以 CLK 为基准，数据对与 CLK 长度差 ≤30mil"]}
          verification={["EDA 长度报告确认各对 length 与 CLK 差值", "差分对 S1<2S、蛇形线间距 ≥3W", "示波器看眼图过零点无偏移"]}
          answer="MIPI 等长换算成 mil：对内 ±5mil、组内 ±30mil；等长的本质是等时，同组同层、一起换层。"
        />
      </section>

      <section id="stackup">
        <h2>4 层/6 层叠层与参考平面</h2>
        <p>叠层方案由信号密度和成本共同决定：层数越多布线越从容、信号质量越好，但成本和加工周期也上去了。</p>
        <p><strong>4 层板</strong>常用方案：01 TOP — 02 GND — 03 PWR — 04 BOTTOM。TOP 参考 02 GND，BOTTOM 参考 03 PWR——<strong>顶层信号质量最好</strong>，因为 GND 是一整块完整平面；而 03 PWR 通常按电压分割成多块铺铜，BOTTOM 走线跨电源分区时相当于回流阻抗增大，质量略逊。</p>
        <p><strong>6 层板</strong>推荐方案：01 TOP — 02 GND — 03 SIG — 04 PWR — 05 GND — 06 BOTTOM。三个信号层：TOP 参考 02 GND，BOTTOM 参考 05 GND，中间的 03 SIG 夹在 02 GND 与 04 PWR 之间、有两个参考层——<strong>主要参考距离更近的 04 PWR</strong>（4.28mil 对 21.65mil），距离越近参考效果越强。</p>
        <ArticleFigureGroup
          figures={[
            { src: "images/knowledge/pcb-layout/hs-jlc-4layer-stackup.webp", fullSrc: "images/knowledge/pcb-layout/hs-jlc-4layer-stackup-hd.jpg", alt: "嘉立创四层板常用叠层", caption: "嘉立创四层板 JLC04161H-7628：1.6mm 板厚，PP 7628 半固化片 8.6mil。", sourcePage: "25" },
            { src: "images/knowledge/pcb-layout/hs-jlc-6layer-stackup.webp", fullSrc: "images/knowledge/pcb-layout/hs-jlc-6layer-stackup-hd.jpg", alt: "嘉立创六层板常用叠层", caption: "嘉立创六层板 JLC06161H-3313：两块 0.55mm 芯板（21.65mil），L3-L4 层距仅 4.28mil。", sourcePage: "25" }
          ]}
        />
        <p>对高频信号，电源层和 GND 层都可以作回流路径（两者间交流阻抗很小），所以「参考电源层」并不违规——要避免的是<strong>参考平面被分割</strong>（跨分割问题见本专栏走线规则篇）。选叠层的判断口诀：<strong>关键信号所在层，其参考平面要近、要完整</strong>。</p>
      </section>

      <section id="impedance">
        <h2>阻抗与铜厚、线宽、层距</h2>
        <p>以最简单的表层微带线模型（只参考一层，忽略阻焊）分析：<FormulaText text="Z_0" /> 由线宽 W、铜厚 t、板介电常数 <FormulaText text="ε_r" />、走线到参考层的层距 h 共同决定：</p>
        <div className="formula-block"><figcaption>微带线特征阻抗（定性用）</figcaption><div className="formula"><FormulaText text="Z_0 ≈ 87/√(ε_r+1.41) × ln(5.98h/(0.8W+t))" /></div><p>板材与层压方案确定后：<FormulaText text="ε_r" />（FR4 取 4）、铜厚 t（外层 1oz≈35µm/1.38mil）、层距 h 都已固定，唯一可调的设计变量是线宽 W。</p></div>
        <ArticleFigure src="images/knowledge/pcb-layout/hs-microstrip-model.webp" fullSrc="images/knowledge/pcb-layout/hs-microstrip-model-hd.jpg" alt="微带线阻抗模型" caption="表层微带线模型：阻抗由 W、t、εr、h 决定，工程上靠调线宽 W 控制阻抗。" sourcePage="26" />
        <p>定性结论（面试常考）：</p>
        <div className="application-list">
          <article><h3>线宽 W ↑ → 阻抗 ↓</h3><p>走线越宽阻抗越小，这是日常控阻抗的主要手段。</p></article>
          <article><h3>铜厚 t ↑ → 阻抗 ↓</h3><p>加厚铜（如 1oz→2oz）等效增大导体截面，阻抗略降。</p></article>
          <article><h3>层距 h ↑ → 阻抗 ↑</h3><p>走线离参考层越远阻抗越大；有的射频板反过来利用这一点，挖空近端参考层让走线参考更远的平面来抬阻抗。</p></article>
          <article><h3>介电常数 εr ↑ → 阻抗 ↓</h3><p>高频板材（罗杰斯、铁氟龙）εr 只有 2~3；实际应用常「高频板材 + 加宽走线」组合，阻抗不变而宽线的射频衰减更小。</p></article>
        </div>
        <p>所以 <strong>PCB 控阻抗主要靠控制线宽 W</strong>；板厂会按你的叠层与目标阻抗（如 50Ω 单端、90Ω 差分）给出线宽建议。</p>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>什么情况需要绕等长？</summary><p>并行总线（DDR 数据组、HDMI/MIPI 差分对组）为保证同时采样做组内等长（±20/50/100mil 视速率）；差分对内 P/N 等长（约 ±5mil）防止过零点偏移。MIPI 量化为对内 1ps≈6mil、组内 5ps≈30mil。</p></details>
          <details><summary>蛇形线绕等长有哪些规则？</summary><p>①以组内最长线为基准、最终以 CLK 为评判基准；②平行段间距 ≥3W（最小 2W）；③就近补偿（眼图更优）；④等长为了等时——同组同层、一起换层；⑤蛇线尽量少绕，从布局阶段解决。</p></details>
          <details><summary>为什么差分对绕等长要求 S1&lt;2S？</summary><p>差分线是紧耦合结构，P-N 间距拉大超过原线距 2 倍会明显改变差分阻抗与耦合度；EDA 支持保持 P-N 间距不变的蛇形绕线，应优先使用。</p></details>
          <details><summary>画一个常见的 4 层/6 层叠层，说明参考平面选择。</summary><p>4 层：TOP-GND-PWR-BOTTOM，TOP 参考 GND 质量最好（完整平面），BOTTOM 参考 PWR（常被分割）。6 层：TOP-GND-SIG-PWR-GND-BOTTOM，中间 SIG 主要参考距离更近的 PWR（4.28mil），次要参考 GND（21.65mil）——距离越近参考效果越强。</p></details>
          <details><summary>走线阻抗与哪些因素有关？怎么定性分析？</summary><p>Z0 与线宽 W、铜厚 t、介电常数 εr 成反比，与到参考层距离 h 成正比。板材叠层定死后 εr、t、h 不变，工程上主要通过调整线宽 W 控制阻抗；射频场合也用挖空参考层、换高频板材等手段。</p></details>
        </div>
      </section>
    </>
  );
}
