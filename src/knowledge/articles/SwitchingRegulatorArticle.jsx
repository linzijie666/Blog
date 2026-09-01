import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function SwitchingRegulatorArticle() {
  return (
    <>
      <section id="principle">
        <h2>DC-DC 的组成与设计流程</h2>
        <p>面试常考的题目是“设计一个 12V 输入、5V 输出、2A 电流的开关电源电路”。先把电路拆成六个器件去理解：<strong>DC-DC 控制器芯片、输入滤波电容、输出滤波电容、功率电感、续流二极管（同步拓扑为下管）和 FB 反馈分压电阻</strong>。芯片外围再配一个 BOOT 自举电容给高边驱动供电，EN 使能引脚用电阻上拉或受控开启。</p>
        <ArticleFigure src="images/knowledge/power-supplies/dcdc-components.webp" fullSrc="images/knowledge/power-supplies/dcdc-components-hd.jpg" alt="TPS54602 降压电路各部分器件标注" caption="TPS54602 典型应用电路：自举电容、功率电感、续流二极管、输入/输出滤波电容与反馈电阻一目了然。" sourcePage="4" />
        <p>引脚和网络定义要能脱口而出：<FormulaText text="V_{IN}" /> 输入电源、GND 地、SW 开关节点（接电感）、BOOT 自举电容、EN 使能、FB 反馈电压输入、VOUT 输出电源。回答设计题时按“输入耐压 → 电感 → 输出电容 →FB 电阻”四步走：</p>
        <div className="formula-block"><figcaption>BUCK 电感选型公式</figcaption><div className="formula"><FormulaText text="L = V_{OUT}×(V_{IN}-V_{OUT}) / (V_{IN}×f_{SW}×ΔI_L)" /></div><p>输入耐压按 1.2 倍余量选（12V 输入至少耐 16V，常见取 25V）；<FormulaText text="ΔI_L" /> 为纹波电流，一般取输出电流的 10%~40%（按 20% 估算便于计算）；输出电容按纹波指标和环路稳定性确定，常见 2×47µF MLCC；FB 电阻按 <FormulaText text="V_{OUT}=V_{FB}×(1+R_1/R_2)" /> 分压，FB 引脚有上拉电阻时按 datasheet 推荐值取。</p></div>
        <p>厂家 datasheet 的 Typical Application Circuit 就是现成答案：RT8279（耐压 36V、5A、非同步外置二极管续流）和 RT6253A/B（耐压 17V、3A、同步）都给出了推荐电感、FB 电阻和输出电容组合，设计时对齐输入输出电压与电流档位即可。</p>
        <ArticleFigure src="images/knowledge/power-supplies/dcdc-design-rt8279.webp" fullSrc="images/knowledge/power-supplies/dcdc-design-rt8279-hd.jpg" alt="RT8279 典型应用电路与推荐元件表" caption="RT8279 非同步 BUCK 参考设计：5.5V~36V 输入，B550A 续流，按输出电压查表选 R1/R2。" sourcePage="5" />
        <p>设计完成后用示波器复核三个关键波形：SW 开关节点方波（验证开关频率与占空比）、IL 电感电流三角波（验证纹波电流与是否饱和）、VOUT 交流耦合纹波（验证输出指标）。这张图里 <FormulaText text="T≈4µs" /> 即 <FormulaText text="f_{SW}≈250kHz" />，SW 高电平期间对应电感电流上升段。</p>
        <ArticleFigure src="images/knowledge/power-supplies/dcdc-design-waveform.webp" fullSrc="images/knowledge/power-supplies/dcdc-design-waveform-hd.jpg" alt="SW、IL、VOUT 三个关键波形" caption="SW 方波、电感电流三角波与输出交流纹波：调试开关电源时先看这三条曲线。" sourcePage="7" />
        <WorkedExample
          title="12V→5V/3A BUCK 的电感与纹波校核"
          given={["输入 12V，输出 5V/3A，开关频率 fsw=600kHz（TPS54602 类芯片）", "功率电感取 L=4.7µH，纹波电流按输出电流 20%~40% 估算", "输出电容 2×22µF MLCC，ESR≈5mΩ"]}
          calculation={["ΔIL=VOUT×(VIN−VOUT)/(VIN×fsw×L)=5×7/(12×600k×4.7µ)≈1.04A，约为 IOUT 的 35%", "纹波电流分量 VRIPPLE(ESR)=ΔIL×ESR≈1.04×5mΩ≈5mV", "电容充放电分量 VRIPPLE(C)=ΔIL/(8×COUT×fsw)=1.04/(8×44µ×600k)≈4.9mV", "输出纹波合计约 10mV，满足常见 ≤1%VOUT 的指标"]}
          verification={["电感饱和电流需大于峰值电流 IOUT+ΔIL/2≈3.5A 并留余量", "SW 引脚耐压、BOOT 电容 0.1µF 与芯片推荐值一致", "FB 分压按 VFB=0.6V 计算：R1/R2=(5/0.6−1)≈7.33，取 73.2k/10k 1% 精度"]}
          answer="我先按公式算纹波电流确认电感取值，再分别用 ESR 和电容充放电两项估算输出纹波，最后校核电感饱和电流与 FB 分压，而不是只抄一版典型电路。"
        />
        <aside className="article-callout"><strong>面试主线：</strong>先报器件清单，再按“耐压、电感、输出电容、FB”给设计流程，最后强调用 SW/IL/VOUT 三个波形验收。</aside>
      </section>

      <section id="topology">
        <h2>BUCK 与 BOOST 拓扑两条回路</h2>
        <p>回答“画出 BUCK/BOOST 拓扑并简述工作原理”时，核心是讲清<strong>充电回路和续流回路</strong>两条路径，再配 SW 电压与电感电流波形。</p>
        <h3>同步 BUCK：上管充电、下管续流</h3>
        <p>同步 BUCK 用两颗 MOS 管：上管 Q1 导通、下管 Q2 关断时，VIN 经 Q1 给电感充电储能，电流线性上升，SW 电压约等于 VIN；上管关断、下管导通时，电感电流经 Q2 继续流通（续流），电感放电，SW 拉到接近 0V。输出电压由两者时间比例决定，所以 BUCK 只能降压。</p>
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/power-supplies/buck-loop-charge.webp", fullSrc: "images/knowledge/power-supplies/buck-loop-charge-hd.jpg", alt: "同步 BUCK 上管导通充电回路", caption: "上管 Q1 导通：VIN → 电感 → 负载的充电回路，电感电流线性上升。", sourcePage: "9" },
          { src: "images/knowledge/power-supplies/buck-loop-freewheel.webp", fullSrc: "images/knowledge/power-supplies/buck-loop-freewheel-hd.jpg", alt: "同步 BUCK 下管导通续流回路", caption: "下管 Q2 导通：电感经 Q2 续流放电，SW 接近 0V。", sourcePage: "9" }
        ]} />
        <p>非同步 BUCK 把下管换成肖特基二极管：结构简单、成本低，常见于中小电流、成本敏感的场合；代价是二极管约 0.4~0.5V 的导通压降持续损耗，轻载和高压差时效率明显低于同步方案。</p>
        <p>波形层面要能对应起来：SW 是周期为 <FormulaText text="T" /> 的方波，高电平段电感电流上升（斜率 <FormulaText text="(V_{IN}-V_{OUT})/L" />），低电平段下降；VOUT 交流耦合后就是毫伏级的锯齿纹波，频率与 SW 相同。</p>
        <ArticleFigure src="images/knowledge/power-supplies/buck-waveform.webp" fullSrc="images/knowledge/power-supplies/buck-waveform-hd.jpg" alt="同步 BUCK 的 SW、IL、VOUT 波形" caption="SW 10V/div、IL 1A/div、VOUT-AC 10mV/div：上管导通充电、下管导通续流在波形上完全对应。" sourcePage="10" />
        <h3>BOOST：先储能再释放</h3>
        <p>BOOST 电路开关管串在电感之后、整流二极管在输出侧：开关导通时 VIN 直接给电感充电储能（二极管截止，隔离输出电容）；开关关断时电感电流不能突变，感生电压与 VIN 叠加后经二极管向输出释放能量，因此 <FormulaText text="V_{OUT}>V_{IN}" />。画图时同样抓住充电、续流（放电）两条回路。</p>
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/power-supplies/boost-loop-charge.webp", fullSrc: "images/knowledge/power-supplies/boost-loop-charge-hd.jpg", alt: "BOOST 开关管导通电感充电回路", caption: "Q4 导通：VIN 给电感充电，D2 截止隔离输出级。", sourcePage: "12" },
          { src: "images/knowledge/power-supplies/boost-loop-freewheel.webp", fullSrc: "images/knowledge/power-supplies/boost-loop-freewheel-hd.jpg", alt: "BOOST 开关管关断电感放电回路", caption: "Q4 关断：电感电压与 VIN 叠加经 D2 向输出释放能量。", sourcePage: "12" }
        ]} />
        <aside className="article-callout"><strong>画图技巧：</strong>BUCK = 电感在开关管之后 + 续流管到地；BOOST = 电感在开关管之前 + 整流管到输出。两条回路（充电/续流）标清楚，工作原理就顺理成章。</aside>
      </section>

      <section id="modes">
        <h2>CCM、DCM 与 FCCM/PSM 轻载模式</h2>
        <p>CCM（连续导通模式）指电感电流在整个开关周期内不为零，重载时典型状态；DCM（断续导通模式）指轻载时电感电流在周期结束前降到零，下一周期从零开始；BCM（边界导通模式）是电流刚好降到零又被拉起的临界状态，可视为 CCM 的特例。</p>
        <ArticleFigure src="images/knowledge/power-supplies/ccm-dcm-waveforms.webp" fullSrc="images/knowledge/power-supplies/ccm-dcm-waveforms-hd.jpg" alt="CCM、DCM、BCM 电感电流波形对比" caption="CCM 电流连续、DCM 电流断续、BCM 电流最小值恰好为零（边界模式）。" sourcePage="14" />
        <p>面试更深一层的问法是“电源芯片 FCCM 模式与轻载高效 PSM/PFM 模式的区别”：</p>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <caption>FCCM 与 PSM/PFM 轻载模式对比</caption>
            <thead>
              <tr>
                <th scope="col">维度</th>
                <th scope="col">FCCM（强制连续模式）</th>
                <th scope="col">PSM/PFM（跳周期/变频）</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">工作方式</th><td>轻载仍按固定频率完整开关</td><td>轻载跳过部分脉冲或拉长周期，能量够了再开一拍</td></tr>
              <tr><th scope="row">纹波表现</th><td>纹波小、频率恒定、频谱干净</td><td>纹波明显增大，开关频率随负载变化</td></tr>
              <tr><th scope="row">效率表现</th><td>轻载开关损耗占比大，效率低</td><td>轻载效率显著提高（效率曲线在轻载段分叉）</td></tr>
              <tr><th scope="row">适用场景</th><td>对纹波/EMI 敏感的模拟供电</td><td>电池供电、轻载时间长的数字负载</td></tr>
            </tbody>
          </table>
        </div>
        <p>实测对比最能说明问题：某开关电源空载时纹波峰峰值达 82mV 且 SW 频率异常——正是进入了 PFM 跳周期模式；带载 2A 后纹波回到 40mV、频率恢复稳定，即工作在 CCM。轻载纹波大不一定是电源坏了，先确认工作模式再排查。</p>
        <ArticleFigure src="images/knowledge/power-supplies/mode-scope-compare.webp" fullSrc="images/knowledge/power-supplies/mode-scope-compare-hd.jpg" alt="空载 PFM 与带载 CCM 的纹波对比" caption="左侧空载进入 PFM：纹波 82mV、SW 频率异常；右侧带载 2A：纹波 40mV、频率正常。" sourcePage="53" />
        <ArticleFigure src="images/knowledge/power-supplies/psm-light-load-ripple.webp" fullSrc="images/knowledge/power-supplies/psm-light-load-ripple-hd.jpg" alt="轻载 10mA 时的 PSM 输出纹波" caption="IOUT=10mA 时 VOUT 50mV/div、周期拉长到 10µs/div：跳周期让纹波周期性起伏。" sourcePage="15" />
      </section>

      <section id="volt-second">
        <h2>伏秒平衡与占空比</h2>
        <p>伏秒平衡是开关电源所有占空比公式的推导工具：<strong>稳态时电感一个开关周期内的伏秒积为零</strong>（充进去的伏秒等于放出来的伏秒），否则电流会一直上升或下降，输出无法稳定。</p>
        <p>以 BUCK 为例，设开关周期 T、占空比 D。导通（充电）时间 D×T 内电感两端电压 <FormulaText text="U_{ON}=V_{IN}-V_{OUT}" />；关断（续流）时间 (1−D)×T 内 <FormulaText text="U_{OFF}=-V_{OUT}" />。两者绝对值相等、符号相反，相加为零：</p>
        <div className="formula-block"><figcaption>BUCK 伏秒平衡推导</figcaption><div className="formula"><FormulaText text="(V_{IN}-V_{OUT})×D×T = V_{OUT}×(1-D)×T → V_{OUT}/V_{IN}=D" /></div><p>同理 BOOST 导通时电感承受 VIN、关断时承受 VOUT−VIN，推得 <FormulaText text="V_{OUT}=V_{IN}/(1-D)" />。这两个公式建议现场推导而不是死记。</p></div>
        <ArticleFigure src="images/knowledge/power-supplies/volt-second-waveform.webp" fullSrc="images/knowledge/power-supplies/volt-second-waveform-hd.jpg" alt="伏秒平衡的充电与续流时间标注" caption="VIN=12V、VOUT=5V 时输出纹波波形：充电时间 D×T 与关断续流时间 (1−D)×T。" sourcePage="17" />
        <p>把 BUCK 简化成“NMOS 当开关、二极管续流”的等效电路，充电回路（红色）与放电回路（蓝色）分别闭合，伏秒平衡的物理图像就是电感电压波形在一个周期内正负面积相等：</p>
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/power-supplies/volt-second-buck-circuit.webp", fullSrc: "images/knowledge/power-supplies/volt-second-buck-circuit-hd.jpg", alt: "RT8279 非同步 BUCK 应用电路", caption: "RT8279 非同步 BUCK：为简化分析把上管等效为开关、续流用二极管。", sourcePage: "18" },
          { src: "images/knowledge/power-supplies/volt-second-buck-equiv.webp", fullSrc: "images/knowledge/power-supplies/volt-second-buck-equiv-hd.jpg", alt: "BUCK 等效电路的充电与放电回路", caption: "等效电路：开关 SW 闭合走充电电流回路，断开走放电电流回路。", sourcePage: "18" }
        ]} />
        <WorkedExample
          title="用伏秒平衡反推占空比与纹波电流"
          given={["BUCK 电路 VIN=12V、VOUT=5V、IOUT=3A、L=4.7µH（课件实测波形）", "开关周期由 SW 波形读出，fsw≈600kHz"]}
          calculation={["占空比 D=VOUT/VIN=5/12≈0.42，与 SW 波形高电平占比一致", "导通期间电流斜率 (VIN−VOUT)/L=7/4.7µ≈1.49A/µs", "续流期间电流斜率 −VOUT/L=−5/4.7µ≈−1.06A/µs", "纹波电流 ΔIL≈1.49A/µs×D/fsw≈1.04A，与实测三角波峰峰值吻合"]}
          verification={["检查 D×T 与 (1−D)×T 两段电流上升/下降量是否相等（伏秒平衡自检）", "峰值电流 IOUT+ΔIL/2≈3.5A 用于电感饱和电流校核", "若实测 D 偏离 0.42 较多，先怀疑反馈分压或二极管压降（非同步拓扑）"]}
          answer="面试时我会先写出伏秒平衡方程，推导 D=VOUT/VIN，再用斜率算纹波电流并与波形对照——展示的是推导过程，而不是背公式。"
        />
      </section>

      <section id="sequencing">
        <h2>多电源上电时序设计</h2>
        <p>一块板子往往同时有 5V、3.3V、1.8V、1.2V 等多路电源，CPU、FPGA、DDR 对“谁先上电、谁后掉电”有明确要求（如核心电源先于 IO 电源）。控制上电时序的常用思路是<strong>控制后级电源芯片的 EN 使能引脚</strong>，有三种实现：</p>
        <div className="application-list">
          <article><h3>方案一：RC 延时</h3><p>EN 引脚对地接电容、上拉电阻充电：上电后电容电压指数上升，越过 EN 高电平阈值后电源开启，τ=RC 决定延时。例如 EN 高阈值 1.2V、电源 5V，取 R=10kΩ、C=0.47µF，τ=RC=4.7ms，充到 1.2V 阈值需 t=τ×ln(5/(5−1.2))≈0.27τ≈1.3ms。优点是成本低；缺点是延时精度差，且前一级输出必须高于后级 EN 的逻辑高阈值（有的芯片 EN 阈值 1.4V 左右，前级只有 1.2V 就无法级联）。</p></article>
          <article><h3>方案二：时序芯片</h3><p>用 LM3881 这类专用时序芯片，三路 FLAG 输出按固定顺序依次释放各路 EN，延时可通过 TADJ 引脚调节。时序精确、独立于各级输出电压，是多电源系统的标准做法。</p></article>
          <article><h3>方案三：主芯片 GPIO 程控</h3><p>主控芯片用三路 GPIO 分别控制各路电源 EN，软件里精确安排上下电顺序，还能在异常时主动断电重启。最灵活，但上电瞬间 GPIO 状态未初始化前要保证默认安全（EN 默认下拉）。</p></article>
        </div>
        <p>RC 方案的延时本质是电容充电过程：电容电压从 0 充到 0.63Vs 用时 1τ，进入稳态约需 3~5τ。把“充电到 EN 阈值的时间”当成设计指标，就能算出 R、C 取值。</p>
        <ArticleFigure src="images/knowledge/power-supplies/cap-charge-curve.webp" fullSrc="images/knowledge/power-supplies/cap-charge-curve-hd.jpg" alt="电容充电曲线与时间常数" caption="电容充电曲线：1τ 达到 63%，瞬态与稳态的分界决定了 RC 延时的可预测区间。" sourcePage="29" />
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/power-supplies/sequencing-rc-circuit.webp", fullSrc: "images/knowledge/power-supplies/sequencing-rc-circuit-hd.jpg", alt: "RC 延时上电时序电路", caption: "RC 延时方案：每路 EN 接 10k 上拉 + 对地电容，τ 依次递增实现 1.2V→1.8V→3.3V 顺序。", sourcePage: "28" },
          { src: "images/knowledge/power-supplies/sequencing-chip-circuit.webp", fullSrc: "images/knowledge/power-supplies/sequencing-chip-circuit-hd.jpg", alt: "LM3881 时序芯片控制三路电源", caption: "LM3881MM 方案：FLAG1/2/3 按序释放三路 EN，时序由芯片保证。", sourcePage: "29" },
          { src: "images/knowledge/power-supplies/sequencing-gpio-circuit.webp", fullSrc: "images/knowledge/power-supplies/sequencing-gpio-circuit-hd.jpg", alt: "主芯片 GPIO 程控时序电路", caption: "GPIO 程控方案：主芯片三路 IO 分别控制三路电源 EN。", sourcePage: "31" }
        ]} />
      </section>

      <section id="ripple">
        <h2>纹波与噪声：测量、成因与抑制</h2>
        <h3>先分清纹波和噪声</h3>
        <p><strong>纹波（Ripple）</strong>是开关电源输出上与开关频率同步的周期性波动，表现为基波与高次谐波；<strong>噪声（Noise）</strong>是叠加在上面的高频杂音，来自开关沿、寄生参数和负载突变。两者的测量位置不同：纹波在输出滤波电容处测，噪声要贴近芯片电源引脚（去耦电容）处测，因为噪声沿传输路径会被衰减。</p>
        <ArticleFigure src="images/knowledge/power-supplies/ripple-measure-chain.webp" fullSrc="images/knowledge/power-supplies/ripple-measure-chain-hd.jpg" alt="纹波与噪声的测量位置" caption="纹波测量在电源输出滤波电容处，噪声测量在芯片电源去耦处，中间隔着传输路径。" sourcePage="55" />
        <p>标准测量姿势：示波器交流耦合、开启 20MHz 带宽限制（滤掉无关高频）、探头换<strong>接地弹簧/短接地</strong>（长地线会拾取空间辐射造成假纹波），测点选在输出滤波电容两端。</p>
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/power-supplies/ripple-probe-setup.webp", fullSrc: "images/knowledge/power-supplies/ripple-probe-setup-hd.jpg", alt: "示波器探头接地弹簧与地夹", caption: "探头配件：弹簧地针把接地回路缩到最短，避免地线拾取干扰。", sourcePage: "34" },
          { src: "images/knowledge/power-supplies/ripple-measure-point.webp", fullSrc: "images/knowledge/power-supplies/ripple-measure-point-hd.jpg", alt: "RT6253A/B 电路上的纹波与 SW 测量点", caption: "SW 测量看开关节点波形，纹波测量在 COUT 两端，绿箭头标出测量位置。", sourcePage: "34" }
        ]} />
        <h3>纹波由三部分构成</h3>
        <div className="formula-block"><figcaption>输出纹波构成</figcaption><div className="formula"><FormulaText text="V_{RIPPLE} = ΔI_L×ESR + ΔI_L/(8×C_{OUT}×f_{SW})" /></div><p>① 纹波电流流过电容 ESR 产生压降；② 电容充放电产生三角波电压；此外还有高频开关沿激励 ESL 产生的尖峰噪声（<FormulaText text="V=ESL×di/dt" />），属噪声范畴。</p></div>
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/power-supplies/ripple-cause-parts.webp", fullSrc: "images/knowledge/power-supplies/ripple-cause-parts-hd.jpg", alt: "输出电容 ESR/Co/ESL 三项纹波构成", caption: "SW→电感→输出电容的纹波分解：①I×ESR ②V/(8LCfsw) ③ESL 项。", sourcePage: "32" },
          { src: "images/knowledge/power-supplies/ripple-esr-esl-parts.webp", fullSrc: "images/knowledge/power-supplies/ripple-esr-esl-parts-hd.jpg", alt: "电容 RLC 模型与相移示意", caption: "电容的 RLC 模型：ESR 决定纹波台阶，ESL 决定开关沿尖峰。", sourcePage: "48" }
        ]} />
        <h3>抑制纹波的六个抓手</h3>
        <div className="application-list">
          <article><h3>输出电容</h3><p>加大容量、多颗并联、选低 ESR 贴片陶瓷电容（插件电容 ESL 大），直接压低 ESR 与充放电两项纹波。</p></article>
          <article><h3>电感量</h3><p>增大电感减小 ΔIL。仿真显示 7.5µH 换 15µH 纹波电流约减半；代价是 DCR 增大、体积成本上升、动态响应变慢。</p></article>
          <article><h3>开关频率</h3><p>提高 fSW 同样减小 ΔIL（2MHz 时 ΔIL≈0.5A，1MHz 时约 1A）；但开关损耗成比例上升，效率下降，EMI 也更难处理。</p></article>
          <article><h3>工作模式</h3><p>纹波敏感的供电用 FCCM；电池类轻载场景接受 PSM/PFM 换效率，或在后级加 LC/LDO 再滤波。</p></article>
          <article><h3>PCB 布局</h3><p>输入/输出功率环路面积最小化，功率回路避免过孔（过孔 ESL 大），输入输出电容紧靠芯片，加宽铺铜降低阻抗。</p></article>
          <article><h3>后级二次稳压</h3><p>对 ADC、时钟、射频等敏感电路用 LDO 从开关电源二次降压，利用 LDO 的高 PSRR 吃掉残余纹波。</p></article>
        </div>
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/power-supplies/ripple-inductance-sim.webp", fullSrc: "images/knowledge/power-supplies/ripple-inductance-sim-hd.jpg", alt: "7.5µH 与 15µH 电感的仿真电流对比", caption: "同样工况下 15µH 的电感电流纹波明显小于 7.5µH。", sourcePage: "51" },
          { src: "images/knowledge/power-supplies/ripple-fsw-sim.webp", fullSrc: "images/knowledge/power-supplies/ripple-fsw-sim-hd.jpg", alt: "2MHz 与 1MHz 开关频率的纹波电流对比", caption: "开关频率翻倍，ΔIL 从 1A 降到 0.5A，纹波随之减半。", sourcePage: "52" }
        ]} />
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>开关电源由哪些器件组成，各自作用是什么？</summary><p>控制器芯片（开关与调节）、输入滤波电容（抑制输入纹波）、输出滤波电容（稳输出）、功率电感（储能）、续流二极管/下管（续流）、FB 反馈电阻（设定输出电压），外加 BOOT 自举电容和 EN 使能。</p></details>
          <details><summary>同步 BUCK 和非同步 BUCK 的区别？</summary><p>非同步用肖特基二极管续流，结构简单成本低，但二极管压降（约 0.4~0.5V）带来固定损耗，效率低、发热大；同步用下管续流，导通电阻毫欧级，效率高，但需要两路驱动且要防上下管直通。</p></details>
          <details><summary>伏秒平衡是什么？怎么用它推导占空比？</summary><p>稳态下电感一个开关周期内的伏秒积为零。BUCK 导通时电感电压 VIN−VOUT 持续 D×T，续流时 −VOUT 持续 (1−D)×T，两式相等推出 VOUT/VIN=D；BOOST 同理推出 VOUT=VIN/(1−D)。</p></details>
          <details><summary>电源轻载时纹波变大正常吗？</summary><p>如果芯片处于 PSM/PFM 跳周期模式则正常：轻载时跳过部分脉冲提高效率，纹波和频率都会变化；需要低纹波时应选 FCCM 模式或后级加 LDO。空载纹波 82mV、带载回落 40mV 的实测就属于这类。</p></details>
          <details><summary>如何降低开关电源的输出纹波？至少说出四种。</summary><p>①输出电容加大容量、并联低 ESR 陶瓷电容；②增大电感减小 ΔIL；③提高开关频率；④纹波敏感负载改用 FCCM 或后级加 LC/LDO；⑤PCB 上功率环路最小化、避免过孔；⑥确认测量方法本身没有引入地线干扰。</p></details>
          <details><summary>多电源上电时序有哪几种实现？</summary><p>RC 延时控制 EN（成本低、精度差、要求前级输出高于后级 EN 阈值）、专用时序芯片如 LM3881（时序精确可调）、主芯片 GPIO 程控（最灵活，可软件调度与异常断电）。</p></details>
        </div>
      </section>
    </>
  );
}
