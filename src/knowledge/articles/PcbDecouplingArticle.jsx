import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function PcbDecouplingArticle() {
  return (
    <>
      <section id="decoupling-layout">
        <h2>去耦电容怎么布置</h2>
        <p>去耦电容的作用是就近为芯片开关瞬间提供瞬态电流、压低电源阻抗，布置位置直接决定效果。课件总结了四条原则：</p>
        <div className="application-list">
          <article><h3>1. 按电源域和电流回路分配</h3><p>先遵循芯片手册给出的数量与容值，再让高频去耦形成最小安装回路。不是所有电源脚都无条件“一脚一颗”；BGA、大电流核心和成组供电脚常需结合封装 PDN、目标阻抗和电容阵列统筹。</p></article>
          <article><h3>2. 引线尽可能短</h3><p>引线寄生电感会显著削弱高频去耦能力；贴片电容远好于插件电容。焊盘打过孔的方式也有讲究：长引线不推荐，双端过孔、焊盘上直接打孔寄生电感最小（但有 SMT 漏锡风险，通用性差）。</p></article>
          <article><h3>3. 小容值靠近引脚</h3><p>一个引脚配多颗电容（如 10µF+100nF）时，容值越小的越靠近芯片引脚——原因见下节「去耦半径」。</p></article>
          <article><h3>4. BGA 电容放背面正下方</h3><p>BGA 封装的去耦电容最好布置在引脚正下方的背面，路径最短；高端 FPGA 的背面几乎被各电源网络的 MLCC 铺满。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/pcb-layout/decoupling-stm32-placement.webp" fullSrc="images/knowledge/pcb-layout/decoupling-stm32-placement-hd.jpg" alt="STM32 每个电源引脚单独分配去耦电容" caption="STM32 周边四颗去耦电容各自靠近对应电源引脚，单独分配、走线短。" sourcePage="8" />
        <ArticleFigure src="images/knowledge/pcb-layout/decoupling-via-connection-abcd.webp" fullSrc="images/knowledge/pcb-layout/decoupling-via-connection-abcd-hd.jpg" alt="焊盘过孔连接四种方式对比" caption="A 长引线不推荐；B/C 端向与侧向过孔可用；D 双侧过孔引线并联、寄生电感更小。" sourcePage="9" />
        <ArticleFigure src="images/knowledge/pcb-layout/decoupling-bga-backside.webp" fullSrc="images/knowledge/pcb-layout/decoupling-bga-backside-hd.jpg" alt="BGA 背面密布去耦电容" caption="900 脚 BGA 封装 FPGA 的背面基本被各电源网络的去耦 MLCC 占满。" sourcePage="9" />
      </section>

      <section id="decoupling-radius">
        <h2>如何理解去耦半径</h2>
        <p>电容离负载越远，连接路径的安装电感越大，高频供电效果通常越差。所谓“去耦半径为波长的 1/40~1/50”只是判断分布效应的粗略经验，不能单独决定摆放距离；实际应看电流回路电感、目标阻抗、自谐振与反谐振。</p>
        <div className="formula-block"><figcaption>传播距离的粗略边界</figcaption><div className="formula"><FormulaText text="d_{decap}≈λ/40~λ/50（仅作分布效应的经验估算）" /></div><p>这个估算不能替代安装电感与目标阻抗分析。高频去耦通常先受封装、焊盘、过孔和走线的回路电感限制；大容值电容也不代表可以任意远放，小容值电容还可能与其他电容形成反谐振。</p></div>
        <p>按层次看整个供电系统：距离芯片最远的是<strong>大容量电容器</strong>（铝电解或大封装 MLCC，几十 µF 以上，负责低频储能），中距离是<strong>板电容器</strong>（100nF~10µF MLCC），最近的是集成在芯片基板上的<strong>封装电容器</strong>（电脑 CPU 和高端芯片才有），最后是片上电容。容量越大、离芯片越远，正好与去耦半径递增的规律一致。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/decoupling-radius-layers.webp" fullSrc="images/knowledge/pcb-layout/decoupling-radius-layers-hd.jpg" alt="去耦半径分层示意" caption="电源模块 → 大容量电容 → 板级电容 → 封装电容 → 片上电容，越靠近芯片容值越小、响应越快（兆易 AN058）。" sourcePage="10" />
        <WorkedExample
          title="100nF 去耦电容为什么必须贴着引脚放"
          given={["100nF MLCC（0402），ESL 约 0.5nH，自谐振频率约 22MHz", "芯片开关电流瞬变前沿在百 MHz 量级"]}
          calculation={["先根据负载阶跃和允许纹波得到目标阻抗", "λ/40~λ/50 只能粗略提示何时出现分布效应，不能作为摆放半径", "用封装、焊盘、过孔与走线的安装电感估算高频阻抗，并检查多电容反谐振"]}
          verification={["示波器观察电源引脚纹波，电容位置由远改近后高频毛刺明显减小", "PDN 阻抗曲线在目标频段保持低阻"]}
          answer="高频去耦要优先缩小芯片—电容—参考面的电流回路，并按目标阻抗检查安装电感和反谐振；λ/40~λ/50 只能作传播效应的粗略提醒。"
        />
      </section>

      <section id="crystal-circuit">
        <h2>晶体晶振电路设计</h2>
        <p>时钟信号频率高、边沿陡、驱动强，是 PCB 上优先级最高的信号之一（高速信号、时钟、复位、中断、模拟信号都属于高优先级）。时钟设计从<strong>原理图阶段</strong>就要开始：</p>
        <div className="application-list">
          <article><h3>磁珠 + 前后电容</h3><p>时钟电源经磁珠从主电源滤出，防止晶振高频噪声耦合进主电源；磁珠前后都必须放电容（滤波 + 储能）。</p></article>
          <article><h3>输出串阻</h3><p>时钟输出串联 22Ω/33Ω 电阻做阻抗匹配，抑制振铃和过冲。</p></article>
          <article><h3>预留 EMC 电容工位</h3><p>时钟输出预留一个对地 0402 电容工位（默认不贴），EMC 辐射超标调试时再上 pF~nF 级电容。</p></article>
          <article><h3>网络特异性命名</h3><p>时钟网络命名带特征（25M_CLK、FPGA_CLK、PCIE_CLK），方便 EDA 软件搜索并批量添加布线约束规则。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/pcb-layout/clock-oscillator-schematic.webp" fullSrc="images/knowledge/pcb-layout/clock-oscillator-schematic-hd.jpg" alt="25MHz 有源晶振典型电路" caption="3.3V 经磁珠 FB1 + C13/C15 滤波供电，X2 输出经 R86 22Ω 串阻，C14 为预留 EMC 电容工位。" sourcePage="10" />
        <p>晶振 datasheet 里有一个常被忽略的参数决定了对走线的要求：<strong>上升/下降时间</strong>。下表中有源晶振 Rise/Fall Time 最大 4ns——时钟的实际能量带宽远高于工作频率，带宽可按 <FormulaText text="BW=0.35/t_r" /> 估算：25MHz 晶振、tr=4ns 时 BW &gt; 87.5MHz，这些高次谐波正是 EMI 辐射的来源。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/clock-osc-params.webp" fullSrc="images/knowledge/pcb-layout/clock-osc-params-hd.jpg" alt="有源晶振 datasheet 参数表" caption="红框标出 Rise Time/Fall Time 4ns Max——用 BW=0.35/tr 估算出时钟能量带宽远超 25MHz。" sourcePage="11" />
        <p>温度也会影响频率稳定度：晶体晶振周围要避免高功耗器件（热源），下图的温频曲线显示温度过低或过高时频偏都会增大。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/clock-xtal-temp-curve.webp" fullSrc="images/knowledge/pcb-layout/clock-xtal-temp-curve-hd.jpg" alt="晶振频率-温度特性曲线" caption="32.768kHz 石英晶体频偏随温度呈抛物线变化，布局时要远离热源。" sourcePage="11" />
      </section>

      <section id="clock-routing">
        <h2>时钟走线规则与后果</h2>
        <p>PCB 上的时钟走线有六条硬性注意点：</p>
        <div className="application-list">
          <article><h3>靠近主芯片</h3><p>晶体晶振尽量靠近主芯片，时钟线走最短路径，布局阶段优先摆放。</p></article>
          <article><h3>远离热源</h3><p>晶振周围避免高功耗器件，温度漂移直接影响频率稳定度。</p></article>
          <article><h3>不放板边</h3><p>防止 EMI 超标与机械受力失效；必须放板边时，板边加 GND 走线 + 过孔包地，并远离螺丝孔等受力点。</p></article>
          <article><h3>下方禁止走线</h3><p>晶振正下方的各层都不走其他信号线。</p></article>
          <article><h3>少打过孔、少换层</h3><p>换层会增加寄生参数与阻抗不连续；晶振在顶层、主芯片在底层时，打孔换层不超过 2 次，走线长时优先走有完整参考的内层。</p></article>
          <article><h3>远离敏感信号</h3><p>时钟周围不要与复位、中断、模拟信号长距离平行，必要时对时钟线包地，包地线打过孔。</p></article>
        </div>
        <p>时钟设计不合理有三类典型后果，都有实测证据：</p>
        <p><strong>1. 串扰导致异常复位。</strong>时钟与复位线长距离平行时，时钟边沿会在复位线上耦合成毛刺；毛刺幅度一旦超过复位芯片的 VIL 阈值，系统直接被「复位」。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/clock-crosstalk-glitch.webp" fullSrc="images/knowledge/pcb-layout/clock-crosstalk-glitch-hd.jpg" alt="时钟串扰在复位线上形成毛刺" caption="示波器实测：红色时钟方波在黄色复位线上耦合出毛刺，幅度超过 VIL 即误复位。" sourcePage="12" />
        <p><strong>2. 上升沿退化与振铃。</strong>走线过长、过孔太多会让上升沿变缓，无法满足主芯片的时序要求；阻抗匹配不好时边沿出现上冲、下冲甚至振荡。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/clock-edge-overshoot.webp" fullSrc="images/knowledge/pcb-layout/clock-edge-overshoot-hd.jpg" alt="时钟上升沿退化与上冲实测" caption="实测时钟边沿：上升沿退化、过冲振铃，多由走线过长/过孔多/阻抗失配引起。" sourcePage="12" />
        <p><strong>3. EMC 辐射超标。</strong>下图 125MHz 时钟的辐射发射测试：125.036MHz 处 44.02dBµV/m，超过 Class B 限值（40）<strong>4.02dB</strong>——时钟谐波是辐射重灾区，串阻、包地、内层走线都是对策。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/clock-emi-125mhz.webp" fullSrc="images/knowledge/pcb-layout/clock-emi-125mhz-hd.jpg" alt="125MHz 时钟辐射超标测试曲线" caption="EN 55032 Class B 辐射发射测试：M1 点 125.036MHz 超标 4.02dBµV/m。" sourcePage="13" />
        <WorkedExample
          title="产品辐射超标，定位时钟问题"
          given={["EMI-RE 测试 125.036MHz 超标 4.02dB，恰好是 25MHz 晶振的 5 倍谐波", "晶振输出直接走线到主芯片，约 4cm，两个过孔"]}
          calculation={["BW = 0.35/tr = 0.35/4ns ≈ 87.5MHz，边沿陡峭导致高次谐波丰富", "确认晶振输出已串 22Ω（若未串先加串阻）", "走线改到内层并包地，缩短长度、减少换层"]}
          verification={["复测辐射，125MHz 与其倍频点下降", "观察时钟边沿振铃是否恶化（过度滤波会牺牲边沿）", "预留的 EMC 对地电容工位按需上 10~47pF"]}
          answer="时钟辐射超标先查谐波来源（BW=0.35/tr），处理顺序：串阻匹配 → 缩短走线/少换层 → 包地 → 必要时并小电容压边沿。"
        />
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>去耦电容布置有哪些原则？</summary><p>先遵循芯片手册的容值与数量，把高频电容的供电—回流环路做短、低电感；BGA 还要结合封装 PDN、目标阻抗和背面/同层过孔结构，不能机械执行“一脚一颗”。</p></details>
          <details><summary>怎样理解所谓去耦半径？</summary><p>λ/40~λ/50 只能粗略判断传播的分布效应。实际摆放更常受封装、焊盘、过孔和走线的安装电感限制，还要检查目标阻抗、自谐振与多电容反谐振。</p></details>
          <details><summary>时钟电路原理图阶段要做哪些设计？</summary><p>时钟电源用磁珠滤波且磁珠前后放电容；输出串联 22/33Ω 阻抗匹配；预留对地 0402 电容工位用于 EMC 调试；时钟网络做特异性命名（如 25M_CLK）便于加布线约束。</p></details>
          <details><summary>时钟走线有哪些 PCB 注意点？</summary><p>靠近主芯片走最短路径；远离热源；不放板边（否则包地并远离受力点）；晶振下方禁止走线；少打过孔少换层（≤2 次）；不与复位、中断、模拟线平行，必要时包地且包地线密打过孔。</p></details>
          <details><summary>为什么时钟信号容易辐射超标？</summary><p>时钟边沿陡（如 tr=4ns），能量带宽 BW=0.35/tr 可达上百 MHz，远高于基频，高次谐波丰富；走线较长时这些谐波直接辐射。对策：串阻匹配、包地、内层走线、必要时并小电容放缓边沿。</p></details>
          <details><summary>时钟串扰为什么会引起系统复位？</summary><p>时钟与复位线长距离平行时，时钟边沿通过耦合在复位线上形成毛刺；毛刺幅度超过复位芯片/引脚的 VIL 阈值时，芯片被误判为有效复位。对策是加大间距、垂直交叉、包地。</p></details>
        </div>
      </section>
    </>
  );
}
