import ArticleFigure from "../ArticleFigure.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function IicSpiArticle() {
  return <>
    <section id="iic-principle">
      <h2>IIC 协议与信号定义</h2>
      <p>IIC 用 SCL、SDA 两根开漏线完成同步半双工通信。标准、快速和高速模式分别为 100kHz、400kHz、3.4MHz；7 位地址理论上提供 128 个编码。空闲时两线均为高，SCL 为高期间 SDA 高→低是 START、低→高是 STOP，普通数据只能在 SCL 低时变化。</p>
      <ArticleFigure src="images/knowledge/high-speed-interfaces/iic-frame-protocol.webp" fullSrc="images/knowledge/high-speed-interfaces/iic-frame-protocol-hd.jpg" alt="IIC 帧协议" caption="地址、R/W、ACK、寄存器地址与数据按 8bit+第 9 个应答时钟组织；R/W=0 写、R/W=1 读。" sourcePage="7" />
      <ArticleFigure src="images/knowledge/high-speed-interfaces/iic-start-stop-wave.webp" fullSrc="images/knowledge/high-speed-interfaces/iic-start-stop-wave-hd.jpg" alt="IIC 起止条件波形" caption="START/STOP 只允许主机在 SCL 高电平时改变 SDA；第 9 个时钟 SDA 被拉低表示 ACK。" sourcePage="7" />
    </section>
    <section id="iic-circuits">
      <h2>物理连接、电平转换与隔离</h2>
      <p>总线只需要一组上拉，同型号从机用 A0/A1/A2 改地址。不同 IO 电压必须转换：低成本双向 NMOS 适合低速，GTL2002DP 等专用器件更稳妥；大功率系统跨隔离域可用 NSI8100，典型隔离耐压 5000Vrms、速率 2MHz、CMTI 150kV/µs。</p>
      <ArticleFigure src="images/knowledge/high-speed-interfaces/iic-multi-at24c256.webp" fullSrc="images/knowledge/high-speed-interfaces/iic-multi-at24c256-hd.jpg" alt="多个 AT24C256 地址配置" caption="AT24C256 用 A2/A1/A0 上下拉错开地址，同一 SCL/SDA 总线上不重复放置上拉。" sourcePage="9" />
      <ArticleFigure src="images/knowledge/high-speed-interfaces/iic-nsi8100.webp" fullSrc="images/knowledge/high-speed-interfaces/iic-nsi8100-hd.jpg" alt="NSI8100 隔离 IIC 电路" caption="双通道隔离器把控制侧和高功率侧电气隔离，两侧各按本域电压配置上拉。" sourcePage="10" />
    </section>
    <section id="iic-open-drain">
      <h2>开漏输出与上拉电阻选择</h2>
      <p>开漏允许任何设备只把总线拉低，实现“线与”；若多个推挽输出一高一低则会直通。上拉常取 1kΩ~10kΩ：过大使 RC 上升沿变慢，过小会增加静态功耗、超过灌电流或抬高低电平。</p>
      <div className="formula-block"><figcaption>RC 上升时间</figcaption><div className="formula"><FormulaText text="t_r=0.8473×R_P×C_L" /></div><p>快速模式在 400pF 总线电容下要求 tr≤300ns，所以挂载器件、线长增加后通常要减小上拉。</p></div>
      <ArticleFigure src="images/knowledge/high-speed-interfaces/iic-rc-model.webp" fullSrc="images/knowledge/high-speed-interfaces/iic-rc-model-hd.jpg" alt="IIC 总线 RC 充电模型" caption="上拉电阻与总线寄生电容决定上升时间；30%→70% VDD 的时间为 0.8473RC。" sourcePage="11" />
      <WorkedExample title="400kHz IIC 上拉电阻校核" given={["VDD=3.3V，总线电容 CL=200pF", "快速模式 tr≤300ns，器件最小灌电流 4mA"]} calculation={["由 tr=0.8473RPCL，RP≤300ns/(0.8473×200pF)=1.77kΩ", "取 1.5kΩ，拉低电流约 3.3V/1.5kΩ=2.2mA"]} verification={["2.2mA 小于 4mA 灌电流能力", "还需按器件 VOL 最大值校核 VIL≤0.3VDD"]} answer="先用上升时间算电阻上限，再用灌电流和低电平阈值算下限，1.5kΩ 满足本例。" />
    </section>
    <section id="spi-principle">
      <h2>SPI 协议与四种模式</h2>
      <p>SPI 用 CSn、SCLK、MOSI、MISO 四线全双工传输，常见速率 10~100MHz。CPOL 决定时钟空闲电平，CPHA 决定在第一还是第二个边沿采样；Mode 0 即 CPOL=0、CPHA=0，使用最广。</p>
      <ArticleFigure src="images/knowledge/high-speed-interfaces/spi-cpol-cpha.webp" fullSrc="images/knowledge/high-speed-interfaces/spi-cpol-cpha-hd.jpg" alt="SPI CPOL 与 CPHA 四模式" caption="主从两端必须配置相同模式；模式错误常表现为每字节移位或边界位不稳定。" sourcePage="13" />
    </section>
    <section id="spi-circuits">
      <h2>SPI 电路设计与多从扩展</h2>
      <p>CSn 预留 5~10kΩ 上拉，SCLK、MOSI、MISO 可串 22~33Ω 源端电阻：MOSI/SCLK 靠主控，MISO 靠从机。推挽高速 SPI 不宜照搬 IIC 的 NMOS 转换，应选方向、速率和压摆率匹配的电平转换器。多个从机共享 SCLK/MOSI/MISO，各自独占 CSn；残桩变长时需要降速。</p>
      <ArticleFigure src="images/knowledge/high-speed-interfaces/spi-stm32-w25q.webp" fullSrc="images/knowledge/high-speed-interfaces/spi-stm32-w25q-hd.jpg" alt="STM32 与 W25Q SPI 电路" caption="CSn、WPn、HOLDn 上拉，源端串阻抑制过冲；QUAD 模式可把数据线扩到四根。" sourcePage="17" />
      <ArticleFigure src="images/knowledge/high-speed-interfaces/spi-multi-slave.webp" fullSrc="images/knowledge/high-speed-interfaces/spi-multi-slave-hd.jpg" alt="SPI 多从机连接" caption="每个从机独立片选，共享时钟与数据；支路过长会形成残桩。" sourcePage="19" />
    </section>
    <section id="compare"><h2>IIC 与 SPI 对比</h2><div className="comparison-table-wrap"><table className="comparison-table"><caption>板内串行总线取舍</caption><thead><tr><th scope="col">项目</th><th scope="col">IIC</th><th scope="col">SPI</th></tr></thead><tbody><tr><th scope="row">连接</th><td>2 线、地址总线</td><td>4 线起、每从机一根 CSn</td></tr><tr><th scope="row">输出/方向</th><td>开漏、半双工</td><td>推挽、全双工</td></tr><tr><th scope="row">速度</th><td>100k/400k/3.4MHz</td><td>常见 10~100MHz</td></tr><tr><th scope="row">适用</th><td>传感器与寄存器配置</td><td>FLASH、ADC/DAC、显示与网口芯片</td></tr></tbody></table></div></section>
    <section id="interview"><h2>面试自测</h2><details><summary>IIC 为什么必须开漏加上拉？</summary><p>开漏实现多器件线与和仲裁，避免推挽冲突；上拉负责恢复高电平。</p></details><details><summary>上拉电阻怎样选？</summary><p>先按 0.8473RC 与模式上升时间算上限，再按灌电流、VOL/VIL 和功耗算下限。</p></details><details><summary>SPI 四种模式由什么决定？</summary><p>CPOL 决定空闲电平，CPHA 决定第一或第二个有效边沿采样。</p></details></section>
  </>;
}
