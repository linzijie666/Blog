import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function FpgaArticle() {
  return (
    <>
      <section id="compare">
        <h2>SOC 与 FPGA 的区别与联系</h2>
        <p>SOC（System on Chip）把 CPU、GPU、NPU、ISP、视频编解码和各种外设控制器固化在一颗芯片里，软件跑 Android/Linux，性能强、生态成熟；FPGA 是硬件可编程的逻辑阵列（LUT、触发器、BRAM、DSP、收发器），电路结构由硬件描述语言现场重构，天然并行、延迟低。一句话：<strong>SOC 是“固定硬件 + 软件编程”，FPGA 是“硬件本身可编程”</strong>。</p>
        <ArticleFigure src="images/knowledge/digital-chips/soc-block-diagram.webp" fullSrc="images/knowledge/digital-chips/soc-block-diagram-hd.jpg" alt="RK3588 SOC 内部框图" caption="RK3588：四核 A76 + 四核 A55、GPU/NPU、多媒体处理器、丰富接口——典型 SOC 的集成度。" sourcePage="20" />
        <p>容量档位要心里有数：Xilinx 7 系列从 Spartan-7（约 2 万逻辑单元）到 Virtex-7（近 200 万逻辑单元），逻辑单元、Block RAM、DSP 硬核、高速收发器（最高 16.3Gbps）随档位递增，选型按“逻辑规模 + 高速接口”两条线查表。</p>
        <ArticleFigure src="images/knowledge/digital-chips/fpga-7series-table.webp" fullSrc="images/knowledge/digital-chips/fpga-7series-table-hd.jpg" alt="Xilinx 7 系列 FPGA 家族对比表" caption="7 Series 对比：Spartan/Artix/Kintex/Virtex 的逻辑单元、BRAM、DSP 与收发器规格。" sourcePage="21" />
        <p>两者的融合形态是 ZYNQ 这类 SOC+FPGA 器件：PS（Processing System）双核 Cortex-A9 加 DDR 控制器和常用外设，PL（Programmable Logic）是可编程逻辑，之间用多条 AXI 总线互联——软件负责流程控制，硬件负责并行加速。</p>
        <ArticleFigure src="images/knowledge/digital-chips/fpga-zynq-architecture.webp" fullSrc="images/knowledge/digital-chips/fpga-zynq-architecture-hd.jpg" alt="ZYNQ PS+PL 架构框图" caption="ZYNQ-7000：Processing System（ARM+外设）与 Programmable Logic（逻辑+DSP+BRAM）经 AXI 互联。" sourcePage="23" />
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <caption>SOC 与 FPGA 对比</caption>
            <thead>
              <tr>
                <th scope="col">维度</th>
                <th scope="col">SOC</th>
                <th scope="col">FPGA</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">可编程对象</th><td>软件（固定硬件架构）</td><td>硬件电路本身</td></tr>
              <tr><th scope="row">并行能力</th><td>核数固定，靠多核/加速器</td><td>逻辑并行，天然流水线、低延迟</td></tr>
              <tr><th scope="row">开发方式</th><td>Android/Linux + 驱动/应用</td><td>Verilog/VHDL + 时序约束 + 综合</td></tr>
              <tr><th scope="row">单颗成本</th><td>量产便宜，性能/价格比高</td><td>单价高，小批量友好</td></tr>
              <tr><th scope="row">典型用途</th><td>消费电子、复杂系统主控</td><td>协议处理、高速接口、算法加速原型</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="power">
        <h2>三路电源与上电时序</h2>
        <p>FPGA 通常需要三路电源：<strong>VCCINT</strong> 内核电源（1.0V）、<strong>VCCAUX</strong> 辅助电源（1.8V，供 PLL/配置等）、<strong>VCCO</strong> 各 BANK 的 IO 电源（按 IO 标准选 3.3V/2.5V/1.35V 等）。时序错了轻则配置失败，重则闩锁损坏。</p>
        <p>Xilinx 官方建议：上电按 VCCINT/VCCBRAM → VCCAUX → VCCO 顺序，掉电反向。VCCINT 与 VCCBRAM 在推荐电压相同且数据手册允许时可共用同一电源输出；1.0V 的 VCCINT 与 1.8V 的 VCCAUX 不能接到同一固定输出。具体时序、斜率和单调性仍以所用 FPGA 数据手册为准。</p>
        <ArticleFigure src="images/knowledge/digital-chips/fpga-artix-power.webp" fullSrc="images/knowledge/digital-chips/fpga-artix-power-hd.jpg" alt="Artix-7 上电时序与推荐工作条件" caption="Power-On/Off Sequencing 说明 + Table 2 推荐工作条件（VCCINT 0.95~1.05V 等），右侧为课程标注。" sourcePage="24" />
        <p>ALTERA 的写法不同但思路一致：Cyclone V 把电源分成 Group 1（1.1V：VCC、VCCIO_GXB 等）与 Group 2（2.5V：VCCPGA/VCCAUX/VCCPLL 等），要求 Group 1 至少充到满轨的 80% 后 Group 2 才开始上电。</p>
        <ArticleFigure src="images/knowledge/digital-chips/fpga-cyclone-power.webp" fullSrc="images/knowledge/digital-chips/fpga-cyclone-power-hd.jpg" alt="Cyclone V 上电时序分组建议" caption="Figure 10-3：Group 1（1.1V）先行，达到 80% 后再上 Group 2（2.5V）。" sourcePage="25" />
        <aside className="article-callout"><strong>实现手段：</strong>用 LM3881 等时序芯片或 DC-DC 的 PG/EN 链实现先后顺序；VCCO 分 BANK 供电时按 IO 标准分组，注意 BANK 电压与配置引脚所在 BANK 的电平匹配。</aside>
      </section>

      <section id="config">
        <h2>配置与加载：JTAG 与主从 SPI</h2>
        <p>FPGA 的配置数据存放在外部 SPI FLASH，上电后由 FPGA 读取加载。整体配置架构：Microprocessor/CPLD 或专用下载器通过 JTAG 口或配置接口（PROGRAM_B、INIT_B、DONE、CCLK、D00~D03、M[2:0]）与 FPGA 和配置存储器交互。</p>
        <ArticleFigure src="images/knowledge/digital-chips/fpga-config-arch.webp" fullSrc="images/knowledge/digital-chips/fpga-config-arch-hd.jpg" alt="7 系列 FPGA 配置架构框图" caption="配置总体框图：配置存储器、FPGA、JTAG 与 M[2:0]/CCLK/DONE 等信号的关系。" sourcePage="28" />
        <h3>三种加载方式</h3>
        <div className="application-list">
          <article><h3>JTAG 加载</h3><p>经 TMS/TCK/TDI/TDO 直写 FPGA，调试阶段最常用，掉电丢失；JTAG 连接器上通常有 TVS 防护，信号串阻尼电阻。</p></article>
          <article><h3>主模式 SPI</h3><p>FPGA 自己输出 CCLK 时钟，从 QSPI FLASH 读配置流（可 x1/x2/x4 位宽），上电自动加载，产品默认方式。M[2:0]=001 选择 Master SPI x1/x2/x4。</p></article>
          <article><h3>从模式</h3><p>外部主控（MCU/CPLD）提供时钟与数据，FPGA 被动接收；适合多芯片统一由 MCU 管理配置的场景。</p></article>
        </div>
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/digital-chips/fpga-jtag-circuit.webp", fullSrc: "images/knowledge/digital-chips/fpga-jtag-circuit-hd.jpg", alt: "JTAG 连接器电路与 TVS 防护", caption: "JTAG Connector：TMS/TCK/TDI/TDO 经 BAT54S TVS 防护，调试口典型接法。", sourcePage: "27" },
          { src: "images/knowledge/digital-chips/fpga-master-spi.webp", fullSrc: "images/knowledge/digital-chips/fpga-master-spi-hd.jpg", alt: "FPGA 主模式 QSPI FLASH 加载电路", caption: "主模式加载：FPGA 的 CCLK/QSPI_SS/D00~D03 直连 QSPI FLASH。", sourcePage: "27" }
        ]} />
        <p>配置模式由 M[2:0] 三个引脚的电平决定（上拉到 VCCAUX 为 1、下拉到地为 0），JTAG 模式固定为 101；上电时按表采样，配置完成后 DONE 拉高表示加载成功。</p>
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/digital-chips/fpga-mode-circuit.webp", fullSrc: "images/knowledge/digital-chips/fpga-mode-circuit-hd.jpg", alt: "MASTER SPI M[2:0]=001 配置电路", caption: "M[2:0]=001：上拉/下拉电阻组合选择 Master SPI 模式。", sourcePage: "29" },
          { src: "images/knowledge/digital-chips/fpga-mode-table.webp", fullSrc: "images/knowledge/digital-chips/fpga-mode-table-hd.jpg", alt: "Configuration Mode 配置模式表", caption: "配置模式表：Master Serial/SPI/BPI/SelectMAP、JTAG(101)、Slave 模式与位宽、CCLK 方向。", sourcePage: "28" }
        ]} />
        <p>DONE 信号跨电压域要加电平转换：3.3V 域用 LED+限流电阻直接指示“加载成功”，接到 1.8V 域时用一颗 MOS 管转换电平。</p>
        <ArticleFigure src="images/knowledge/digital-chips/fpga-done-circuit.webp" fullSrc="images/knowledge/digital-chips/fpga-done-circuit-hd.jpg" alt="DONE 指示与电平转换电路" caption="左：DONE 经 330R 点亮加载成功 LED；右：1.8V PS_DONE 经 MOS 转到 3.3V 域。" sourcePage="29" />
        <WorkedExample
          title="FPGA 上电不加载的排查"
          given={["板卡上电后 DONE 一直为低，加载成功 LED 不亮", "M[2:0] 配置为 001（Master SPI）", "QSPI FLASH 中已有固件"]}
          calculation={["量 CCLK：无时钟输出 → FPGA 没有发起加载", "量 PROGRAM_B：曾被人接了弱下拉，上电即保持复位", "修正 PROGRAM_B 上拉 4.7k 后重新上电，CCLK 出现，DONE 变高"]}
          verification={["核对 M[2:0] 三个引脚的上拉/下拉与目标模式一致", "确认 VCCINT→VCCAUX→VCCO 上电顺序没有被电源 PG 链打乱", "FLASH 电源与四线 QSPI 连接（D00~D03）逐一测量"]}
          answer="FPGA 不加载按“配置模式引脚 → PROGRAM_B/INIT_B → CCLK 与 FLASH 连接 → 上电时序”的顺序查，多数问题出在配置引脚电平和上电时序上。"
        />
      </section>

      <section id="clock">
        <h2>专用时钟引脚与时钟方案</h2>
        <p>FPGA 的时钟入口有讲究：时钟要进<strong>专用全局/区域时钟引脚</strong>（Xilinx 的 MRCC/SRCC，ALTERA 的专用 CLK 引脚），这些引脚直连片内全时钟网络（BUFIO/BUFR/BUFG/MMCM/PLL 等时钟资源）；从普通 IO 进时钟要走更长的内部路径，偏斜和占空比都会变差。</p>
        <ArticleFigure src="images/knowledge/digital-chips/fpga-clock-region.webp" fullSrc="images/knowledge/digital-chips/fpga-clock-region-hd.jpg" alt="Xilinx Clock Region 时钟资源结构" caption="Figure 1-5 Clock Region：I/O Bank、CMT、BUFIO/BUFR/BUFG 与 SRCC/MRCC 对（红框）的分布。" sourcePage="64" />
        <p>工程上最典型的例子是 HDMI：差分时钟对 HDMI_CLK_P/N 必须落在 MRCC 引脚上，原理图里用红框把这对引脚标出来作为布局约束。</p>
        <ArticleFigure src="images/knowledge/digital-chips/fpga-clock-hdmi.webp" fullSrc="images/knowledge/digital-chips/fpga-clock-hdmi-hd.jpg" alt="HDMI 时钟对使用 MRCC 引脚" caption="HDMI 差分对与时钟对连接：IO_L13P_T2_MRCC_16 标明时钟对占用 MRCC 专用引脚。" sourcePage="64" />
        <h3>有源晶振与时钟缓冲</h3>
        <p>FPGA 参考时钟常用<strong>有源晶振</strong>（oscillator）：内部含振荡电路，供电即输出方波，单端 4 引脚（VDD/GND/EN/OUT）。应用电路要点：电源经磁珠 + 0.1µF/4.7µF 去耦，输出串 22~33Ω 阻尼电阻抑制振铃，EN 引脚 10k 上拉或由主控控制。</p>
        <ArticleFigure src="images/knowledge/digital-chips/osc-active-circuit.webp" fullSrc="images/knowledge/digital-chips/osc-active-circuit-hd.jpg" alt="有源晶振应用电路" caption="50MHz 有源晶振：3.3V 经磁珠供电、OE 上拉、输出经 33R 送到主芯片，EMC 电容预留。" sourcePage="59" />
        <p>无源晶体方案则要匹配负载电容，选型核对频率、频差、ESR 与负载电容 CL（12pF 红框）：这些参数决定外围电容与起振裕量。</p>
        <ArticleFigure src="images/knowledge/digital-chips/quartz-params.webp" fullSrc="images/knowledge/digital-chips/quartz-params-hd.jpg" alt="石英晶体参数规格表" caption="QUARTZ CRYSTAL UNIT SPECIFICATION：25.000MHz、频差 ±20ppm、ESR、负载电容 CL=12pF。" sourcePage="61" />
        <p>一路参考时钟要分给多颗芯片时用<strong>时钟缓冲器</strong>（一进多出、低偏斜），CDCV304 把一路 CLKIN 缓冲成四路输出，各路输出偏斜仅 ±100ps 量级，还能用 OE 控制关断。</p>
        <ArticleFigure src="images/knowledge/digital-chips/clock-buffer-diagram.webp" fullSrc="images/knowledge/digital-chips/clock-buffer-diagram-hd.jpg" alt="CDCV304 时钟缓冲器框图" caption="CDCV304 Functional Block Diagram：CLKIN 经逻辑控制分四路 1Y0~1Y3 输出。" sourcePage="61" />
        <div className="application-list">
          <article><h3>时钟方案选型</h3><p>单芯片用无源晶体（便宜）；多芯片/高速接口用有源晶振（波形好、带使能）；多负载用时钟缓冲器扇出；高速收发器用差分晶振。</p></article>
          <article><h3>成本对比</h3><p>无源晶体几分钱、有源晶振几毛到几块、时钟缓冲器再贵一档——按“负载数量 + 频率精度 + 偏斜要求”决定，不盲目堆料。</p></article>
        </div>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>SOC 和 FPGA 的本质区别是什么？</summary><p>SOC 的硬件架构是固定的，编的是软件；FPGA 的硬件电路本身可编程（LUT/互连可重构），天然并行低延迟。SOC 适合复杂系统主控，FPGA 适合协议处理、高速接口和算法加速；ZYNQ 类器件把两者合在一起用 AXI 互联。</p></details>
          <details><summary>FPGA 为什么需要三路电源？上电顺序是什么？</summary><p>VCCINT 内核（1.0V）、VCCAUX 辅助（1.8V）、VCCO 各 BANK IO 电源（3.3/2.5/1.35V）。Xilinx 建议上电 VCCINT/VCCBRAM → VCCAUX → VCCO，掉电反向，保证上电瞬间 IO 三态；ALTERA 按 Group 1（1.1V）先于 Group 2（2.5V），Group 1 达 80% 后再上 Group 2。</p></details>
          <details><summary>FPGA 有哪几种配置加载方式？</summary><p>JTAG 直写（调试、掉电丢失）、主模式 SPI（FPGA 输出 CCLK 读 QSPI FLASH，产品默认）、从模式（外部主控供时钟与数据）。M[2:0] 选择模式，JTAG 固定 101，配置完成 DONE 拉高。</p></details>
          <details><summary>为什么时钟要接专用时钟引脚？</summary><p>MRCC/SRCC 专用引脚直连全局/区域时钟网络（BUFIO/BUFR/BUFG/MMCM），偏斜小、资源直达；普通 IO 进时钟路径长、偏斜大。HDMI 等高速接口的差分时钟必须落在 MRCC 上。</p></details>
          <details><summary>有源晶振和无源晶振怎么选？</summary><p>无源晶体便宜但要匹配负载电容（CL=(C1C2)/(C1+C2)+Cstray），依赖芯片内部振荡电路；有源晶振供电即输出、带使能、波形规整，多芯片共享时钟时再加时钟缓冲器扇出。</p></details>
          <details><summary>DONE 引脚有什么用？跨电压域怎么处理？</summary><p>DONE 拉高表示配置加载成功，可点 LED 指示；3.3V 与 1.8V 域之间用 MOS 管做电平转换，避免直接互连损坏 IO。</p></details>
        </div>
      </section>
    </>
  );
}
