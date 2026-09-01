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
        <p>数字电路频率高、谐波丰富，数字电流在地平面上流动时，因为铜皮有阻抗，地电位并不是理想的 0V，会产生<strong>地弹（ground bounce）</strong>。模拟电路对这些波动非常敏感，共用地平面会让采样值抖动、失准——这就是模拟地（AGND）与数字地（GND）要分开的原因。</p>
        <p>分割后的连接方式是<strong>单点接地</strong>：两地铺铜分开，中间通过<strong>0Ω 电阻或磁珠</strong>连接。0Ω 电阻保证两端等电位（0V 压差），又阻隔数字地上的高频噪声窜入模拟地——形象地说像两个池塘之间接一根细水管：液位相同，但一边的波纹传不到另一边。用磁珠还是 0Ω 电阻，可以根据调试情况确定。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/ground-agnd-0ohm-schematic.webp" fullSrc="images/knowledge/pcb-layout/ground-agnd-0ohm-schematic-hd.jpg" alt="AGND 与 GND 经 0Ω 电阻单点连接的原理图" caption="原理图上模拟地网络 AGND 与 GND 之间通过一颗 0Ω 电阻（R6）连接。" sourcePage="18" />
        <p>PCB 落地上：模拟电路的器件与走线下方铺 <strong>AGND 铜皮作参考平面</strong>，AGND 与外围 GND 铺铜只在一点通过电阻/磁珠连接。下图的 DAC 布局中，GND 与 AGND 分区铺铜，在顶部单点互连，模拟电源（3V3_AVDD、+5V_AVDD）与数字信号各自分区走线。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/ground-agnd-single-point.webp" fullSrc="images/knowledge/pcb-layout/ground-agnd-single-point-hd.jpg" alt="DAC 布局的 AGND/GND 单点连接" caption="U6 DAC：AGND 与 GND 分区铺铜，蓝箭头处单点连接（R28/R6 位置）。" sourcePage="19" />
        <WorkedExample
          title="ADC 采样值抖动，检查地处理"
          given={["板上有开关电源与数字总线，ADC 参考地直接挂在数字地平面上", "ADC 输入短接时采样值仍有数个 LSB 抖动"]}
          calculation={["确认模拟区域：ADC、基准源、运放及其下方铺铜划为 AGND 区", "AGND 与 GND 之间仅保留一颗 0Ω 电阻单点连接", "模拟电源经磁珠 + 去耦电容从数字电源分离"]}
          verification={["输入短接复测，抖动明显收敛", "检查模拟区下方无数字信号走线穿过", "单点连接电阻两端电位差近似 0V"]}
          answer="数字地弹经共用地平面耦合进模拟域是采样抖动的常见根因；AGND 独立铺铜 + 0Ω（或磁珠）单点连接，让两地等电位而噪声不互通。"
        />
      </section>

      <section id="20h-rule">
        <h2>电源地层的 20H 原则</h2>
        <p><strong>20H 原则</strong>：电源平面边缘要比相邻地平面（0V 参考面）边缘至少缩进 20 倍层间距，H 即电源平面与地平面之间的介质距离。H 可以在 PCB 层叠信息里查到。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/ground-20h-diagram.webp" fullSrc="images/knowledge/pcb-layout/ground-20h-diagram-hd.jpg" alt="20H 原则示意" caption="电源平面相对地平面边缘内缩 20H（H 为两平面间距）。" sourcePage="19" />
        <p>原理是<strong>边缘磁通泄露</strong>：高速 PCB 中电源平面与地平面相互耦合的 RF 能量会沿板边向外辐射。把电源平面内缩 20H，可以将约 <strong>70%</strong> 的电场限制在地平面边沿之内；内缩 100H 则可达约 <strong>98%</strong>。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/ground-6layer-stackup-table.webp" fullSrc="images/knowledge/pcb-layout/ground-6layer-stackup-table-hd.jpg" alt="六层板叠层表" caption="用于查 H 的六层板叠层表：L4 电源与 L5 地之间的芯板厚度 21.65mil 即为 H。" sourcePage="20" />
        <WorkedExample
          title="计算六层板的 20H 内缩量"
          given={["六层板叠层：L4 PWR 与 L5 GND 之间芯板厚度 21.65mil（0.55mm）", "要求电源平面相对地平面内缩"]}
          calculation={["H = 21.65mil", "20H = 20 × 21.65 = 433mil ≈ 11mm", "内缩 100H = 2165mil ≈ 55mm（板内空间通常不允许，取 20H 折中）"]}
          verification={["在 EDA 中测量电源平面边缘到地平面边缘距离 ≥ 433mil", "板边缘辐射测试对比内缩前后的 EMI 差异"]}
          answer="20H = 433mil ≈ 11mm；20H 约束住 70% 电场，空间充裕时做到 100H 可约束 98%。"
        />
        <ArticleFigure src="images/knowledge/pcb-layout/ground-20h-flux-containment.webp" fullSrc="images/knowledge/pcb-layout/ground-20h-flux-containment-hd.jpg" alt="边缘磁通泄露与内缩效果对比" caption="左：平面边缘 RF 能量向外辐射；右：电源平面内缩后电场被束缚在地平面内。" sourcePage="20" />
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>插件器件为什么要用十字花焊盘？</summary><p>大面积电源/地铜皮散热极快，焊盘全连接时焊点温度不足，容易虚焊、焊接不良，甚至长时间加热导致铜皮分离。十字花焊盘用几条辐条多点连接，在保证电气连接的同时限制导热，改善焊接性。</p></details>
          <details><summary>模拟地和数字地为什么要分开？怎么连？</summary><p>数字电路高频谐波在地平面上产生地弹，铜皮阻抗使地电位波动，干扰模拟电路精度。两地铺铜分开、通过 0Ω 电阻或磁珠单点连接：保证等电位，又阻隔数字噪声进入模拟域。</p></details>
          <details><summary>20H 原则是什么？</summary><p>电源平面边缘比相邻地平面边缘至少内缩 20 倍层间距（H 为电源层与地层的介质距离），抑制边缘磁通泄露造成的板边辐射。20H 约束约 70% 电场，100H 约 98%。如 H=21.65mil 的六层板，20H=433mil。</p></details>
          <details><summary>贴片器件什么时候也用热风焊盘？</summary><p>部分 EDA 软件对贴片焊盘与铺铜连接处自动设热风焊盘，防止受热不均立碑；但贴片回流焊受热均匀，实际应用较少，主要用于插件焊接场景。</p></details>
          <details><summary>AGND 与 GND 之间用磁珠还是 0Ω 电阻？</summary><p>两者都保证两地单点互连。0Ω 电阻直流等电位、成本最低；磁珠对高频呈高阻抗，隔离射频噪声更彻底。按调试情况与噪声频段选择，原理图上常先放 0Ω 电阻预留磁珠位置。</p></details>
        </div>
      </section>
    </>
  );
}
