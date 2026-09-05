import ArticleFigure from "../ArticleFigure.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function PcbGroundDesignArticle() {
  return (
    <>
      <section id="thermal-relief">
        <h2>十字花焊盘（热风焊盘）</h2>
        <p>插件器件的过孔焊盘连接大面积铜皮时，要使用<strong>十字花焊盘（热风焊盘，Thermal Relief）</strong>：焊盘与铜皮之间通过几条辐条多点连接，而不是整圈直接相连。</p>
        <p>原因是散热：PCB 上的电源、地铜皮面积非常大，若焊盘与铜皮全连接，焊接时热量瞬间被铜皮带走，焊点温度上不去，波峰焊或手焊都容易<strong>虚焊、焊接不良</strong>；加热时间拉长还可能导致铜皮与板材分离。手焊时多引脚器件的 GND 引脚最难焊、「不吃锡」，就是这个原因。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/ground-thermal-relief-pad.webp" fullSrc="images/knowledge/pcb-layout/ground-thermal-relief-pad-hd.jpg" alt="十字花焊盘俯视图" caption="四个过孔焊盘以十字花（spoke）方式连接铜皮：多点连接、限制导热截面。" sourcePage="17" />
        <ArticleFigure src="images/knowledge/pcb-layout/ground-thermal-spoke-detail.webp" fullSrc="images/knowledge/pcb-layout/ground-thermal-spoke-detail-hd.jpg" alt="热风焊盘结构细节" caption="热风焊盘结构：辐条宽度、隔离盘与 GND 网络铜皮的关系。" sourcePage="17" />
        <ArticleFigure src="images/knowledge/pcb-layout/ground-solder-quality.webp" fullSrc="images/knowledge/pcb-layout/ground-solder-quality-hd.jpg" alt="焊接不良与正常对比" caption="左侧锡珠不润湿（虚焊）、右侧焊脚良好——全连接大铜皮是焊接不良的常见原因。" sourcePage="17" />
        <p>部分 EDA 软件对贴片焊盘与铺铜的连接也会自动使用热风焊盘，防止受热不均导致<strong>立碑</strong>；不过贴片回流焊预热时间长、受热均匀，这类应用相对少。</p>
      </section>

      <section id="agnd-dgnd">
        <h2>模拟地与数字地的分割连接</h2>
        <p>数字开关电流和模拟回流共享阻抗时会产生地弹并污染测量。解决核心是器件分区、回流路径可预测和共享阻抗尽量小，而不是看到 AGND/DGND 名称就机械切割地平面。对多数混合信号板，连续地平面配合合理布局能提供更低阻抗、更完整的高频回流。</p>
        <p>只有器件手册或系统隔离边界明确要求时，才考虑局部分地和单点连接。0Ω 电阻仍有寄生阻抗，流过电流就有压差；磁珠在高频提高地回路阻抗，可能让回流改道并恶化辐射。它们不能同时“保证等电位”又“隔绝高频噪声”，必须结合回流路径、频谱和实测决定。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/ground-agnd-0ohm-schematic.webp" fullSrc="images/knowledge/pcb-layout/ground-agnd-0ohm-schematic-hd.jpg" alt="AGND 与 GND 经 0Ω 电阻单点连接的原理图" caption="原理图上模拟地网络 AGND 与 GND 之间通过一颗 0Ω 电阻（R6）连接。" sourcePage="18" />
        <p>PCB 落地时先按所用 ADC/DAC 的参考设计安排模拟、数字区域，让每条高速信号都在连续参考面上有短回流。若原厂确实要求 AGND/DGND 分区，则在指定位置连接并禁止信号跨越分割缝；下图只能作为特定 DAC 方案示例，不能推广为通用规则。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/ground-agnd-single-point.webp" fullSrc="images/knowledge/pcb-layout/ground-agnd-single-point-hd.jpg" alt="DAC 布局的 AGND/GND 单点连接" caption="U6 DAC：AGND 与 GND 分区铺铜，蓝箭头处单点连接（R28/R6 位置）。" sourcePage="19" />
        <WorkedExample
          title="ADC 采样值抖动，检查地处理"
          given={["板上有开关电源与数字总线，ADC 参考地直接挂在数字地平面上", "ADC 输入短接时采样值仍有数个 LSB 抖动"]}
          calculation={["先用示波器和频谱定位噪声是否与开关节点或数字边沿相关", "检查 ADC、基准源和运放的去耦、参考连接与回流路径，优先保持连续地平面", "调整布局使大电流/高 di/dt 回流远离模拟采样路径；仅在器件手册要求时按指定点连接 AGND/DGND"]}
          verification={["输入短接与真实传感器两种状态复测噪声", "检查任何高速信号都不跨地平面分割缝", "测量关键地参考之间的动态压差，而不是假设 0Ω 两端恒为 0V"]}
          answer="先查回流与共享阻抗，再决定地平面结构。多数场合优先连续地平面和功能分区；分地、0Ω 或磁珠只有在器件手册和实测支持时才使用。"
        />
      </section>

      <section id="20h-rule">
        <h2>电源地层的 20H 原则</h2>
        <p><strong>20H 原则</strong>：电源平面边缘要比相邻地平面（0V 参考面）边缘至少缩进 20 倍层间距，H 即电源平面与地平面之间的介质距离。H 可以在 PCB 层叠信息里查到。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/ground-20h-diagram.webp" fullSrc="images/knowledge/pcb-layout/ground-20h-diagram-hd.jpg" alt="20H 原则示意" caption="电源平面相对地平面边缘内缩 20H（H 为两平面间距）。" sourcePage="19" />
        <p>电源平面相对地平面内缩可减小部分板边缘场泄露，但 20H/100H 及 70%/98% 来自特定几何模型，只能作为经验起点。实际效果取决于层间距、平面尺寸、频率、边缘端接与机壳结构，应优先通过叠层规划、连续参考面和 EMC 仿真/测试验证。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/ground-6layer-stackup-table.webp" fullSrc="images/knowledge/pcb-layout/ground-6layer-stackup-table-hd.jpg" alt="六层板叠层表" caption="用于查 H 的六层板叠层表：L4 电源与 L5 地之间的芯板厚度 21.65mil 即为 H。" sourcePage="20" />
        <WorkedExample
          title="计算六层板的 20H 内缩量"
          given={["六层板叠层：L4 PWR 与 L5 GND 之间芯板厚度 21.65mil（0.55mm）", "要求电源平面相对地平面内缩"]}
          calculation={["H = 21.65mil", "20H = 20 × 21.65 = 433mil ≈ 11mm", "内缩 100H = 2165mil ≈ 55mm（板内空间通常不允许，取 20H 折中）"]}
          verification={["在 EDA 中测量电源平面边缘到地平面边缘距离 ≥ 433mil", "板边缘辐射测试对比内缩前后的 EMI 差异"]}
          answer="按给定 H，20H=433mil≈11mm；这只是几何经验值，是否值得保留如此大的内缩要结合叠层、板边结构、频谱与 EMC 结果判断。"
        />
        <ArticleFigure src="images/knowledge/pcb-layout/ground-20h-flux-containment.webp" fullSrc="images/knowledge/pcb-layout/ground-20h-flux-containment-hd.jpg" alt="边缘磁通泄露与内缩效果对比" caption="左：平面边缘 RF 能量向外辐射；右：电源平面内缩后电场被束缚在地平面内。" sourcePage="20" />
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>插件器件为什么要用十字花焊盘？</summary><p>大面积电源/地铜皮散热极快，焊盘全连接时焊点温度不足，容易虚焊、焊接不良，甚至长时间加热导致铜皮分离。十字花焊盘用几条辐条多点连接，在保证电气连接的同时限制导热，改善焊接性。</p></details>
          <details><summary>模拟地和数字地一定要分开吗？</summary><p>不一定。目标是控制回流和共享阻抗；多数混合信号板优先连续地平面、功能分区和短回流。只有器件手册明确要求时才局部分地，并确保高速信号不跨分割缝。</p></details>
          <details><summary>20H 原则是什么？</summary><p>它建议电源平面相对相邻地平面内缩约 20 倍层间距，以减小边缘场泄露；但百分比效果依赖模型，不能当通用定律。应与实际叠层、频率和 EMC 测试一起判断。</p></details>
          <details><summary>贴片器件什么时候也用热风焊盘？</summary><p>部分 EDA 软件对贴片焊盘与铺铜连接处自动设热风焊盘，防止受热不均立碑；但贴片回流焊受热均匀，实际应用较少，主要用于插件焊接场景。</p></details>
          <details><summary>AGND 与 GND 之间用磁珠还是 0Ω 电阻？</summary><p>不能脱离回流路径直接二选一。0Ω 有寄生阻抗和压降，磁珠会提高高频地回路阻抗；两者都不保证“等电位且隔噪”。先遵循器件参考设计，再以阻抗、回流和实测噪声决定。</p></details>
        </div>
      </section>
    </>
  );
}
