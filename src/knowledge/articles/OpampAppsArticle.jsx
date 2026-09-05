import ArticleFigure from "../ArticleFigure.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function OpampAppsArticle() {
  return (
    <>
      <section id="constant-current">
        <h2>恒流源电路</h2>
        <p>恒流源的核心也是负反馈：运放把采样电阻上的电压钳位在参考值，电流就恒定了。<strong>小电流方案</strong>（mA 级）可以直接用运放驱动：</p>
        <div className="formula-block"><figcaption>运放恒流源（2.5mA 例）</figcaption><div className="formula"><FormulaText text="I=V_{ref}/R=2.5V/1kΩ=2.5mA" /></div><p>虚短使采样电阻 R 上电压恒为 Vref，虚断使 IR 全部流向负载：不论 RL 多大，电流都是 2.5mA。</p></div>
        <ArticleFigure src="images/knowledge/analog-devices/app-cc-source-opamp.webp" fullSrc="images/knowledge/analog-devices/app-cc-source-opamp-hd.jpg" alt="运放小电流恒流源电路" caption="Vref 2.5V 进 IN+，R 1kΩ 采样，负载 RL 与电流表串在输出回路：恒流 2.5mA。" sourcePage="16" />
        <p>限制条件要说清：运放输出电压不能超过供电（RL 太大电流会掉）、输出电流只有几十 mA——所以这个电路实用价值有限。<strong>大电流方案</strong>是「运放做控制器 + MOS/BJT 做功率级」，恒流能力由功率管决定，可达几十 A。</p>
        <ArticleFigure src="images/knowledge/analog-devices/app-cc-source-mos.webp" fullSrc="images/knowledge/analog-devices/app-cc-source-mos-hd.jpg" alt="运放+MOS/BJT 大电流恒流源" caption="U19 运放负反馈控制 Q27（NPN 功率管/NMOS），R79 100mΩ 采样：参考电压=采样电阻×设定电流（2A→0.2V）。" sourcePage="17" />
        <div className="application-list">
          <article><h3>反馈环路</h3><p>电流偏高 → 采样电压升高 → 运放输出降低 → 管子开度减小 → 电流回落，负反馈自动稳流。</p></article>
          <article><h3>设计要点</h3><p>①用 NMOS 时注意栅极驱动电压余量，运放供电可取高些（勿超栅压耐压）；②功率管损耗大，核对封装与散热；③采样电阻用高精度低温漂型号，或加大封装减小温升。</p></article>
        </div>
        <WorkedExample
          title="设计 2A 恒流源"
          given={["主回路 5V，负载为 LED/激光管（连接器接入）", "采样电阻 R79=100mΩ"]}
          calculation={["参考电压 = R79×I = 0.1Ω×2A = 0.2V，由 DAC/基准经电阻送运放同相端", "运放将采样电压钳位到 0.2V，负反馈自动调节基极/栅极", "功率管压降 × 2A = 管耗，核对封装散热"]}
          verification={["满载测采样电阻压降恒为 0.2V", "负载短路/开路时的保护（TVS、限流）", "温升测试：功率管与采样电阻"]}
          answer="恒流 I=Vref/Rs：给 0.2V 参考就能在 100mΩ 采样上得 2A；工程重点在功率管选型散热与采样电阻精度温漂。"
        />
      </section>

      <section id="signal-range">
        <h2>转换信号范围</h2>
        <p>ADC 只认自己的量程，信号范围不匹配时用运放做线性变换 <FormulaText text="V_{OUT}=k×V_{IN}+m" />。课件实例：把 DAC 输出的 0~+2.5V 变换成 −5~+5V——用<strong>差分（减法）电路 + 4 倍增益</strong>实现：</p>
        <div className="formula-block"><figcaption>0~2.5V → ±5V 变换</figcaption><div className="formula"><FormulaText text="V_{OUT}=4.000×(V_{DAC}-1.25V)" /></div><p>TL431 产生 2.5V 基准，分压出 1.25V 偏置：输入先平移为 −1.25~+1.25V，再用精确 4.000 的匹配电阻比放大到 −5~+5V。课件图中的 3.9kΩ/1kΩ 实际只有 3.9 倍，理想输出是 ±4.875V，不能写成精确 ±5V。</p></div>
        <ArticleFigure src="images/knowledge/analog-devices/app-range-shift-tl431.webp" fullSrc="images/knowledge/analog-devices/app-range-shift-tl431-hd.jpg" alt="TL431+DAC 的信号范围变换电路" caption="课件用 3.9kΩ/1kΩ 得到 3.9 倍、理想输出 ±4.875V；若要求 ±5V，应改为精确 4.000 的匹配电阻比。" sourcePage="17" />
        <p>设计选型注意：</p>
        <div className="application-list">
          <article><h3>供电余量</h3><p>要输出 ±5V，运放供电必须宽于 ±5V 至少 1~2V；LM358 不是轨到轨，余量还要再放大——图中用了 ±10V 双电源。</p></article>
          <article><h3>电阻精度</h3><p>与增益和基准相关的 6 只电阻（R3/R4/R22/R25/R23/R24）用 1% 或更高精度。</p></article>
          <article><h3>偏置微调</h3><p>Vref_1V25 实测可能偏低（差分电路输入电阻小导致分压不准），可微调 R23/R24。</p></article>
          <article><h3>基准串阻功耗</h3><p>TL431 与 5V 之间的串阻 R15 压差大、功耗大，用大封装电阻。</p></article>
        </div>
      </section>

      <section id="adc-op">
        <h2>ADC+OP：输入阻抗匹配</h2>
        <p>STM32F103 的 ADC 输入是开关电容采样网络。手册中的 RAIN 是允许的外部源阻抗，不是 ADC 内部恒定的 50kΩ 对地电阻；其上限随采样时间变化。10kΩ+10kΩ 分压的戴维南源阻抗为 5kΩ，应按采样电容建立时间、采样周期和目标误差校核，不能由 RAIN 表直接推出 5% 的直流分压误差。</p>
        <ArticleFigure src="images/knowledge/analog-devices/app-stm32-rain-table.webp" fullSrc="images/knowledge/analog-devices/app-stm32-rain-table-hd.jpg" alt="STM32F103 ADC 输入阻抗与采样周期关系表" caption="Table 47：采样时间 3.96µs 时 RAIN max=50kΩ，采样越快允许的源阻抗越低。" sourcePage="18" />
        <ArticleFigure src="images/knowledge/analog-devices/app-ntc-rain-error.webp" fullSrc="images/knowledge/analog-devices/app-ntc-rain-error-hd.jpg" alt="NTC 测温源阻抗与 ADC 采样网络示意" caption="课件把 RAIN 画成并联电阻仅是错误的简化模型；实际应按开关、电容、源阻抗和采样时间分析动态建立误差。" sourcePage="19" />
        <p>对策按顺序做：先延长采样时间并核对源阻抗上限；需要更快采样或信号源阻抗很高时，再加稳定驱动容性负载的运放缓冲和适当 RC；最后用标定处理剩余的增益、偏移和传感器误差。</p>
        <ArticleFigure src="images/knowledge/analog-devices/app-dac-opamp-follower.webp" fullSrc="images/knowledge/analog-devices/app-dac-opamp-follower-hd.jpg" alt="分压 + 运放跟随 + ADC 架构" caption="NTC 分压经 2.2Ω 调试电阻进 LM358 跟随器，输出经 2.2Ω 到 ADC_IN；C9/C10 预留滤波工位默认不贴。" sourcePage="21" />
        <aside className="article-callout"><strong>面试要点：</strong>「模拟量—运放—ADC」「DAC—运放—模拟量」是模拟链路的标准句式，原理都是运放高输入阻抗 + 低输出阻抗的缓冲作用。</aside>
      </section>

      <section id="dac-op">
        <h2>DAC+OP：增强驱动能力</h2>
        <p>电压输出 DAC 的输出缓冲器通常具备 source/sink 能力，但允许负载、线性度和稳定性必须按 VOUT 条件查手册，不能把 VREF、VOUT、负载调整率和短路电流混成一个“±5mA”指标。AD5683 系列在指定条件下可源出或灌入电流；大电容或长线缆仍可能使建立时间变差、引起振铃。</p>
        <ArticleFigure src="images/knowledge/analog-devices/app-ad5683-drive.webp" fullSrc="images/knowledge/analog-devices/app-ad5683-drive-hd.jpg" alt="AD5683 输出负载条件参数表" caption="读取 DAC 驱动能力时要区分 VOUT 的 source/sink 测试条件、负载调整率、短路电流与 VREF 引脚额定值。" sourcePage="20" />
        <p>对策是 DAC 后加<strong>同相跟随器</strong>，但运放必须同时满足输出电流、压摆率、建立时间、输出摆幅和容性负载稳定性；不能只看“几十 mA”。必要时在运放输出与电容之间加隔离电阻，并按所选器件的反馈拓扑验证稳定性。</p>
        <WorkedExample
          title="DAC 输出经长线缆驱动负载"
          given={["DAC AD5683 输出 0~2.5V，经 2m 线缆送到采集板", "线缆寄生电容约 1nF，负载端要求信号边沿 <1µs"]}
          calculation={["仅按 I=C·dV/dt，2.5V/1µs 对 1nF 需要约 2.5mA；这只是电流下限，不含器件自身建立时间", "LM358 的典型压摆率约 0.6V/µs，完整 2.5V 跃迁约需 4.17µs，因此压摆率不能满足 <1µs 边沿", "改选 SR、建立时间和容性负载稳定性均合适的运放，并按手册在驱动端配置隔离/阻尼电阻"]}
          verification={["用目标负载实测 10%~90% 边沿、过冲和稳定时间", "核对 DAC 与运放的输出摆幅、source/sink 电流和失调误差", "确认串联电阻位于正确反馈边界内且不会破坏直流精度"]}
          answer="先由 I=C·dV/dt 算电流，再由 SR 与建立时间卡速度，最后检查容性负载稳定性。LM358 的压摆率不能满足本例 <1µs 的边沿要求，应换合适的高速稳定运放。"
        />
      </section>

      <section id="current-loop">
        <h2>4-20mA 电流检测</h2>
        <p>工业仪表普遍用 <strong>4-20mA 电流环</strong>传输测量值：电流源传输抗长线压降、抗衰减，4mA 活零点还能区分「断线」。接收端的任务是把电流转成电压再送 ADC：</p>
        <div className="application-list">
          <article><h3>电流→电压</h3><p>让环路电流流过采样电阻（如 150Ω：4-20mA → 0.6-3V），直接落进 ADC 量程。</p></article>
          <article><h3>差分采样</h3><p>用运放差分输入检测采样电阻两端电压：差分输入抗共模干扰（长线上的共模噪声被抑制），还能按需放大的小信号。</p></article>
          <article><h3>防负电压</h3><p>考虑负向电流的可能时，给检测输出叠加偏置（如 Vs/2=1.65V）防止超出 ADC 量程，详见基准源篇的 1.65V 偏置电路。</p></article>
        </div>
        <aside className="article-callout"><strong>面试要点：</strong>回答 4-20mA 检测抓住三点：采样电阻转电压、差分输入抗共模、量程匹配 ADC。与第二章三极管恒流源、本章恒流源电路串成一条线复习。</aside>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>画一个运放恒流源，输出电流怎么算？</summary><p>运放同相端接参考电压 Vref，反相端接采样电阻 R 到地，负载串在输出回路。虚短使 R 上电压=Vref，虚断使电流全部流过负载：I=Vref/R。例：2.5V+1kΩ→2.5mA。限制：运放输出摆幅与输出电流能力。</p></details>
          <details><summary>大电流恒流源怎么实现？要注意什么？</summary><p>运放负反馈做控制器，MOS/BJT 做主回路功率管，采样电阻反馈到运放。要点：栅/基极驱动电压余量、功率管封装散热、采样电阻高精度低温漂（加大封装降温漂）。电流能力由功率管决定，可达几十 A。</p></details>
          <details><summary>怎么把 0~2.5V 信号变成 −5~+5V？</summary><p>先减去 1.25V 得 ±1.25V，再用精确 4.000 的匹配电阻比放大。3.9kΩ/1kΩ 只有 3.9 倍，对应 ±4.875V；还要核对运放供电、共模范围和输出摆幅。</p></details>
          <details><summary>NTC 分压直接接单片机 ADC 为什么会有误差？怎么解决？</summary><p>误差来自 ADC 采样电容在有限采样时间内通过信号源阻抗充电不充分。RAIN 是允许的外部源阻抗，不是并联到地的输入电阻。先延长采样时间；仍不满足时加合适的缓冲器和 RC，再做系统标定。</p></details>
          <details><summary>DAC 输出驱动能力不足有什么表现？怎么增强？</summary><p>驱动重负载或大电容时可能出现幅值误差、边沿变缓、振铃或不稳定。先按 VOUT 的 source/sink 与负载条件查 DAC 手册；加跟随器时同时核对输出电流、SR、建立时间、摆幅和容性负载稳定性。</p></details>
          <details><summary>4-20mA 信号怎么接入 ADC？</summary><p>电流流过采样电阻（150Ω → 0.6~3V）转为电压；用运放差分输入检测电阻两端，抗长线共模干扰并按需放大；注意防负电压时叠加偏置，量程对齐 ADC 输入范围。4mA 活零点可区分断线故障。</p></details>
        </div>
      </section>
    </>
  );
}
