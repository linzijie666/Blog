import ArticleFigure from "../ArticleFigure.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function OptocouplerArticle() {
  return (
    <>
      <section id="principle">
        <h2>光耦为什么能隔离</h2>
        <p>光耦把发光二极管和光敏三极管封装在一起：输入侧用电信号点亮 LED，输出侧光敏三极管接收光强再还原成电流，信号以“电→光→电”方式跨越隔离带，输入输出之间没有电气连接，只有光路耦合。</p>
        <p>它解决三件事：两个地之间的干扰隔离（例如强弱电、数字地与功率地）、电平域转换（3.3V 逻辑控制 12V 或更高电压域）、以及单向信号传输——光路只能从输入传向输出。常见封装的 1-2 脚是 LED 阳极/阴极，4-3 脚是输出三极管的集电极/发射极。</p>
        <aside className="article-callout"><strong>面试主线：</strong>先说清“隔离什么、隔离方向”，再谈参数。光耦是单向器件，反向传不了信号；需要双向要用两路或选双向光耦。</aside>
      </section>

      <section id="parameters">
        <h2>CTR 与关键参数</h2>
        <p>光耦的核心参数是 <strong>CTR（电流传输比）</strong>：输出三极管集电极电流与输入 LED 正向电流的比值 <FormulaText text="CTR = I_C/I_F" />，典型规格 50%~400%，同一型号还分档（如 GB 档 100%~400%）。其他关键参数：</p>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <caption>光耦关键参数速查</caption>
            <thead>
              <tr>
                <th scope="col">参数</th>
                <th scope="col">含义</th>
                <th scope="col">典型值</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">CTR</th><td>输出电流与输入电流之比</td><td>50%~400%，随温度和时间老化下降</td></tr>
              <tr><th scope="row">V(BR)CEO</th><td>输出侧 C-E 击穿电压</td><td>约 80V</td></tr>
              <tr><th scope="row">V(BR)ECO</th><td>输出侧 E-C 击穿电压</td><td>约 7V，接线时不可接反</td></tr>
              <tr><th scope="row">IC 最大值</th><td>输出三极管允许电流</td><td>约 50mA</td></tr>
              <tr><th scope="row">开关速度</th><td>ton/toff/tr/tf 决定</td><td>µs 级，常规工作频率不建议超过 10kHz</td></tr>
            </tbody>
          </table>
        </div>
        <ArticleFigure src="images/knowledge/semiconductor-devices/optocoupler-ctr.webp" fullSrc="images/knowledge/semiconductor-devices/optocoupler-ctr-hd.jpg" alt="光耦 CTR 电流传输比参数表与 CTR-IF 特性曲线" caption="CTR 随 IF 工作点和 VCE 变化：设计时按实际工作点查曲线并留出老化与温度余量。" sourcePage="31" />
        <div className="formula-block"><figcaption>输出电流由 CTR 决定</figcaption><div className="formula"><FormulaText text="I_C = I_F·CTR　开关速度 ton/toff 为 µs 级" /></div><p>CTR 在 IF 约 1~10mA 区间达到峰值，IF 太小 CTR 下降；VCE 饱和（0.4V 附近）时 CTR 明显低于 VCE=5V 的测试条件，设计必须按实际工作点取值。</p></div>
        <p>开关速度方面，tr/tf 按输出 VCE 在 90% 与 10% 之间变化定义；常规光耦的导通/关断时间为微秒级，传输 100kHz 以上信号要选高速光耦。CTR 还会随使用时间缓慢衰减，可靠设计要在寿命末期仍满足电流需求。</p>
      </section>

      <section id="circuits">
        <h2>光耦电路设计</h2>
        <p><strong>输入侧限流：</strong>LED 与普通二极管一样需要限流电阻。已知单片机 3.3V 输出、LED 压降 UF=1.25V、目标工作点 IF=2mA，则 <FormulaText text="R_{IN} = (3.3V - 1.25V)/2mA ≈ 1KΩ" />。</p>
        <p><strong>输出侧上拉：</strong>输出三极管相当于受光控制的开关，集电极经上拉电阻接到目标电压域。上拉电阻有下限：输出电流不能超过 <FormulaText text="I_C = I_F·CTR" /> 的能力；取值大一些可以降低静态功耗，但会拖慢上升沿（上拉电阻与负载电容构成 RC）。</p>
        <p>实际应用还要加输出 TVS 防护和输入防反二极管——光耦正向耐压可达几十伏，反向耐压只有几伏，反接会损坏输入侧 LED。注意这个典型电路输出逻辑是反相的：GPIO 高电平→LED 亮→三极管导通→输出被拉低。</p>
        <ArticleFigure src="images/knowledge/semiconductor-devices/optocoupler-circuits.webp" fullSrc="images/knowledge/semiconductor-devices/optocoupler-circuits-hd.jpg" alt="光耦输入限流与输出上拉完整电路设计" caption="输入按 IF 工作点算限流电阻，输出按 IF·CTR 校核上拉电阻下限，输出逻辑取反。" sourcePage="33" />
        <WorkedExample
          title="3.3V GPIO 隔离驱动 12V 输出的光耦校核"
          given={["输入侧 3.3V GPIO，LED 工作点 IF=2mA，VF=1.25V", "光耦 CTR=150%（GB 档，按实际工作点查曲线）", "输出侧 12V 电压域，负载为远端采样回路"]}
          calculation={["输入限流电阻 R10=(3.3-1.25)V/2mA≈1.025K，实取 1K", "输出最大电流 IC=IF×CTR=2mA×150%=3mA", "上拉电阻下限 R11(min)=12V/3mA=4K", "取 5.1K 上拉，导通压降足够低且静态功耗更小"]}
          verification={["CTR 按实际 IF、VCE 工作点查曲线，并预留老化和低温余量", "输出低电平满足后级阈值，上升沿满足信号速度要求", "输出电压 12V 低于 V(BR)CEO 耐压并留余量", "输入加防反二极管，输出按需加 TVS"]}
          answer="我会先定 LED 工作点算限流电阻，再用 CTR 校核输出电流能力和上拉电阻下限，最后检查耐压、速度与逻辑极性，并在寿命末期 CTR 衰减后复算一遍电流预算。"
        />
      </section>

      <section id="oc-od">
        <h2>OC 门、OD 门与线与</h2>
        <p>光耦输出本质上是开路集电极（OC）结构，把话题延伸到开路输出器件：<strong>OC 门</strong>由 NPN 三极管集电极开路实现，<strong>OD 门</strong>由 NMOS 漏极开路实现，两者都必须外接上拉电阻才能输出高电平。</p>
        <p>它们的逻辑功能几乎相同，可以互换：都能做“线与”——多个 OC/OD 输出直接并联，任何一个输出低电平，总线就是低电平；只有全部输出高电平，总线才被上拉为高。差别在细节：OC 门饱和导通的低电平约 0.3V（VCE(sat) 残压），OD 门可以低到接近 0V；OC 门是电流控制、功耗略高。</p>
        <ArticleFigure src="images/knowledge/semiconductor-devices/oc-od-wired-and.webp" fullSrc="images/knowledge/semiconductor-devices/oc-od-wired-and-hd.jpg" alt="OC 门与 OD 门对比电路和线与真值表" caption="OD 门与 OC 门电路逻辑几乎相同可互换，低电平残压分别为约 0V 与 0.3V。" sourcePage="35" />
        <div className="formula-block"><figcaption>线与逻辑</figcaption><div className="formula"><FormulaText text="OUT = IN1·IN2·…·INn（任一为低即低）" /></div><p>两路线与的真值表只有 HH 输出高，其余全为低；上拉电阻在多门并联时可以合并为一个。</p></div>
        <p>线与最有名的应用是 IIC 总线：SDA 数据线靠 OD/OC 输出实现“任一设备拉低即总线为低”，总线空闲时被上拉为高，任意从设备都能发起应答，因此一条线可以挂 127 个从设备。</p>
        <aside className="article-callout"><strong>判断口诀：</strong>推挽输出不能线与（两个低阻电平对打会短路），开路输出才能线与；上拉电阻决定高电平速度与功耗。</aside>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>光耦为什么速度慢？</summary><p>信号要经历 LED 发光、光传输、光敏三极管建流的过程，且输出三极管存在存储效应，ton/toff 为微秒级；常规光耦工作频率不宜超过 10kHz，高速场景选专用高速光耦。</p></details>
          <details><summary>为什么 CTR 要留余量？</summary><p>CTR 随温度降低、器件老化下降，且在 IF 很小或 VCE 饱和时明显低于标称值；按最坏工作点和寿命末期 CTR 复算输出电流，才能保证长期可靠。</p></details>
          <details><summary>OC 门和 OD 门有什么区别？</summary><p>OC 门用 NPN 三极管实现、低电平约 0.3V；OD 门用 NMOS 实现、低电平接近 0V、开关速度更快；两者都需要上拉，逻辑功能可互换。</p></details>
          <details><summary>推挽输出为什么不能做线与？</summary><p>推挽的高电平和低电平都是低阻输出，两个推挽端口电平相异时相当于电源对地短路；只有开路输出加公共上拉才能安全线与。</p></details>
        </div>
      </section>
    </>
  );
}
