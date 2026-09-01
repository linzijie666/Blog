import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function AdcPrimerArticle() {
  return (
    <>
      <section id="conversion">
        <h2>ADC 的功能与转换过程</h2>
        <p>单片机、SOC、FPGA 都是数字芯片，只认得逻辑 0/1，而温度、压力、电压这些物理量是时间与数值都连续的模拟量。<strong>ADC 的功能就是把时间连续、数值连续的物理量，变成时间离散、数值二进制的数字量</strong>：时间上离散的周期由采样率决定，数值上的位数由分辨率决定。</p>
        <ArticleFigure src="images/knowledge/analog-devices/adc-sh-quantize-encode.webp" fullSrc="images/knowledge/analog-devices/adc-sh-quantize-encode-hd.jpg" alt="S/H 采样保持 + 量化编码链路" caption="模拟信号 → 采样保持（S/H）→ 量化编码 → 数字输出，四个环节构成一次转换。" sourcePage="21" />
        <p>转换过程分四步：</p>
        <div className="application-list">
          <article><h3>采样</h3><p>把连续信号在时间上离散化。<strong>采样频率必须大于信号最高频率的 2 倍</strong>（香农采样定理），否则高频成分被错误折叠成低频（混叠），信号失真。</p></article>
          <article><h3>保持</h3><p>采样与量化之间保持采样值稳定，给量化留出转换时间。</p></article>
          <article><h3>量化</h3><p>把幅值也离散化到有限电平上，涉及分辨率、量化误差、测量精度。</p></article>
          <article><h3>编码</h3><p>把离散电平转成标准二进制码输出给主芯片。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/analog-devices/adc-sampling-quantize-diagram.webp" fullSrc="images/knowledge/analog-devices/adc-sampling-quantize-diagram-hd.jpg" alt="采样与量化编码示意图" caption="左：vI 连续信号与 vS 采样保持阶梯；右：0~1V 分 8 层的量化编码对照表（数电课本）。" sourcePage="22" />
        <p>用一个具体例子把分辨率、LSB 和码值串起来（Xilinx UG480，0-1V 量程 12bit ADC）：</p>
        <div className="formula-block"><figcaption>12bit / 0~1V 的码值换算</figcaption><div className="formula"><FormulaText text="LSB=1V/2^{12}=1V/4096=244µV" /></div><p>数字量 D 对应电压 D×LSB：0.244mV~0.488mV → 码 001（Hex 001）；最大码 FFF 对应 999.75mV = Vref − 1LSB——<strong>ADC 输出达不到满量程电压</strong>，差恰好 1LSB。</p></div>
        <ArticleFigure src="images/knowledge/analog-devices/adc-transfer-curve-12bit.webp" fullSrc="images/knowledge/analog-devices/adc-transfer-curve-12bit-hd.jpg" alt="12bit ADC 传输特性曲线" caption="UG480：0~1V 量程 12bit 的码-电压阶梯，999.75mV 处为 Full Scale Transition。" sourcePage="23" />
      </section>

      <section id="architectures">
        <h2>SAR / FLASH / 流水线 / Σ-Δ</h2>
        <p><strong>逐次逼近 SAR</strong>（Successive Approximation Register）：内部是 DAC + 比较器，用二分法逼近——DAC 先输出量程一半与 VIN 比较，按高低逐位确定，直到差值小于 1LSB。以 1V 量程 6bit 为例：0.5V（Vin&gt;，记 1）→ 0.75V（记 0）→ 0.625V（记 1）→ … → 41/64V，得到输出码 101000。</p>
        <ArticleFigure src="images/knowledge/analog-devices/adc-sar-architecture.webp" fullSrc="images/knowledge/analog-devices/adc-sar-architecture-hd.jpg" alt="SAR ADC 结构与二分逼近波形" caption="SAR = DAC + 比较器 + 控制逻辑；波形展示 1/2→3/4→5/8→…的二分搜索过程。" sourcePage="23" />
        <p>SAR 优点：结构简单、尺寸小、功耗低；缺点：速率慢——n 位要比较 n 轮，每轮含 DAC 建立、比较与逻辑延时。</p>
        <p><strong>FLASH 型</strong>：电阻分压产生 2^n 量级的比较电平，2^n 个比较器同时比较、一次编码输出。3bit FLASH 用 9 个分压电阻（2^3+1）+ 8 个比较器（2^3）。</p>
        <ArticleFigure src="images/knowledge/analog-devices/adc-flash-architecture.webp" fullSrc="images/knowledge/analog-devices/adc-flash-architecture-hd.jpg" alt="3bit FLASH ADC 结构" caption="FLASH：分压链 + 2^n 比较器阵列 + 编码器，单周期完成转换（fastest，但分辨率受限）。" sourcePage="24" />
        <p>FLASH 优点：转换速度最快、延迟最低；缺点：分辨率低——比较器数量随位数指数增长，一般 ≤10bit（教科书注：常限于 6bit、1~2GS/s 应用）。</p>
        <p><strong>流水线型</strong>（Pipeline）：n 位 ADC 分成多级，每级做一次 1bit（或多位）粗转换、做差、剩余误差放大 2 倍传给下一级；各级同时工作，像流水线一样吞吐。</p>
        <ArticleFigure src="images/knowledge/analog-devices/adc-pipeline-architecture.webp" fullSrc="images/knowledge/analog-devices/adc-pipeline-architecture-hd.jpg" alt="流水线 ADC 架构" caption="每级 S/H + 1bit ADC + 1bit DAC + ×2 残差放大器；4bit 例：0.4V → 码 0110。" sourcePage="26" />
        <div className="formula-block"><figcaption>流水线单级递推</figcaption><div className="formula"><FormulaText text="V_{next}=(V_{in}-D×0.5)×2" /></div><p>4bit/1V 例（Vin=0.4V）：V1=(0.4−0)×2=0.8 → V2=(0.8−0.5)×2=0.6 → V3=(0.6−0.5)×2=0.2 → V4=(0.2−0)×2，各级输出码拼成 0110；扩展 8 级得 01100110=102，102/256≈0.398≈Vin。</p></div>
        <p>流水线优点：采样率与精度均衡；缺点：转换延迟较长（n 级流水），首结果要等 n 个周期。</p>
        <p><strong>Σ-Δ 型</strong>（Sigma-Delta）：模拟部分只有简单的调制器，靠<strong>过采样 + 数字滤波 + 抽取</strong>把量化噪声搬到带外滤除，实现极高分辨率（最高 24~32bit）；代价是采样率低、延迟大、功耗不低，适合高精度低速测量。</p>
        <ArticleFigure src="images/knowledge/analog-devices/adc-sigma-delta-architecture.webp" fullSrc="images/knowledge/analog-devices/adc-sigma-delta-architecture-hd.jpg" alt="Σ-Δ ADC 框图" caption="模拟调制器 → 数字滤波 → 抽取器：过采样把量化噪声推到带外，数字滤波器滤除。" sourcePage="27" />
        <ArticleFigure src="images/knowledge/analog-devices/adc-architecture-compare.webp" fullSrc="images/knowledge/analog-devices/adc-architecture-compare-hd.jpg" alt="四种 ADC 架构优缺点对比表" caption="SAR：简单省电；FLASH：最快但 ≤10bit；流水线：速度精度均衡；Σ-Δ：精度最高但速率低。" sourcePage="27" />
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <caption>四种 ADC 架构优缺点对比</caption>
            <thead><tr><th scope="col">架构</th><th scope="col">优点</th><th scope="col">缺点</th><th scope="col">典型应用</th></tr></thead>
            <tbody>
              <tr><th scope="row">逐次逼近 SAR</th><td>架构简单尺寸小、功耗小</td><td>分辨率与速率有限</td><td>通用采集、低成本（应用最多）</td></tr>
              <tr><th scope="row">FLASH</th><td>转换速度最高、延迟最低</td><td>分辨率最低 ≤10bit、规模 2^n 暴涨</td><td>高速示波/通信前端</td></tr>
              <tr><th scope="row">流水线</th><td>采样率与精度较为均衡</td><td>延迟较高</td><td>视频、通信基带</td></tr>
              <tr><th scope="row">Σ-Δ</th><td>精度最高（24~32bit）</td><td>采样率低、延迟高</td><td>精密测量、音频（高精度首选）</td></tr>
            </tbody>
          </table>
        </div>
        <WorkedExample
          title="SAR 二分逼近推码"
          given={["1V 量程、6bit SAR ADC，输入 Vin=0.64V"]}
          calculation={["第 1 位：DAC=0.5V，0.64>0.5 → 1", "第 2 位：DAC=0.75V，0.64<0.75 → 0", "第 3 位：DAC=0.625V，0.64>0.625 → 1", "第 6 位：DAC=41/64=0.640625V，0.64<0.640625 → 0", "输出码 101000"]}
          verification={["101000=40，40/64=0.625V≈Vin（误差 <1LSB）", "共需 6 次比较，每轮一次 DAC 建立+比较"]}
          answer="SAR 就是二分搜索：每位一次比较，n 位 n 拍；会画 1/2、3/4、5/8 的台阶图就能推出任意码。"
        />
      </section>

      <section id="resolution-lsb">
        <h2>FSR、分辨率、LSB 与误差</h2>
        <p><strong>量程 FSR</strong>（full-scale range）：有单端 0~Vref 的（如 STM32 内置 ADC 0~3.3V），也有关于 0V 对称的差分量程（如 ADS1115 的 ±0.256V~±6.144V）。<strong>分辨率 Resolution</strong>：量化位数，常见 8/12/14/16bit。</p>
        <ArticleFigure src="images/knowledge/analog-devices/adc-lsb-fsr-table.webp" fullSrc="images/knowledge/analog-devices/adc-lsb-fsr-table-hd.jpg" alt="ADS1115 量程与 LSB 对照表" caption="ADS1115（16bit）：LSB=FSR/2^16，量程越小 LSB 越小——±6.144V 时 187.5µV，±0.256V 时 7.8125µV。" sourcePage="29" />
        <div className="formula-block"><figcaption>三个基本换算</figcaption><div className="formula"><FormulaText text="LSB=FSR/2^N，电压=数字量×LSB" /></div><p>12bit/3.3V：LSB=0.806mV，数字量 2048 → 1.65V，4095 → 3.299V（差 1LSB 到 Vref）。同一颗 ADC，把量程从 3.3V 改成 1.65V 测 0~1V 信号，精度直接翻倍。</p></div>
        <p><strong>测量误差</strong> ≠ LSB：LSB 是理想线性的理论分辨率，实际 ADC 还有：</p>
        <div className="application-list">
          <article><h3>量化误差</h3><p>量化过程固有，理想 ±1/2 LSB。</p></article>
          <article><h3>偏移误差 OE 与增益误差 GE</h3><p>传输曲线整体平移（OE）与斜率偏差（GE）；满量程误差 = GE + OE。</p></article>
          <article><h3>DNL / INL</h3><p>微分非线性：实际步距偏离 1LSB 的程度；INL 是 DNL 累积出的最大曲线偏离。</p></article>
          <article><h3>TUE 与温漂</h3><p>总不可调整误差，加上温度漂移项（µV/°C、ppm/°C）。</p></article>
          <article><h3>ENOB 有效位数</h3><p>考虑噪声、失真、时钟抖动后的实际动态分辨率，随输入频率升高而下降。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/analog-devices/adc-offset-gain-error.webp" fullSrc="images/knowledge/analog-devices/adc-offset-gain-error-hd.jpg" alt="偏移与增益误差的传输曲线" caption="理想/实际/校正后三条传输线：Gain Error = Full-scale Error − Offset Error。" sourcePage="30" />
        <ArticleFigure src="images/knowledge/analog-devices/adc-enob-table.webp" fullSrc="images/knowledge/analog-devices/adc-enob-table-hd.jpg" alt="AD9238 ENOB 参数表" caption="12bit 的 AD9238：输入 2.4MHz 时 ENOB 11.4~11.5bit，100MHz 时降到 10.9~11.1bit。" sourcePage="31" />
      </section>

      <section id="sampling-interface">
        <h2>采样速率、带宽与接口</h2>
        <p><strong>采样速率</strong>（SPS，每秒采样次数）与<strong>转换速率</strong>（每秒完成转换的次数）不是一回事，大部分 ADC 采样率 ≤ 转换率；AD9280 两者同为 32MSPS。更易混淆的是<strong>带宽</strong>：模拟输入衰减 −3dB（降到 0.7 倍）对应的频率——AD9280 带宽 300MHz，而采样率只有 32MSPS，<strong>带宽和采样率、转换速率不是一个概念</strong>。</p>
        <ArticleFigure src="images/knowledge/analog-devices/adc-bandwidth-vs-rate.webp" fullSrc="images/knowledge/analog-devices/adc-bandwidth-vs-rate-hd.jpg" alt="AD9280 输入带宽参数" caption="AD9280：8bit/32MSPS，Input Bandwidth(−3dB) 300MHz——带宽远高于采样率。" sourcePage="31" />
        <p><strong>参考电压 Vref</strong> 决定量程：转换结果正比于输入与 Vref 之比，Vref 不准则一切不准。高精度场合用基准源芯片，低精度用电阻分压即可。<strong>通道数</strong>一般 1~4 路：ADS1114 两路（可做一路差分）、ADS1115 四路（可做两路差分）。</p>
        <ArticleFigure src="images/knowledge/analog-devices/adc-channel-interface.webp" fullSrc="images/knowledge/analog-devices/adc-channel-interface-hd.jpg" alt="ADS1114/ADS1115 通道与接口框图" caption="AIN0~AIN3 经 MUX/PGA 进 ADC，I2C 接口输出：通道可配单端或差分。" sourcePage="32" />
        <p><strong>对外接口</strong>按速度选：</p>
        <div className="application-list">
          <article><h3>IIC</h3><p>低速。ADS1115：16bit×860SPS ≈ 14Kbps 数据带宽，IIC 快速模式 400Kbps 绰绰有余。</p></article>
          <article><h3>并口</h3><p>中速。AD9280：8bit×32MSPS=256Mbps，用 8 根数据线 D0~D7 并行传输。</p></article>
          <article><h3>LVDS</h3><p>高速。HMCAD1511：8bit×1GSPS=8Gbps，8 对 LVDS、每对 500MHz 双沿采样 =1Gbps。</p></article>
        </div>
        <p><strong>输入阻抗</strong>：独立 ADC 一般可达 MΩ 级（ADS1115 共模输入阻抗 3~100MΩ、差分 710kΩ~22MΩ，随量程变化）；单片机内置 ADC 只有 kΩ 级——这直接决定了要不要加运放缓冲（见运放应用篇）。</p>
        <ArticleFigure src="images/knowledge/analog-devices/adc-input-impedance.webp" fullSrc="images/knowledge/analog-devices/adc-input-impedance-hd.jpg" alt="ADS1115 输入阻抗参数表" caption="ADS1115 共模输入阻抗 3~100MΩ、差分 710kΩ~22MΩ（随 FSR 变化）——独立 ADC 远高于 MCU 内置 ADC。" sourcePage="34" />
        <WorkedExample
          title="选一颗采集电池电压的 ADC"
          given={["电池 0~4.2V，要求分辨率 1mV，MCU 为 STM32F103", "已有 16bit IIC ADC（ADS1115）一颗"]}
          calculation={["1mV/4.2V → 至少 12bit（4.2/4096≈1mV），16bit 更富余", "量程匹配：FSR 设 ±4.096V，LSB=125µV，覆盖 4.2V 差分测量", "ADS1115 860SPS 对慢变电池电压足够；IIC 带宽 14Kbps 充裕"]}
          verification={["确认输入阻抗 MΩ 级不干扰被测对象", "Vref/基准精度换算到 LSB 误差", "或直接用 STM32 内置 12bit ADC+分压/跟随器方案对比成本"]}
          answer="选型口诀：先量程后位数再速率——FSR 盖住信号、LSB 小于精度要求、采样率按信号带宽 ×2 以上，最后核对接口与输入阻抗。"
        />
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>ADC 的转换过程分几步？</summary><p>采样 →（保持）→ 量化 → 编码。采样把时间离散化（采样率&gt;2 倍信号带宽，防混叠）；保持让量化期间样值稳定；量化把幅值离散化（涉及分辨率、量化误差）；编码输出标准二进制。</p></details>
          <details><summary>四种 ADC 架构的优缺点和应用？</summary><p>SAR：结构简单、功耗低、速率与分辨率有限——通用采集最常用；FLASH：最快、延迟最低，比较器 2^n 规模限制分辨率 ≤10bit；流水线：速度与精度均衡、延迟 n 级；Σ-Δ：过采样+数字滤波，精度最高 24~32bit，速率低。低成本选 SAR，高精度选 Σ-Δ，超高速选 FLASH/流水线。</p></details>
          <details><summary>12bit、3.3V 量程的 ADC，LSB 是多少？最大码对应多少伏？</summary><p>LSB=3.3V/4096≈0.806mV；最大码 4095 对应 3.3V−1LSB≈3.299V——ADC 输出达不到满量程电压，恒差 1LSB。</p></details>
          <details><summary>ADC 的误差参数有哪些？</summary><p>量化误差（±1/2LSB 理想值）、偏移误差 OE、增益误差 GE（GE=满量程误差−OE）、微分非线性 DNL、积分非线性 INL（DNL 累积）、总误差 TUE、温漂，以及反映实际动态精度的 ENOB。</p></details>
          <details><summary>采样率和带宽有什么区别？</summary><p>采样率是每秒采样/转换次数（决定能处理多快的信号）；带宽是模拟输入 −3dB 衰减对应的频率（决定能看多快的信号边沿）。AD9280 采样率 32MSPS、带宽 300MHz——带宽远高于采样率，两者不是一个概念。</p></details>
          <details><summary>低速 ADC 用 IIC、高速 ADC 用什么接口？为什么？</summary><p>接口带宽 ≥ 分辨率×采样率：ADS1115 16bit×860SPS≈14Kbps，IIC 够用；AD9280 8bit×32MSPS=256Mbps，用 8 位并口；HMCAD1511 8Gbps 用 8 对 LVDS（每对 500MHz 双沿采样 1Gbps）。接口跟着数据带宽走。</p></details>
        </div>
      </section>
    </>
  );
}
