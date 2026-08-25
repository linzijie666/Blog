import ArticleShell from "./ArticleShell.jsx";
import { legacyArticle } from "./articles.js";

function Formula({ label, children, note }) {
  return (
    <figure className="formula-block">
      <figcaption>{label}</figcaption>
      <div className="formula" aria-label={`${label}：${children}`}>
        {children}
      </div>
      <p>{note}</p>
    </figure>
  );
}

export default function KnowledgeArticle({ email }) {
  return (
    <ArticleShell article={legacyArticle} email={email}>
          <section id="intuition">
            <h2>先纠正一句口诀</h2>
            <p>
              “隔”和“通”不是理想开关。更准确地说，电容阻碍恒定电压建立持续电流，电感阻碍电流发生变化。口诀描述的是理想元件在直流稳态和正弦稳态下的极限表现。
            </p>
            <aside className="article-callout">
              <strong>本质：</strong>电容电压不能突变，电感电流不能突变。
            </aside>
          </section>

          <section id="capacitor">
            <h2>电容为什么隔直流、通交流</h2>
            <p>
              电容通过两块极板储存电场能量。接入直流的一瞬间，极板开始充电，外部电路存在充电电流；充满后的电压不再变化，理想电容电流降为零，因此直流稳态下等效开路。
            </p>
            <Formula
              label="电容的时域关系"
              note="电压变化越快，电流越大；电压恒定时，电流为零。"
            >
              i = C du/dt
            </Formula>
            <p>
              交流电压持续改变方向和大小，电容反复充放电，所以外部导线中持续出现交变电流。电子并没有穿过绝缘介质，而是极板电荷反复重新分布，形成了外部电路中的电流。
            </p>
            <Formula
              label="电容的复阻抗"
              note="频率 f 越高，容抗越小；f = 0 时阻抗趋于无穷大。正弦稳态下，电容电流超前电压 90°。"
            >
              Z_C = 1/(jωC)，|Z_C| = 1/(2πfC)
            </Formula>
          </section>

          <section id="inductor">
            <h2>电感为什么通直流、隔交流</h2>
            <p>
              线圈中的电流产生磁场。电流一旦变化，磁通量也变化，电感依据楞次定律产生感应电压，方向总是阻碍原电流的变化。因此电感表现出“电流惯性”。
            </p>
            <Formula
              label="电感的时域关系"
              note="电流变化越快，需要的电感电压越大；电流恒定时，理想电感电压为零。"
            >
              u = L di/dt
            </Formula>
            <p>
              接入直流的一瞬间，电感阻碍电流从零突然上升；进入稳态后电流不再变化，理想电感两端电压为零，等效为短路。交流频率越高，电流变化越快，电感的阻碍越强。
            </p>
            <Formula
              label="电感的复阻抗"
              note="频率 f 越高，感抗越大；f = 0 时理想感抗为零。正弦稳态下，电感电流滞后电压 90°。"
            >
              Z_L = jωL，|Z_L| = 2πfL
            </Formula>
          </section>

          <section id="comparison">
            <h2>电容与电感的对偶关系</h2>
            <div className="comparison-table-wrap">
              <table className="comparison-table">
                <caption>电容与电感特性比较</caption>
                <thead>
                  <tr>
                    <th scope="col">特性</th>
                    <th scope="col">电容</th>
                    <th scope="col">电感</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">不能突变</th>
                    <td>电压</td>
                    <td>电流</td>
                  </tr>
                  <tr>
                    <th scope="row">直流稳态</th>
                    <td>开路</td>
                    <td>短路</td>
                  </tr>
                  <tr>
                    <th scope="row">频率升高</th>
                    <td>阻抗减小</td>
                    <td>阻抗增大</td>
                  </tr>
                  <tr>
                    <th scope="row">储能形式</th>
                    <td>电场，W = Cu²/2</td>
                    <td>磁场，W = Li²/2</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              需要区分接通瞬间和稳态。刚加上直流时，电容会充电，电感电流会逐渐上升；只有时间足够长后，才分别近似开路和短路。如果电容电压或电感电流被强迫突变，理想模型将分别要求无限大的电流或电压。
            </p>
          </section>

          <section id="applications">
            <h2>通信工程中的典型应用</h2>
            <div className="application-list">
              <article>
                <h3>耦合电容</h3>
                <p>串联在放大器级间，阻断前一级直流偏置，只把信号的交流分量送往下一级。</p>
              </article>
              <article>
                <h3>去耦与旁路电容</h3>
                <p>并联在电源与地之间，为高频噪声提供低阻抗回路，同时不把直流电源短路。</p>
              </article>
              <article>
                <h3>射频扼流圈</h3>
                <p>串联在偏置供电线上，让直流进入射频电路，同时用较高感抗阻止射频信号窜回电源。</p>
              </article>
              <article>
                <h3>LC 滤波与选频</h3>
                <p>利用容抗下降和感抗上升的频率特性，构造低通、高通、带通与谐振网络。</p>
              </article>
            </div>
          </section>

          <section id="nonideal">
            <h2>真实器件并不理想</h2>
            <p>
              实际电容具有 ESR、ESL 和漏电流，超过自谐振频率后可能表现得更像电感；实际电感具有绕组直流电阻、寄生电容和磁芯损耗，超过自谐振频率后也不再保持理想感性。
            </p>
            <aside className="article-callout">
              选择器件时不仅要看 C 或 L，还要检查工作频率、自谐振频率、额定电压或电流、损耗和封装寄生参数。
            </aside>
          </section>

          <section id="summary">
            <h2>最后记住这四句话</h2>
            <ol className="summary-list">
              <li>电容电压不能突变，电感电流不能突变。</li>
              <li>直流稳态下，理想电容开路，理想电感短路。</li>
              <li>频率越高，电容阻抗越小，电感阻抗越大。</li>
              <li>“通”和“隔”都是相对阻抗，不代表现实器件的绝对开路或短路。</li>
            </ol>
          </section>
    </ArticleShell>
  );
}
