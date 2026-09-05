import ArticleFigure from "../ArticleFigure.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function PcbRoutingArticle() {
  return (
    <>
      <section id="three-w">
        <h2>3W 原则与串扰</h2>
        <p>两根信号线平行走线时会产生容性与感性耦合。3W 是常见经验规则，不是固定衰减定律；实际串扰取决于层叠、参考面距离、线宽、平行长度、边沿速度和端接。可先用中心距 ≥3W 做初始布局，再依据目标层叠和场求解/仿真确定间距，不能脱离条件宣称必然降低 70% 或 98%。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/routing-3w-definition.webp" fullSrc="images/knowledge/pcb-layout/routing-3w-definition-hd.jpg" alt="3W 间距定义示意图" caption="3W 原则：两条走线中心距 ≥ 3 倍线宽 W，抑制线间容性/感性耦合。" sourcePage="2" />
        <p>间距的效果可以量化：《信号完整性揭秘》给出的仿真实例中，攻击信号上升时间 200ps、幅值 500mV、耦合长度 2000mil，实际中心距 2W 时耦合到约 <strong>35mV</strong> 干扰，加大到 4W 后只剩约 <strong>3mV</strong>——差一个数量级。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/routing-crosstalk-cases.webp" fullSrc="images/knowledge/pcb-layout/routing-crosstalk-cases-hd.jpg" alt="三种间距布线的串扰 NEXT 对比" caption="Case1（2W）串扰约 35mV，Case2（4W）约 3mV，Case3（加隔离地线）接近 0。" sourcePage="2" />
        <aside className="article-callout"><strong>面试要点：</strong>设计时尽可能保证平行走线间距；密度太高时优先牺牲低速信号的间距；<strong>时钟、复位、高速差分对等关键信号必须尽可能加大与其他线的间距</strong>。</aside>
      </section>

      <section id="orthogonal">
        <h2>相邻层垂直走线</h2>
        <p>串扰不只在同层发生。相邻两层信号如果长距离平行走线，相当于电容器的两个极板正对，高速交变信号会直接通过层间容性耦合串到另一层。对策就是<strong>相邻层走线互相垂直</strong>：一层偏横、一层偏竖，把平行长度降到最短。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/routing-perpendicular-layers.webp" fullSrc="images/knowledge/pcb-layout/routing-perpendicular-layers-hd.jpg" alt="相邻层红蓝走线互相垂直" caption="相邻信号层一层走横向、一层走纵向，避免长距离平行造成的层间耦合。" sourcePage="3" />
        <p>如果层数多或信号频率高，还要<strong>用地层或电源层把相邻信号层隔开</strong>。常见的 6 层板叠层 L1 信号—L2 GND—L3 信号—L4 电源—L5 GND—L6 信号，三个信号层之间都被平面层隔开，这就是叠层设计对串扰的贡献（叠层细节见本文章节「叠层方案」篇）。</p>
      </section>

      <section id="reference-return">
        <h2>参考平面与返回路径</h2>
        <p>信号传输有两个基本要素——<strong>信号路径和参考路径（返回路径）</strong>。所有信号传输都需要返回电流，只有信号路径而没有返回路径就无法构成信号传输。参考平面（叠层中的 GND 层或电源层）就是为信号提供返回路径的；对高速交变信号而言，电源层与地层之间交流阻抗很小，所以电源层同样可以作返回路径。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/routing-return-path.webp" fullSrc="images/knowledge/pcb-layout/routing-return-path-hd.jpg" alt="信号路径与返回路径示意" caption="信号从源端经信号路径到负载，必须经参考平面构成的返回路径回到源端。" sourcePage="4" />
        <p>以 6 层板为例：L1 TOP 参考 L2 GND，L6 BOTTOM 参考 L5 GND；L3 信号层夹在 L2 GND 与 L4 PWR 之间有两个参考层，通常受叠层尺寸影响（如 L3—L4 间距 0.215mm 小于 L3—L2 的 0.5mm），<strong>L3 主要参考距离更近的 L4，次要参考 L2</strong>。</p>
        <p>返回电流究竟怎么流？仿真给出的表层微带线返回电流密度显示：<strong>返回电流高度集中在走线正下方的参考平面上，呈正态分布</strong>。这解释了两件事：信号线下方必须保留完整参考平面；参考平面一旦不连续，返回电流被迫绕行，走线阻抗突变、产生反射。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/routing-return-current-density.webp" fullSrc="images/knowledge/pcb-layout/routing-return-current-density-hd.jpg" alt="返回电流密度正态分布曲线" caption="返回电流集中在走线正下方（d 为偏离走线的距离，I/Imax 为电流密度）。" sourcePage="4" />
      </section>

      <section id="split-crossing">
        <h2>为什么不能跨分割</h2>
        <p><strong>跨分割</strong>指走线的参考平面不完整，走线参考了两个或以上的网络——参考电源平面时最容易出现（电源层常按电压分割成多块）。</p>
        <p>危害一：<strong>阻抗突变</strong>。走线失去参考平面的瞬间特征阻抗变大，产生反射。于博士手记的 TDR 仿真：6mil 线宽、600mil 长、距参考层 4mil 的走线，完整参考时约 <FormulaText text="Z_0=55Ω" />，跨过 40mil 分割的瞬间阻抗跳到 <strong>85Ω</strong>。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/routing-cross-split-tdr.webp" fullSrc="images/knowledge/pcb-layout/routing-cross-split-tdr-hd.jpg" alt="跨分割时 TDR 阻抗突变曲线" caption="微带线跨分割瞬间阻抗从 55Ω 跳到 85Ω（图 7-6），阻抗不连续产生反射。" sourcePage="5" />
        <p>危害二：<strong>返回路径变长</strong>。返回电流绕过分割处，信号环路面积增大，容易对外辐射或耦合串扰。对沿时间的敏感度也不同：上升沿 50ps 的高速信号跨分割会产生约 <strong>20% 的过冲</strong>，而 500ps 的低速信号基本无感——但低速信号也应尽量避开。</p>
        <p>如果不得不跨分割，用<strong>缝合电容（stitching capacitor）</strong>给返回电流搭桥：容值 1µF 以下、封装不大于 0402、<strong>2 颗分别布置在走线两侧</strong>、引线尽量短，电容两端分别连接分割开的两个参考网络。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/routing-stitching-cap.webp" fullSrc="images/knowledge/pcb-layout/routing-stitching-cap-hd.jpg" alt="缝合电容跨接布局" caption="C1/C2 两颗 0402 电容跨接 +3.3V 与 +5V 分割区，给返回电流提供低阻通路。" sourcePage="6" />
        <p>还有一类隐蔽的跨分割：<strong>密集过孔的反焊盘把参考平面打断</strong>。走线恰好从两个过孔中间穿过时，两侧反焊盘让参考层出现空隙，走线在此处短暂失去参考。布线时要注意过孔的分配位置，避免把关键信号挤进过孔阵的缝隙里。</p>
        <WorkedExample
          title="电源平面分割区的走线处理"
          given={["6 层板，L3 信号层一组差分线必须穿过 L4 电源平面的 3.3V/5V 分割边界", "信号上升沿约 200ps"]}
          calculation={["优先改层或改道，让走线全程参考完整平面", "无法避开时，在分割边界两侧各放 1 颗 0402/1µF 以下缝合电容，跨接两个电源网络", "检查过孔密集区，避免走线从两个反焊盘之间穿过"]}
          verification={["用 TDR 或仿真确认跨分割点阻抗变化量", "高速线观察波形过冲是否明显（50ps 级可达 20%）", "确认缝合电容焊盘引线最短、接地过孔就近"]}
          answer="先保证参考平面完整；必须跨分割时用双 0402 缝合电容跨接两个参考网络，并警惕过孔反焊盘造成的隐性分割。"
        />
      </section>

      <section id="corners">
        <h2>直角与钝角转弯</h2>
        <p>走线转弯尽量用 <strong>45° 折线或圆弧</strong>，避免直角和钝角。原因有三：</p>
        <div className="application-list">
          <article><h3>阻抗变化</h3><p>直角处有效线宽增大到 <FormulaText text="1.414×W" />（√2 倍），线宽突变带来阻抗不连续与反射。实际转弯段很短，影响有限，但原理要讲得清。</p></article>
          <article><h3>辐射与放电</h3><p>直角尖端类似天线，增强 EMI 辐射；尖端电场集中、电压较高时更容易尖端放电。</p></article>
          <article><h3>工艺（DFM）</h3><p>走线由蚀刻形成，直角内侧容易被过度蚀刻形成 acid traps（酸角），造成线路变细甚至腐蚀断线；现代工艺已大幅改善，但仍不建议直角走线。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/pcb-layout/routing-right-angle-width.webp" fullSrc="images/knowledge/pcb-layout/routing-right-angle-width-hd.jpg" alt="直角转弯处线宽增大到 1.414W" caption="直角拐角的有效线宽为 √2·W，线宽突变导致阻抗不连续。" sourcePage="7" />
        <ArticleFigure src="images/knowledge/pcb-layout/routing-arc-45deg.webp" fullSrc="images/knowledge/pcb-layout/routing-arc-45deg-hd.jpg" alt="圆弧与 45° 转弯的实际布局" caption="高速接口（如 HDMI）用近似圆弧走线，普通信号用两个 45° 代替直角。" sourcePage="7" />
        <p>从性能、可制造性和美观三个角度看，45° 与圆弧都是更优解：高速线（如 HDMI 差分对）走圆弧，一般信号用两段 45° 过渡即可。</p>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>3W 原则是什么？为什么不能当定律？</summary><p>中心距 ≥3W 可作为减少平行耦合的初始经验值，但串扰还取决于层叠、参考面距离、平行长度、边沿和端接。70%/98% 等数字只对特定模型成立，关键网络应按实际叠层仿真。</p></details>
          <details><summary>什么是参考平面？电源层能作参考层吗？</summary><p>参考平面是为信号提供返回路径的完整铜平面，通常是 GND 层或电源层。对高速交变信号，电源层与地层间交流阻抗很小，电源层同样可作返回路径；多层板中信号层主要参考距离更近的那个平面。</p></details>
          <details><summary>走线为什么不能跨分割？跨了怎么办？</summary><p>跨分割使走线阻抗突变（仿真从 55Ω 跳到 85Ω）产生反射，且返回电流绕行加大环路、易辐射串扰；50ps 级高速信号可产生约 20% 过冲。补救：尽量保持参考平面完整；必须跨时在分割两侧放 2 颗 ≤1µF/0402 缝合电容跨接两个参考网络；同时警惕密集过孔反焊盘造成的隐性分割。</p></details>
          <details><summary>相邻层信号为什么要垂直走线？</summary><p>相邻层平行走线相当于电容两极板正对，层间容性耦合大；互相垂直可把平行长度降到最短、耦合最小。层数多或频率高时，还应用地/电源平面把相邻信号层隔开（如 6 层板 SIG-GND-SIG-PWR-GND-SIG）。</p></details>
          <details><summary>直角走线有哪些问题？</summary><p>①拐角有效线宽变为 1.414W，阻抗不连续产生反射；②直角尖端天线效应增强 EMI，尖端易放电；③蚀刻工艺上直角内侧易形成 acid traps 造成线路腐蚀过度。转弯应尽量采用 45° 折线或圆弧。</p></details>
          <details><summary>返回电流在参考平面里怎么流动？</summary><p>返回电流集中在走线正下方的参考平面内，沿路径呈正态分布。所以信号线下方要有完整参考平面；一旦参考层被分割或打断，返回电流被迫绕行，回路面积增大，阻抗突变并引发反射与辐射。</p></details>
        </div>
      </section>
    </>
  );
}
