import ArticleFigure from "../ArticleFigure.jsx";
import ArticleFigureGroup from "../ArticleFigureGroup.jsx";
import FormulaText from "../FormulaText.jsx";
import WorkedExample from "../WorkedExample.jsx";

export default function ResetWatchdogArticle() {
  return (
    <>
      <section id="reset-types">
        <h2>复位从哪里来</h2>
        <p>复位的作用是把芯片恢复到确定的初始状态。按来源分四类：<strong>上电复位 POR</strong>（电源建立过程中自动复位）、<strong>掉电/欠压复位 PDR/BOR</strong>（电压跌落或 Brown-out 时复位）、<strong>手动复位</strong>（按键或调试器）、<strong>看门狗复位</strong>（程序跑飞后自动复位），再加上软件复位。设计上要回答三个问题：复位电平（低有效还是高有效）、复位脉宽（要覆盖芯片启动时间）、复位释放时机（要在电源稳定之后）。</p>
        <p>以 STM32 为例，NRST 低电平有效，内部自带弱上拉与施密特滤波器；外部复位电路就是“上拉电阻 + 滤波电容 + 按键”接到 NRST，经内部施密特触发器整形后同步到内部复位域，复位 CPU 内核、外设寄存器和调试逻辑。</p>
        <ArticleFigure src="images/knowledge/digital-chips/reset-rc-internal.webp" fullSrc="images/knowledge/digital-chips/reset-rc-internal-hd.jpg" alt="STM32 datasheet 复位电路与内部施密特滤波" caption="外部上拉+电容+按键 → 内部 Filter/施密特 → 内部复位，STM32F10x datasheet 原图。" sourcePage="49" />
        <aside className="article-callout"><strong>面试主线：</strong>先分清复位来源（POR/掉电/手动/看门狗），再讲复位电平与脉宽要求，最后落到“复位释放必须在电源稳定之后”。</aside>
      </section>

      <section id="por-circuits">
        <h2>POR 复位电路实现</h2>
        <h3>方案一：RC 复位</h3>
        <p>最简单的方式：上电时电容充电，复位引脚电压从 0 缓慢爬升，越过阈值后释放复位，<FormulaText text="t≈R×C" /> 决定复位时间；按键并联在电容上做手动复位。优点是零成本；缺点是阈值不精确——电源爬升慢或电压跌到临界区时，RC 电路本身判断不了电源质量。</p>
        <h3>方案二：专用复位芯片</h3>
        <p>专用上电复位芯片（如 MAX809，SOT23-3）持续监测 VCC：低于阈值时 RESET 输出有效，电源恢复后仍保持一段复位超时时间（约 140ms）再释放，保证后级芯片充分复位。阈值分档精确（如 L 档 4.63V、M 档 4.38V、T 档 3.08V、S 档 2.93V、R 档 2.63V），3.3V 系统通常选 2.93V 的 S 档。</p>
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/digital-chips/max809-timing.webp", fullSrc: "images/knowledge/digital-chips/max809-timing-hd.jpg", alt: "MAX809 上电复位时序图", caption: "VCC 越过阈值 VTH 后 RESET 继续保持 Reset Timeout Period（约 140ms）再释放。", sourcePage: "50" },
          { src: "images/knowledge/digital-chips/max809-table.webp", fullSrc: "images/knowledge/digital-chips/max809-table-hd.jpg", alt: "MAX809 复位阈值分档表", caption: "复位检测电压分档表：L/M/J/T/S/R/Z 各档阈值与温度范围（M 4.38V、S 2.93V、Z 2.32V 红框）。", sourcePage: "50" }
        ]} />
        <p>复位芯片的选择要点：阈值必须低于正常工作电压并留裕量（3.3V 系统选 2.93V 而不是 3.08V，避免电源纹波误触发）、复位脉宽满足后级最长启动时间、输出极性与电平域匹配（开漏输出要加上拉）。</p>
      </section>

      <section id="cascade">
        <h2>芯片间级联复位</h2>
        <p>多芯片系统要保证复位顺序：主控先复位并初始化，再释放从属芯片的复位。典型链路是<strong>上电复位芯片 → MCU → FPGA →（DDR、CMOS 图像传感器、PHY）</strong>：上电复位包给 MCU，MCU 用一个 GPIO 作为 FPGA 的复位源，FPGA 再复位它管理的外围芯片；也可以每颗芯片各配一颗复位芯片，但成本和一致性都不如级联。</p>
        <ArticleFigure src="images/knowledge/digital-chips/reset-cascade.webp" fullSrc="images/knowledge/digital-chips/reset-cascade-hd.jpg" alt="芯片间级联复位框图" caption="级联复位：上电复位包 → MCU → FPGA → DDR / CMOS 图像传感器 / PHY。" sourcePage="51" />
        <div className="application-list">
          <article><h3>复位方向</h3><p>从主到从：复位信号由主控发出，从属芯片在主控初始化完成后再释放，避免从芯片在配置完成前抢总线。</p></article>
          <article><h3>电平匹配</h3><p>跨电压域（3.3V MCU 复位 1.8V FPGA）要加电平转换或选 OD 输出加上拉到目标域。</p></article>
          <article><h3>与电源好信号联动</h3><p>用 DC-DC 的 PG（Power Good）参与复位释放逻辑，确保“所有电源就绪 → 才释放复位”。</p></article>
        </div>
      </section>

      <section id="watchdog">
        <h2>看门狗原理与电路设计</h2>
        <p>看门狗（Watchdog Timer, WDT）解决的问题是：<strong>程序跑飞、死循环或时钟失效时，系统自己不知道，需要独立的电路强制复位</strong>。工作方式是反向的——主控必须周期性“喂狗”（在 WDI 引脚上产生电平翻转或脉冲）；如果超时时间 tWD 内没有喂狗信号，看门狗输出复位脉冲（脉宽 tWP，典型 140~200ms）复位主控。</p>
        <p>两类实现：主控<strong>片内看门狗</strong>和<strong>外置看门狗芯片</strong>。STM32F103 的 IWDG 使用独立 LSI，因此主晶振停振时仍可工作；WWDG 则来自主时钟域并要求在规定窗口内喂狗。外置方案的价值是进一步独立故障域，并可集成电压监测复位和手动复位输入（MR#），而不是笼统认为所有片内看门狗都与主晶振同失效。</p>
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/digital-chips/watchdog-tpv6823-app.webp", fullSrc: "images/knowledge/digital-chips/watchdog-tpv6823-app-hd.jpg", alt: "TPV6823 典型应用框图", caption: "TPV6823 与主控：RESET→复位主控、主控 IO→WDI 喂狗、MR# 手动复位，双向箭头标出信号方向。", sourcePage: "54" },
          { src: "images/knowledge/digital-chips/watchdog-timing.webp", fullSrc: "images/knowledge/digital-chips/watchdog-timing-hd.jpg", alt: "看门狗时序图", caption: "Figure 11 Watchdog Timing：VCC 越过 VTH 复位释放，WDI 停喂超过 tWD 触发 tWP 复位脉冲。", sourcePage: "55" }
        ]} />
        <p>完整应用电路：复位输出接主控 NRST（330Ω+10k 上拉保证电平），WDI 接主控的一个空闲 IO（程序主循环里周期翻转），MR# 接手动复位按键，电源处 100nF 去耦。芯片既监测被测电压（低于阈值复位），又在喂狗超时时复位，一颗芯片两种保护。</p>
        <ArticleFigureGroup figures={[
          { src: "images/knowledge/digital-chips/watchdog-cn825-circuit.webp", fullSrc: "images/knowledge/digital-chips/watchdog-cn825-circuit-hd.jpg", alt: "CN825 看门狗应用框图", caption: "CN825 硬件看门狗：Vcc 被监测电压、MRn 手动复位、WDI 喂狗输入、RESETn 输出主控。", sourcePage: "51" },
          { src: "images/knowledge/digital-chips/watchdog-design-circuit.webp", fullSrc: "images/knowledge/digital-chips/watchdog-design-circuit-hd.jpg", alt: "看门狗应用电路设计", caption: "CN825D 与 STM32F103：KEY1→MR# 手动复位、WDI←PA1 喂狗、RESET#→NRST，10k/330R 电阻配置。", sourcePage: "56" }
        ]} />
        <WorkedExample
          title="外置看门狗的喂狗周期校核"
          given={["看门狗芯片超时时间 tWD=1.6s，复位脉宽 tWP=200ms", "主循环周期 10ms，喂狗实现为主循环内翻转 WDI", "关键任务最长阻塞一段 800ms（Flash 写入）"]}
          calculation={["正常喂狗间隔：主循环每 10ms 翻转一次，远小于 1.6s", "最长不喂狗区间：800ms 阻塞期间，仍小于 1.6s，不会误复位", "设计余量：tWD 应大于最长任务周期的 2 倍以上，1.6s/0.8s=2 倍，成立"]}
          verification={["喂狗 IO 初始化要在 main 最早处完成，避免上电即被咬", "中断里不要喂狗——主循环卡死时中断可能仍在跑，喂狗会掩盖故障", "调试器挂起 CPU 时看门狗会照常超时，联调阶段注意设计旁路"]}
          answer="回答看门狗设计要给三个数：超时时间、最长不喂狗路径、两者余量比，并强调喂狗点必须在主循环而不是中断里。"
        />
        <div className="application-list">
          <article><h3>看门狗时间选择</h3><p>太短容易误复位（慢任务、低功耗唤醒），太长故障恢复慢；按最长合法任务周期的 2 倍以上取值。</p></article>
          <article><h3>复位设计注意事项</h3><p>复位脉宽覆盖芯片启动与初始化；多电压域做电平转换；复位期间关注 IO 状态（上拉/下拉决定外设初始态）；预留复位测试点。</p></article>
          <article><h3>片内 vs 外置</h3><p>片内看门狗零成本，外置看门狗独立于主控时钟与电源监测更完整——高可靠系统两个都要：片内做第一道、外置做兜底。</p></article>
        </div>
      </section>

      <section id="interview">
        <h2>面试自测</h2>
        <div className="review-questions">
          <details><summary>芯片复位有哪几种来源？</summary><p>上电复位 POR、掉电/欠压复位 PDR/BOR、手动复位（按键/调试器）、看门狗复位、软件复位。设计上关注复位电平、脉宽和释放时机（电源稳定后）。</p></details>
          <details><summary>RC 复位和专用复位芯片怎么选？</summary><p>RC 成本低适合电源简单的小系统，但无法判断电源质量；专用芯片（MAX809 等）阈值精确、带约 140ms 复位延时，能应对电压跌落，3.3V 系统选 2.93V 阈值档，要求高的系统必用。</p></details>
          <details><summary>多芯片系统的复位怎么组织？</summary><p>级联：上电复位芯片 → MCU → FPGA → DDR/传感器/PHY，从主到从依次释放；跨电压域加电平转换；配合电源 PG 信号保证所有电源就绪后才释放复位。</p></details>
          <details><summary>看门狗的工作原理是什么？</summary><p>主控周期性在 WDI 上产生翻转信号（喂狗），看门狗在超时时间 tWD 内收不到喂狗就输出复位脉冲 tWP。它构成“主控失能 → 自动复位”的兜底保护。</p></details>
          <details><summary>为什么高可靠系统仍可能使用外置看门狗？</summary><p>STM32F103 的 IWDG 由独立 LSI 驱动，能覆盖主晶振停振；外置看门狗的优势是与 MCU 的时钟、逻辑和部分电源故障进一步隔离，并可附带电压监控、独立复位输出和手动复位。</p></details>
          <details><summary>喂狗有什么讲究？</summary><p>喂狗点放在主循环（不能放中断，否则主循环卡死仍被喂）；喂狗周期远小于超时时间；关键长任务要拆分出喂狗点或把超时时间放大到 2 倍余量以上；初始化早期就要开始喂狗，避免“上电即被咬”。</p></details>
        </div>
      </section>
    </>
  );
}
