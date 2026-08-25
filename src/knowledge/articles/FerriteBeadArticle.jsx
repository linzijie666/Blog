import ArticleFigure from "../ArticleFigure.jsx";
import CircuitDiagram from "../CircuitDiagram.jsx";

export default function FerriteBeadArticle() {
  return (
    <>
      <section id="principle">
        <h2>磁珠为什么能抑制高频噪声</h2>
        <p>磁珠在低频和直流下阻抗较小，在目标高频区呈现较大的损耗性阻抗。它不是单纯把噪声反射回去，而是借助磁性材料损耗把一部分高频能量转化为热。</p>
        <div className="formula-block"><figcaption>磁珠阻抗组成</figcaption><div className="formula">ZFB(f) = R(f) + jX(f)</div><p>抑制噪声时更关注目标频段内的阻性分量，而不是只看“100MHz 时 600Ω”这一点。</p></div>
      </section>

      <section id="parameters">
        <h2>阻抗曲线与额定参数</h2>
        <p>选型应查看完整阻抗曲线、测试条件、额定电流、DCR、温升和直流偏置特性。大电流会降低磁导率，使目标频段阻抗下降；额定电流也不能代替对温升和压降的校核。</p>
        <ArticleFigure src="images/knowledge/passive-components/ferrite-curve.webp" fullSrc="images/knowledge/passive-components/ferrite-curve-hd.jpg" alt="磁珠阻抗电阻与电抗随频率变化的曲线" caption="在目标噪声频段，应确认总阻抗以及损耗性电阻分量是否足够。" sourcePage="44" />
      </section>

      <section id="applications">
        <h2>电源与信号线应用</h2>
        <CircuitDiagram variant="ferrite" />
        <div className="application-list"><article><h3>模拟电源隔离</h3><p>磁珠与两侧去耦电容构成低通网络，减少数字电源噪声进入模拟域。</p></article><article><h3>接口与线缆 EMI</h3><p>在共模或差模噪声路径上提供高频损耗，但不能破坏有效信号带宽和阻抗连续性。</p></article></div>
        <aside className="article-callout"><strong>稳定性提醒：</strong>磁珠与低 ESR 电容组合可能形成高 Q 谐振，需要根据源阻抗、负载和阻尼进行验证。</aside>
      </section>

      <section id="comparison">
        <h2>磁珠和电感的异同</h2>
        <div className="comparison-table-wrap"><table className="comparison-table"><caption>磁珠和电感的异同</caption><thead><tr><th scope="col">维度</th><th scope="col">磁珠</th><th scope="col">电感</th></tr></thead><tbody><tr><th scope="row">主要目标</th><td>耗散高频噪声</td><td>储能、滤波或谐振</td></tr><tr><th scope="row">关注参数</th><td>阻抗曲线、R/X、偏置</td><td>感值、DCR、Isat、Irms</td></tr><tr><th scope="row">典型频段</th><td>MHz 级 EMI</td><td>电源开关与滤波频段</td></tr><tr><th scope="row">模型</th><td>频变损耗网络</td><td>以电感储能为主</td></tr></tbody></table></div>
      </section>

      <section id="workflow">
        <h2>选型流程与易错点</h2>
        <ol className="summary-list"><li>先测量或估算噪声频段和噪声模式。</li><li>查曲线选择目标频段内阻性分量充足的器件。</li><li>在实际直流偏置下复核阻抗、DCR、压降和温升。</li><li>与两侧电容及源负载阻抗一起评估谐振和稳定性。</li><li>通过频谱、近场探头或传导测试验证，而不是只凭标称阻抗。</li></ol>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>磁珠为什么不能简单等效成理想电感？</summary><p>其阻抗和损耗随频率显著变化，目标频段常由阻性分量主导，设计目的也是耗散噪声而非储能。</p></details>
          <details><summary>600Ω@100MHz 是否意味着任何频率都有 600Ω？</summary><p>不是。它只是特定测试条件下的单点指标，必须查看完整曲线和直流偏置后的变化。</p></details>
          <details><summary>磁珠后面并一个大电容就一定能降噪吗？</summary><p>不一定。组合网络可能产生谐振，还可能影响稳压器或负载的瞬态稳定性，需要实测目标频段阻抗。</p></details>
        </div>
      </section>
    </>
  );
}
