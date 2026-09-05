import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function OpampBasicsArticle() {
  return (
    <>
      <section id="virtual-short-ground">
        <h2>虚短、虚断与虚地</h2>
        <p>运放电路计算的全部秘密浓缩在三个「虚」字上：</p>
        <div className="application-list">
          <article><h3>虚短（Virtual Short）</h3><p>运放工作在负反馈线性放大状态时，输出会自动调整；理想模型写作 <FormulaText text="V_{IN+}=V_{IN-}" />，真实电路只是近似相等。实际输入差压不只来自失调电压 Vos：有限开环增益还需要约 <FormulaText text="V_{OUT}/A_{OL}" /> 的差压来产生输出，并叠加偏置、噪声和温漂等误差。</p></article>
          <article><h3>虚断（Virtual Open）</h3><p>运放输入阻抗非常大（几十 MΩ 以上），流入 IN+/IN− 的电流近似为 0：<FormulaText text="I_{IN+}=I_{IN-}=0" />。实际存在的输入电流就是输入偏置电流 IB 与失调电流 Ios，一般 nA~µA 级。</p></article>
          <article><h3>虚地（Virtual Ground）</h3><p>当 IN+ 接地时，由虚短推知 IN− 电位也是 0V——但它并没有真正接 GND，所以叫虚地。反相类电路（反相放大、反相加法、微分积分）计算的核心。</p></article>
        </div>
        <p>用两颗真实运放感受一下「虚短」的误差量级：LM358 是 mV 级失调的通用运放，LT1678 是 µV 级失调的精密运放。</p>
        <ArticleFigureGroup
          figures={[
            { src: "images/knowledge/analog-devices/opamp-lm358-vos-datasheet.webp", fullSrc: "images/knowledge/analog-devices/opamp-lm358-vos-datasheet-hd.jpg", alt: "LM358 失调电压参数表", caption: "LM358 失调电压 typ 2~3mV / max 7~9mV，温漂 typ 7µV/°C——mV 级「虚短」误差。", sourcePage: "3" },
            { src: "images/knowledge/analog-devices/opamp-lt1678-vos-datasheet.webp", fullSrc: "images/knowledge/analog-devices/opamp-lt1678-vos-datasheet-hd.jpg", alt: "LT1678 失调电压参数表", caption: "LT1678 失调电压 typ 35µV / max 100µV，比 LM358 好两个数量级；近轨工作时显著增大。", sourcePage: "3" }
          ]}
        />
        <p>虚断的误差量级看输入电流：LT1678 的输入偏置电流 ±2/±20nA、失调电流 4/25nA——对 MΩ 级信号源也要掂量压降；LM358 的 IB 则是 20~250nA 级。</p>
        <ArticleFigure src="images/knowledge/analog-devices/opamp-bias-current-table.webp" fullSrc="images/knowledge/analog-devices/opamp-bias-current-table-hd.jpg" alt="LM358 输入偏置电流参数表" caption="LM358 输入偏置电流 typ 20nA / max 150~250nA——「虚断」并非真的零电流。" sourcePage="8" />
        <aside className="article-callout"><strong>面试要点：</strong>虚短的本质是负反馈的自动调整能力，虚断的本质是输入阻抗大，虚地由虚短 + 同相端接地推理而来。概念要结合运放特性记忆，并亲手推导每种基本电路才算掌握。</aside>
      </section>

      <section id="calc-applications">
        <h2>在计算中的应用</h2>
        <p>以最经典的反相放大电路（《运算放大器权威指南》图 2-7）演示三件套怎么用：VIN 经 Rg 接 IN−，Rf 从 IN− 反馈到输出，IN+ 接地。</p>
        <ArticleFigure src="images/knowledge/analog-devices/gain-inverting-amp.webp" fullSrc="images/knowledge/analog-devices/gain-inverting-amp-hd.jpg" alt="反相放大电路（图 2-7）" caption="VIN—Rg—IN−，Rf 反馈，IN+ 接地：虚地让节点 VE=0V，I1=I2。" sourcePage="12" />
        <div className="formula-block"><figcaption>反相放大推导（虚短虚断三步）</figcaption><div className="formula"><FormulaText text="V_{IN+}=0 → V_{IN-}=V_{IN+}=0（虚短+虚地）" /></div><p>虚断：<FormulaText text="I_B=0 → I_1=I_2" />，而 <FormulaText text="I_1=V_{IN}/R_g" />；输出 <FormulaText text="V_{OUT}=V_{IN-}-I_2×R_f=-V_{IN}×R_f/R_g" />。增益只由电阻比决定。</p></div>
        <p>记住这个套路：先设输入条件 → 虚短定节点电压 → 虚断列节点电流方程 → 解出 Vout。同相放大、加法、减法全部如此。</p>
        <WorkedExample
          title="反相放大器输出计算"
          given={["反相放大电路：Rg=1kΩ，Rf=10kΩ", "输入 VIN=0.5V 直流，运放为理想运放"]}
          calculation={["虚短虚地：VIN− = VIN+ = 0V", "虚断：I1 = VIN/Rg = 0.5V/1k = 0.5mA，I2 = I1", "VOUT = 0 − I2×Rf = −0.5mA×10k = −5V"]}
          verification={["增益 −Rf/Rg = −10，输出 −5V 一致", "检查输出摆幅是否超出供电范围", "实际运放需考虑 Vos、IB 引入的偏移"]}
          answer="反相放大 VOUT = −VIN×Rf/Rg；三步就是虚地定 0V、虚断定电流相等、欧姆定律出结果。"
        />
      </section>

      <section id="parameters">
        <h2>运放关键参数解读</h2>
        <p>选型就是读 datasheet。以 ST LM358（通用双运放，DIP-8/SOP-8：1Out1、2In1−、3In1+、4GND、5In2+、6In2−、7Out2、8VCC+）为主线逐项看参数：</p>
        <ArticleFigure src="images/knowledge/analog-devices/opamp-lm358-pinout.webp" fullSrc="images/knowledge/analog-devices/opamp-lm358-pinout-hd.jpg" alt="LM358 引脚定义" caption="LM358 双运放引脚：两路运放共用电源，VCC+ 单电源 3~30V 或双电源 ±1.5~±15V。" sourcePage="5" />
        <div className="application-list">
          <article><h3>供电电压（绝对值 vs 工作电压）</h3><p>绝对最大：单电源 32V / 双电源 ±16V，超过可能损坏；推荐工作：单电源 3~30V（双电源 ±1.5~±15V）。两个值都要看，留降额。</p></article>
          <article><h3>轨到轨（Rail to Rail）</h3><p>输出幅值能否到达供电轨。3.3V 供电的轨到轨运放可输出接近 3.3V，非轨到轨只能到约 2.6V。LM358 非轨到轨：VCC=30V 时 VOH 仅 26~28V；LT1678 则明确 Rail-to-Rail Input and Output。</p></article>
          <article><h3>开环差模增益 Ad</h3><p>理想无穷大；实际用 dB 表示 <FormulaText text="Gain=20×log(A_d)" />。LM358 约 85~120dB，随电源电压与负载变化。</p></article>
          <article><h3>单位增益频率 fT 与闭环带宽</h3><p>fT 是开环增益曲线降到 1 倍（0dB）的频率；闭环带宽通常指相对低频闭环增益下降 3dB 的频率。对单主极点电压反馈运放可近似 <FormulaText text="f_{BW}≈GBW/噪声增益" />，但仍要核对环路增益和稳定性，不能把 GBW/f 当作任意频率下保证可用的闭环增益。</p></article>
          <article><h3>压摆率 SR</h3><p>输出电压的最大变化速率 <FormulaText text="SR=dV/dt" />（V/µs），决定大信号跟随能力。LM358 typ 0.6V/µs；压摆率不够时正弦变三角、方波边沿变斜坡。带宽/GBP 反映小信号能力，SR 反映大信号能力。</p></article>
          <article><h3>CMRR 与 PSRR</h3><p>共模抑制比 <FormulaText text="CMRR=20×log(A_d/A_c)" /> 衡量共模变化折算到输入端的误差；运放 PSRR 通常也按输入折算，描述电源变化引起的输入失调变化，常用 µV/V 或 dB 表示。输出端出现多少电源纹波还取决于噪声增益、闭环与频率。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/analog-devices/opamp-lt1678-cover.webp" fullSrc="images/knowledge/analog-devices/opamp-lt1678-cover-hd.jpg" alt="LT1678 手册封面" caption="LT1678/LT1679：轨到轨输入输出、3.9nV/√Hz 低噪声精密运放——与 LM358 的参数对比代表了通用与精密两档。" sourcePage="6" />
        <ArticleFigureGroup
          figures={[
            { src: "images/knowledge/analog-devices/opamp-openloop-gain.webp", fullSrc: "images/knowledge/analog-devices/opamp-openloop-gain-hd.jpg", alt: "LM358 开环增益与电源电压关系", caption: "Figure 11：开环增益随电源电压与负载变化（RL=2kΩ 时明显低于 RL=20kΩ）。", sourcePage: "6" },
            { src: "images/knowledge/analog-devices/opamp-openloop-bode.webp", fullSrc: "images/knowledge/analog-devices/opamp-openloop-bode-hd.jpg", alt: "LM358 开环频率响应", caption: "Figure 2：增益随频率以 −20dB/十倍频下降，0dB 交点即单位增益带宽约 1.1MHz。", sourcePage: "7" }
          ]}
        />
        <p>压摆率的实测口径见下图：电压跟随器输入 1→3.5V 阶跃，输出边沿约 10µs 爬完 2.5V，即 <FormulaText text="SR=2.5V/10µs=0.25V/µs" />（datasheet 标称 0.6V/µs 是更理想的测试条件）。</p>
        <ArticleFigure src="images/knowledge/analog-devices/opamp-slew-rate-response.webp" fullSrc="images/knowledge/analog-devices/opamp-slew-rate-response-hd.jpg" alt="LM358 电压跟随器脉冲响应" caption="Figure 4：阶跃响应边沿决定压摆率，负载电容越大 SR 越低。" sourcePage="9" />
        <p>CMRR/PSRR 不是常数：下图 TI 手册中 LM358 的 CMRR 从 1kHz 的约 90dB 一路降到 1MHz 的约 45dB，PSRR− 在高频掉得更狠——电源上的高频纹波更容易窜到输出。</p>
        <ArticleFigure src="images/knowledge/analog-devices/opamp-cmrr-psrr-freq.webp" fullSrc="images/knowledge/analog-devices/opamp-cmrr-psrr-freq-hd.jpg" alt="LM358 CMRR/PSRR 随频率变化" caption="图 6-13/6-14：CMRR、PSRR 随频率与温度变化，高频段指标大幅劣化。" sourcePage="10" />
      </section>

      <section id="ideal-vs-real">
        <h2>理想运放与选型侧重</h2>
        <p>把理想运放的「无穷大/零」和实际运放对上号，计算时才知道什么时候能忽略什么：</p>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <caption>理想运放与实际运放的参数对照</caption>
            <thead><tr><th scope="col">参数</th><th scope="col">理想运放按</th><th scope="col">实际运放</th></tr></thead>
            <tbody>
              <tr><th scope="row">输入失调电压 Vos / 失调电流 Ios / 偏置电流 IB</th><td>0</td><td>LM358：mV 级 / nA 级；精密运放 µV / nA 级</td></tr>
              <tr><th scope="row">输入阻抗</th><td>无穷大</td><td>几十 MΩ 以上</td></tr>
              <tr><th scope="row">开环增益 Ad</th><td>无穷大</td><td>85~120dB（LM358）</td></tr>
              <tr><th scope="row">带宽 / GBP</th><td>无穷大</td><td>约 1.1MHz（LM358）</td></tr>
              <tr><th scope="row">CMRR / PSRR</th><td>无穷大</td><td>65~100dB，随频率下降</td></tr>
              <tr><th scope="row">压摆率 SR</th><td>无穷大</td><td>0.3~0.6V/µs（LM358）</td></tr>
            </tbody>
          </table>
        </div>
        <p>没有一颗运放每个参数都优秀，选型按电路需求排优先级：</p>
        <div className="application-list">
          <article><h3>差分放大</h3><p>关注 CMRR——共模抑制能力直接决定检测精度。</p></article>
          <article><h3>小信号精密放大</h3><p>关注 Vos 与温漂——失调被放大后就是输出偏移。</p></article>
          <article><h3>高阻信号源</h3><p>关注 IB 与 Ios——偏置电流流过信号源内阻就是误差电压。</p></article>
          <article><h3>高频信号</h3><p>关注带宽与 GBP——闭环增益下要留足带宽余量。</p></article>
          <article><h3>低频大幅值</h3><p>关注 SR 与轨到轨——压摆率不足波形畸变，输出摆幅不够削顶。</p></article>
        </div>
        <WorkedExample
          title="先判断 100kHz 放大需求能否实现"
          given={["信号幅值 ±2V、频率 100kHz，需放大 10 倍", "信号源内阻 100kΩ，供电 5V 单电源"]}
          calculation={["题设要求输出峰值 ±20V；5V 单电源无论是否轨到轨都无法实现，必须先修改供电、增益或输入幅值", "若改用足够的双电源，100kHz、20Vpeak 正弦所需 SR≥2π×100k×20≈12.57V/µs", "噪声增益 10 时，闭环带宽与建立精度还要求 GBW 留足环路增益裕量；100kΩ 源阻抗要求低 IB 输入级"]}
          verification={["先核对输出 ±20V 与供电轨、负载下输出摆幅和器件绝对额定值", "确认 SR≥12.57V/µs 并留畸变裕量", "再核对 100kHz 下的闭环增益误差、相位裕量、共模范围、IB、Vos 和噪声"]}
          answer="先做可实现性检查：本题 5V 单电源不可能输出 ±20V。修正供电或信号幅值后，再按闭环带宽、12.57V/µs 以上压摆率、输入偏置和精度逐项选型。"
        />
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>什么是虚短、虚断、虚地？成立条件是什么？</summary><p>虚短是高开环增益、负反馈且输出在线性区时 VIN+≈VIN−；虚断来自输入阻抗很大、输入电流很小，本身不以负反馈为前提；虚地是在虚短条件下把一端固定到地后得到的近似节点。</p></details>
          <details><summary>实际运放的哪些参数对应「虚短虚断」的误差？</summary><p>输入差压包含有限开环增益所需的 VOUT/AOL，并叠加 Vos、噪声与温漂；输入端还存在偏置电流 IB 和失调电流 Ios。源阻抗越大，输入电流造成的压降越明显。</p></details>
          <details><summary>带宽和增益带宽积有什么区别？</summary><p>开环曲线的 0dB 交点是单位增益频率 fT；闭环带宽是指定闭环增益相对低频值下降 −3dB 的频率。单主极点电压反馈运放可近似 fBW≈GBW/噪声增益，但还必须校核环路增益与稳定性。</p></details>
          <details><summary>压摆率不足会怎样？和带宽是一回事吗？</summary><p>不是一回事。带宽/GBP 反映小信号高频放大能力；压摆率 SR=dV/dt 反映大信号输出边沿的爬升速度。SR 不足时大幅值正弦变三角波、方波边沿变斜坡。估算正弦不失真条件：SR ≥ 2π×f×Vpeak。</p></details>
          <details><summary>什么是轨到轨运放？为什么重要？</summary><p>输入或输出电压可以到达供电轨的运放。3.3V 供电时轨到轨输出能接近 3.3V，非轨到轨只能到约 2.6V（如 LM358 在 30V 供电时输出最高 27~28V）。低压单电源系统必须关注，否则动态范围被砍。</p></details>
          <details><summary>CMRR、PSRR 定义是什么？选型时什么时候重点关注？</summary><p>CMRR 描述共模变化折算到输入端的误差；运放 PSRR 通常描述电源变化造成的输入失调变化，可用 µV/V 或 dB 表示。差分小信号重点看 CMRR，供电变化大时重点看 PSRR；输出纹波还与噪声增益和频率有关。</p></details>
        </div>
      </section>
    </>
  );
}
