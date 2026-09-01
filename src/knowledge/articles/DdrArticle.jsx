import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function DdrArticle() {
  return (
    <>
      <section id="operations">
        <h2>SDRAM 的操作流程与指令</h2>
        <p>SDRAM（Synchronous DRAM，同步动态随机存储器）靠电容存储电荷保存数据，需要周期性刷新；DDR SDRAM 是其升级版，时钟上下双沿采样（Double Data Rate）。它的操作由<strong>命令</strong>驱动：CS#、RAS#、CAS#、WE#（配合 CKE）在时钟沿上组合译码出 NOP、激活、读、写、预充电、刷新和模式寄存器配置等指令。</p>
        <ArticleFigure src="images/knowledge/digital-chips/ddr-command-table.webp" fullSrc="images/knowledge/digital-chips/ddr-command-table-hd.jpg" alt="SDRAM 指令真值表" caption="指令真值表：NOP/激活/读/写/预充电/自动刷新/模式寄存器由 CS#/RAS#/CAS#/WE# 组合译码。" sourcePage="32" />
        <p>标准操作流程要按顺序背下来：</p>
        <div className="application-list">
          <article><h3>上电初始化</h3><p>电源与时钟稳定后等待 200µs → 对所有 BANK 预充电 → 自动刷新 8 次 → 加载模式寄存器（设定 CL、突发长度等）。</p></article>
          <article><h3>激活 ACT</h3><p>读写前先激活目标 BANK 的目标行，行数据进入灵敏放大器；行地址由 A0~A13 提供。</p></article>
          <article><h3>读 / 写</h3><p>激活后按列地址读写，突发（Burst）方式连续传输，读出延迟由 CAS Latency（CL）决定。</p></article>
          <article><h3>预充电 PRECHARGE</h3><p>操作完把打开的行写回并关闭（A10=1 预充所有 BANK），为下一次激活做准备。</p></article>
          <article><h3>刷新 REFRESH</h3><p>电容会漏电，控制器周期性发起自动刷新（典型 64ms 内刷完全部行），期间总线不可用。</p></article>
        </div>
        <p>模式寄存器决定器件的工作方式：A0~A2 选突发长度、A3 选突发类型、A4~A6 选 CAS Latency、A7~A9 是写突发模式与保留位（DDR2/3 还有扩展模式寄存器配置驱动强度、ODT 等）。</p>
        <ArticleFigure src="images/knowledge/digital-chips/ddr-mode-register.webp" fullSrc="images/knowledge/digital-chips/ddr-mode-register-hd.jpg" alt="配置模式寄存器位定义" caption="图 7.17 配置模式寄存器：突发长度、突发类型、CAS Latency、写突发模式各位段。" sourcePage="33" />
        <p>颗粒内部的层级结构帮助理解这些操作：地址/命令进入后经 bank 逻辑分发到 8 个 BANK 阵列，读数据经多路选择与 DLL 对齐后由 DQS 选通输出——这也解释了为什么激活要先于读写、刷新会占用总线。</p>
        <ArticleFigure src="images/knowledge/digital-chips/ddr-internal-block.webp" fullSrc="images/knowledge/digital-chips/ddr-internal-block-hd.jpg" alt="DDR SDRAM 内部功能框图" caption="内部功能框图：地址/命令 → bank 控制 → 存储阵列 → 读多路选择 → DLL → DQS/DQ。" sourcePage="40" />
      </section>

      <section id="pinout">
        <h2>引脚分类与地址复用</h2>
        <p>DDR 颗粒引脚可以分成五类：<strong>地址线</strong>（行/列复用 + BANK 选择）、<strong>命令线</strong>（CS#/RAS#/CAS#/WE#/CKE）、<strong>时钟</strong>（CK/CK# 差分）、<strong>数据线</strong>（DQ + DQS 数据选通 + DM 数据掩码）、<strong>电源与参考</strong>（VDD/VDDQ/VREF）。读原理图时按这五类分组标注，信号就理得清。</p>
        <ArticleFigure src="images/knowledge/digital-chips/ddr-ball-table.webp" fullSrc="images/knowledge/digital-chips/ddr-ball-table-hd.jpg" alt="镁光 DDR3 颗粒引脚说明表" caption="MT41K128M16JT-125（96-ball x16）Ball Descriptions：地址、BANK、时钟、命令、数据掩码与 ODT。" sourcePage="35" />
        <p>地址线是复用的精髓：同一组 A 引脚在激活时当<strong>行地址</strong>（A0~A13，2¹⁴=16384 行），读写时当<strong>列地址</strong>（A0~A9，2¹⁰=1024 列），BA0~BA2 三根选择 8 个 BANK；DDR4 再叠加 Bank Group（BG0~BG1）一层分组。</p>
        <ArticleFigure src="images/knowledge/digital-chips/ddr-address-table.webp" fullSrc="images/knowledge/digital-chips/ddr-address-table-hd.jpg" alt="行列地址译码示例表" caption="行地址×列地址译码示例：激活选行、读写选列，同一组地址引脚分时复用。" sourcePage="36" />
        <p>命令线五根记住功能即可：CS# 片选、RAS# 行地址选通、CAS# 列地址选通、WE# 写使能、CKE 时钟使能（自刷新入口）。数据线以 8bit 或 16bit 为一组，配一对 DQS 选通和 1~2 根 DM 掩码，读写对齐都以 DQS 为基准。</p>
      </section>

      <section id="capacity">
        <h2>容量与带宽计算</h2>
        <p>容量计算是 DDR 面试的必考题，公式一句话：</p>
        <div className="formula-block"><figcaption>存储容量计算</figcaption><div className="formula"><FormulaText text="容量 = 2^{(行地址线数+列地址线数+BANK线数+BG线数)} × 数据线位宽" /></div><p>注意 BG 线数仅 DDR4 有，SDRAM/DDR1-3 按 BG=0 计算。</p></div>
        <p>以华邦 SDRAM W9825G6KH 为例：行地址 A0~A12 共 13 根、列地址复用 A0~A8 共 9 根、BANK 选择 BS0~BS1 共 2 根、数据 16 位：</p>
        <div className="formula-block"><figcaption>W9825G6KH 容量</figcaption><div className="formula"><FormulaText text="2^{(13+9+2)}×16=2^{24}×16=268,435,456 bit=256Mb" /></div><p>即 32MB 的 SDRAM 颗粒，与型号里 "25"（256Mbit）对应。</p></div>
        <ArticleFigure src="images/knowledge/digital-chips/ddr-capacity-sdram.webp" fullSrc="images/knowledge/digital-chips/ddr-capacity-sdram-hd.jpg" alt="W9825G6KH 引脚表与容量计算" caption="W9825G6KH PIN DESCRIPTION：A0~A12 行地址、A0~A8 列地址、BS0/BS1、DQ0~DQ15 与容量推导。" sourcePage="39" />
        <p>DDR3 颗粒按配置表算：128Meg×16 颗粒行地址 A[13:0]（16K）、BANK 8 个（BA[2:0]）、列地址 A[9:0]（1K）：</p>
        <div className="formula-block"><figcaption>DDR3 128Meg×16 容量</figcaption><div className="formula"><FormulaText text="16K×1K×8×16=2^{14+10+3}×2^4=2^{31}=2Gb" /></div><p>单颗 2Gbit（256MB），4 颗位宽拼成 64bit 总线即 1GB 内存。</p></div>
        <ArticleFigure src="images/knowledge/digital-chips/ddr-capacity-ddr3.webp" fullSrc="images/knowledge/digital-chips/ddr-capacity-ddr3-hd.jpg" alt="DDR3 容量参数表" caption="256Meg×8 与 128Meg×16 配置对照：行地址 16K、BANK 8、列地址 1K（红框为 x16 配置）。" sourcePage="39" />
        <p>DDR4 多了 Bank Group 一层：4Gb 颗粒以 256Mb×16 配置为例：2 个 Bank Group（BG 地址仅 BG0 一根）× 4 BANK（BA0~BA1）× 行地址 A0~A14 × 列地址 A0~A9 × 16bit 位宽，2^(1+2+15+10)×16=2³²=4Gb；同容量的 x4 配置则是 4 BG（BG0~1）× 行地址 A0~A15 × 列地址 A0~A9 × 4bit。</p>
        <ArticleFigure src="images/knowledge/digital-chips/ddr-capacity-ddr4.webp" fullSrc="images/knowledge/digital-chips/ddr-capacity-ddr4-hd.jpg" alt="DDR4 4Gb Addressing Table" caption="4Gb Addressing Table：BG、Bank、Row、Column 各地址位数（256Mb×16 列红框）。" sourcePage="40" />
        <p>带宽 = 数据速率 × 总线位宽 ÷ 8。DDR4-1600 单通道 64bit：<FormulaText text="1600Mbps×64/8=12.8GB/s" />；双通道再翻倍。speed bin 表给出各速率档的 tCK、CL、tRCD/tRP/tRAS/tRC 时序参数，选型时速率与时序余量一起看。</p>
        <ArticleFigure src="images/knowledge/digital-chips/ddr-speedbin.webp" fullSrc="images/knowledge/digital-chips/ddr-speedbin-hd.jpg" alt="DDR4 speed bin 参数表" caption="Table 2 DDR4-1600/1866/2133/2400 speed bins：tCK、CL、tRCD、tRP、tRAS、tRC。" sourcePage="41" />
        <WorkedExample
          title="判断开发板 DDR3 颗粒的总容量"
          given={["颗粒型号 MT41K128M16JT-125（128Meg × 16，DDR3L）", "行地址 A[13:0] 共 14 根，BANK BA[2:0] 共 3 根，列地址 A[9:0] 共 10 根", "板卡上焊了 2 颗同型号颗粒"]}
          calculation={["单颗容量 = 2^{(14+10+3)} × 16bit = 2^{27} × 2^{4} = 2^{31} bit = 2Gb", "换算字节：2Gb / 8 = 256MB", "两颗拼位宽：总位宽 32bit，总容量 2×256MB = 512MB"]}
          verification={["核对原理图地址线连接：A[13:0] 与 BA[2:0] 是否全部连接", "DQS/DM 与 DQ 组的对应关系决定能不能位宽拼接", "容量问法常反过来：给容量问地址线根数，用同一公式反推"]}
          answer="先按 行×列×BANK×位宽 算单颗，再按板卡颗粒数与位宽拼法算总量——套路固定，考场直接套。"
        />
      </section>

      <section id="routing">
        <h2>等长设计与引脚交换</h2>
        <h3>哪些引脚可以交换</h3>
        <p>画原理图和 PCB 前先明确交换规则，能大幅降低布线难度：<strong>数据线 DQ 可以在同组内任意交换</strong>——一个 DQS 选通对应的一组 DQ（8bit 组内，如 DQ0~DQ7）内部任意调换，例如 DQ0 与 DQ7 对调；组与组之间不能混，DM、DQS 与各自的 DQ 组绑定；<strong>地址、命令、控制线不能随意交换</strong>，否则初始化后容量与时序参数全错。</p>
        <ArticleFigure src="images/knowledge/digital-chips/ddr-pin-swap.webp" fullSrc="images/knowledge/digital-chips/ddr-pin-swap-hd.jpg" alt="DQ 数据线交换分组图" caption="MT41K128M16JT-125 的 DQ15~DQ0 与 UDQS/LDQS、UDM/LDM 分组：组内可任意交换。" sourcePage="47" />
        <h3>等长与阻抗规则</h3>
        <div className="application-list">
          <article><h3>数据组等长</h3><p>每组 DQ 相对配对 DQS 做组内等长（按速率给 ±25~50mil 公差），DQS 差分对内紧耦合等长。</p></article>
          <article><h3>地址/命令等长</h3><p>地址、命令、控制线相对 CK 时钟做等长，公差比数据组宽松一档。</p></article>
          <article><h3>阻抗与参考</h3><p>单端线按 40/50Ω 控阻抗，DQS 差分 80~100Ω；完整地平面做参考，禁止跨分割。</p></article>
          <article><h3>端接与 VREF</h3><p>DDR3 依靠片内 ODT 端接，按速率配置（40/60/120Ω）；VREF 引脚就近放去耦电容。</p></article>
        </div>
        <p>看一张真实开发板原理图找感觉：ZYNQ 的 DDRI3 地址/BA/CK 与 DDR3 颗粒的 DQ0~15、UDQS/LDQS 分区连线，网络标号按组命名，后续 PCB 的组内等长就按这些组执行。</p>
        <ArticleFigure src="images/knowledge/digital-chips/ddr-routing-schematic.webp" fullSrc="images/knowledge/digital-chips/ddr-routing-schematic-hd.jpg" alt="AX7105 开发板 DDR3 原理图" caption="ALINX AX7105：ZYNQ DDRI3 地址/BA/CK 组与 DDR3 颗粒 DQ/DQS/DM 组的网络划分。" sourcePage="43" />
        <aside className="article-callout"><strong>常见误区：</strong>以为 DQ 交换要和 PCB 一一对应其实组内随意、以为地址线也能交换（不行）、忘记 VTT/VREF 去耦。多片位宽拼接时同组信号必须落到相同位宽段。</aside>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>SDRAM 的基本操作流程是什么？</summary><p>上电初始化（等 200µs → 预充电 → 自动刷新 8 次 → 加载模式寄存器），之后循环“激活行 → 列读写 → 预充电关闭行”，控制器再周期性发起自动刷新防止电容漏电丢数据。</p></details>
          <details><summary>DDR 的容量怎么计算？</summary><p>容量 = 2^(行地址线数+列地址线数+BANK 线数+BG 线数) × 位宽。例如 W9825G6KH：2^(13+9+2)×16bit=256Mb；DDR3 128Meg×16 颗粒：16K×1K×8×16bit=2Gb。BG 仅 DDR4 有。</p></details>
          <details><summary>DDR 哪些引脚可以交换？哪些不行？</summary><p>DQ 数据线在同一 DQS 组内可任意交换（如 DQ0↔DQ7），DM/DQS 随各自组绑定；地址、命令、控制线不可交换，否则容量与初始化参数错乱。</p></details>
          <details><summary>DDR 布线有哪些等长与阻抗要求？</summary><p>DQ 组内相对 DQS 等长（±25~50mil 按速率），地址/命令相对 CK 等长；单端 40/50Ω、DQS 差分 80~100Ω，完整地平面参考，DDR3 用片内 ODT 端接，VREF 就近去耦。</p></details>
          <details><summary>DDR4 相比 DDR3 新增了什么结构？</summary><p>Bank Group 分组（BG0~BG1），同组内 BANK 快速轮转、组间切换有附加延迟 tCCD_L；寻址上多了一层 BG 地址，容量公式多乘 2^BG 线数。</p></details>
          <details><summary>DDR 带宽怎么估算？</summary><p>带宽=数据速率×位宽/8。DDR4-1600 双 64bit 通道 ≈ 2×12.8GB/s=25.6GB/s；速率档与 CL/tRCD 等 speed bin 参数一起评估。</p></details>
        </div>
      </section>
    </>
  );
}
