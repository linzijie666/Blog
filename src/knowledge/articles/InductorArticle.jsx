import ArticleFigure from "../ArticleFigure.jsx";
import CircuitDiagram from "../CircuitDiagram.jsx";

export default function InductorArticle() {
  return (
    <>
      <section id="principle">
        <h2>电感的储能与电流惯性</h2>
        <p>电感把能量储存在磁场中，电流不能突变。端电压满足 u = L·di/dt；理想正弦稳态下 ZL = jωL，因此频率越高，感抗越大。</p>
        <div className="formula-block"><figcaption>储能与纹波</figcaption><div className="formula">E = ½LI²　ΔI ≈ VL·Δt/L</div><p>开关电源中，感值直接影响电流纹波和瞬态响应速度。</p></div>
      </section>

      <section id="parameters">
        <h2>五个关键选型参数</h2>
        <p>感值决定目标纹波；DCR 决定直流铜损；饱和电流限制磁芯仍能保持有效感值的峰值电流；RMS 或温升电流限制允许的持续发热；额定频率与磁芯材料决定高频损耗。</p>
        <div className="comparison-table-wrap"><table className="comparison-table"><caption>功率电感关键参数</caption><thead><tr><th scope="col">参数</th><th scope="col">主要影响</th><th scope="col">校核电流</th></tr></thead><tbody><tr><th scope="row">感值 L</th><td>纹波、瞬态响应</td><td>由拓扑计算</td></tr><tr><th scope="row">DCR</th><td>I²R 铜损与压降</td><td>平均/RMS 电流</td></tr><tr><th scope="row">饱和电流 Isat</th><td>磁芯饱和、感值下降</td><td>峰值电流</td></tr><tr><th scope="row">温升电流 Irms</th><td>器件温升</td><td>RMS 电流</td></tr></tbody></table></div>
      </section>

      <section id="structure">
        <h2>磁芯结构与封装</h2>
        <p>屏蔽电感能减少漏磁和邻近电路耦合；非屏蔽结构通常成本更低。铁氧体、合金粉芯和铁粉芯在磁导率、饱和特性和高频损耗上不同，一体成型结构通常拥有较好的大电流和机械性能。</p>
        <ArticleFigure src="images/knowledge/passive-components/inductor-structure.webp" fullSrc="images/knowledge/passive-components/inductor-structure-hd.jpg" alt="功率电感内部线圈、磁芯和电极结构示意" caption="结构与磁芯材料共同决定 DCR、漏磁、饱和和温升表现。" sourcePage="40" />
      </section>

      <section id="circuits">
        <h2>典型电源应用</h2>
        <CircuitDiagram variant="buck" />
        <p>Buck 中电感位于开关节点与输出之间，把脉冲电压转换为较连续的负载电流；Boost 中电感在开关导通时储能、关断时向输出释放能量。输入输出滤波器还要关注电感与电容形成的谐振及控制环路稳定性。</p>
      </section>

      <section id="workflow">
        <h2>功率电感选型流程</h2>
        <ol className="summary-list"><li>根据拓扑、输入输出电压、开关频率和目标纹波计算感值。</li><li>计算全工况峰值电流，确保 Isat 留有瞬态余量。</li><li>用 RMS 电流校核温升电流，并计算 DCR 铜损。</li><li>核对磁芯损耗、自谐振频率、屏蔽需求、尺寸和器件温度。</li><li>在样机上测量电流纹波、效率、温升与开关节点振铃。</li></ol>
      </section>

      <section id="mistakes">
        <h2>常见易错点</h2>
        <aside className="article-callout"><strong>不要混淆：</strong>Isat 通常对应感值下降的阈值，Irms 对应规定温升；设计电流必须分别和峰值、RMS 电流比较。</aside>
        <p>只追求更大感值会减小纹波，却可能带来更慢瞬态、更高 DCR 和更大体积。实际电感还存在绕组电容与自谐振频率，超过目标频段后不再保持理想感性。</p>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>饱和电流和温升电流为什么不能互相替代？</summary><p>饱和电流描述磁芯非线性，温升电流描述损耗引起的热限制；一个看峰值，一个通常看 RMS。</p></details>
          <details><summary>电感 DCR 越小是否一定越好？</summary><p>更低 DCR 通常降低铜损，但可能增加尺寸、成本或寄生电容，仍需结合频率、磁芯损耗和布局权衡。</p></details>
          <details><summary>开关频率提高后功率电感可以变小吗？</summary><p>在相同纹波目标下可以减小感值，但开关损耗、磁芯损耗、EMI 和热设计压力会升高。</p></details>
        </div>
      </section>
    </>
  );
}
