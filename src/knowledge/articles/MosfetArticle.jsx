import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function MosfetArticle() {
  return (
    <>
      <section id="principle">
        <h2>MOS 管的结构与开关直觉</h2>
        <p>MOS 管是电压控制型器件：栅极通过电场控制漏源沟道，几乎不取静态电流。NMOS 在 <FormulaText text="V_{GS} > V_{GS(th)}" /> 后导通，PMOS 在 <FormulaText text="V_{GS} < V_{GS(th)}" />（负值）后导通；导通后表现为一个电阻 <FormulaText text="R_{DS(ON)}" />，而不是三极管那样的 0.3V 残压，这正是低阻开关场景的首选原因。</p>
        <div className="formula-block"><figcaption>开关状态判据</figcaption><div className="formula"><FormulaText text="NMOS：V_{GS} > V_{GS(th)} 导通　PMOS：V_{GS} < V_{GS(th)} 导通" /></div><p>MOS 管内部自带体二极管（漏源反向），防反与续流应用可以借它导通；栅极对源极是电容，开关要消耗栅极电荷 Qg。</p></div>
        <aside className="article-callout"><strong>面试主线：</strong>先讲“电压控制、阻性导通、容性栅极”三点，再展开具体电路。驱动设计的本质是给栅极电容充放电。</aside>
      </section>

      <section id="functions">
        <h2>七类典型功能</h2>
        <div className="application-list">
          <article><h3>逻辑反相与开关</h3><p>NMOS 替代三极管做低边开关：栅极高电平导通、输出拉低，低电平可到接近 0V，比三极管的 0.3V 饱和残压更低。</p></article>
          <article><h3>电平转换</h3><p>用 2N7002 搭建 IIC 双向电平转换：漏源可以双向导通，左侧电平必须低于右侧且能满足 Vgs 导通阈值。</p></article>
          <article><h3>电源防反</h3><p>PMOS 串在电源高边，体二极管先建立电压再完全导通。同样 12V/1A 工况，肖特基防反损耗约 0.5W，PMOS 只有 I²R ≈ 0.01W。</p></article>
          <article><h3>电源缓启动</h3><p>栅极 RC 控制导通过程，抑制上电浪涌电流，详见缓启动一节。</p></article>
          <article><h3>开关电源</h3><p>功率级首选 NMOS：RDS(ON) 小、开关速度快。小功率 DC-DC 把 MOS 集成在芯片内，大功率外置。</p></article>
          <article><h3>电机控制</h3><p>H 桥和三相桥全部由 MOS 管组成，配合 PWM 实现换向与调速，续流走体二极管。</p></article>
          <article><h3>恒流与恒压</h3><p>工作在线性区的 MOS 可以做压控电阻和恒流源；LDO 的调整管用 MOS 实现更低压差和更小的静态电流。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/semiconductor-devices/mos-iic-level-shift.webp" fullSrc="images/knowledge/semiconductor-devices/mos-iic-level-shift-hd.jpg" alt="2N7002 MOS 管搭建的 IIC 双向电平转换电路" caption="MOS 电平转换要求左侧电压域更低且能满足 NMOS 的 Vgs 阈值，否则电路无法工作。" sourcePage="38" />
      </section>

      <section id="compare">
        <h2>与三极管的区别及并联使用</h2>
        <p>两者最常被对比：MOS 是电压控制、容性栅极、阻性导通；三极管是电流控制、线性放大、饱和残压固定。温度特性上的差异直接决定了并联能力。</p>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <caption>MOS 管与三极管关键差异</caption>
            <thead>
              <tr>
                <th scope="col">维度</th>
                <th scope="col">MOS 管</th>
                <th scope="col">三极管</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">控制方式</th><td>栅极电压控制，静态几乎不耗电流</td><td>基极电流控制，需要持续驱动电流</td></tr>
              <tr><th scope="row">导通压降</th><td>RDS(ON)×ID，可低至毫欧级</td><td>饱和残压约 0.3V，与电流成正比损耗大</td></tr>
              <tr><th scope="row">温度特性</th><td>RDS(ON) 随结温升高而增大，负反馈</td><td>VBE 下降、β 上升，正反馈</td></tr>
              <tr><th scope="row">并联能力</th><td>强驱动欧姆区有静态均流趋势，仍需专门设计</td><td>通常需发射极均流电阻等措施</td></tr>
              <tr><th scope="row">驱动代价</th><td>每次开关消耗栅极电荷 Qg</td><td>导通期间持续消耗基极电流</td></tr>
            </tbody>
          </table>
        </div>
        <p>MOS 在栅极强驱动、欧姆区稳态导通时，RDS(ON) 的正温度系数有助于静态均流；这不能推广到线性区或开关瞬态。并联仍要评估 VGS(th)、Qg、寄生电感和散热差异，采用对称功率回路、独立栅极电阻和良好热耦合。线性工作点可能出现热失稳，必须按线性 SOA 单独校核。</p>
        <ArticleFigure src="images/knowledge/semiconductor-devices/mos-vs-bjt-temperature.webp" fullSrc="images/knowledge/semiconductor-devices/mos-vs-bjt-temperature-hd.jpg" alt="MOS 管导通电阻与三极管电流放大倍数随结温变化的曲线对比" caption="MOS 的 RDS(ON) 正温度系数是负反馈，三极管的 VBE/β 温漂是正反馈，决定并联能力差异。" sourcePage="46" />
      </section>

      <section id="soft-start">
        <h2>缓启动电源设计</h2>
        <p>直接开通 MOS 时栅极瞬间充满，负载电容和后级电容的充电电流会形成浪涌，可能让前级电压跌落。缓启动的思路是给栅极充电串一个 RC，让 MOS 在毫秒级时间内缓慢进入完全导通。</p>
        <p>典型 PMOS 高边缓启动电路：三极管控制 A 点电位，导通时栅极电容经 100K 电阻缓慢放电，<FormulaText text="V_{GS}" /> 逐渐超过阈值，主回路电流随沟道逐渐打开而上升。R×C 越大，缓启动时间越长。</p>
        <ArticleFigure src="images/knowledge/semiconductor-devices/mos-pmos-soft-start.webp" fullSrc="images/knowledge/semiconductor-devices/mos-pmos-soft-start-hd.jpg" alt="PMOS 缓启动电路与工作过程分析" caption="关断时 Vgs=0 截止；导通时栅极经 R30 缓慢充电，Vgs 缓慢达到 -12V 实现软启动。" sourcePage="40" />
        <p>仿真验证了电容取值的影响：栅源并 10µF 时负载电压约 2ms 建立完成，并 1µF 时约 300µs——电容越大缓启动越慢，实际电路要按浪涌目标和上级电源承受能力调试。</p>
        <ArticleFigure src="images/knowledge/semiconductor-devices/mos-soft-start-simulation.webp" fullSrc="images/knowledge/semiconductor-devices/mos-soft-start-simulation-hd.jpg" alt="PMOS 缓启动仿真电路与两种电容取值的波形对比" caption="栅源电容 10µF 与 1µF 对应约 2ms 与 300µs 的上电斜率，缓启动时间由 RC 决定。" sourcePage="50" />
        <aside className="article-callout"><strong>设计要点：</strong>PMOS 关断要把栅极拉回源极，使 VGS→0；这时栅极对地电压通常上升，不能照搬 NMOS 的“向地放电”说法。全过程都要保证 |VGS| 不超过额定值。</aside>
      </section>

      <section id="selection">
        <h2>参数、损耗与选型</h2>
        <p>选型先看三个基础参数：<strong>VDS 耐压</strong>（按母线电压尖峰留 20% 以上余量）、<strong>ID 电流</strong>（区分 25℃ 瞬时值与壳温下的连续值）、<strong>VGS(th)</strong>（阈值范围宽，驱动电平必须远超阈值才能进入低阻区）。再核对 RDS(ON)、栅极电荷 Qg、封装热阻和 SOA。</p>
        <p>损耗分三部分，高频大电流场景开关损耗往往超过导通损耗：</p>
        <div className="formula-block"><figcaption>MOS 管损耗组成</figcaption><div className="formula"><FormulaText text="P_{on} = I_D²·R_{DS(ON)}·D　P_{sw} = 0.5·V_{CC}·I_D·(t_r + t_f)·f_{sw}　P_{drive} = Q_g·V_{GS}·f_{sw}" /></div><p>导通损耗按占空比折算；开关损耗发生在电压电流交叠的上升下降沿；驱动损耗是栅极电荷在每个开关周期的充放电损耗。</p></div>
        <ArticleFigure src="images/knowledge/semiconductor-devices/mos-switching-loss.webp" fullSrc="images/knowledge/semiconductor-devices/mos-switching-loss-hd.jpg" alt="MOS 管开关时间参数表与开关损耗波形示意" caption="开关损耗由导通/关断时间和开关频率共同决定，datasheet 的 tr/tf 是计算输入。" sourcePage="55" />
        <WorkedExample
          title="Buck 功率级 MOS 管损耗校核"
          given={["母线 12V，负载电流 ID=5A，占空比按 100% 估算导通损耗", "RDS(ON)=10mΩ，tr=80ns，tf=92ns", "开关频率 fsw=400kHz，栅极电荷 Qg=15nC，驱动电压 10V"]}
          calculation={["导通损耗 Pon=5²×0.01×1=0.25W", "开关损耗 Psw=0.5×12×5×172ns×400kHz≈2.06W", "驱动损耗 Pdrive=15nC×10V×400kHz=0.06W", "总损耗 P≈2.4W，开关损耗占主导"]}
          verification={["核对 SOA：导通点 0.2V/5A 与关断点 12V/0A 均需落在对应脉冲时间的功率限制线内", "按热阻估算结温：TJ=TA+P×θJA，需低于 150℃ 并留余量", "若频率降到 100kHz，Psw 降到约 0.52W——频率与损耗的权衡要写进设计说明", "确认驱动电路能在目标频率下提供足够的栅极电流"]}
          answer="我先算导通、开关、驱动三部分损耗，判断高频场景下开关损耗主导；再校核 SOA 和结温，给出频率、封装或并联的优化方向，而不是只报一个 RDS(ON)。"
        />
      </section>

      <section id="soa">
        <h2>SOA 安全工作区</h2>
        <p>SOA（Safe Operating Area）由 4~5 条限制线围成，MOS 管的（VDS, ID）工作点必须落在区域内部：</p>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <caption>SOA 五条限制线</caption>
            <thead>
              <tr>
                <th scope="col">限制线</th>
                <th scope="col">物理来源</th>
                <th scope="col">要点</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">RDS(ON) 限制线</th><td>特定温度和 VGS 下的导通电阻</td><td>左侧斜线，欧姆定律约束</td></tr>
              <tr><th scope="row">电流限制线</th><td>封装与键合线的最大脉冲电流</td><td>关注的是瞬时电流 ID(max)</td></tr>
              <tr><th scope="row">功率限制线</th><td>电流电压乘积恒定</td><td>不同导通时间对应多条斜线</td></tr>
              <tr><th scope="row">热稳定性限制线</th><td>芯片内部温度不均引发热正反馈</td><td>超出可能热失控损坏</td></tr>
              <tr><th scope="row">击穿电压限制线</th><td>VDS 最大耐压</td><td>垂直右边界</td></tr>
            </tbody>
          </table>
        </div>
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/semiconductor-devices/mos-soa.webp", fullSrc: "images/knowledge/semiconductor-devices/mos-soa-hd.jpg", alt: "MOS 管 SOA 安全工作区由五条限制线围成", caption: "SOA 的功率限制线按单脉冲时间区分：导通时间越长，允许的电流电压乘积越小。", sourcePage: "58" },
          { src: "images/knowledge/semiconductor-devices/mos-soa-selection.webp", fullSrc: "images/knowledge/semiconductor-devices/mos-soa-selection-hd.jpg", alt: "按 SOA 曲线校核 MOS 管工作点的选型实例", caption: "12V 关断、0.2V/3A 导通的工作点落在 SOA 内；若开关时间拉长到 100ms 则越界。", sourcePage: "59" }
        ]} />
        <p>校核方法：记录开关、缓启动或故障限制期间完整的 VDS-ID 轨迹，而不是只查关断与稳态导通两个端点；把轨迹按实际脉宽标到对应 SOA 曲线上，并结合初始结温、重复率、瞬态热阻和板级散热降额。周期性脉冲不能只靠占空比换成“等效单脉冲”，应使用厂商给出的重复脉冲 SOA/热阻模型；线性工作还要确认器件明确支持该模式。</p>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>MOS 管和三极管最核心的区别是什么？</summary><p>MOS 是电压控制、容性栅极、阻性导通（RDS(ON)），静态驱动不耗电流；三极管是电流控制、饱和残压约 0.3V、需要持续基极电流。温度特性一负一正，进一步决定并联能力。</p></details>
          <details><summary>MOS 管并联为什么仍要专门设计？</summary><p>RDS(ON) 正温度系数只帮助强驱动欧姆区的稳态均流。开关瞬态和线性区还受阈值、栅极电荷、寄生参数和热耦合影响；需要对称布局、独立栅极电阻、相同散热条件，并逐段检查 SOA。</p></details>
          <details><summary>缓启动电路的时间由什么决定？</summary><p>由栅极 RC 决定：R×C 越大，VGS 建立越慢，负载电压上升越缓。仿真显示 10µF 约 2ms、1µF 约 300µs，需结合上级电源的浪涌承受能力调试。</p></details>
          <details><summary>SOA 曲线怎么用来判断器件可用？</summary><p>把完整的 VDS-ID 轨迹按实际脉宽与初始温度映射到 SOA，而非只看端点；重复脉冲还要结合重复率、瞬态热阻和厂商重复 SOA 数据。所有轨迹点留足降额后都在限制内，才可判断安全。</p></details>
        </div>
      </section>
    </>
  );
}
