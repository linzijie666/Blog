import ArticleFigure from "../ArticleFigure.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function PcbPowerLayoutArticle() {
  return (
    <>
      <section id="switch-layout">
        <h2>开关电源布局四准则</h2>
        <p>开关电源的布局质量直接决定纹波、噪声与辐射表现。理解准则的钥匙是<strong>电流环路</strong>：BUCK/BOOST 的输入、输出回路里有高 di/dt 的开关电流，环路所包围的面积就是天线。四条准则：</p>
        <div className="application-list">
          <article><h3>1. 电容靠近芯片，环路最小</h3><p>输入、输出滤波电容尽可能贴近芯片，让高频电流环路面积最小——降低辐射，也减小走线寄生电阻和电感带来的纹波。理解 BUCK/BOOST 拓扑的充放电回路（见本专栏开关电源篇）是布局的前提。</p></article>
          <article><h3>2. SW 节点面积最小、电感同层</h3><p>SW 开关节点是高频电压摆动点，铺铜面积在满足通流的前提下尽可能小，降低辐射；功率电感尽量与电源芯片放同一层，不要过孔换层。</p></article>
          <article><h3>3. 芯片下方 GND 铺铜 + 散热过孔</h3><p>电源芯片（尤其带 thermal pad 的）下方铺 GND 铜皮，并打过孔连接到内层地平面，把热量水平方向摊到整板。铜导热系数 355 W/m·K，是 FR-4（0.25 W/m·K）的上千倍。</p></article>
          <article><h3>4. FB 反馈取点在滤波电容之后</h3><p>反馈电阻的分压取样点要放在输出滤波电容之后（采样干净输出），且 FB 反馈电阻尽量靠近芯片 FB 引脚，缩短高阻走线防拾取噪声。</p></article>
        </div>
      </section>

      <section id="loop-filter">
        <h2>官方 Layout 指引对照</h2>
        <p> Richtek RT6253A/B 的 Layout Considerations 与上述准则一一对应，是回答「开关电源怎么布局」的现成素材：</p>
        <ArticleFigure src="images/knowledge/pcb-layout/power-rt6253-guidelines.webp" fullSrc="images/knowledge/pcb-layout/power-rt6253-guidelines-hd.jpg" alt="RT6253A/B Layout Considerations 原文" caption="官方五条：大电流路径最短、输入 MLCC 贴 VIN/GND、SW 节点小且远离模拟件、反馈网络在输出电容之后、GND 用宽厚平面或打过孔。" sourcePage="31" />
        <ArticleFigure src="images/knowledge/pcb-layout/power-rt6253-layout-fig14.webp" fullSrc="images/knowledge/pcb-layout/power-rt6253-layout-fig14-hd.jpg" alt="RT6253A/B Figure 14 布局指引图" caption="Figure 14 官方布局模板：输入电容、SW、电感、反馈与散热过孔的相对位置。" sourcePage="31" />
        <p>逐条对应：①high-current path（输入电容→高侧管→电感→输出电容）最短，保证稳定无抖振、高效率；②输入 MLCC 尽量贴 VIN 与 GND 引脚、大 MLCC 同层放置；③SW 节点保持小面积，模拟器件远离 SW 防容性拾取；④反馈网络接在输出电容之后、器件靠近 FB 引脚；⑤GND 引脚用宽而厚的平面并打散热过孔。</p>
        <WorkedExample
          title="评审一块 BUCK 电源的布局"
          given={["12V 输入转 3.3V/3A，芯片带 thermal pad", "评审发现：输入电容距芯片 15mm，SW 铺了大面积铜，FB 取样点在电感之前"]}
          calculation={["输入回路面积过大 → 高 di/dt 环路辐射与输入纹波恶化", "SW 大铜 → 天线效应，容性耦合到邻近走线", "FB 取样在电容之前 → 采样到的是滤波前的纹波，输出调整变差", "整改：输入电容移到 VIN 引脚旁（<3mm）并就近落 GND 孔", "整改：SW 铜缩到满足通流的最小面积，电感与芯片同层", "整改：FB 分压下端移到输出电容之后，电阻靠近 FB 引脚", "整改：芯片下方 GND 铺铜 + 4~6 个过孔连内层地"]}
          verification={["复测输入纹波与辐射", "SW 波形振铃减小", "负载阶跃时输出调整率改善"]}
          answer="按「环路最小 → SW 最小 → 反馈取点正确 → 散热过孔」四步整改，对照芯片官方 Layout 指引逐条核销。"
        />
      </section>

      <section id="current-capacity">
        <h2>走线宽度与过孔通流</h2>
        <p>走线通流的评判标准是<strong>温升</strong>：承载预定电流时温升不超过 10K（10℃）。普通设计可用估算法：<strong>1oz 铜厚下，约 1mm（40mil）线宽通流 1A</strong>。但电流增大时线宽并非正比例增长——0.4mm 载 1A，3A 要 1.8mm、5A 要 4mm、10A 要 10mm。内层铜厚一般为 0.5oz，内层走线要再放宽；大电流（20A 以上）建议软件仿真。</p>
        <div className="formula-block"><figcaption>IPC 载流经验公式</figcaption><div className="formula"><FormulaText text="I = k × ΔT^0.44 × A^0.725" /></div><p>I 为电流（A），A 为走线截面积（sq.mils），ΔT 为温升（℃）；k 与层位置（外层/内层）有关。工程速算：外层 1oz、10℃ 温升时 40mil 线宽 ≈ 1A。</p></div>
        <ArticleFigure src="images/knowledge/pcb-layout/power-trace-current-calc.webp" fullSrc="images/knowledge/pcb-layout/power-trace-current-calc-hd.jpg" alt="走线载流计算器" caption="载流计算器：5A、1oz、温升 10℃ → 外层线宽 108.9mil、内层 283.2mil。" sourcePage="32" />
        <p>过孔通流同样按 10K 温升评估：<strong>10mil（0.25mm）内径过孔约通流 1A，20mil（0.5mm）约 1.5A</strong>。加大孔径收益不大，工程上用<strong>多打孔</strong>增强通流——4A 就打 4 个 10mil 过孔。但孔数也不能无限加：<strong>电流并不会均匀分配</strong>，下图的 20A/20 孔仿真中，最热孔电流 2.4A、最小不足 200mA，相差几十倍，大电流设计务必仿真验证。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/power-via-current-sharing.webp" fullSrc="images/knowledge/pcb-layout/power-via-current-sharing-hd.jpg" alt="20A 下 20 个过孔的电流分配仿真" caption="色标显示各过孔电流：最大的 2.44A、最小的不足 200mA——加孔前先确认分流均匀。" sourcePage="32" />
        <WorkedExample
          title="给 4A 电源走线定线宽与过孔"
          given={["DC-DC 输出 4A，板厚 1.6mm，外层 1oz", "温升目标 10K，输出需跨层到背面"]}
          calculation={["外层线宽：按 40mil/1A 非线性修正，4A 取约 60~80mil（1.5~2mm）并用载流工具复核", "过孔：10mil 孔约 1A → 打 4~6 个 10mil 过孔，孔环放在电流路径上", "内层若分担载流：0.5oz 铜厚线宽再加大约一倍"]}
          verification={["用 IPC 公式或计算器复核 4A/10K 的线宽", "仿真或简单评估过孔组分流均匀性", "实测满载温升 ≤10K"]}
          answer="4A 外层走线约 1.5~2mm 宽，跨层打 4~6 个 10mil 过孔；大电流加孔要关注分流不均，关键场合做仿真。"
        />
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>开关电源 PCB 布局有哪些准则？</summary><p>①输入/输出滤波电容贴近芯片、环路面积最小，降低辐射与纹波；②SW 节点铺铜满足通流下尽量小，电感与芯片同层不换层；③芯片下方 GND 铺铜 + 过孔连内层地散热；④FB 反馈取样在输出滤波电容之后、反馈电阻靠近芯片。</p></details>
          <details><summary>为什么 SW 节点铺铜要小？</summary><p>SW 是高频方波摆动点（高 dv/dt），大面积铺铜相当于天线，对外辐射并容性耦合到邻近走线；在满足通流和散热的前提下面积越小越好，同时模拟器件要远缡 SW。</p></details>
          <details><summary>走线通流怎么估算？</summary><p>按温升 10K 评估：IPC 经验公式 I=k×ΔT^0.44×A^0.725；工程速算 1oz 外层约 40mil（1mm）线宽通 1A，但非线性——3A 要 1.8mm、10A 要 10mm。内层 0.5oz 要加宽，20A 以上用仿真。</p></details>
          <details><summary>过孔通流怎么算？为什么要多打孔而不是加大孔？</summary><p>10mil 内径过孔约 1A、20mil 约 1.5A（温升 10K）。加大孔径收益低，多打孔更有效；但电流不会均匀分配（20 孔仿真中最大 2.4A/最小 200mA），大电流设计要做分流仿真。</p></details>
          <details><summary>电源芯片的散热在 layout 上怎么做？</summary><p>芯片（尤其带 thermal pad 的）下方铺 GND 铜皮，并打阵列过孔连接内层地平面，把热量水平扩散到整板；铜导热 355 W/m·K 是 FR-4 的上千倍，铺铜 + 过孔是最有效的低成本散热手段。</p></details>
        </div>
      </section>
    </>
  );
}
