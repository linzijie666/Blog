import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function LinearRegulatorArticle() {
  return (
    <>
      <section id="principle">
        <h2>LDO 内部结构：误差放大器与调整管</h2>
        <p>LDO（Low Dropout Regulator，低压差线性稳压器）的本质是一个<strong>负反馈的压控可变电阻</strong>：误差放大器比较基准电压 <FormulaText text="V_{REF}" /> 与反馈分压采样到的输出电压，实时调整功率管的导通程度，把输出“顶”在设定值上。因为调整管工作在线性区而非开关状态，所以叫线性稳压源。</p>
        <ArticleFigure src="images/knowledge/power-supplies/ldo-nmos-block.webp" fullSrc="images/knowledge/power-supplies/ldo-nmos-block-hd.jpg" alt="NMOS 型 LDO 内部功能框图" caption="NMOS 型 LDO 内部：误差放大器 + NMOS 调整管，配合电荷泵、限流、热关断与 Active Discharge。" sourcePage="21" />
        <p>输出电压由外部反馈电阻设定，芯片内部只负责基准与放大：</p>
        <div className="formula-block"><figcaption>输出电压设定</figcaption><div className="formula"><FormulaText text="V_{OUT}=V_{REF}×(1+R_1/R_2)" /></div><p>FB 引脚接 R1/R2 分压点；固定输出版本把分压电阻做在片内，只需输入、输出滤波电容和 EN 控制。以 <FormulaText text="V_{FB}=0.8V" /> 为例，取 R1=30.9kΩ、R2=10kΩ（1% 精度），输出 <FormulaText text="0.8×(30.9/10+1)≈3.27V" />。</p></div>
        <ArticleFigure src="images/knowledge/power-supplies/ldo-fb-divider.webp" fullSrc="images/knowledge/power-supplies/ldo-fb-divider-hd.jpg" alt="LDO 反馈分压电路与输出电压公式" caption="VIN 经调整管到负载，R1/R2 分压送回 FB 引脚，VREF 接误差放大器同相端。" sourcePage="21" />
        <p>理解 NMOS 调整管的工作点，可以借 NMOS 的输出特性曲线：横轴 Vds（对应 LDO 的输入输出压差），纵轴 Id（负载电流）。输入输出压差小的时候管子工作在可变电阻区（图中 A 点附近），压差小、损耗低；压差被拉大后进入饱和区（B 点附近），同样的电流下损耗 <FormulaText text="P=V_{DS}×I_D" /> 急剧增加。输入电压波动时，误差放大器反向调节 Vgs，把工作点拉回设定值——这就是负反馈稳压的物理过程。</p>
        <ArticleFigure src="images/knowledge/power-supplies/ldo-nmos-iv.webp" fullSrc="images/knowledge/power-supplies/ldo-nmos-iv-hd.jpg" alt="NMOS 输出特性曲线与 LDO 工作点" caption="NMOS Ids-Vds 曲线：LDO 尽量把工作点维持在低 Vds 的可变电阻区，压差越大损耗越大。" sourcePage="22" />
      </section>

      <section id="pmos">
        <h2>PMOS 型 LDO 与两种结构对比</h2>
        <p>PMOS 型 LDO 把调整管换成 PMOS：源极接 VIN、漏极接输出，误差放大器把栅极往低拉即导通。它不需要高于输入电压的栅极驱动，也就省掉了 NMOS 型里的电荷泵，电路更简单、静态电流更小；但 PMOS 的导通电阻随 Vgs 减小而变大，在低压差、低输入电压下性能不如 NMOS 型，输出电容的 ESR 匹配也更敏感。</p>
        <ArticleFigure src="images/knowledge/power-supplies/ldo-pmos-topology.webp" fullSrc="images/knowledge/power-supplies/ldo-pmos-topology-hd.jpg" alt="PMOS 型 LDO 电路结构" caption="PMOS 型 LDO：源极接 VIN，栅极由误差放大器驱动，同样靠 R1/R2 分压反馈。" sourcePage="23" />
        <ArticleFigure src="images/knowledge/power-supplies/ldo-pmos-iv.webp" fullSrc="images/knowledge/power-supplies/ldo-pmos-iv-hd.jpg" alt="PMOS 输出特性曲线" caption="PMOS 输出特性（Vgs 为负值）：Vgs 绝对值越大导通越充分。" sourcePage="23" />
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <caption>NMOS 型与 PMOS 型 LDO 对比</caption>
            <thead>
              <tr>
                <th scope="col">维度</th>
                <th scope="col">NMOS 型</th>
                <th scope="col">PMOS 型</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">压差表现</th><td>导通电阻小，可做到更低 dropout</td><td>低压差下 Rds(on) 增大，dropout 相对较大</td></tr>
              <tr><th scope="row">驱动需求</th><td>需要电荷泵/外部 BIAS 抬升栅极，多一个引脚</td><td>误差放大器直接驱动，无需额外电源域</td></tr>
              <tr><th scope="row">静态电流</th><td>稍大（电荷泵工作）</td><td>小，适合电池供电</td></tr>
              <tr><th scope="row">稳定性</th><td>输出电容 ESR 范围宽</td><td>对输出电容容量/ESR 敏感，需按手册取值</td></tr>
              <tr><th scope="row">典型应用</th><td>大电流、超低压差供电轨</td><td>小电流、低成本、电池后级</td></tr>
            </tbody>
          </table>
        </div>
        <aside className="article-callout"><strong>一句话对比：</strong>NMOS 型牺牲静态电流换来更低压差，PMOS 型用简单结构换低成本低功耗——回答时给出取舍逻辑即可。</aside>
      </section>

      <section id="thermal">
        <h2>效率、损耗与温升计算</h2>
        <p>线性稳压的输出电流全部流过调整管，输入输出压差全部变成热，所以效率近似等于输出/输入电压比：</p>
        <div className="formula-block"><figcaption>LDO 效率与热损耗</figcaption><div className="formula"><FormulaText text="η≈V_{OUT}/V_{IN}　　P_D=(V_{IN}-V_{OUT})×I_{OUT}+V_{IN}×I_Q" /></div><p>例如 5V 输入 3.3V 输出效率仅 66%；12V 直接降到 3.3V 效率只剩 27.5%。静态电流 <FormulaText text="I_Q" /> 项在小电流电池应用时不可忽略。</p></div>
        <p>温升计算两步走：先算损耗，再乘热阻。AMS1117（SOT-223 封装）热阻 <FormulaText text="θ_{JA}=90°C/W" />、<FormulaText text="θ_{JC}=15°C/W" />：</p>
        <ArticleFigure src="images/knowledge/power-supplies/ldo-thermal-calc.webp" fullSrc="images/knowledge/power-supplies/ldo-thermal-calc-hd.jpg" alt="AMS1117 损耗与温升计算示例" caption="7.1.2 LDO 损耗与 7.1.3 LDO 温升：PD=(5−3.3)×0.5=0.85W，再按热阻算结温。" sourcePage="26" />
        <div className="formula-block"><figcaption>结温计算</figcaption><div className="formula"><FormulaText text="T_J=T_A+P_D×θ_{JA}=25+0.85×90≈101.5°C" /></div><p>Tjmax 一般 125℃，25℃ 环境下已经用掉大半裕量；若按封装表面温度 70℃ 和 <FormulaText text="θ_{JC}=15°C/W" /> 估算，<FormulaText text="T_J=70+0.85×15=82.75°C" />——铺铜散热直接决定热阻，<FormulaText text="θ_{JA}" /> 与焊接铜皮面积强相关。</p></div>
        <WorkedExample
          title="AMS1117 5V→3.3V/500mA 温升校核"
          given={["输入 5V，输出 3.3V，负载电流 500mA，静态电流约 5mA", "AMS1117 SOT-223：θJA=90°C/W，θJC=15°C/W，Tjmax=125℃"]}
          calculation={["热损耗 PD=(5−3.3)×0.5=0.85W（Iq 项 5V×5mA=0.025W，可忽略）", "按环境温度算：Tj=25+0.85×90=101.5℃", "按封装表面 70℃ 算：Tj=70+0.85×15=82.75℃"]}
          verification={["两种口径都低于 125℃，但 25℃ 口径裕量只有约 20℃", "加大铺铜面积或改 SOT-89/TO-252 封装可显著降低 θJA", "负载若升到 800mA，PD=1.36W，Tj≈147℃ 超限——必须降差或换 DC-DC"]}
          answer="我先算压差损耗，再用 θJA/θJC 两种口径估结温，结论是“能用但要铺铜、要控负载”——面试时给出裕量判断比只报一个温度更有说服力。"
        />
      </section>

      <section id="parameters">
        <h2>参数解读与选型</h2>
        <p>读 LDO datasheet 的顺序：先看 Absolute Maximum / Recommended Operating Conditions 划安全边界，再看输出电压档位与封装，最后核对压差、PSRR、静态电流和输出电容要求。</p>
        <ArticleFigure src="images/knowledge/power-supplies/ldo-selection-table.webp" fullSrc="images/knowledge/power-supplies/ldo-selection-table-hd.jpg" alt="WL2836 系列选型表" caption="WL2836 系列：0.8V~3.3V 固定输出档位，DFN1x1-4L 封装，按输出电压选具体型号。" sourcePage="42" />
        <p>固定输出版本的外围最简单：输入滤波电容 + 输出滤波电容 + EN 开关控制，datasheet 明确说“固定输出电压的 LDO 电路非常简洁，仅需输入滤波电容 + 输出滤波电容”。</p>
        <ArticleFigure src="images/knowledge/power-supplies/ldo-fixed-circuit.webp" fullSrc="images/knowledge/power-supplies/ldo-fixed-circuit-hd.jpg" alt="WL2836 固定输出 LDO 应用电路" caption="固定输出 LDO：VIN/VOUT 各 1µF 滤波，EN 由 ON/OFF 电平控制。" sourcePage="42" />
        <h3>关键参数逐个过</h3>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <caption>LDO 选型关键参数</caption>
            <thead>
              <tr>
                <th scope="col">参数</th>
                <th scope="col">含义</th>
                <th scope="col">选型要点</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">VIN/VOUT 范围</th><td>允许输入与可输出电压区间</td><td>输出档位固定版选型号、可调版算 FB 电阻</td></tr>
              <tr><th scope="row">Dropout 压差</th><td>维持稳压所需的最小 (VIN−VOUT)</td><td>按最大电流、低温端查 Dropout vs Temperature 曲线，VIN≥VOUT+Dropout</td></tr>
              <tr><th scope="row">PSRR</th><td><FormulaText text="20log(V_{IN-NOISE}/V_{OUT-NOISE})" />，对输入纹波的抑制</td><td>一般 &gt;50dB；查 PSRR vs Frequency 曲线，关注 10k~100kHz 最差点</td></tr>
              <tr><th scope="row">线性/负载调整率</th><td>输入或负载变化引起的输出漂移</td><td>单位 mV 或 %/V，精度要求高的基准供电重点核对</td></tr>
              <tr><th scope="row">静态电流 IQ</th><td>芯片自身消耗的输入电流</td><td>电池供电关键，注意关闭（EN=0）时的漏电流</td></tr>
              <tr><th scope="row">输出电容要求</th><td>稳定所需最小容量与 ESR 范围</td><td>MLCC 低温漂移导致容量衰减，按有效容量校核</td></tr>
            </tbody>
          </table>
        </div>
        <p>压差和 PSRR 都要看曲线而不是只看表格标称值：压差随负载电流增大、随温度变化；PSRR 在中高频段会跌落，这正是“LDO 滤不干净高频开关噪声”的原因。</p>
        <ArticleFigure src="images/knowledge/power-supplies/ldo-dropout-psrr.webp" fullSrc="images/knowledge/power-supplies/ldo-dropout-psrr-hd.jpg" alt="Dropout 与温度及 PSRR 与频率曲线" caption="Figure 9 压差随温度/负载变化；PSRR=20log(VIN-NOISE/VOUT-NOISE)，中高频段明显衰减。" sourcePage="44" />
        <p>可调输出版本还要算 FB 电阻：手册一般给出推荐阻值表，输出精度取决于电阻精度（1% 或更高）和 FB 偏置电流。</p>
        <ArticleFigure src="images/knowledge/power-supplies/ldo-params-table.webp" fullSrc="images/knowledge/power-supplies/ldo-params-table-hd.jpg" alt="TPS7A8001 参数表与推荐电阻表" caption="TPS7A8001：VFB=0.8V，按 Table 1 推荐 1% 电阻组合取值，30.9k+10k 输出约 3.27V。" sourcePage="45" />
      </section>

      <section id="circuit">
        <h2>LDO 电路设计与电源树</h2>
        <p>一个完整的可调 LDO 电路：输入滤波电容、FB 分压电阻、输出滤波电容、EN 上拉（或受控），再加上 NR/SS 软启动电容。下图 TPS7A8001 把 5V 电源降到 3.3V，反馈电阻 R20/R24=30.9k/10k，FB 基准 0.8V：</p>
        <ArticleFigure src="images/knowledge/power-supplies/ldo-power-circuit.webp" fullSrc="images/knowledge/power-supplies/ldo-power-circuit-hd.jpg" alt="TPS7A8001 5V 转 3.3V 完整电路" caption="5V→3.3V 可调 LDO：输入/输出滤波电容、FB 分压（FB=0.8V）、EN 与 EP 散热焊盘齐备。" sourcePage="46" />
        <h3>DC-DC 与 LDO 搭电源树</h3>
        <p>面试高频题：“给 12V 电源降到 3.3V 给 ADC 供电，怎么做？”直接用 LDO 效率只有 27.5%，0.5A 负载下损耗 4.35W，发热不可接受；直接用 DC-DC 纹波又可能超 ADC 指标。标准答案是 <strong>DC-DC 先降压 + LDO 二次稳压</strong>：</p>
        <div className="formula-block"><figcaption>两级电源树的效率账</figcaption><div className="formula"><FormulaText text="η_{DCDC}≈90%，η_{LDO}≈3.3/5=66%，η_{总}≈0.9×0.66≈59%" /></div><p>损耗由两颗芯片分摊且 LDO 承担大头：LDO 压差 (5−3.3)V×0.5A≈0.85W，90% 效率的 DC-DC 仅损耗约 0.28W，都远低于 12V 直降的 4.35W，同时利用 LDO 高 PSRR 把 DC-DC 残余纹波再压一档。更激进的接法是 DC-DC 先降到 3.5V 左右再 LDO，效率更高，但要给 DC-DC 纹波和 LDO 压差留足裕量。</p></div>
        <p>从等效模型看，DC-DC 与 LDO 级联就是两级储能与滤波环节串联，LDO 在末级把前级纹波“削平”：</p>
        <ArticleFigure src="images/knowledge/power-supplies/dcdc-ldo-model.webp" fullSrc="images/knowledge/power-supplies/dcdc-ldo-model-hd.jpg" alt="DC-DC 与 LDO 级联等效电路" caption="DC-DC+LDO 等效电路：L1/C1/L2/L3/C2 组成两级滤波，末级 LDO 负责低噪声输出。" sourcePage="56" />
        <aside className="article-callout"><strong>设计要点：</strong>LDO 输入必须始终高于 VOUT+Dropout（含 DC-DC 纹波谷值）；两级的软启动顺序用 EN 控制；敏感电路优先用 LDO 末级供电。</aside>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>LDO 的工作原理是什么？</summary><p>误差放大器把 FB 引脚采样电压与内部基准 VREF 比较，输出控制调整管的导通程度，形成负反馈；输出电压由 VREF×(1+R1/R2) 设定。调整管始终工作在线性区，相当于一个自动调节的压控电阻。</p></details>
          <details><summary>NMOS 型和 PMOS 型 LDO 有什么区别？</summary><p>NMOS 型导通电阻小、压差可以做得很低，但栅极需要高于输入的驱动电压，要内部电荷泵或外部 BIAS，静态电流稍大；PMOS 型无需升压驱动、电路简单静态电流小，但低压差性能弱一些且对输出电容 ESR 敏感。</p></details>
          <details><summary>LDO 效率怎么算？什么时候不适合用？</summary><p>效率≈VOUT/VIN。压差大、电流大的场合（比如 12V→3.3V/0.5A 损耗 4W 以上）发热无法接受，应该用 DC-DC 降压；LDO 适合小电流、压差小、对噪声敏感的供电。</p></details>
          <details><summary>PSRR 是什么？为什么 LDO 能滤掉开关电源纹波？</summary><p>PSRR=20log(VIN 纹波/VOUT 纹波)，表征对输入纹波的抑制能力，一般大于 50dB。因为调整管工作在线性区不产生开关动作，输出噪声本身很小，所以常放在 DC-DC 后级做二次稳压；注意 PSRR 在 10k~100kHz 段会明显衰减。</p></details>
          <details><summary>AMS1117 从 5V 转 3.3V、500mA 会不会过热？</summary><p>损耗 (5−3.3)×0.5=0.85W，SOT-223 的 θJA=90°C/W，25℃ 环境下结温约 101.5℃，接近 125℃ 上限。要加大铺铜散热、控制负载，或者换成压差更小的 DC-DC+LDO 组合。</p></details>
          <details><summary>多电源板子上怎么安排 DC-DC 和 LDO？</summary><p>大电流主轨用 DC-DC（5V、1.2V 核电等），敏感小电流轨（ADC、时钟、射频）用 LDO 从干净中间轨二次降压；用 EN/PG 或时序芯片安排上下电顺序，LDO 输入始终保证高于 VOUT+Dropout。</p></details>
        </div>
      </section>
    </>
  );
}
