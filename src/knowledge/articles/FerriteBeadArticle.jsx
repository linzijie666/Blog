import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function FerriteBeadArticle() {
  return (
    <>
      <section id="principle">
        <h2>磁珠为什么能抑制高频噪声</h2>
        <p>磁珠在直流和低频下阻抗较小，在目标噪声频段呈现较大的损耗性阻抗。它不是单纯把噪声反射回去，而是借助磁性材料损耗把一部分高频能量转化为热。</p>
        <div className="formula-block"><figcaption>磁珠阻抗组成</figcaption><div className="formula">ZFB(f) = R(f) + jX(f)</div><p>抑制 EMI 时更关注目标频段的阻性分量 R(f)，而不是只看某个频点的总阻抗。</p></div>
      </section>

      <section id="parameters">
        <h2>阻抗曲线与额定参数</h2>
        <div className="selection-grid">
          <article><h3>完整阻抗曲线</h3><p>标称 600Ω@100MHz 只是单点。需要确认噪声频率落在高损耗区，并区分 R 与 X 的占比。</p></article>
          <article><h3>直流偏置</h3><p>负载电流会降低磁导率，使目标频段阻抗下降。必须查看偏置条件下的曲线，而不是只看零偏数据。</p></article>
          <article><h3>DCR 与压降</h3><p>直流路径上的 DCR 会产生压降和 I²R 发热，低压大电流电源尤其敏感。</p></article>
          <article><h3>额定电流与温升</h3><p>额定电流通常由温升或阻抗下降定义，需要结合工作温度和厂商判据。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/passive-components/ferrite-curve.webp" fullSrc="images/knowledge/passive-components/ferrite-curve-hd.jpg" alt="磁珠总阻抗电阻与电抗随频率变化的曲线" caption="在目标噪声频段，应确认总阻抗、阻性分量和直流偏置后的衰减。" sourcePage="44" />
      </section>

      <section id="applications">
        <h2>电源与信号线应用</h2>
        <div className="application-list">
          <article><h3>模拟电源隔离</h3><p>磁珠与负载侧去耦电容构成低通网络，减少数字电源噪声进入模拟域。</p></article>
          <article><h3>π 型滤波</h3><p>磁珠前后都放置电容可提高衰减，但源阻抗、低 ESR 电容和负载可能形成高 Q 谐振峰。</p></article>
          <article><h3>接口与线缆 EMI</h3><p>在噪声路径上提供高频损耗，但必须保证有效信号带宽、直流电平和阻抗连续性。</p></article>
          <article><h3>时钟与敏感电源域</h3><p>可隔离 PLL、ADC、时钟和射频电源，但应先确认噪声频谱和稳压器的稳定性要求。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/passive-components/ferrite-applications.webp" fullSrc="images/knowledge/passive-components/ferrite-applications-hd.jpg" alt="磁珠用于电源隔离时钟和模拟电源滤波的应用电路" caption="磁珠要放在实际噪声电流路径上，并与负载侧去耦共同验证。" sourcePage="42" />

        <WorkedExample
          title="磁珠电源滤波选型"
          given={["3.3V 电源域负载电流 300mA", "频谱测得主要干扰在 100MHz", "希望隔离数字电源与模拟负载"]}
          calculation={["先在厂商曲线中确认 100MHz 处由阻性分量主导", "在 300mA 直流偏置曲线下重新读取有效阻抗", "用 0.3A × DCR 估算直流压降，并用 0.3A² × DCR 估算铜损"]}
          verification={["额定电流、温升和压降满足电源预算", "负载侧放置就近去耦，必要时增加阻尼抑制谐振峰", "确认磁珠不会破坏稳压器与负载的瞬态稳定性", "用频谱仪或近场探头复测 100MHz 干扰"]}
          answer="我不会只按 600Ω@100MHz 选型。我会先确认目标噪声频段和阻性分量，再检查 300mA 直流偏置后的阻抗、DCR 压降与温升，最后结合两侧电容实测谐振和衰减。"
        />
      </section>

      <section id="comparison">
        <h2>磁珠和电感的异同</h2>
        <div className="comparison-table-wrap"><table className="comparison-table"><caption>磁珠和电感的异同</caption><thead><tr><th scope="col">维度</th><th scope="col">磁珠</th><th scope="col">电感</th></tr></thead><tbody><tr><th scope="row">主要目标</th><td>耗散高频噪声</td><td>储能、滤波或谐振</td></tr><tr><th scope="row">关注参数</th><td>阻抗曲线、R/X、偏置</td><td>感值、DCR、Isat、Irms</td></tr><tr><th scope="row">典型频段</th><td>MHz 级 EMI</td><td>电源开关与滤波频段</td></tr><tr><th scope="row">能量处理</th><td>以损耗为目标</td><td>以储能为主要目标</td></tr></tbody></table></div>
        <ArticleFigure src="images/knowledge/passive-components/ferrite-comparison.webp" fullSrc="images/knowledge/passive-components/ferrite-comparison-hd.jpg" alt="磁珠低通应用和磁珠与电感区别说明" caption="磁珠用于耗散高频噪声，功率电感用于可控储能，两者不能只按外形替换。" sourcePage="43" />
      </section>

      <section id="workflow">
        <h2>选型流程与易错点</h2>
        <ol className="summary-list"><li>先测量或估算目标噪声频段和共模、差模路径。</li><li>查完整曲线，选择目标频段内阻性分量充足的器件。</li><li>在实际直流偏置下复核阻抗、DCR、压降和温升。</li><li>与两侧电容、源阻抗和负载一起评估 π 型滤波的谐振峰和稳定性。</li><li>通过频谱、近场探头或传导测试验证，而不是只凭标称阻抗。</li></ol>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>磁珠为什么不能简单等效成理想电感？</summary><p>其阻抗和损耗随频率显著变化，目标频段常由阻性分量主导，设计目的也是耗散噪声而非储能。</p></details>
          <details><summary>600Ω@100MHz 是否意味着任何频率都有 600Ω？</summary><p>不是。它只是特定测试条件下的单点指标，必须查看完整曲线和直流偏置后的变化。</p></details>
          <details><summary>磁珠后面并一个大电容就一定能降噪吗？</summary><p>不一定。组合网络可能产生谐振峰，还可能影响稳压器或负载的瞬态稳定性，需要实测目标频段。</p></details>
        </div>
      </section>
    </>
  );
}
