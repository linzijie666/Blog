import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function InductorArticle() {
  return (
    <>
      <section id="principle">
        <h2>电感的储能与电流惯性</h2>
        <p>电感把能量储存在磁场中，电流不能突变。端电压满足 u = L·di/dt；正弦稳态下 <FormulaText text="Z_L = jωL" />。开关电源利用这项电流惯性，把脉冲开关节点转换为较连续的负载电流。</p>
        <div className="formula-block"><figcaption>储能与电感纹波</figcaption><div className="formula"><FormulaText text="E = ½LI²　ΔI = V_L·Δt/L" /></div><p>感值越大，纹波通常越小，但瞬态响应、体积、DCR 和磁芯损耗也会随器件选择变化。</p></div>
      </section>

      <section id="parameters">
        <h2>五个关键选型参数</h2>
        <p>选型时必须区分平均电流、峰值电流和 RMS 电流。平均电流接近负载电流；峰值电流用于校核饱和；RMS 电流用于计算绕组发热和 DCR 铜损。</p>
        <div className="comparison-table-wrap"><table className="comparison-table"><caption>功率电感关键参数</caption><thead><tr><th scope="col">参数</th><th scope="col">主要影响</th><th scope="col">校核方式</th></tr></thead><tbody><tr><th scope="row">感值 L</th><td>电感纹波、瞬态响应</td><td>按拓扑和最坏输入计算</td></tr><tr><th scope="row">DCR</th><td>DCR 铜损与直流压降</td><td><FormulaText text="P_{cu} = I_{rms}² × DCR" /></td></tr><tr><th scope="row">饱和电流 Isat</th><td>磁芯饱和、感值下降</td><td>与峰值电流比较</td></tr><tr><th scope="row">温升电流 Irms</th><td>绕组和器件温升</td><td>与 RMS 电流比较</td></tr><tr><th scope="row">磁芯损耗</th><td>高频效率和温升</td><td>频率、纹波和材料共同决定</td></tr></tbody></table></div>
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/passive-components/inductor-dcr.webp", fullSrc: "images/knowledge/passive-components/inductor-dcr-hd.jpg", alt: "功率电感数据手册中的感值和 DCR 参数", caption: "DCR 决定直流铜损，数据表还要结合额定温度和测试条件读取。", sourcePage: "38" },
          { src: "images/knowledge/passive-components/inductor-current.webp", fullSrc: "images/knowledge/passive-components/inductor-current-hd.jpg", alt: "功率电感饱和电流纹波和 RMS 电流示意", caption: "峰值电流校核饱和，RMS 电流校核温升，两者不能互相替代。", sourcePage: "39" }
        ]} />
      </section>

      <section id="structure">
        <h2>磁芯结构与封装</h2>
        <div className="selection-grid">
          <article><h3>屏蔽结构</h3><p>闭合磁路减少漏磁和邻近耦合，适合紧凑电源，但成本和寄生电容可能更高。</p></article>
          <article><h3>非屏蔽结构</h3><p>成本低、结构简单，漏磁较强，需要远离敏感走线、磁传感器和高速接口。</p></article>
          <article><h3>铁氧体磁芯</h3><p>高频损耗较低，但饱和通常较陡，适合开关频率较高且峰值电流受控的场景。</p></article>
          <article><h3>粉芯与合金材料</h3><p>分布气隙让饱和更平缓，适合大电流，但要关注磁芯损耗和温升。</p></article>
          <article><h3>一体成型</h3><p>线圈埋入磁性粉末，漏磁小、机械强度高、DCR 较低，适合高密度电源。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/passive-components/inductor-structure.webp" fullSrc="images/knowledge/passive-components/inductor-structure-hd.jpg" alt="功率电感内部线圈磁芯和电极结构示意" caption="结构与磁芯材料共同决定 DCR、漏磁、饱和、磁芯损耗和温升。" sourcePage="40" />
      </section>

      <section id="circuits">
        <h2>典型电源应用</h2>
        <p>Buck 中电感位于开关节点与输出之间；Boost 中电感在开关导通时储能、关断时向输出释放能量。输入或输出 LC 滤波还要评估谐振与控制环路稳定性。</p>
        <WorkedExample
          title="Buck 功率电感选型"
          given={["输入 12V，输出 5V/3A", "开关频率 400kHz", "目标峰峰值纹波为负载电流的 30%，即 0.9A"]}
          calculation={["占空比近似 D = 5V/12V = 0.417", "L = (12V - 5V) × 0.417/(0.9A × 400kHz) ≈ 8.1µH", "选择相邻标准值 8.2µH", "峰值电流 I_{peak} = 3A + 0.9A/2 = 3.45A"]}
          verification={["建议 Isat 至少高于 4.1A，并核对厂商的感值下降判据", "Irms 需高于实际 RMS 电流并满足允许温升", "按 I_{rms}² × DCR 计算铜损，再叠加磁芯损耗", "检查自谐振频率、屏蔽、尺寸和样机温度"]}
          answer="我先按最坏输入、开关频率和目标纹波计算感值，再用峰值电流校核 Isat，用 RMS 电流校核温升与 DCR 铜损，最后检查磁芯损耗、屏蔽和实测温升。"
        />
      </section>

      <section id="workflow">
        <h2>功率电感选型流程</h2>
        <ol className="summary-list"><li>根据拓扑、最坏输入输出电压、开关频率和目标纹波计算感值。</li><li>计算全工况峰值电流，并按瞬态与容差为饱和电流留余量。</li><li>用 RMS 电流校核温升电流，并计算 DCR 铜损。</li><li>核对磁芯损耗、自谐振频率、屏蔽需求、尺寸和器件温度。</li><li>在样机上测量电流纹波、效率、温升、漏磁和开关节点振铃。</li></ol>
      </section>

      <section id="mistakes">
        <h2>常见易错点</h2>
        <aside className="article-callout"><strong>不要混淆：</strong>Isat 对应规定的感值下降阈值，Irms 对应规定温升。设计时分别与峰值电流和 RMS 电流比较。</aside>
        <p>更大感值会减小纹波，但可能带来更慢瞬态、更高 DCR、更大体积和不同的磁芯损耗。实际电感还有绕组电容与自谐振频率，超过目标频段后不再保持理想感性。</p>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>饱和电流和温升电流为什么不能互相替代？</summary><p>饱和电流描述磁芯非线性，温升电流描述损耗引起的热限制。一个看峰值，一个看 RMS。</p></details>
          <details><summary>DCR 如何影响效率？</summary><p>绕组铜损近似为 <FormulaText text="I_{rms}² × DCR" />。DCR 还会造成直流压降和器件自身温升。</p></details>
          <details><summary>开关频率提高后功率电感可以变小吗？</summary><p>相同纹波目标下可以减小感值，但开关损耗、磁芯损耗、EMI 和热设计压力会上升。</p></details>
        </div>
      </section>
    </>
  );
}
