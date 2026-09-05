export const knowledgeChapters = {
  passive: {
    id: "passive",
    index: "第一章",
    title: "无源器件",
    description: "按电阻、电容、电感和磁珠四类整理原理、参数、典型电路、选型流程与易错点。",
    downloadHref: "downloads/passive-components-review.pdf",
    downloadPages: 44
  },
  semiconductor: {
    id: "semiconductor",
    index: "第二章",
    title: "基础半导体器件",
    description: "按二极管、三极管、光耦和 MOS 管四类整理器件原理、参数计算、典型电路与选型校核。",
    downloadHref: "downloads/semiconductor-devices-review.pdf",
    downloadPages: 60
  },
  power: {
    id: "power",
    index: "第三章",
    title: "电源类",
    description: "按开关电源与线性稳压源两条主线整理拓扑、伏秒平衡、上电时序、纹波噪声与 LDO 参数计算。",
    downloadHref: "downloads/power-supplies-review.pdf",
    downloadPages: 56
  },
  digital: {
    id: "digital",
    index: "第四章",
    title: "主控芯片",
    description: "按单片机最小系统、FPGA 配置加载、DDR SDRAM 设计和复位看门狗四类整理原理、参数与设计要点。",
    downloadHref: "downloads/digital-chips-review.pdf",
    downloadPages: 66
  },
  "pcb-layout": {
    id: "pcb-layout",
    index: "第五章",
    title: "PCB Layout",
    description: "按走线规则、去耦与时钟、铺铜包地、接地设计、高速等长、加工工艺与电源 Layout 七类整理 3W 原则、返回路径、20H、阻抗与通流等设计规则。",
    downloadHref: "downloads/pcb-layout-review.pdf",
    downloadPages: 32
  },
  "analog-devices": {
    id: "analog-devices",
    index: "第六章",
    title: "模拟器件",
    description: "按运放基础、运算电路、应用电路、ADC 原理选型与精度基准源五类整理虚短虚断、增益计算、ADC 架构对比与基准源设计。",
    downloadHref: "downloads/analog-devices-review.pdf",
    downloadPages: 51
  },
  "high-speed-interfaces": {
    id: "high-speed-interfaces",
    index: "第七章",
    title: "高速接口",
    description: "按 IIC/SPI 总线、建立保持时间与测量仪器、RS232/RS485、差分与 LVDS、千兆网、HDMI/PCIE/USB 六类整理接口电平、协议时序、电路设计与 PCB 规则。",
    downloadHref: "downloads/high-speed-interfaces-review.pdf",
    downloadPages: 66
  },
  "si-pi": {
    id: "si-pi",
    index: "第八章",
    title: "信号完整性与电源完整性",
    description: "从 PDN 目标阻抗、传输线反射与端接出发，系统整理高速判断与测量、等时设计、回流路径、过孔与板材，以及眼图、ISI、抖动和均衡。",
    downloadHref: "downloads/si-pi-review.pdf",
    downloadPages: 98
  }
};

const reviewArticleDefinitions = [
  {
    slug: "resistor",
    chapter: "passive",
    title: "电阻：从参数选型到 0Ω 电阻的工程用法",
    summary: "系统复习电阻的精度、耐压、功率与降额，并串联分压、匹配、采样、限流和 0Ω 电阻的典型面试问题。",
    readingTime: "约 18 分钟",
    sections: [
      ["principle", "先建立电阻的工程直觉"],
      ["parameters", "选型参数与降额"],
      ["circuits", "八类典型电路"],
      ["zero-ohm", "0Ω 电阻为什么存在"],
      ["workflow", "选型流程与易错点"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "capacitor",
    chapter: "passive",
    title: "电容：去耦、储能与高频模型复习",
    summary: "从电容的七类功能出发，掌握介质类型、MLCC 温度等级、直流偏压、ESR/ESL 与 PDN 并联设计。",
    readingTime: "约 22 分钟",
    sections: [
      ["principle", "电容的核心关系"],
      ["functions", "七类典型功能"],
      ["types", "介质类型与应用选择"],
      ["mlcc", "MLCC 的温度与偏压效应"],
      ["high-frequency", "高频 RLC 模型"],
      ["pdn", "并联电容与 PDN"],
      ["workflow", "选型流程与易错点"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "inductor",
    chapter: "passive",
    title: "电感：DCR、饱和电流与功率选型",
    summary: "围绕储能机理、感值、DCR、饱和电流和温升电流，建立开关电源功率电感的完整选型流程。",
    readingTime: "约 14 分钟",
    sections: [
      ["principle", "电感的储能与电流惯性"],
      ["parameters", "五个关键选型参数"],
      ["structure", "磁芯结构与封装"],
      ["circuits", "典型电源应用"],
      ["workflow", "功率电感选型流程"],
      ["mistakes", "常见易错点"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "ferrite-bead",
    chapter: "passive",
    title: "磁珠：高频噪声抑制与电感辨析",
    summary: "理解磁珠如何把高频噪声转化为损耗，并掌握阻抗曲线、额定电流、直流偏置和磁珠与电感的选用边界。",
    readingTime: "约 12 分钟",
    sections: [
      ["principle", "磁珠为什么能抑制高频噪声"],
      ["parameters", "阻抗曲线与额定参数"],
      ["applications", "电源与信号线应用"],
      ["comparison", "磁珠和电感的异同"],
      ["workflow", "选型流程与易错点"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "diode",
    chapter: "semiconductor",
    title: "二极管：从 PN 结到整流、限幅与稳压",
    summary: "用一条主线串起载流子运动、伏安方程、等效模型与典型电路，先理解 PN 结，再用模型解决面试和笔试题。",
    readingTime: "约 30–45 分钟",
    sections: [
      ["semiconductor", "先把半导体方向理清"],
      ["pn-junction", "PN 结如何形成"],
      ["iv-curve", "伏安特性与电流方程"],
      ["models", "等效模型与小信号"],
      ["capacitance", "PN 结的电容效应"],
      ["breakdown", "击穿与稳压"],
      ["circuits", "典型电路与题型"],
      ["dynamic", "动态参数与器件选型"],
      ["interview", "秋招高频题与一页速记"]
    ]
  },
  {
    slug: "triode",
    chapter: "semiconductor",
    title: "三极管：开关、放大与工作点计算",
    summary: "从三个工作区出发，覆盖开关反相、电平转换、恒流与线性稳压应用，并用微变等效电路算清静态工作点和动态参数。",
    readingTime: "约 18 分钟",
    sections: [
      ["principle", "三极管的工作区与工程直觉"],
      ["circuits", "开关、电平转换与恒流稳压"],
      ["amplifier", "静态工作点与动态参数"],
      ["configurations", "三种组态对比与多级耦合"],
      ["workflow", "设计流程与易错点"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "optocoupler",
    chapter: "semiconductor",
    title: "光耦：隔离原理、CTR 参数与线与应用",
    summary: "理解光耦的电隔离与 CTR 电流传输比，掌握输入限流、输出上拉设计，以及 OC/OD 门和线与逻辑。",
    readingTime: "约 12 分钟",
    sections: [
      ["principle", "光耦为什么能隔离"],
      ["parameters", "CTR 与关键参数"],
      ["circuits", "光耦电路设计"],
      ["oc-od", "OC 门、OD 门与线与"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "mosfet",
    chapter: "semiconductor",
    title: "MOS 管：从开关电路到损耗计算与 SOA",
    summary: "围绕 NMOS/PMOS 开关特性，覆盖电平转换、电源防反、缓启动、开关电源应用，以及损耗计算、并联使用与 SOA 校核。",
    readingTime: "约 20 分钟",
    sections: [
      ["principle", "MOS 管的结构与开关直觉"],
      ["functions", "七类典型功能"],
      ["compare", "与三极管的区别及并联使用"],
      ["soft-start", "缓启动电源设计"],
      ["selection", "参数、损耗与选型"],
      ["soa", "SOA 安全工作区"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "switching-regulator",
    chapter: "power",
    title: "开关电源：BUCK/BOOST 拓扑、伏秒平衡与纹波抑制",
    summary: "从 TPS54602 降压电路出发，掌握 BUCK/BOOST 两条回路、CCM/DCM/PSM 工作模式、伏秒平衡推导、多电源上电时序与纹波测量抑制。",
    readingTime: "约 25 分钟",
    sections: [
      ["principle", "DC-DC 的组成与设计流程"],
      ["topology", "BUCK 与 BOOST 拓扑两条回路"],
      ["modes", "CCM、DCM 与 FCCM/PSM 轻载模式"],
      ["volt-second", "伏秒平衡与占空比"],
      ["sequencing", "多电源上电时序设计"],
      ["ripple", "纹波与噪声：测量、成因与抑制"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "linear-regulator",
    chapter: "power",
    title: "线性稳压源：LDO 原理、参数选型与电源树",
    summary: "从 NMOS/PMOS 调整管内部结构理解 LDO，掌握压差、PSRR、静态电流等参数解读，算清损耗温升，并用 DC-DC+LDO 电源树取长补短。",
    readingTime: "约 18 分钟",
    sections: [
      ["principle", "LDO 内部结构：误差放大器与调整管"],
      ["pmos", "PMOS 型 LDO 与两种结构对比"],
      ["thermal", "效率、损耗与温升计算"],
      ["parameters", "参数解读与选型"],
      ["circuit", "LDO 电路设计与电源树"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "mcu",
    chapter: "digital",
    title: "单片机：最小系统、晶振时钟与调试接口",
    summary: "以 STM32F103 最小系统为蓝本，逐块讲清电源去耦、晶振负载电容计算、复位与 BOOT 启动配置、SWD 调试和 datasheet 阅读方法。",
    readingTime: "约 22 分钟",
    sections: [
      ["principle", "最小系统由哪几部分组成"],
      ["power", "电源与去耦设计"],
      ["clock", "时钟与晶振：负载电容计算"],
      ["reset-boot", "复位与 BOOT 启动配置"],
      ["debug", "SWD 调试与 datasheet 阅读"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "fpga",
    chapter: "digital",
    title: "FPGA：与 SOC 的边界、上电时序与配置加载",
    summary: "用 RK3588 和 ZYNQ 框图分清 SOC 与 FPGA 的定位，掌握三路电源上电时序、JTAG 与主从 SPI 加载方式、配置引脚与专用时钟资源。",
    readingTime: "约 18 分钟",
    sections: [
      ["compare", "SOC 与 FPGA 的区别与联系"],
      ["power", "三路电源与上电时序"],
      ["config", "配置与加载：JTAG 与主从 SPI"],
      ["clock", "专用时钟引脚与时钟方案"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "ddr",
    chapter: "digital",
    title: "DDR SDRAM：操作流程、容量计算与等长设计",
    summary: "从指令真值表到激活、读写、刷新的操作流程，掌握引脚分类与地址复用、容量带宽计算、DQ 交换规则与 DDR3 等长布线要点。",
    readingTime: "约 20 分钟",
    sections: [
      ["operations", "SDRAM 的操作流程与指令"],
      ["pinout", "引脚分类与地址复用"],
      ["capacity", "容量与带宽计算"],
      ["routing", "等长设计与引脚交换"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "reset-watchdog",
    chapter: "digital",
    title: "复位与看门狗：POR 电路、级联复位与喂狗设计",
    summary: "梳理上电复位、手动复位与看门狗复位的来源，掌握 RC 与专用复位芯片电路、芯片间级联复位和喂狗周期校核。",
    readingTime: "约 15 分钟",
    sections: [
      ["reset-types", "复位从哪里来"],
      ["por-circuits", "POR 复位电路实现"],
      ["cascade", "芯片间级联复位"],
      ["watchdog", "看门狗原理与电路设计"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "pcb-routing",
    chapter: "pcb-layout",
    title: "PCB 走线规则：3W 间距、参考平面与跨分割",
    summary: "从 3W 原则和相邻层垂直走线出发，理解参考平面与返回路径，量化跨分割的阻抗突变与缝合电容补救，并解释为什么不能直角走线。",
    readingTime: "约 15 分钟",
    sections: [
      ["three-w", "3W 原则与串扰"],
      ["orthogonal", "相邻层垂直走线"],
      ["reference-return", "参考平面与返回路径"],
      ["split-crossing", "为什么不能跨分割"],
      ["corners", "直角与钝角转弯"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "pcb-decoupling",
    chapter: "pcb-layout",
    title: "去耦电容布置、去耦半径与时钟走线",
    summary: "掌握去耦电容单独分配、引线最短、小容值靠近引脚、BGA 背面布置四原则与去耦半径估算，梳理时钟电路原理图三件套与 PCB 六条注意点。",
    readingTime: "约 14 分钟",
    sections: [
      ["decoupling-layout", "去耦电容怎么布置"],
      ["decoupling-radius", "如何理解去耦半径"],
      ["crystal-circuit", "晶体晶振电路设计"],
      ["clock-routing", "时钟走线规则与后果"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "pcb-copper-pour",
    chapter: "pcb-layout",
    title: "铺铜、包地线与隔离器件挖空",
    summary: "总结铺铜的五个作用与三条注意点，包地线打过孔的波长规则与共面参考应用，以及光耦、网变下方挖空与 HGND 的隔离设计。",
    readingTime: "约 10 分钟",
    sections: [
      ["copper-pour", "铺铜的作用与注意点"],
      ["guard-traces", "包地线的功能与打孔"],
      ["isolation-keepout", "隔离器件下方挖空"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "pcb-ground-design",
    chapter: "pcb-layout",
    title: "接地设计：十字花焊盘、AGND 分割与 20H",
    summary: "从热风焊盘的焊接原理讲到模拟地数字地单点连接，再用叠层参数算清 20H 内缩距离与边缘磁通泄露的抑制效果。",
    readingTime: "约 11 分钟",
    sections: [
      ["thermal-relief", "十字花焊盘（热风焊盘）"],
      ["agnd-dgnd", "模拟地与数字地的分割连接"],
      ["20h-rule", "电源地层的 20H 原则"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "pcb-high-speed",
    chapter: "pcb-layout",
    title: "高速设计：绕等长、叠层方案与阻抗控制",
    summary: "绕等长的两种场景与五条蛇形线规则（含 MIPI 的 ps 级量化要求），4 层/6 层叠层方案与参考平面选择，微带线阻抗与铜厚线宽层距的定性分析。",
    readingTime: "约 15 分钟",
    sections: [
      ["length-tuning", "什么情况要绕等长"],
      ["stackup", "4 层/6 层叠层与参考平面"],
      ["impedance", "阻抗与铜厚、线宽、层距"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "pcb-fab-hdi",
    chapter: "pcb-layout",
    title: "加工工艺与板型：线宽线距、通孔与 HDI",
    summary: "盘点两家板厂的最小孔径与线宽线距能力，在性能与成本间选过孔与工艺参数，区分通孔板与 HDI 板的盲埋孔结构与适用场景。",
    readingTime: "约 10 分钟",
    sections: [
      ["fab-limits", "最小孔径与线宽线距"],
      ["cost-balance", "性能与成本的平衡"],
      ["via-hdi", "通孔板与 HDI 板"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "pcb-power-layout",
    chapter: "pcb-layout",
    title: "开关电源 Layout 准则与走线通流",
    summary: "小结开关电源布局四准则并对照 RT6253A/B 官方 Layout 指引，用载流经验公式估算走线宽度与过孔数量，理解多过孔分流不均的仿真真相。",
    readingTime: "约 8 分钟",
    sections: [
      ["switch-layout", "开关电源布局四准则"],
      ["loop-filter", "官方 Layout 指引对照"],
      ["current-capacity", "走线宽度与过孔通流"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "opamp-basics",
    chapter: "analog-devices",
    title: "运放基础：虚短虚断虚地与参数选型",
    summary: "用 LM358 与 LT1678 的真实参数理解虚短、虚断、虚地，逐项解读供电、轨到轨、带宽 GBP、失调、压摆率、CMRR/PSRR，总结按场景选型的侧重点。",
    readingTime: "约 18 分钟",
    sections: [
      ["virtual-short-ground", "虚短、虚断与虚地"],
      ["calc-applications", "在计算中的应用"],
      ["parameters", "运放关键参数解读"],
      ["ideal-vs-real", "理想运放与选型侧重"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "opamp-circuits",
    chapter: "analog-devices",
    title: "运放基本运算电路：从跟随器到微分积分",
    summary: "亲手推导同相跟随、同相/反相比例、加法、减法与微分积分电路，注意反相与差分电路输入阻抗低的关键差异。",
    readingTime: "约 12 分钟",
    sections: [
      ["follower", "同相电压跟随"],
      ["non-inverting", "同相比例放大"],
      ["inverting", "反相比例放大"],
      ["sum-diff", "加法与减法电路"],
      ["diff-integral", "微分与积分"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "opamp-apps",
    chapter: "analog-devices",
    title: "运放应用：恒流源、信号变换与 ADC/DAC 接口",
    summary: "从 2.5mA 小电流恒流源到运放+MOS 大电流方案，用差分电路实现 0~2.5V 转 ±5V，解决 NTC 接 ADC 的输入阻抗误差与 DAC 驱动能力不足。",
    readingTime: "约 14 分钟",
    sections: [
      ["constant-current", "恒流源电路"],
      ["signal-range", "转换信号范围"],
      ["adc-op", "ADC+OP：输入阻抗匹配"],
      ["dac-op", "DAC+OP：增强驱动能力"],
      ["current-loop", "4-20mA 电流检测"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "adc-primer",
    chapter: "analog-devices",
    title: "ADC：转换过程、四种架构与选型参数",
    summary: "梳理采样、保持、量化、编码流程与香农采样定理，对比 SAR/FLASH/流水线/Σ-Δ 四种架构，算清 FSR、LSB、误差项、带宽与接口选型。",
    readingTime: "约 20 分钟",
    sections: [
      ["conversion", "ADC 的功能与转换过程"],
      ["architectures", "SAR/FLASH/流水线/Σ-Δ"],
      ["resolution-lsb", "FSR、分辨率、LSB 与误差"],
      ["sampling-interface", "采样速率、带宽与接口"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "vref-precision",
    chapter: "analog-devices",
    title: "ADC 精度设计与基准源：从 TL431 到 ADR34xx",
    summary: "按选型、阻抗匹配、差分输入、滤波、基准源、电源、布局七步提高 ADC 检测精度，掌握 TL431 输出公式与 12V→5V 设计例，对比专用基准源关键参数。",
    readingTime: "约 18 分钟",
    sections: [
      ["accuracy-methods", "提高精度的系统方法"],
      ["signal-conditioning", "匹配、差分、滤波与开尔文"],
      ["vref-applications", "参考电压的典型应用"],
      ["vref-circuits", "参考电压生成电路"],
      ["interview", "面试自测"]
    ]
  },
  {
    slug: "iic-spi",
    chapter: "high-speed-interfaces",
    title: "IIC 与 SPI：协议时序、上拉与多从机设计",
    summary: "从 IIC 开漏总线、ACK 与 RC 上升时间讲到 SPI 四种模式、电平转换、端接与多从机扩展，串起板内串行总线的原理图设计。",
    readingTime: "约 20 分钟",
    sections: [["iic-principle", "IIC 协议与信号定义"], ["iic-circuits", "物理连接、电平转换与隔离"], ["iic-open-drain", "开漏输出与上拉电阻选择"], ["spi-principle", "SPI 协议与四种模式"], ["spi-circuits", "SPI 电路设计与多从扩展"], ["compare", "IIC 与 SPI 对比"], ["interview", "面试自测"]]
  },
  {
    slug: "setup-hold-time",
    chapter: "high-speed-interfaces",
    title: "建立时间与保持时间：测量与联合调试",
    summary: "用 SPI 实测波形理解建立、保持裕量及 10%/90% 判定方法，对比示波器和逻辑分析仪，形成通信异常的软硬件联合排查流程。",
    readingTime: "约 10 分钟",
    sections: [["definition", "什么是建立时间与保持时间"], ["measure", "用示波器测量建立保持时间"], ["scope-vs-la", "示波器与逻辑分析仪"], ["workflow", "软硬件联合调试步骤"], ["interview", "面试自测"]]
  },
  {
    slug: "rs232-rs485",
    chapter: "high-speed-interfaces",
    title: "RS232 与 RS485：电平、电路与波形",
    summary: "对照单端全双工 RS232 与差分半双工 RS485，掌握收发器、防护、端接与方向控制电路，并从实测波形读懂逻辑电平。",
    readingTime: "约 15 分钟",
    sections: [["rs232-intro", "RS232 接口与电平"], ["rs232-circuits", "RS232 电路设计：SP3232E"], ["rs232-waveform", "RS232 波形解读"], ["rs485-intro", "RS485 接口与差分电平"], ["rs485-circuits", "RS485 电路设计：SP3485"], ["rs485-waveform", "RS485 波形解读"], ["compare", "四类接口对比"], ["interview", "面试自测"]]
  },
  {
    slug: "lvds",
    chapter: "high-speed-interfaces",
    title: "差分信号与 LVDS：电平、等长与长距离传输",
    summary: "从差分抗干扰机理到 LVDS 恒流驱动、100Ω 端接与采样时钟关系，量化组内等长和链路插损，并介绍均衡与中继。",
    readingTime: "约 18 分钟",
    sections: [["differential-basics", "差分信号与单端的区别"], ["differential-interfaces", "常见差分接口一览"], ["lvds-standard", "LVDS 电气标准与电平"], ["clock-data", "时钟与数据的关系"], ["length-matching", "LVDS 等长设计"], ["long-distance", "长距离衰减与均衡中继"], ["interview", "面试自测"]]
  },
  {
    slug: "gigabit-ethernet",
    chapter: "high-speed-interfaces",
    title: "千兆网接口：PHY、RGMII、MDI 与 PCB",
    summary: "沿 MAC—PHY—网变—RJ45 链路拆解 RGMII 2ns 延时、MDIO 管理、PAM5 编码与 T568B 线序，并总结千兆网 PCB 和隔离分地规则。",
    readingTime: "约 20 分钟",
    sections: [["phy-topology", "千兆网拓扑与 PHY 架构"], ["rgmii", "RGMII 接口与 2ns 延时"], ["mdio", "MDIO 管理接口"], ["mdi-pam5", "MDI 接口与 PAM5 编码"], ["rj45", "RJ45 线序与网络变压器"], ["speed-diff", "十兆、百兆、千兆的区别"], ["pcb-design", "千兆网 PCB 设计"], ["interview", "面试自测"]]
  },
  {
    slug: "hdmi-pcie-usb",
    chapter: "high-speed-interfaces",
    title: "HDMI、PCIE 与 USB：高速链路电路与 PCB",
    summary: "比较 HDMI TMDS/FRL、PCIE lane 与 USB SuperSpeed 的链路结构、速率和辅助信号，归纳阻抗、等长、耦合、电源限流与 ESD 设计。",
    readingTime: "约 20 分钟",
    sections: [["hdmi-arch", "HDMI 接口架构与 TMDS 电平"], ["hdmi-speed", "HDMI 速率等级与其他引脚"], ["hdmi-pcb", "HDMI 的 PCB 设计"], ["pcie", "PCIE 接口与电路设计"], ["usb", "USB 接口与电路设计"], ["usb-pcie-pcb", "PCIE 与 USB 的 PCB 设计对比"], ["interview", "面试自测"]]
  },
  {
    slug: "pi-pdn", chapter: "si-pi", title: "电源完整性：PDN、目标阻抗与去耦设计", summary: "建立 PI 与 PDN 的频域模型，计算目标阻抗，理解 VRM、去耦、平面、封装和片上电容的分工，并处理 SSN、VSENSE、地弹与分电源。", readingTime: "约 18 分钟",
    sections: [["definitions", "SI、PI 与常见问题"], ["pdn-model", "PDN 组成与目标阻抗"], ["ssn", "SSN 同时开关噪声"], ["vsense", "远端反馈与压降补偿"], ["decoupling", "去耦电容与板级设计"], ["ground-power", "地弹、分地与分电源"], ["interview", "面试自测"]]
  },
  {
    slug: "transmission-line-termination", chapter: "si-pi", title: "传输线、反射与端接：从特征阻抗到 ODT", summary: "从分布电容电感推导特征阻抗，计算开路/短路反射，并对比源端、并联、戴维宁、RC、差分端接和 DDR ODT。", readingTime: "约 22 分钟",
    sections: [["transmission-line", "传输线与特征阻抗"], ["impedance-control", "阻抗控制与参考平面"], ["reflection", "反射系数与振铃"], ["terminations", "源端、并联、戴维宁与 RC 端接"], ["differential-odt", "差分端接与 ODT"], ["interview", "面试自测"]]
  },
  {
    slug: "si-measurement", chapter: "si-pi", title: "高速信号判断与测试：带宽、VNA 与 TDR", summary: "用上升时间和 1/6 波长判断高速边界，选择示波器带宽，再用 VNA 的 S 参数和 TDR 定量测插损、回损与阻抗位置。", readingTime: "约 14 分钟",
    sections: [["bandwidth", "上升时间与信号带宽"], ["high-speed", "什么时候算高速信号"], ["vna", "插损、回损与 VNA"], ["tdr", "TDR 阻抗与位置定位"], ["interview", "面试自测"]]
  },
  {
    slug: "length-matching", chapter: "si-pi", title: "等长设计：从等长基准到差分蛇形实现", summary: "从建立保持解释等长基准，梳理 DDR/eMMC/RGMII、LVDS/MIPI/HDMI 与内嵌时钟接口，落实对内/对间等时和蛇形补偿规则。", readingTime: "约 20 分钟",
    sections: [["why", "等长的原因与等时本质"], ["single-ended", "单端总线按谁等长"], ["differential", "差分对内与对间等长"], ["embedded-clock", "内嵌时钟接口"], ["implementation", "PCB 绕等长实现"], ["interview", "面试自测"]]
  },
  {
    slug: "si-routing", chapter: "si-pi", title: "高速传输路径：回流、过孔、板材与跨板连接", summary: "围绕阻抗连续和完整参考平面，处理伴地孔、过孔残桩、背钻/HDI、焊盘挖空、差分对称、板材玻纤效应与跨板传输。", readingTime: "约 22 分钟",
    sections: [["impedance", "阻抗连续与扇出"], ["reference", "参考平面与伴地孔"], ["vias", "残桩、背钻与 HDI"], ["symmetry", "焊盘挖空与差分对称"], ["materials", "间距、板材与玻纤效应"], ["offboard", "跨板、线缆与中继"], ["interview", "面试自测"]]
  },
  {
    slug: "eye-diagram-jitter", chapter: "si-pi", title: "眼图、ISI 与均衡：预加重和去加重", summary: "读懂眼高、眼宽、UI 与模板，理解码间干扰和抖动如何闭眼，并比较接收均衡、预加重与去加重的补偿机理。", readingTime: "约 16 分钟",
    sections: [["eye-basics", "眼图的意义与叠加"], ["eye-metrics", "眼高、眼宽与模板"], ["isi-jitter", "码间干扰与抖动"], ["equalization", "接收端均衡"], ["emphasis", "预加重与去加重"], ["interview", "面试自测"]]
  }
];

export const reviewArticles = reviewArticleDefinitions.map((article, index, articles) => ({
  ...article,
  hash: `#/knowledge/${article.slug}`,
  previousSlug: articles[index - 1]?.slug ?? null,
  nextSlug: articles[index + 1]?.slug ?? null,
  category: `${knowledgeChapters[article.chapter].index} · ${knowledgeChapters[article.chapter].title} / 硬件面试复习`,
  download: {
    href: knowledgeChapters[article.chapter].downloadHref,
    pages: knowledgeChapters[article.chapter].downloadPages
  }
}));

export const legacyArticle = {
  slug: "capacitor-inductor",
  hash: "#/knowledge/capacitor-inductor",
  title: "电容“隔直通交”与电感“通直隔交”的原理",
  summary: "从时域微分关系和频域阻抗理解电容、电感对直流与交流的不同表现。",
  readingTime: "约 5–8 分钟",
  category: "电路基础 / 延伸阅读",
  previousSlug: null,
  nextSlug: null,
  download: {
    href: knowledgeChapters.passive.downloadHref,
    pages: knowledgeChapters.passive.downloadPages
  },
  sections: [
    ["intuition", "先纠正一句口诀"],
    ["capacitor", "电容为什么隔直流、通交流"],
    ["inductor", "电感为什么通直流、隔交流"],
    ["comparison", "电容与电感的对偶关系"],
    ["applications", "通信工程中的典型应用"],
    ["nonideal", "真实器件并不理想"],
    ["summary", "最后记住这四句话"]
  ]
};

export const articleRegistry = [...reviewArticles, legacyArticle];
export function filterReviewArticles(query = "", chapterId = "all") {
  const needle = query.trim().toLocaleLowerCase();
  return reviewArticles.filter(article => {
    const chapter = knowledgeChapters[article.chapter];
    return (chapterId === "all" || article.chapter === chapterId) &&
      [article.title, article.summary, chapter.index, chapter.title].join(" ").toLocaleLowerCase().includes(needle);
  });
}

export function getArticleBySlug(slug) {
  return articleRegistry.find((article) => article.slug === slug) ?? null;
}
