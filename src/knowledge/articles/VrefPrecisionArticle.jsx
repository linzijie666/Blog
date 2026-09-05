import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function VrefPrecisionArticle() {
  return (
    <>
      <section id="accuracy-methods">
        <h2>提高精度的系统方法</h2>
        <p>提高 ADC 检测精度是系统性工程，覆盖方案设计、器件选型到 PCB 布局。七步法总览：</p>
        <div className="application-list">
          <article><h3>1. 合理选型</h3><p>让量程贴合信号并选择足够 ENOB，把 LSB 做小：<FormulaText text="LSB=FSR/2^N" />。量程减半只代表理想 LSB 减半、量化分辨率提高；总精度仍由 OE/GE/DNL/INL、噪声和基准误差共同决定。</p></article>
          <article><h3>2. 驱动与建立</h3><p>许多 SAR ADC 的输入是开关电容网络。STM32 手册的 RAIN 表示给定采样时间下允许的外部源阻抗，不是固定的 ADC 输入电阻。应按信号源的戴维南阻抗、采样电容建立时间和目标误差校核；不满足时延长采样时间或用合适的运放缓冲。</p></article>
          <article><h3>3. 单端 vs 差分</h3><p>差分输入抗共模干扰，适合长距离传输；单端信号也可用「信号+采样点 GND」构成伪差分。详见下节。</p></article>
          <article><h3>4. 低通滤波</h3><p>ADC 采的多是低频信号，在运放与 ADC 之间加一阶 RC 低通抑制 MHz 级开关噪声。AD7980 实例：采 100kHz 正弦用 18.9Ω+2.7nF（fc≈3.1MHz，保信号滤开关噪声）。</p></article>
          <article><h3>5. 高精度基准源</h3><p>VREF 决定量程，基准不准一切白搭。低成本用电源或 1% 电阻分压；高精度用专用基准芯片（精度百分比 + 温漂 ppm/°C 两项指标）。</p></article>
          <article><h3>6. 电源设计</h3><p>ADC、运放、基准源用独立 LDO 供电（LDO 的 PSRR 能压制开关电源噪声），不与数字部分共轨；每个模拟器件 10µF+100nF 大小电容搭配去耦。</p></article>
          <article><h3>7. PCB 布局</h3><p>模拟与数字功能分区摆放，优先保持连续地平面和短而可预测的回流路径；是否分割 AGND/DGND 必须服从 ADC/基准器件手册。0Ω 或磁珠有寄生阻抗，不能同时保证等电位并隔绝高频噪声。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/analog-devices/vref-analog-digital-partition.webp" fullSrc="images/knowledge/analog-devices/vref-analog-digital-partition-hd.jpg" alt="模拟与数字分区布局示意" caption="模拟区（电源、时钟、ADC、基准、滤波、放大）与数字区（时序、缓存、逻辑、存储）虚线分区。" sourcePage="39" />
        <ArticleFigure src="images/knowledge/analog-devices/vref-ldo-psrr.webp" fullSrc="images/knowledge/analog-devices/vref-ldo-psrr-hd.jpg" alt="LDO 的 PSRR 频率曲线" caption="LDO 在 100Hz 处 PSRR 约 80dB，随频率下降——这正是模拟供电选 LDO 的原因。" sourcePage="38" />
        <ArticleFigure src="images/knowledge/analog-devices/vref-rc-filter-ad7980.webp" fullSrc="images/knowledge/analog-devices/vref-rc-filter-ad7980-hd.jpg" alt="AD7980 前端 RC 低通滤波" caption="运放缓冲 → 18.9Ω+2.7nF 一阶低通 → AD7980（16bit 1MSPS，采样电容 27pF）。" sourcePage="37" />
      </section>

      <section id="signal-conditioning">
        <h2>匹配、差分、滤波与开尔文</h2>
        <p><strong>驱动与建立</strong>不能只看直流输入阻抗：NTC 分压的源阻抗可能使 ADC 采样电容在采样窗内建立不充分。先按手册选择采样时间；需要缓冲时，运放还要满足输入/输出范围、稳定时间与容性负载稳定性，并配合适当 RC。</p>
        <p><strong>单端 vs 差分</strong>：实测对比最直观——单端采样时采样时钟边沿在信号上耦出毛刺；同样信号改差分传输、末端做减法，共模毛刺被抵消，波形干净。</p>
        <ArticleFigure src="images/knowledge/analog-devices/vref-single-vs-differential.webp" fullSrc="images/knowledge/analog-devices/vref-single-vs-differential-hd.jpg" alt="单端与差分采样实测对比" caption="(A) 单端：时钟沿毛刺明显；(B) 差分：共模干扰被减法抵消，正弦干净。" sourcePage="35" />
        <p>差分输入的三种实现：<strong>①差分 ADC 直采</strong>（信号对经一阶 RC 低通直接进 IN+/IN−，如 LTC2385；不需要放大时最简）；<strong>②双运放分别跟随</strong>后进差分 ADC（信号源阻抗高时先做阻抗变换）；<strong>③需要放大时用仪用放大器</strong>或三运放结构，输出接单端 ADC。电流采样还可以用<strong>开尔文走线</strong>：从采样电阻焊盘内侧引出检测线，避免主回路铜皮压降混入测量——这是「伪差分」思想在 layout 上的落地。</p>
        <ArticleFigure src="images/knowledge/analog-devices/vref-kelvin-ina240.webp" fullSrc="images/knowledge/analog-devices/vref-kelvin-ina240-hd.jpg" alt="INA240 开尔文连接 DO/DON'T" caption="图 9-7：从采样电阻焊盘内侧引出检测线（DO）；用主回路铜皮兼作检测线（DON'T）会引入压降误差。" sourcePage="37" />
        <aside className="article-callout"><strong>面试要点：</strong>差分抗共模、跟随器抗分压失真、开尔文抗引线压降——三者的本质都是「别让无用的阻抗落在测量路径上」。</aside>
      </section>

      <section id="vref-applications">
        <h2>参考电压的典型应用</h2>
        <p>基准源/参考电压在数电与模电里都大量出现，模电对它的要求更高（直接影响 ADC/DAC 精度）。五个典型场景：</p>
        <div className="application-list">
          <article><h3>① DDR 的 VREFCA/VREFDQ</h3><p>DDR3 判决电平参考：VREFCA 供命令/地址（自刷新期间也必须维持），VREFDQ 供数据（除自刷新外必须维持），标称 VDDQ/2=0.75V（SSTL15），判别门限围绕 VREF±AC 噪声/±DC 误差分布。</p></article>
          <article><h3>② CMOS 传感器特殊电压轨</h3><p>图像传感器除常规电源外还有大量小电流、高精度、低噪声的参考/像素电压轨（VDDPIX、VDRH/VDRL、VTX 等），常由 DAC+运放或数控电位器生成。</p></article>
          <article><h3>③ ADC/DAC 的基准输入</h3><p>Vref 决定 FSR：如 AD7192 使用差分基准输入 REFIN1±。型号后缀必须分清：AD5683 只接受外部基准；带 R 后缀的 AD5683R 才集成 2.5V 基准，并可按配置把 VREF 作为基准输入或输出。</p></article>
          <article><h3>④ 运放偏置电压</h3><p>低侧电流检测要测双向电流时，给检测输出叠加 Vs/2=1.65V 偏置，防负电压超出 ADC 量程——图 2-1 用跟随器缓冲 1.65V，图 2-2 用戴维南等效（20k/20k 分压≈1.65V、内阻 10k）。</p></article>
          <article><h3>⑤ 电源反馈基准</h3><p>反激电源次级反馈 = 电阻分压取样 + TLV431 基准比较 + 光耦隔离，基准源是稳压环路的「尺子」。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/analog-devices/vref-offset-1p65-thevenin.webp" fullSrc="images/knowledge/analog-devices/vref-offset-1p65-thevenin-hd.jpg" alt="1.65V 偏置的两种差分放大方案" caption="图 2-1：跟随器缓冲的模拟地基准 + 输入保护二极管；图 2-2：本地戴维南等效基准（R3/R6=20k/20k → 1.65V）。" sourcePage="43" />
        <ArticleFigure src="images/knowledge/analog-devices/vref-flyback-tlv431.webp" fullSrc="images/knowledge/analog-devices/vref-flyback-tlv431-hd.jpg" alt="反激电源的 TLV431+光耦反馈" caption="Si3404 POE 反激拓扑：红框内 R1/R2 分压取样 + TLV431 基准 + 光耦反馈。" sourcePage="43" />
      </section>

      <section id="vref-circuits">
        <h2>参考电压生成电路</h2>
        <p>按成本与精度递进，常用七种方案：</p>
        <div className="application-list">
          <article><h3>① 电阻分压</h3><p>成本最低，但带载即掉压：电流越大 Vref 越低，只能给几乎不吃电流的场合。</p></article>
          <article><h3>② 电阻分压 + 运放跟随</h3><p>跟随器高输入阻抗/低输出阻抗，支持约 ±30mA 推拉电流且输出不随负载变化；配数控电位器（如 AD5254+LT6220）还能 I2C 数控调压（实例：给传感器生成 2.0~4.0V 可调轨）。</p></article>
          <article><h3>③ DAC + 运放</h3><p>电压数控可调，适合即时可调或多路参考。电压输出 DAC 的缓冲器通常可以 source 和 sink 电流，但能力、线性度和稳定性取决于具体 VOUT 负载条件；外加运放时再按所需电流、摆幅、SR、建立时间与容性负载选型。</p></article>
          <article><h3>④ PWM + RC 滤波（+运放）</h3><p>占空比 D 的 PWM 经 RC 滤波得 V≈3.3×D（50% → 1.65V），成本最低的可数控方案；缺点是输出不精确、纹波大（实测波形可见波动），要电流能力还得加运放。</p></article>
          <article><h3>⑤ DDR 专用电源芯片</h3><p>TPS51200 一类同时输出 VTT 端接电源与 VTTREF 参考（REFIN 引脚设电压），是 DDR 供电的专用解。</p></article>
          <article><h3>⑥ TL431 可调基准</h3><p>三脚（K 阴极/R 参考/A 阳极）可调齐纳：内部是基准+运放+三极管负反馈，R 脚阈值 2.5V。成本低、输出 2.5~36V，精度 1%（也有 0.5%/2%）。VKA=Vref(1+R1/R2)+Iref×R1，Iref≈2µA 可忽略时 VKA≈2.5×(1+R1/R2)。</p></article>
          <article><h3>⑦ 专用基准源芯片</h3><p>高精度低温漂：初始精度低于 1%（高至 0.1%）、温漂低于 10ppm/℃；常见输出 1.25/2.048/2.5/4.096/5V，部分可调或 IIC 配置。对比：开关电源/LDO 直接做参考精度约 ±5%，1% 电阻分压约 ±2%。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/analog-devices/vref-digipot-lt6220.webp" fullSrc="images/knowledge/analog-devices/vref-digipot-lt6220-hd.jpg" alt="数控电位器+运放的可调参考电压" caption="AD5254 数控电位器分压 + LT6220 跟随：I2C 可调的 2.0~4.0V 传感器参考轨。" sourcePage="44" />
        <ArticleFigure src="images/knowledge/analog-devices/vref-pwm-rc-scope.webp" fullSrc="images/knowledge/analog-devices/vref-pwm-rc-scope-hd.jpg" alt="PWM 经 RC 滤波的实测波形" caption="CH1：3.3V PWM；CH2：10kΩ+0.1µF 滤波后的近似直流（≈1.65V），可见残余纹波。" sourcePage="45" />
        <h3>TL431 深入：公式与设计例</h3>
        <p>TL431 的工作原理：内部运放比较 R 脚电压与 2.5V 内部基准，调节 K-A 间三极管开度——R 脚偏低则收拢抬高 K 脚电压，偏高则开大压低 K 脚；K 脚经分压电阻接回 R 脚构成负反馈稳压。</p>
        <ArticleFigureGroup
          figures={[
            { src: "images/knowledge/analog-devices/vref-tl431-pinout-app.webp", fullSrc: "images/knowledge/analog-devices/vref-tl431-pinout-app-hd.jpg", alt: "TL431 引脚与典型应用", caption: "K/R/A 三脚定义与 R1/R2 分压典型应用：R 脚阈值=内部 Vref=2.5V。", sourcePage: "46" },
            { src: "images/knowledge/analog-devices/vref-tl431-internal.webp", fullSrc: "images/knowledge/analog-devices/vref-tl431-internal-hd.jpg", alt: "TL431 内部等效原理图", caption: "图 8-1：内部基准 + 运放 + 三极管负反馈——本质是一个 2.5V 的误差放大器。", sourcePage: "46" }
          ]}
        />
        <div className="formula-block"><figcaption>TL431 输出电压公式</figcaption><div className="formula"><FormulaText text="V_{KA}=V_{ref}×(1+R_1/R_2)+I_{ref}×R_1 ≈ 2.5V×(1+R_1/R_2)" /></div><p>完整式含基准输入电流项 Iref（typ 1.5~2µA / max 4µA）；精度要求不高时可忽略。应用 A（R 脚直连 VKA）输出恒 2.5V。</p></div>
        <p>设计例：12V 输入、输出 5V 参考电压。约束来自 datasheet：VKA 建议 Vref~36V、连续阴极电流 IKA 1~100mA（&lt;1mA 稳不住，取目标 10mA 控制发热）。</p>
        <ArticleFigure src="images/knowledge/analog-devices/vref-tl431-12v-5v.webp" fullSrc="images/knowledge/analog-devices/vref-tl431-12v-5v-hd.jpg" alt="TL431 12V 转 5V 设计例" caption="R100 限流供电，R101/R102 分压取样，I1=Iout+IKA+I2：负载轻时多余电流全部由 TL431 吸收。" sourcePage="48" />
        <WorkedExample
          title="TL431 设计：12V→5V 参考源"
          given={["输入 12V，输出 5V 参考电压", "TL431：IKA 1~100mA（目标 10mA），Iref≈2µA，VKA<36V"]}
          calculation={["R1/R2 分压比：5V=2.5×(1+R1/R2) → R1/R2=1，取 R101=R102=4.7kΩ（R100 的 5~10 倍，兼顾发热与 Iref 误差）", "Iref 误差 = 2µA×4.7k ≈ 9.4mV，可忽略", "R100=(12−5)V/10mA=700Ω → 取 680Ω；功率 0.01²×680=0.068W → 0805（1/8W 降额一半）", "I2=5V/9.4k≈0.51mA，I1=7V/680=10.29mA", "最大输出电流 Iout(max)=I1−I2−IKA(min)=10.29−0.51−1≈8.78mA"]}
          verification={["核对三只电阻功率（0402 的 1/16W 对 R101/R102 的 0.0012W 足够）", "IKA≥1mA 保证稳压；轻载时 IKA 增大吸收多余电流", "输出接 DAC/ADC 参考脚时确认负载 <8.78mA"]}
          answer="TL431 设计四步：分压比定输出、Iref 误差校核、限流电阻算阻值与功率、用 I1=Iout+IKA+I2 核最大带载能力（本例 8.78mA）。"
        />
        <p>专用基准源的最后一块拼图是远端检测：ADR3425（2.5V、±0.1%、8ppm/℃、源 10mA/吸 3mA）这类芯片提供 VOUT FORCE/SENSE 与 GND FORCE/SENSE 引脚，按<strong>开尔文接法</strong>在负载端取样，长走线压降不进入误差；供电需高于输出至少 200mV，输入 1µF+0.1µF、输出 0.1µF 去耦。</p>
        <ArticleFigure src="images/knowledge/analog-devices/vref-adr34xx-application.webp" fullSrc="images/knowledge/analog-devices/vref-adr34xx-application-hd.jpg" alt="ADR34xx 基本应用电路" caption="VIN 2.7~5.5V（≥Vout+200mV）+ 1µF/0.1µF；FORCE/SENSE 四线制接负载端，输出电容贴近 VOUT FORCE。" sourcePage="50" />
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>如何系统性提高 ADC 采样精度？</summary><p>先做误差预算：量程、ENOB、偏移、增益、INL、噪声和基准；再核对采样电容建立时间与源阻抗，必要时延长采样或加合适的缓冲/RC；最后规划连续回流路径、供电去耦、差分/开尔文连接、热源距离，并按器件手册决定接地方式。</p></details>
          <details><summary>差分输入为什么抗干扰？有哪些实现方式？</summary><p>两根线拾取的共模干扰在接收端减法时被抵消，尤其适合长距离传输。实现：①差分 ADC 直采（LTC2385 + RC 低通）；②双运放分别同相跟随再做差分；③需放大时用仪放/三运放结构；电流采样用开尔文走线（伪差分）消除引线压降。</p></details>
          <details><summary>列出你知道的参考电压生成方案及适用场景。</summary><p>①电阻分压（最便宜、几乎不带载）；②分压+运放跟随（±30mA，可配数控电位器）；③DAC+运放（数控可调、成本高）；④PWM+RC 滤波（最低成本数控、精度差纹波大）；⑤DDR 专用电源（TPS51200 出 VTT/VTTREF）；⑥TL431（2.5~36V 可调、1% 精度、mA 级）；⑦专用基准芯片（0.1%、低于 10ppm/℃、FORCE/SENSE 远端检测）。</p></details>
          <details><summary>推导 TL431 的输出电压公式。</summary><p>R 脚电压=内部基准 2.5V 时平衡：VKa 经 R1/R2 分压再叠加 Iref 在 R1 上的压降，VKA=Vref(1+R1/R2)+Iref×R1；Iref≈2µA 很小，忽略后 VKA≈2.5×(1+R1/R2)。应用 A（R 脚直连阴极）固定输出 2.5V。</p></details>
          <details><summary>TL431 设计 12V→5V 参考源，电阻怎么取？</summary><p>输出 5V → R1/R2=1，取两只 4.7kΩ（Iref 误差 2µA×4.7k≈9mV 可忽略）；限流电阻按 IKA 目标 10mA：R=(12−5)/10mA=700Ω→680Ω，功率 0.068W 选 0805；最大带载 Iout=I1−I2−IKA(min)≈8.78mA，IKA 必须 &gt;1mA 否则失稳。</p></details>
          <details><summary>为什么高精度 ADC 的参考要用基准源芯片而不是 LDO 或分压？</summary><p>基准源芯片初始精度低于 1%（高至 0.1%）、温漂低于 10ppm/℃、调整率 ppm 级；LDO/开关电源输出精度约 ±5%，1% 电阻分压约 ±2% 且叠加电源误差与负载效应。Vref 的误差直接乘进每一次转换结果，是精度的根。</p></details>
          <details><summary>基准源的 FORCE/SENSE 引脚有什么用？</summary><p>四线制开尔文接法：FORCE 输出参考电压，SENSE 在负载端直接取样反馈，长 PCB 走线的压降被补偿在外；GND SENSE 同理就近接负载地。输出电容贴近 VOUT FORCE，SENSE 线按开尔文方式走。</p></details>
        </div>
      </section>
    </>
  );
}
