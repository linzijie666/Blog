import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function McuArticle() {
  return (
    <>
      <section id="principle">
        <h2>最小系统由哪几部分组成</h2>
        <p>“画一个单片机最小系统”是硬件面试的基础题。以 STM32F103RBT6（LQFP64，128KB FLASH / 20KB SRAM）为例，最小系统由五部分组成：<strong>主芯片、电源、时钟、复位、配置调试</strong>。画图时把每一块圈出来，讲的时候逐块展开，条理就出来了。</p>
        <ArticleFigure src="images/knowledge/digital-chips/mcu-minimal-system.webp" fullSrc="images/knowledge/digital-chips/mcu-minimal-system-hd.jpg" alt="STM32F103RBT6 最小系统总图" caption="STM32F103 最小系统：时钟（左上）、配置调试（右上）、复位（左下）、电源（下方）四大块围绕主芯片。" sourcePage="5" />
        <p>datasheet 阅读是配套技能：从型号命名（STM32F103xB：F 通用、103 增强型、x 引脚数、B=128KB Flash）和首页 Features 提取内核、频率、存储、外设、工作电压等关键信息，再翻 Table 1 Device summary 确认具体型号的容量与封装。</p>
        <ArticleFigure src="images/knowledge/digital-chips/mcu-datasheet-page.webp" fullSrc="images/knowledge/digital-chips/mcu-datasheet-page-hd.jpg" alt="STM32F103xB datasheet 首页" caption="datasheet 首页：Features 列表 + 封装图 + Device summary 表，是回答“如何读 datasheet”的素材。" sourcePage="14" />
      </section>

      <section id="power">
        <h2>电源与去耦设计</h2>
        <p>电源部分回答三个问题：电压从哪来、每个电源引脚怎么去耦、模拟电源怎么处理。系统电源 12V 先经 DC-DC 降到 5V，再由 LDO（如 SPX5209）转为 3.3V 给单片机；VBAT 引脚接 3V 纽扣电池（1.8~3.6V）维持 RTC。</p>
        <div className="application-list">
          <article><h3>去耦电容</h3><p>每个 VDD 引脚就近放 100nF（104）陶瓷电容，整片再配一颗 10µF 大容量储能；电容紧贴引脚放置，走线短而宽。</p></article>
          <article><h3>模拟电源 VDDA</h3><p>ADC 的 VDDA 单独供电：经磁珠从 3.3V 滤出干净电源，再配 100nF+10nF 去耦和独立的 AGND 回地，降低 ADC 量化噪声。</p></article>
          <article><h3>VBAT 备份</h3><p>VBAT 接纽扣电池或 3.3V，掉电时维持 RTC 和备份寄存器；正常工作时内部开关自动切到 VDD。</p></article>
        </div>
        <ArticleFigure src="images/knowledge/digital-chips/mcu-power-circuit.webp" fullSrc="images/knowledge/digital-chips/mcu-power-circuit-hd.jpg" alt="单片机电源电路四部分标注" caption="① 主芯片电源引脚 ② VDDA 模拟供电（磁珠+AGND） ③ 去耦电容组 ④ LDO 电源电路。" sourcePage="6" />
        <aside className="article-callout"><strong>面试要点：</strong>去耦电容的作用是就近提供瞬态电流、压低电源阻抗；数量“每引脚一颗 104 + 整片一颗 10µF”，位置“越近越好”，必要时磁珠隔离模拟域。</aside>
      </section>

      <section id="clock">
        <h2>时钟与晶振：负载电容计算</h2>
        <p>无源晶振（晶体）需要芯片内部振荡电路配合工作：XTAL 晶体跨接在 OSC_IN/OSC_OUT 之间，两端各接一颗对地负载电容，通常再并联一颗 1MΩ 反馈电阻（有的型号集成在片内）。典型值：主晶振 8MHz + 2×18pF，RTC 晶振 32.768kHz + 小负载电容。</p>
        <ArticleFigure src="images/knowledge/digital-chips/mcu-crystal-circuit.webp" fullSrc="images/knowledge/digital-chips/mcu-crystal-circuit-hd.jpg" alt="8MHz 晶振电路" caption="X1 8MHz 晶振 + C9/C10 18pF 负载电容 + R2 1MΩ 反馈电阻，接 OSC_OUT/OSC_IN。" sourcePage="7" />
        <p>负载电容算错是晶振不起振或频偏的头号原因。晶振的标称负载电容 <FormulaText text="C_L" /> 定义为从晶振两端看到的总电容：</p>
        <div className="formula-block"><figcaption>负载电容计算</figcaption><div className="formula"><FormulaText text="C_L=(C_1×C_2)/(C_1+C_2)+C_{stray}" /></div><p><FormulaText text="C_{stray}" /> 是 PCB 走线与引脚寄生电容，经验值 3~5pF。两颗电容对称取值时 <FormulaText text="C_1=C_2=2×(C_L-C_{stray})" />：例如 CL=12pF、Cstray=4pF，则 C1=C2=2×8=16pF（恰为 E24 标称值），工程上也常就近取 18pF，此时实际 CL≈13pF，频偏影响见下方校核；32.768kHz 晶振 CL=12.5pF 同样算出约 17pF，取 18pF。</p></div>
        <p>选晶振时核对四个参数：标称频率、频率偏差（ppm）、负载电容 CL、ESR。下图商城参数里红框标出的“负载电容 12pF”就是配 2×18pF 电容的依据。</p>
        <ArticleFigure src="images/knowledge/digital-chips/crystal-params.webp" fullSrc="images/knowledge/digital-chips/crystal-params-hd.jpg" alt="X322525MOB4SI 晶振参数" caption="25MHz 贴片晶振 X322525MOB4SI：频差 ±10ppm、负载电容 12pF（红框）——决定外围电容取值。" sourcePage="57" />
        <p>把单片机的时钟来源画成时钟树就能讲清全貌：HSE 4~16MHz 经 PLL 倍频到 SYSCLK 72MHz，再经 AHB/APB 分频到各外设；LSE 32.768kHz 走 RTC；LSI 40kHz 只喂独立看门狗；MCO 引脚可以对外输出时钟。</p>
        <ArticleFigure src="images/knowledge/digital-chips/mcu-clock-tree.webp" fullSrc="images/knowledge/digital-chips/mcu-clock-tree-hd.jpg" alt="STM32F1 时钟树" caption="STM32F1 时钟树：HSE/HSI → PLL → SYSCLK 72MHz → AHB/APB1/APB2，LSE→RTC、LSI→IWDG。" sourcePage="63" />
        <p>晶振电路的 datasheet 参数也要会查：外部时钟频率范围、OSC_IN 高低电平阈值、占空比、输入电容等，PCB 布局上晶振紧靠芯片、走线短、远离干扰源并包地处理。</p>
        <ArticleFigure src="images/knowledge/digital-chips/mcu-hse-params.webp" fullSrc="images/knowledge/digital-chips/mcu-hse-params-hd.jpg" alt="高速外部时钟特性参数表" caption="Table 20 HSE 用户时钟特性：频率范围、VIH/VIL、占空比 45%~55%、输入电容等。" sourcePage="11" />
        <WorkedExample
          title="25MHz 晶振的负载电容配置"
          given={["晶振 X322525MOB4SI：25MHz，负载电容 CL=12pF", "PCB 寄生电容按 Cstray=4pF 估算", "两颗负载电容对称布置（C1=C2）"]}
          calculation={["C1×C2/(C1+C2)=CL−Cstray=12−4=8pF", "对称取值：C1=C2=2×8=16pF", "16pF 恰为 E24 标称值，可直接取用使 CL=12pF；实取 18pF 时实际 CL≈13pF", "1pF 负载偏差使频率略被拉低，幅度需查晶振 pullability 曲线或实测确认"]}
          verification={["若实测频偏大：先确认电容实际值与精度（NP0 介质、±5%）", "ESR 与激励功率满足晶振规格，避免过驱动", "布局上晶振贴近芯片、下面不走其他信号线"]}
          answer="负载电容按 CL=(C1·C2)/(C1+C2)+Cstray 反推：CL 12pF、Cstray 4pF 时取 2×16~18pF，这是晶振电路面试最常被追问的计算。"
        />
      </section>

      <section id="reset-boot">
        <h2>复位与 BOOT 启动配置</h2>
        <h3>复位电路</h3>
        <p>STM32 的 NRST 是低电平有效复位，内部自带弱上拉和施密特滤波。外部经典电路：10kΩ 上拉到 3.3V + 100nF 电容到地 + 复位按键（并联在电容上）。上电时电容充电，NRST 保持低电平一段时间后释放，实现 POR 上电复位；按下按键拉低 NRST 实现手动复位。</p>
        <ArticleFigure src="images/knowledge/digital-chips/mcu-reset-circuit.webp" fullSrc="images/knowledge/digital-chips/mcu-reset-circuit-hd.jpg" alt="STM32 复位电路" caption="R2 10kΩ 上拉 + SW1 按键 + C3 100nF 构成复位电路，NRST 低电平有效。" sourcePage="7" />
        <p>芯片内部的上电/掉电复位（POR/PDR）是最后一道防线：VDD 上升越过 VPOR 阈值后内部复位保持 <FormulaText text="t_{RSTTEMPO}" /> 才释放，跌到 VPDR 以下重新复位，两者之间约 40mV 迟滞防止电压临界抖动。</p>
        <ArticleFigure src="images/knowledge/digital-chips/mcu-por-waveform.webp" fullSrc="images/knowledge/digital-chips/mcu-por-waveform-hd.jpg" alt="POR/PDR 复位波形" caption="Figure 5 上电/掉电复位波形：VPOR/PDR 阈值、40mV 迟滞与 tRSTTEMPO 临时延时。" sourcePage="10" />
        <h3>BOOT 启动配置</h3>
        <p>BOOT0/BOOT1 决定启动空间：BOOT0=0 从主 FLASH 启动（正常运行）；BOOT0=1、BOOT1=0 从系统存储器启动（厂家 bootloader，串口/USB 下载）；BOOT0=1、BOOT1=1 从内置 SRAM 启动（调试用，掉电丢失）。电路上 BOOT0 经 10kΩ 下拉到地，配合跳线帽或拨码选择。</p>
        <ArticleFigure src="images/knowledge/digital-chips/mcu-boot-modes.webp" fullSrc="images/knowledge/digital-chips/mcu-boot-modes-hd.jpg" alt="Table 9 Boot modes 启动模式表" caption="BOOT1/BOOT0 组合选择 Main Flash / System memory / Embedded SRAM 启动。" sourcePage="11" />
      </section>

      <section id="debug">
        <h2>SWD 调试与 datasheet 阅读</h2>
        <p>STM32 调试口有 JTAG 和 SWD 两种，SWD 只需 SWDIO（PA13）+ SWCLK（PA14）两根信号线，还能复用引脚给外设，实际产品首选 SWD。从 datasheet 的 SWJ 调试口引脚表可以直接读出映射关系，注意 PB3/PB4/PA15 在 SWD 模式下被释放为普通 IO。</p>
        <ArticleFigure src="images/knowledge/digital-chips/mcu-swd-pins.webp" fullSrc="images/knowledge/digital-chips/mcu-swd-pins-hd.jpg" alt="SWJ 调试口引脚表" caption="SWJ-DP 引脚表：绿框 SWD 两线（PA13/PA14），红框 JTAG 五线。" sourcePage="12" />
        <p>调试接口电路：SWDIO/SWCLK 串联 0Ω 电阻（调试时不断开，量产可拆）引到 2.54mm 排针，电源地随行；有的设计在时钟线上加磁珠抑制辐射。BOOT0/BOOT1 经 10kΩ 上拉/下拉配跳线帽选择启动模式。</p>
        <ArticleFigure src="images/knowledge/digital-chips/mcu-boot-swd.webp" fullSrc="images/knowledge/digital-chips/mcu-boot-swd-hd.jpg" alt="BOOT 配置与 SWD 调试接口电路" caption="BOOT0/BOOT1 跳线选择启动模式；SWDIO/SWCLK 经 0R 与磁珠引到调试排针。" sourcePage="8" />
        <div className="application-list">
          <article><h3>读 datasheet 的顺序</h3><p>型号命名 → Features 提取能力边界 → Table 1 Device summary 确认容量封装 → Pin definition 对应引脚 → 各外设章节查电气参数。</p></article>
          <article><h3>画最小系统的检查单</h3><p>电源去耦齐全、晶振负载电容匹配、复位可靠、BOOT 电平正确、调试口引出、VBAT 处理——六项过了才算最小系统完整。</p></article>
        </div>
        <WorkedExample
          title="最小系统上电无响应的排查思路"
          given={["STM32F103 最小系统上电后 SWD 无法连接，NRST 测得约 1.2V", "电源 3.3V 正常，晶振两端无 8MHz 波形"]}
          calculation={["NRST 只有 1.2V（低于 VIH），芯片一直被按在复位态", "检查复位电容：100nF 正常，但 R2 上拉电阻虚焊，实际靠内部弱上拉", "补焊 10kΩ 后 NRST≈3.3V，晶振起振，SWD 连接恢复"]}
          verification={["复位释放前 BOOT0 必须已在 0 电平，否则进了 bootloader", "SWD 连接失败优先量 NRST 电平再查 SWDIO/SWCLK 走线", "晶振不起振先查负载电容与 1MΩ 反馈电阻"]}
          answer="排查顺序是电源 → 复位 → 时钟 → BOOT → 调试口：先确认 NRST 完全释放，再看晶振波形，最后才怀疑芯片本身。"
        />
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>单片机最小系统包括哪几部分？</summary><p>主芯片、电源（含去耦）、时钟（晶振电路）、复位（上电+手动）、配置调试（BOOT + SWD/JTAG）；带 RTC 的还要处理 VBAT 备份电池。</p></details>
          <details><summary>晶振负载电容怎么计算？</summary><p>CL=(C1×C2)/(C1+C2)+Cstray，Cstray 取 3~5pF。对称取值时 C1=C2=2×(CL−Cstray)，例如 CL=12pF 配 2×16~18pF；电容不匹配会导致不起振或频率偏差。</p></details>
          <details><summary>STM32 有哪几种启动方式？怎么配置？</summary><p>BOOT0=0 主 FLASH 启动；BOOT0=1、BOOT1=0 系统存储器（bootloader 下载）；BOOT0=1、BOOT1=1 内置 SRAM。BOOT0 经 10k 下拉默认主 FLASH，用跳线或拨码切换。</p></details>
          <details><summary>为什么每个电源引脚都要放 100nF 电容？</summary><p>芯片内部开关瞬间的 di/dt 很高，去耦电容就近提供瞬态电流并压低电源阻抗；100nF 谐振点适中覆盖中高频，整片再配 10µF 负责低频储能。</p></details>
          <details><summary>SWD 和 JTAG 有什么区别？</summary><p>SWD 只需 SWDIO/SWCLK 两线，占用引脚少且释放 PB3/PB4/PA15，产品首选；JTAG 五线支持链式多芯片与更完整的调试功能，多用于开发阶段和复杂系统。</p></details>
          <details><summary>上电复位是怎么实现的？</summary><p>芯片内部 POR 监测 VDD，越过 VPOR 阈值后保持 tRSTTEMPO 释放复位，VPDR/VPOR 之间约 40mV 迟滞防抖；外部 RC（10k+100nF+按键）保证复位脉宽覆盖电源稳定过程，并提供手动复位。</p></details>
        </div>
      </section>
    </>
  );
}
