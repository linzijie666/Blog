import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function TriodeArticle() {
  return (
    <>
      <section id="principle">
        <h2>三极管的工作区与工程直觉</h2>
        <p>三极管是电流控制型器件：基极小电流控制集电极大电流。<FormulaText text="I_C = β·I_B" /> 只在放大区成立；开关应用里更关心截止与饱和两个状态，放大应用才关心工作点是否稳定。</p>
        <div className="formula-block"><figcaption>电流关系与工作区判据</figcaption><div className="formula"><FormulaText text="I_C = β·I_B　I_E = I_B + I_C　饱和判据 I_C < β·I_B" /></div><p>β 是放大倍数，小信号管通常大于 100。截止区发射结反偏或零偏，饱和区集电结正偏、管压降只剩 V<sub>CE(sat)</sub>（约 0.3 V）。</p></div>
        <aside className="article-callout"><strong>面试主线：</strong>先说清三极管工作在哪个区，再谈电路功能。开关看饱和深度，放大看工作点与动态参数，两者不能混用一套分析。</aside>
      </section>

      <section id="circuits">
        <h2>开关、电平转换与恒流稳压</h2>
        <p><strong>开关与逻辑反相：</strong>输入高电平时三极管饱和导通、输出被拉到约 0.3 V；输入低电平时截止、输出被上拉到 VCC，天然是一个反相器。以 3.3 V 驱动 MMBT3904 为例：<FormulaText text="I_B = (3.3V - 0.7V)/1KΩ = 2.6mA" />，集电极电流 <FormulaText text="I_C = 3.3V/1KΩ = 3.3mA" />，满足 <FormulaText text="I_C < I_B·β" />，故处于深度饱和，输出低电平约 0.3 V。</p>
        <ArticleFigure src="images/knowledge/semiconductor-devices/bjt-switch-inverter.webp" fullSrc="images/knowledge/semiconductor-devices/bjt-switch-inverter-hd.jpg" alt="NPN 三极管开关反相器电路与饱和判断计算" caption="开关电路的设计核心是饱和校核：基极电流要足够大，让集电极电流脱离 β 的控制。" sourcePage="14" />
        <p><strong>电平转换：</strong>两只 NPN 级联可实现 3.3V 与 5V GPIO 的双向兼容，第一级反相、第二级再反相，恢复信号极性。MOS 管方案（见第二章 MOS 一篇）更适合 IIC 等双向总线。</p>
        <ArticleFigure src="images/knowledge/semiconductor-devices/bjt-level-shift.webp" fullSrc="images/knowledge/semiconductor-devices/bjt-level-shift-hd.jpg" alt="两只 NPN 三极管组成的 3.3V 与 5V 电平转换电路" caption="两级反相恢复极性，输出高电平由 5V 上拉决定，三极管始终工作在开关状态。" sourcePage="14" />
        <p><strong>基准与线性稳压：</strong>TL431 是带基准和误差放大功能的三端器件，配合分压电阻即可生成 2.5V 或 5V 基准；传统线性稳压源（7805、AMS1117）则用大功率三极管做调整管，对输出采样分压后与基准比较，再控制调整管的基极实现负反馈调节。</p>
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/semiconductor-devices/bjt-tl431-reference.webp", fullSrc: "images/knowledge/semiconductor-devices/bjt-tl431-reference-hd.jpg", alt: "TL431 组成的 2.5V 和 5V 基准电压电路", caption: "TL431 的 Reference 引脚需要 1% 以上精度的分压，输出才符合设定值。", sourcePage: "17" },
          { src: "images/knowledge/semiconductor-devices/bjt-linear-regulator.webp", fullSrc: "images/knowledge/semiconductor-devices/bjt-linear-regulator-hd.jpg", alt: "串联型线性稳压电源功能框图与调节趋势", caption: "调整管、比较放大、采样电路和基准四要素构成负反馈：Uo 偏高时自动下调。", sourcePage: "17" }
        ]} />
        <div className="formula-block"><figcaption>线性稳压的调节趋势</figcaption><div className="formula"><FormulaText text="U_O↑ → U_N↑ → U_B↓ → U_O↓" /></div><p>开关电源效率高但纹波大，线性稳压纹波小但压差损耗大，两者按场景取舍；LDO 与传统串联稳压原理接近，差别在调整管工作在压差更小的状态。</p></div>
      </section>

      <section id="amplifier">
        <h2>静态工作点与动态参数</h2>
        <p>放大电路分两步分析：先做直流分析求静态工作点 Q（电容视为开路），再做交流分析求增益、输入输出电阻（电容视为短路、VCC 等效接地，三极管替换成微变等效电路）。</p>
        <div className="formula-block"><figcaption>固定偏置共射电路的静态工作点</figcaption><div className="formula"><FormulaText text="I_{BQ} = (V_{CC} - U_{BEQ})/R_b = (12-0.7)/200K = 56.5µA" /></div><p><FormulaText text="I_{EQ} = (1+β)·I_{BQ} = 5.71mA" />，集电极电流 <FormulaText text="I_{CQ} = β·I_{BQ}" />。U_BEQ 对硅管取 0.7V 固定值。</p></div>
        <ArticleFigure src="images/knowledge/semiconductor-devices/bjt-common-emitter-qpoint.webp" fullSrc="images/knowledge/semiconductor-devices/bjt-common-emitter-qpoint-hd.jpg" alt="共射放大电路与静态工作点计算过程" caption="先算 IBQ、再算 IEQ 和 ICQ：静态分析只看直流通路，耦合电容全部断开。" sourcePage="20" />
        <p>动态参数从微变等效电路出发，先算三极管输入电阻，再按定义求放大倍数、输入电阻和输出电阻。</p>
        <div className="formula-block"><figcaption>三极管输入电阻</figcaption><div className="formula"><FormulaText text="r_{be} = r_{bb'} + (1+β)·U_T/I_{EQ} ≈757Ω" /></div><p>rbb' 基区体电阻典型取 300Ω，UT 为热电压 26mV；IEQ 越大 rbe 越小，这是增益与输入阻抗的折中来源。</p></div>
        <ArticleFigure src="images/knowledge/semiconductor-devices/bjt-small-signal.webp" fullSrc="images/knowledge/semiconductor-devices/bjt-small-signal-hd.jpg" alt="射极跟随器微变等效电路与增益输入输出电阻推导" caption="射极跟随器 Au≈0.98、输入电阻大、输出电阻小，常做输入级、缓冲级和输出级。" sourcePage="24" />
        <WorkedExample
          title="分压偏置共射电路的静态工作点校核"
          given={["VCC=12V，Rb1=5K，Rb2=15K，Re=2.3K，Rc=5.1K，RL=5.1K", "三极管 β=50，rbe=1.5K，UBEQ=0.7V", "基极电流为 µA 级，基极电位近似由 Rb1、Rb2 分压决定"]}
          calculation={["基极电压 UBQ=12V×5K/(5K+15K)=3V", "发射极电压 UEQ=UBQ-UBEQ=3-0.7=2.3V", "发射极电流 IEQ=UEQ/Re=2.3V/2.3K=1mA", "基极电流 IBQ=IEQ/(1+β)=1mA/51≈19.6µA", "集电极电流 ICQ=β×IBQ≈0.98mA", "管压降 UCEQ=VCC-ICQ×Rc-IEQ×Re≈12-5.1-2.3=4.7V"]}
          verification={["UCEQ=4.7V 远大于饱和压降 0.3V，三极管可靠工作在放大区", "分压偏置的 Q 点基本不受 β 离散影响，更换器件后工作点稳定", "动态指标要分有/无 Ce 两种情况分别计算", "核对 Rc、Re 的功率降额与三极管的耐压、功耗余量"]}
          answer="我先按分压近似求基极电位，再依次算出发射极电流、基极电流和管压降，用 UCEQ 与饱和压降比较确认放大区；随后说明分压偏置对 β 离散的抑制，最后按有/无旁路电容分别给出动态指标。"
        />
        <ArticleFigure src="images/knowledge/semiconductor-devices/bjt-voltage-bias-qpoint.webp" fullSrc="images/knowledge/semiconductor-devices/bjt-voltage-bias-qpoint-hd.jpg" alt="分压偏置共射放大电路与静态工作点计算" caption="分压偏置让基极电位几乎不受基极电流影响，是稳定工作点的标准做法。" sourcePage="27" />
      </section>

      <section id="configurations">
        <h2>三种组态对比与多级耦合</h2>
        <p>同一颗三极管按输入输出公共端不同分为共射、共集、共基三种组态，增益、阻抗和频响差别极大，选组态就是选电路定位。</p>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <caption>三种放大组态对比</caption>
            <thead>
              <tr>
                <th scope="col">组态</th>
                <th scope="col">增益</th>
                <th scope="col">输入/输出电阻</th>
                <th scope="col">典型用途</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">共射</th>
                <td>电压增益大、输出反相</td>
                <td>输入中等、输出受 Rc 影响</td>
                <td>通用电压放大</td>
              </tr>
              <tr>
                <th scope="row">共集（射极跟随器）</th>
                <td>电压增益约等于 1</td>
                <td>输入电阻大、输出电阻小</td>
                <td>缓冲、阻抗匹配、输出级</td>
              </tr>
              <tr>
                <th scope="row">共基</th>
                <td>电压增益大、输入输出同相</td>
                <td>输入电阻小、高频特性好</td>
                <td>高频放大、共射共基组合</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>发射极旁路电容 Ce 决定增益量级：有 Ce 时共射增益 <FormulaText text="A_u = -β·(R_c/R_l) 量级，示例电路约 -85" />；去掉 Ce 后发射极电阻引入串联负反馈，增益降到约 1.11 且几乎与 β 无关，输入电阻升高。多级放大常用的阻容耦合会隔离各级直流工作点，但前级输出电阻与后级输入电阻分压会损失增益；直接耦合能放大直流，却要处理各级电平配合与零点漂移。</p>
        <ArticleFigure src="images/knowledge/semiconductor-devices/bjt-bypass-compare.webp" fullSrc="images/knowledge/semiconductor-devices/bjt-bypass-compare-hd.jpg" alt="共射电路有无旁路电容 Ce 的微变等效电路对比" caption="无 Ce 时 Re 引入负反馈：增益骤降但稳定且与 β 无关，输入电阻提高。" sourcePage="28" />
      </section>

      <section id="workflow">
        <h2>设计流程与易错点</h2>
        <ol className="summary-list">
          <li>先明确电路定位：开关、恒流、基准还是信号放大，功能决定组态与工作区。</li>
          <li>开关电路校核饱和条件 <FormulaText text="I_C < I_B·β" />，并留足基极过驱动余量。</li>
          <li>放大电路先算静态工作点，再画微变等效电路求 Au、ri、ro。</li>
          <li>核对温度与容差：分压偏置稳定 Q 点，Re 负反馈稳定增益。</li>
          <li>检查 VCE(sat)、最大集电极电流、耗散功率和耐压是否留有余量。</li>
        </ol>
        <aside className="article-callout"><strong>不要混淆：</strong>VCE(sat) 是饱和导通残压（约 0.3V），UBEQ 是发射结压降（约 0.7V），两者含义不同；开关电路输出低电平由 VCE(sat) 决定。</aside>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>三极管开关电路怎样判断是否饱和？</summary><p>按输入电平算出基极电流 IB，再算集电极最大可能电流 IC=VCC/RC；若 IC &lt; IB×β，三极管饱和，输出为 VCE(sat) 约 0.3V。</p></details>
          <details><summary>发射极旁路电容 Ce 有无对电路有什么影响？</summary><p>有 Ce 时发射极交流接地，增益大（约 -β·Rc/rbe 量级）；无 Ce 时 Re 引入串联负反馈，增益大幅下降但与 β 基本无关，输入电阻升高、线性度更好。</p></details>
          <details><summary>为什么射极跟随器常放在输入级和输出级？</summary><p>共集组态输入电阻大、输出电阻小、电压增益接近 1，能减小对信号源的索取并增强带负载能力，即阻抗变换。</p></details>
          <details><summary>温度升高对放大电路有什么影响？</summary><p>VBE 下降、β 上升导致 IC 增大、Q 点上移，可能进入饱和失真；分压偏置和发射极电阻负反馈可以抑制这种漂移。</p></details>
        </div>
      </section>
    </>
  );
}
