import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function OpampCircuitsArticle() {
  return (
    <>
      <section id="follower">
        <h2>同相电压跟随</h2>
        <p>跟随器是输出直接反馈到 IN− 的同相放大特例（增益 1）：<FormulaText text="V_{out}=V_{in}" />。它的价值不在放大而在<strong>阻抗变换</strong>——输入阻抗高达几十 MΩ、输出阻抗极低，是「高阻信号源 → 低阻负载」之间的标准缓冲级（ADC/DAC 接口篇会反复用到）。</p>
        <ArticleFigure src="images/knowledge/analog-devices/gain-voltage-follower.webp" fullSrc="images/knowledge/analog-devices/gain-voltage-follower-hd.jpg" alt="同相电压跟随器电路" caption="U1.1：VIN 进同相端，输出全反馈到反相端，Vout=Vin。" sourcePage="11" />
      </section>

      <section id="non-inverting">
        <h2>同相比例放大</h2>
        <p>图 2-6：VIN 进 IN+，Rf 反馈、Rg 接地。推导照旧三步：虚短 <FormulaText text="V_{IN-}=V_{IN+}=V_{IN}" />；虚断下 Rg、Rf 串联分压 <FormulaText text="V_{IN-}=V_{OUT}×R_g/(R_f+R_g)" />；联立得：</p>
        <div className="formula-block"><figcaption>同相比例放大</figcaption><div className="formula"><FormulaText text="V_{OUT}=V_{IN}×(1+R_f/R_g)" /></div><p>增益恒 ≥ 1（输出必定高于输入），极性同相，只由电阻比决定。</p></div>
        <ArticleFigure src="images/knowledge/analog-devices/gain-noninverting-amp.webp" fullSrc="images/knowledge/analog-devices/gain-noninverting-amp-hd.jpg" alt="同相放大电路（图 2-6）" caption="VIN 进 IN+，Rf/Rg 分压反馈到 IN−，增益 1+Rf/Rg。" sourcePage="11" />
        <p>注意输入阻抗特性：同相结构的输入信号直接进 IN+，<strong>输入阻抗极高</strong>（几十 MΩ 级），适合接高阻信号源。</p>
      </section>

      <section id="inverting">
        <h2>反相比例放大</h2>
        <p>图 2-7：VIN 经 Rg 进 IN−，IN+ 接地，Rf 反馈。虚短 + 虚地给出 IN−=0V，<FormulaText text="I_1=V_{IN}/R_g=I_2" />，于是：</p>
        <div className="formula-block"><figcaption>反相比例放大</figcaption><div className="formula"><FormulaText text="V_{OUT}=-V_{IN}×R_f/R_g" /></div><p>输出与输入相位相反，幅值由电阻比决定；负号就是「反相」的全部含义。</p></div>
        <ArticleFigure src="images/knowledge/analog-devices/gain-inverting-amp.webp" fullSrc="images/knowledge/analog-devices/gain-inverting-amp-hd.jpg" alt="反相放大电路（图 2-7）" caption="VIN 经 Rg 进 IN−（虚地），Rf 反馈，VOUT=−VIN·Rf/Rg。" sourcePage="12" />
        <aside className="article-callout"><strong>面试要点：</strong>反相放大电路的输入阻抗低——由于虚地，输入信号相当于通过 Rg 接到 GND，输入阻抗就是 Rg（kΩ 级），远小于同相结构的几十 MΩ。信号源内阻大时要加跟随器缓冲。</aside>
      </section>

      <section id="sum-diff">
        <h2>加法与减法电路</h2>
        <p><strong>反相加法电路</strong>（图 2-8）是反相放大的扩展：多路输入 V1~VN 各经 R1~RN 汇到虚地节点，虚断下 <FormulaText text="I_f=I_1+I_2+…+I_N" />：</p>
        <div className="formula-block"><figcaption>反相加法</figcaption><div className="formula"><FormulaText text="V_{OUT}=-R_f×(V_1/R_1+V_2/R_2+…+V_N/R_N)" /></div><p>当 R1=R2=…=RN 时，<FormulaText text="V_{OUT}=-(R_f/R_1)×(V_1+V_2+…+V_N)" />，输出正比于输入之和。</p></div>
        <ArticleFigure src="images/knowledge/analog-devices/gain-summing-amp.webp" fullSrc="images/knowledge/analog-devices/gain-summing-amp-hd.jpg" alt="反相加法器电路（图 2-8）" caption="多路输入经电阻汇入虚地节点，If=I1+I2+…+IN，输出为加权和。" sourcePage="12" />
        <p><strong>减法电路（差分放大）</strong>（图 2-9）：V1 经 R1/R2 分压进 IN+，V2 经 R3 进 IN−、R4 反馈。有两种算法：</p>
        <ArticleFigure src="images/knowledge/analog-devices/gain-difference-amp.webp" fullSrc="images/knowledge/analog-devices/gain-difference-amp-hd.jpg" alt="差分放大器（图 2-9）" caption="V1 分压进同相端，V2 反相端输入：输出正比于 (V1−V2)。输入阻抗低，由 R1~R4 决定。" sourcePage="13" />
        <div className="formula-block"><figcaption>方法一：虚短虚断直接算</figcaption><div className="formula"><FormulaText text="V_{IN+}=V_1×R_2/(R_1+R_2)，I_3=I_4" /></div><p>当 R1=R3、R2=R4 时化简为 <FormulaText text="V_{OUT}=(V_1-V_2)×R_2/R_1" />。</p></div>
        <div className="formula-block"><figcaption>方法二：叠加定理（更简洁）</figcaption><div className="formula"><FormulaText text="V_{OUT}=V_1×R_2/R_1+(-V_2×R_4/R_3)=(V_1-V_2)×R_2/R_1" /></div><p>V1 单独作用时是同相放大，V2 单独作用时是反相放大；叠加即得。要能理解叠加定理的用法。</p></div>
        <p>注意：差分放大电路的输入阻抗也低（由 R1~R4 决定，kΩ 级），用于精密测量时通常前面加跟随器，或直接选仪用放大器。</p>
        <WorkedExample
          title="差分放大输出计算（叠加定理）"
          given={["R1=R3=1kΩ，R2=R4=10kΩ", "V1=2.5V，V2=2.0V"]}
          calculation={["V1 单独作用（V2 置 0）：V+=V1·R2/(R1+R2)，为同相放大结构，VOUT1=V1·R2(R3+R4)/[R3(R1+R2)]=V1·R2/R1=25V", "V2 单独作用（V1 置 0）：V+=0 即虚地，为反相放大，VOUT2=−V2·R4/R3=−20V", "叠加：VOUT=VOUT1+VOUT2=(V1−V2)·R2/R1=0.5V×10=5V"]}
          verification={["虚短虚断直接法结果一致", "检查共模输入范围与输出摆幅", "电阻失配会引入共模误差，取 1% 精度"]}
          answer="配对电阻下差分放大 VOUT=(V1−V2)×R2/R1；叠加定理把电路拆成一个同相放大加一个反相放大，是最快的笔试算法。"
        />
      </section>

      <section id="diff-integral">
        <h2>微分与积分</h2>
        <p><strong>微分电路</strong>（图：C 串联输入、R 反馈）：虚地 + 虚断下电容电流 <FormulaText text="I_C=C×dV_{IN}/dt" /> 全部流过 R：</p>
        <div className="formula-block"><figcaption>微分电路</figcaption><div className="formula"><FormulaText text="V_{OUT}=-RC×dV_{IN}/dt" /></div><p>输出正比于输入的变化率：方波输入在边沿处输出正负尖峰，随后指数衰减回 0。</p></div>
        <ArticleFigureGroup
          figures={[
            { src: "images/knowledge/analog-devices/gain-differentiator.webp", fullSrc: "images/knowledge/analog-devices/gain-differentiator-hd.jpg", alt: "微分电路原理图", caption: "VIN—C—虚地节点—R—VOUT，IN+ 经 R1 1kΩ 平衡接地。", sourcePage: "14" },
            { src: "images/knowledge/analog-devices/gain-differentiator-wave.webp", fullSrc: "images/knowledge/analog-devices/gain-differentiator-wave-hd.jpg", alt: "微分电路方波响应波形", caption: "反相微分器满足 VOUT=−RC·dVIN/dt：方波上升沿出负尖峰，下降沿出正尖峰。若原图极性相反，应核对其是否为无源 RC 微分电路。", sourcePage: "14" }
          ]}
        />
        <p><strong>积分电路</strong>（R 串联输入、C 反馈）：虚地下 <FormulaText text="I_R=V_{IN}/R" /> 给电容充电：</p>
        <div className="formula-block"><figcaption>积分电路</figcaption><div className="formula"><FormulaText text="V_{OUT}=-(1/RC)×∫_{t1}^{t2}V_{IN}dt" /></div><p>依据电容的通用关系 i=C·dU/dt、U=(1/C)∫i dt。方波积分成三角波，正弦积分成余弦（移相 90°）。</p></div>
        <ArticleFigureGroup
          figures={[
            { src: "images/knowledge/analog-devices/gain-integrator.webp", fullSrc: "images/knowledge/analog-devices/gain-integrator-hd.jpg", alt: "积分电路原理图", caption: "VIN—R—虚地节点—C—VOUT，Uc 即输出（左正右负）。", sourcePage: "15" },
            { src: "images/knowledge/analog-devices/gain-integrator-wave.webp", fullSrc: "images/knowledge/analog-devices/gain-integrator-wave-hd.jpg", alt: "积分电路输入输出波形", caption: "阶跃→斜坡、方波→三角波、正弦→余弦（移相 90°）。", sourcePage: "15" }
          ]}
        />
        <p>笔试重点排序：跟随、比例、加法、减法常考且必须会算；微分积分考察较少，记住结构与波形对应关系即可。</p>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>电压跟随器有什么用？</summary><p>增益为 1 的同相缓冲：输入阻抗几十 MΩ、输出阻抗极低，用于高阻信号源与低阻负载之间的隔离，如 NTC 分压后接 ADC、DAC 输出驱动长线缆前加一级跟随增强驱动。</p></details>
          <details><summary>同相放大和反相放大的输入阻抗有什么区别？</summary><p>同相放大输入直接进 IN+，输入阻抗极高（几十 MΩ）；反相放大因虚地，输入阻抗等于 Rg（kΩ 级）。高阻信号源选同相结构，或先加跟随器。</p></details>
          <details><summary>写出四种基本电路的输出公式。</summary><p>同相：Vout=Vin(1+Rf/Rg)；反相：Vout=−Vin·Rf/Rg；反相加法：Vout=−Rf·Σ(Vi/Ri)（等阻值时 =−Rf/R1·ΣVi）；差分（R1=R3、R2=R4）：Vout=(V1−V2)·R2/R1。</p></details>
          <details><summary>减法电路有哪两种计算方法？</summary><p>①虚短虚断直接列方程：V+=V1·R2/(R1+R2)，虚断下 I3=I4，化简得 (V1−V2)·R2/R1；②叠加定理：V1 单独作用为同相放大、V2 单独作用为反相放大，输出叠加。叠加法更简洁。</p></details>
          <details><summary>积分电路输入方波输出什么？微分呢？</summary><p>积分：方波→三角波，正弦→余弦（移相 90°），阶跃→线性斜坡；微分：方波边沿→正负尖峰。微分 Vout=−RC·dVIN/dt，积分 Vout=−(1/RC)∫VINdt。</p></details>
          <details><summary>为什么说「输出电压仅与电阻阻值有关」？</summary><p>在虚短虚断成立的线性区，增益公式里只出现电阻比，与运放自身参数（Ad、GBP 等）无关——这是负反馈的威力；代价是要求运放开环增益远大于闭环增益、带宽足够。</p></details>
        </div>
      </section>
    </>
  );
}
