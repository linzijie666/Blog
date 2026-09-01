import ArticleFigure from "../ArticleFigure.jsx";
import FormulaText from "../FormulaText.jsx";

export default function PcbCopperPourArticle() {
  return (
    <>
      <section id="copper-pour">
        <h2>铺铜的作用与注意点</h2>
        <p>PCB 内层一般都有完整的铺铜层（GND 层、电源层），上下表层也常做大块铺铜。铺铜的作用可以总结为五条：</p>
        <div className="application-list">
          <article><h3>形成完整参考平面</h3><p>内层 GND/电源层为信号层提供返回路径。例如 02GND 层是完整的 GND 网络属性铜皮，直接作为 01TOP 层信号的参考。</p></article>
          <article><h3>提高 EMC 性能</h3><p>根据法拉第笼原理，大面积铺铜能吸收外部干扰，多层板内层走线的抗干扰能力强于表层；有些板子还在板边走一圈地网络 + 打过孔，甚至做沉铜包边，降低对外辐射。</p></article>
          <article><h3>承载更大电流</h3><p>大面积铜皮通流能力强，电源和地网络常用铺铜替代走线。</p></article>
          <article><h3>辅助散热</h3><p>铜导热效率高，大功率器件的热量经铺铜快速传到整板；有时特意在铺铜区开窗露铜（去掉阻焊和丝印），让铜皮直接接触导热结构件。</p></article>
          <article><h3>电镀均匀</h3><p>生产 PCB 的电镀铜过程中，均匀的铺铜设计可以让表面走线铜厚更均匀。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/pcb-layout/copper-pour-reference-plane.webp" fullSrc="images/knowledge/pcb-layout/copper-pour-reference-plane-hd.jpg" alt="02GND 完整铺铜层作为 01TOP 参考" caption="内层完整 GND 铺铜（层 4 内层1）作为顶层走线的参考平面。" sourcePage="13" />
        <ArticleFigure src="images/knowledge/pcb-layout/copper-edge-plating.webp" fullSrc="images/knowledge/pcb-layout/copper-edge-plating-hd.jpg" alt="板边沉铜包边实物" caption="板边沉铜包边：边缘孔化接地，配合板边地网络降低对外辐射。" sourcePage="14" />
        <ArticleFigure src="images/knowledge/pcb-layout/copper-exposed-thermal-vias.webp" fullSrc="images/knowledge/pcb-layout/copper-exposed-thermal-vias-hd.jpg" alt="ESP-12S 模组底部露铜加过孔散热" caption="模组底部露铜 + 过孔把热量引到主板铺铜，辅助散热。" sourcePage="14" />
        <p>铺铜也有三条注意点：<strong>①</strong>铺铜区域的过孔焊盘要做反焊盘、花焊盘（热风焊盘），否则可能焊接困难、虚焊；<strong>②</strong>铜皮必须连接到网络，避免<strong>孤铜</strong>——孤铜相当于悬空天线，反而恶化 EMC；<strong>③</strong>有天线的 PCB，天线附近一定范围禁止铺铜或走线。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/copper-antenna-keepout.webp" fullSrc="images/knowledge/pcb-layout/copper-antenna-keepout-hd.jpg" alt="WIFI 模组天线布局要求" caption="天线伸出板边 6mm 或周边留空 5mm；天线区域禁止铺铜，周边不放金属件。" sourcePage="14" />
      </section>

      <section id="guard-traces">
        <h2>包地线的功能与打孔</h2>
        <p>在高速或敏感信号两侧画 1~2 条 <strong>GND 网络的平行走线（包地线）</strong>，把关键信号（高速、时钟、复位等）与同层其他信号隔开，是布局空间不足、拉不开间距时的串扰对策。</p>
        <p>包地线起效的前提是<strong>密集打过孔连接到 GND 参考平面</strong>：耦合到包地线上的干扰要能就近泄放到地平面。如果打过孔太稀疏甚至不打，包地线反而会成为两条线之间串扰的「桥」，加重干扰。打孔间距的建议值是<strong>小于攻击线信号波长的 1/10</strong>。</p>
        <div className="formula-block"><figcaption>包地线过孔间距</figcaption><div className="formula"><FormulaText text="d_{via} < λ/10（λ 为攻击线信号波长）" /></div><p>「攻击线」指速度快、上升沿陡、驱动强的信号（高速信号、时钟），「受害线」是复位、中断等敏感信号；隔离地线夹在两者中间并多点接地。</p></div>
        <ArticleFigure src="images/knowledge/pcb-layout/guard-trace-via-spacing.webp" fullSrc="images/knowledge/pcb-layout/guard-trace-via-spacing-hd.jpg" alt="包地线与过孔间距示意" caption="攻击线与受害线之间的隔离地线（包地线）必须密集打过孔接地，间距小于 λ/10。" sourcePage="15" />
        <p>包地线的另一个应用场景是<strong>没有参考平面的板子</strong>：单面板只有一层走线，双面板两层间距几十 mil、基本没有参考效果，此时高速线用两侧包地构成<strong>共面参考</strong>。下图的 1.25Gbps SERDES 信号就是包地共面参考的实例——这种用法下包地线与信号线的距离要按共面阻抗用计算工具算，不再是随意的隔离。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/guard-coplanar-serdes.webp" fullSrc="images/knowledge/pcb-layout/guard-coplanar-serdes-hd.jpg" alt="1.25G SERDES 包地共面参考" caption="双面板上 1.25Gbps 高速线用两侧包地做共面参考，线距按阻抗计算确定。" sourcePage="15" />
      </section>

      <section id="isolation-keepout">
        <h2>隔离器件下方挖空</h2>
        <p>光耦、网络变压器等隔离类器件的作用是隔开外部接口与内部电路。为了让隔离真正成立，这类器件<strong>下方所有层的铜皮（包括参考层）都要挖空</strong>，并尽可能不走线——防止雷击、浪涌等外部干扰通过铜皮或走线耦合进内部电路。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/isolation-transformer-photos.webp" fullSrc="images/knowledge/pcb-layout/isolation-transformer-photos-hd.jpg" alt="千兆网网络变压器实物" caption="千兆网网络变压器（隔离器件）正反面实物。" sourcePage="16" />
        <p>实际布局中（下图）：网络变压器中间线圈部分的正下方所有层挖空、不走线，周围的引脚区域不需要挖空；RJ45 连接器分配独立的 <strong>HGND</strong> 地网络，与内部 GND 之间只通过防护器件连接。这些处理的目的都是拉高外部接口与内部电路之间的隔离度，提升抗雷击浪涌与 EMC 能力。</p>
        <ArticleFigure src="images/knowledge/pcb-layout/isolation-transformer-keepout.webp" fullSrc="images/knowledge/pcb-layout/isolation-transformer-keepout-hd.jpg" alt="网变下方挖空与 HGND 布局" caption="网变中段下方整片挖空（蓝框），RJ45 侧使用独立 HGND 地，仅经防护器件连回 GND。" sourcePage="16" />
        <aside className="article-callout"><strong>面试要点：</strong>隔离器件下方挖空 + 独立地网络（如 HGND）+ 防护器件单点连接，是「隔离」在 PCB 上落地三部曲；只换器件不挖空，隔离度大打折扣。</aside>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>PCB 铺铜有哪些作用？</summary><p>①形成完整参考平面（返回路径）；②法拉第笼效应提高 EMC 性能；③大面积铜皮承载更大电流；④铜导热好，辅助大功率器件散热（可露铜加结构件）；⑤电镀时使表面铜厚更均匀。</p></details>
          <details><summary>铺铜要注意什么？</summary><p>铺铜区过孔焊盘做反焊盘/热风焊盘避免虚焊；铜皮必须归属网络，避免孤铜（天线效应恶化 EMC）；天线附近禁止铺铜走线（如 WIFI 模组天线要求伸出板边 6mm 或周边留空 5mm）。</p></details>
          <details><summary>包地线有什么用？为什么要密打过孔？</summary><p>包地线是敏感线两侧的 GND 平行走线，用于隔开攻击线与受害线、降低串扰；也可在无参考平面的单/双面板上构成共面参考。耦合到包地线的干扰要经 GND 过孔泄放，打孔间距应小于攻击线波长的 1/10；不打孔或过孔稀疏时包地线会变成串扰的「桥」。</p></details>
          <details><summary>光耦、网变下方为什么要挖空？</summary><p>隔离器件要阻断外部干扰（雷击、浪涌）经铜皮或走线耦合进内部电路，所以其下方所有层铜皮（含参考层）都挖空且尽量不走线；配合独立 HGND 地网络与防护器件单点连接，最大化隔离度。</p></details>
          <details><summary>什么是孤铜？有什么危害？</summary><p>没有连接到任何网络的孤立铜皮。它会形成天线效应，接收和辐射电磁干扰，影响 EMC；设计时应消除或就近接地删除。</p></details>
        </div>
      </section>
    </>
  );
}
