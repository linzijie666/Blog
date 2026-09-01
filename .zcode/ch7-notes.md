# 第七章 单板接口电路 内容笔记（源：醒工硬件课件 66 页）

## 文章1 iic-spi（p4–19, 32–33）
- IIC：飞利浦(今NXP)1982；标准100k/快速400k/高速3.4MHz；7位地址→2^7=128设备；两线 SCL+SDA；上拉电阻维持高电平；OD开漏；同步、半双工、同一时间1主1从只能读或写
- 电平阈值：V_IL max=0.3V_DD，V_IH min=0.7V_DD（30%/70%，HDC1080/Table10）
- 常见芯片：EEPROM（AT24 系列引脚 A0-A2 地址、SDA/SCL 开漏）、MPU6050（AD0 地址脚）、温湿度 HDC1080/SHT20/30、低速 ADC ADS1115（MUX/PGA/ΣΔ，ADDR 脚、ALERT/RDY）、OLED(SSD1315 4pin)
- 高速接口附带低速配置接口：SMBUS（PCIE 设备管理 10~100kHz 带超时）、HDMI DDC（含IIC，上拉1.5K~2K，标准模式100kHz，固定5V电平需转换）
- 协议：起始+7位地址+R/W+ACK+(8位寄存器地址+ACK)+8位数据+ACK+停止；10位地址分两次(11110+高2位+R/W)；R/W 0写1读；第9个时钟 ACK 拉低 SDA；写时从机回ACK，读时主机回ACK；SDA 高= NACK
- 空闲 SCL/SDA 均高；START：SCL高时 SDA 高→低（仅主机）；STOP：SCL高时 SDA 低→高（仅主机）；数据有效性：SCL 高期间 SDA 必须稳定，SCL 低时才允许变化
- 物理连接：≥2芯片一主一从；IO电平需相同否则转换；总线仅各需一个上拉（1k~10k，5%精度）；多同类从芯片用 A0/A1/A2 上下拉错开地址（AT24C256: 1010+A2A1A0+R/W，U3=1010011 U4=1010001）
- 电平转换：1.8~5V 常见（HDMI 5V）；低成本 NMOS 转换（2SK3018，10K/1.8K 上拉，有风险）或专用芯片（GTL2002DP）；RK3568→HDMI 用 NMOS；Xilinx A7→HDMI 用 GTL2002DP
- 隔离：大功率电源需隔离设定参数；NSI8100 双通道 IIC 隔离，5000Vrms、2MHz、CMTI 150kV/µs、2.5-5.5V
- 开漏原因：多芯片共享总线任一可拉低=线与；推挽会短路损坏（一个高一个低）
- 上拉选择 1k~10k：太大上升沿慢（高速/线多时减小）；太小:1)能耗大 2)超过灌流能力（IO 4~25mA，3.3V/1k=3.3mA<4mA OK）3)OD对地导通阻抗使低电平抬高超过 V_IL
- 挂载芯片增多→减小上拉：总线≈RC充电，Tr=0.8473×R×CL（0.7VDD-0.3VDD 时间差，NXP UM10204）；标准模式 400pF/1000ns、快速 400pF/300ns、高速 550pF/120ns
- 应用：芯片寄存器配置（PHY 的 MDIO+RGMII、HDMI 的 DDC+高速通道）；关联 UM10204；I3C 12.5MHz 向下兼容
- SPI：同步串行，10M~100MHz，4线 CSn(低有效)/SCLK/MOSI/MISO；一主一从点对点；MCU/FPGA/SOC 主，FLASH/ADC/DAC/网口/屏从；SDI/SDO 命名不如 MOSI/MISO 表方向
- 全双工（MOSI发同时MISO收）vs IIC 半双工；4模式：CPOL 0/1 空闲低/高；CPHA 0/1 第1/2边沿采样；mode0(0,0)最常用
- NOR FLASH：几十~几百Mb，最高~100MHz；N25Q128 108MHz、READ 54MHz、4路数据 QUAD；中低速 ADC/DAC：AD5683 50MHz（SYNCn/SDI/SDO）
- W5500 PHY 80MHz（RJ45-网变-PHY-MII-MAC-TCP/IP-SPI，32KB TX/RX，25M PLL→100M，1.2V/3.3V Regulator）
- CMOS 传感器配置 SPI：IMX265 ≤13.5MHz
- 电路设计：CSn 预留5~10k上拉；SCLK 预留对地 EMC 电容位（NC）；四线均串 22~33Ω 靠近发送端（MOSI 主控端、MISO 从芯片端）；STM32F103 SPI1 PA4NSS/PA5SCK/PA6MISO/PA7MOSI（NSS/SCK/MOSI 推挽输出，MISO 上拉输入）；W25Q128：WPn/HOLDn 上拉10k，CSn 上拉，QUAD 可扩
- 电平转换：SPI 推挽高速，MOS 管方案大概率不适配→电平转换芯片（注意方向、最高频率、压摆率）；AXC4T245 100Mbps（3方向主→从+MIPO 从→主 2N7001T）；TXB0108 双向（勿用 TXS 系列），VCCA<VCCB，OE 参考 VCCA，尽量不上拉或 50K 以上
- 多从扩展：每从芯片单独 CSn；1主4从 SCLK/MOSI/MISO 并联；从机数多残桩变长可能降速

## 文章2 setup-hold-time（p19–24）
- 建立时间：时钟上升沿来临之前数据需保持稳定的最短时间；保持时间：时钟上升沿之后数据保持稳定的最小时间；保证芯片内部触发器正常
- 实测（SPI 绿 CLK 黄 MOSI 上升沿采样）：建立=数据跳变完成(红)到采样时刻(橙)；保持=采样时刻到数据线跳变(绿)；高低电平按幅度 10%/90% 判定
- CH390（沁恒 10/100M PHY）SPI：T1 SCK max 72MHz；T2/T3 6.5ns；T4 建立时间 min 3ns；T5 保持 min 2ns；T6 输出延迟 2~6.5ns；各芯片 SPI 时序均为 ns 级
- 要点：数电基础+实测必测；通信异常先查建立/保持；降速测试定位；保持不足加大串阻或对地小电容；FPGA ps 级调整；高低温影响
- 示波器（硬件）：观察波形质量——频率、高低阈值、建立保持、上升下降沿、单调性；缺点：人工转二进制（高端可装软件）、几十位以上协议分析困难、一般最多4通道并口难；UART RX 上升沿振铃毛刺示例
- 逻辑分析仪（软件/嵌入式）：将波形转 0101 二进制；协议分析；接 PC；储存深度大（秒级）；进制转换（二/十/十六/ASCII）；通道多（十几个并口优势）；缺点：无波形细节、采样率上限一般 100MHz；LA5016 Kingst：USB 接 PC，通道 GND 与被测 GND 统一；采集示例 SDA/SCL/MOSI/MISO/CLOCK/ENABLE/TMS/TCK… 
- 结合调试：1)示波器看频率电平建立保持上升下降/串扰毛刺非单调 2)查芯片手册阈值与建立保持要求 3)逻辑分析仪记录多周期数据（秒级几千几万bit），选频率、通道、采样沿模式、数据格式

## 文章3 rs232-rs485（p25–33）
- RS232：1962 EIA；板间低速；触摸屏/读卡器/扫码枪/打印机↔PC/PLC；DB9（工控机 COM 口保留，家用需 USB 转 COM）；公母座、直连线(1-1…9-9)/交叉线(2-3,3-2,5-5)；USB转RS232（1转2/1转4）
- 非同步（无时钟）、全双工、点对点2设备；约定波特率（9600、115200）、数据位、停止位、校验位
- 电平：单端 TX/RX 对 GND；逻辑"1"=-15~-3V；逻辑"0"=+3~+15V；速率一般<2Mbps、距离<15米、抗干扰弱；TX/RX 交叉连接
- 电路：SP3232E（3.3~5V，双路）；电荷泵 C1+/C1-/C2+/C2- 外挂100nF（倍压与负压）、V+/V- 输出滤波100nF；T1OUT/R1IN=RS232电平接连接器，T1IN/R1OUT=CMOS接主控（GPIO_TX 主控→232，GPIO_RX 232→主控）；T1IN/R1OUT 串22Ω；R20/R21 100Ω/0603以上封装（EMC防护+耐压）接 DB9；D1/D2 BV15C 15V 双向TVS（VRWM=15V 匹配±15V 范围，防ESD，靠近DB9）；PE 与 GND 经 10nF/0805 隔离（可并1MΩ），DB9 金属壳接 PE
- 波形解读：PC 9600-n-8-1 发 0xAA(10101010)；R1IN（RS232）逻辑1=-9.6V 逻辑0=+8.2V；R1OUT（CMOS）：0起始位 0LSB 1010101 1停止位
- RS485：1983 EIA；半双工（同一时间收或发）、差分（A/B）、长距离（最远1200m）或高速（10m@10/20Mbps），速率与距离成反比；多节点（一般32个）；工业控制/楼宇/物联网；也非同步
- 电平：共模 A/B 对 GND -7~+12V；差模 A-B -6~-2V/+2~+6V；SP3485 3.3V：逻辑1 A≈3.3V B≈0V(A-B=3.3V)，逻辑0 反之；接收端判决 |A-B|>200mV（-0.2/+0.2V Differential input threshold）
- 电路：SP3485EN；RO/RE#/DE/DI CMOS 电平；A/B 对外；RE#与DE 连一起：高=输出（DI 高→A=3.3V B=0V），低=输入（A-B>+200mV→RO=1）；R31 4.7K RE 下拉+D6 1N4148 DE 上拉（防信号倒灌电源）；R24/R25 100Ω/0603 串阻；R34 120Ω/2512 端接预留（6*6/120=0.3W，100%余量需0.6W→2512封装1~2W）；上拉下拉防悬空；TVS：D3/D4 SMAJ12CA 共模（匹配+12V上限）、D5 SMAJ6CA 差模；C12 10nF PE 隔离；GDT/TSS/MOV 高等级浪涌
- 波形：DI 4MHz 方波，A/B 共模 3.12V/0.32V、2.6V/0.44V，math=A-B 逻辑1=+1.76V 逻辑0=-1.76V；双绞线串扰在 A/B 相同，相减消除→差分优势
- 对比表（RS232 vs RS485）：3线TX/RX/GND vs 2线A/B；单端 vs 差分；±3~15V vs 共模-7~12V差模±2~6V；非同步 both；全双工 vs 半双工；点对点 vs 总线32~256；15m vs 1200m；2Mbps vs 20Mbps；商用 vs 工业；抗干扰弱 vs 强
- IIC/SPI/UART 对比表：IIC 同步半双工 3线(SCL/SDA/GND) 总线≤127从机 ≤3m 100K/400K/3.4M 板内低速；SPI 同步全双工 5线(SCLK/CSn/MOSI/MISO/GND) 点对点≤4从 板内<0.2m 100MHz 中速；UART 非同步全双工 3线(TX/RX/GND) 点对点 ≤3m 2Mbps 板内/板间低速调试；同步=按同步时钟采样，非同步=按约定波特率采样

## 文章4 lvds（p34–44）
- 单端：1信号线+GND 参考端，<20%判低 >80%判高（以芯片为准）；结构简单摆幅大（1.8/2.5/3.3/5V）速度低（除DDR/eMMC 很少>100MHz）距离近（板内为主）抗干扰弱
- 差分：2根等幅反相（P/N +/− A/B），按差压判别：D+−D− 高于阈值=1 低于=0；RS485/网口/HDMI/USB 都是；摆幅小（发送±350~1000mV，接收±100~200mV 即可）、速度高（PCIE/USB Gbps 级）、距离远（千兆百米、RS485 低速几公里；高速与长距矛盾）、抗干扰强
- 对比表：至少2线+GND vs 至少3线+GND；1.8~5V vs 差模±350~1000mV共模<3.3V（RS485除外）；参考平面 GND vs GND主要+PN间内部参考次要（网线/RS485 仅PN间内部参考）；<100MHz vs MHz~GHz；弱 vs 强；IIC/SPI/UART/RS232 vs RS485/网口/HDMI/USB/PCIE/LVDS/MIPI；单端50Ω vs 差分90Ω(USB)/100Ω(LVDS/MIPI/HDMI/网口MDI)
- 优点：1)抗干扰（共模干扰做差消除）2)速度快（摆幅小→同压摆率频率高几倍，压摆率=电压摆幅/时间 V/ns）3)EMI小（幅值低+对外辐射互相抵消，仍超标可串共模电感如USB）
- 缺点：每信号2根等长等间距平行线、同时换层；布板面积大设计要求高；双绞线缆成本高
- 常见差分：网口 10M(一对发一对收 二值)/100M(MLT-3)/1000M(4对 PAM5 全双工)/10G(PAM16)，内嵌时钟；LVDS（CMOS传感器/LCD屏/芯片间FPGA-SOC）1对时钟+N对数据，共模1.2V差模350mV；类 LVDS：SLVS、sub-LVDS；LVDS 单向固定不能传控制；MIPI_CSI/DSI（1对时钟+1/2/4对数据，HS 200mV + LP 双模式）；PCIE（X1~X16 gen1~6）；USB（1/2.0 一对 D+/D−；3.0 加 SSTx/SSRx 5Gbps）；HDMI（TMDS，1对时钟+3对数据 1:10bit）；Cameralink（1对时钟+4对数据 1:7 时钟≤85MHz，双线缆 3时钟+12数据 6.8Gbps 可供电）；CoaXpress（1~4根同轴 内嵌时钟 4×12.5Gbps=50Gbps，24V POC 供电+40Mbps 低速控制）；增量编码器（A+/A−,B+/B−,Z+/Z− 幅值同供电 5/12V，KHz 级，AB 相位差±90°，单A/B测角度，A+B 判方向）；CAN（CAN_H/CAN_L 汽车/工业）
- LVDS：NS 公司（美国国家半导体）为克服 TTL 宽带高码率功耗大 EMI 大；低压摆幅约350mV 差分传输；几百 Mbit/s；低噪声低功耗；显示/通信/汽车/工业/医疗
- 电气标准（TIA/EIA-644）：驱动器 3.5mA 恒流源方向可变；接收器高阻输入，电流流过100Ω 端接电阻产生350mV；PCB 差分阻抗100Ω 否则反射；100Ω 端接尽量靠近接收器；FPGA/SOC 可开内部100Ω 端接（效果更优），内外不要同时用
- 电平：共模1.2V 差模±350mV；传1：P=1.375V N=1.025V P−N=+350mV；传0：P=1.025V N=1.375V −350mV
- LCD 屏接收要求：V_CM 1.0~1.5V（标准1.2）；V_IN 0.7~1.8V（单端测量）；差模接收范围 ±100mV（最小，低于无法判别）~±600mV（最大，超可能损坏）；ΔVCM max 250mV
- AC spec：t_SKEW max |(0.2*T_CK)/7| ps；t_eff min ±360ps；t_SKEW_EO max |1/7*T_CK|
- 采样时钟：1:1 同频（SDR 时钟MHz=速率Mbps；DDR 时钟×2=速率）或 1:N（Cameralink 1:7 单沿、HDMI 1:10、LCD LVDS 1:7）；SLVS：时钟297MHz 数据594Mbps（DDR 二倍）
- 等长：对内 P/N 一般5mil；组内以时钟 CLKP/N 为基准 ±100mil（例 CLK 1000mil DATA0 910 DATA1 1090）；LVDS ≤1.2Gbps 双沿600MHz 周期1.67ns，100mil≈0.0167ns（1%周期）影响小；多组间不需严格等长；布线紧张时用 LVDS training 或调整接收端时钟相位（FPGA 几十ps 步进）
- 长距离衰减：发送±350mV 接收±100mV → 可容忍 20log(100/350)≈−10dB 插损（PCB+线缆+连接器）；Xilinx LVDS_25: VODIFF 247/350/600；VDIFF(min)=100mV VICM 0.3/1.2/1.5V
- 接收不到±100mV：中继（LVDS Buffer）或提高发送电流（ADS6445 寄存器 2.5/3/3.5/4.5mA + CURR_DOUBLE 倍增最高8mA → ±350→±800mV）；DS25BR110 带均衡 EQ：V_TH/V_TL ±100mV 输入 ±350mV 输出；均衡解决码间干扰（不同码型频率不同插损不同）；70inch FR4 2.5Gbps PRBS-7 EQ 前后眼图对比
- 要点：MIPI/HDMI 是 LVDS 变种扩展；校招：拓扑/共模差模/等长；社招：1时钟+多数据等长与PCB、测试调试（调整采样沿相位/驱动强度）、中继与 EQ
- 资料：TI《LVDS Owner's Manual》

## 文章5 gigabit-ethernet（p45–54）
- 1000BASE-T 用超五类/六类；千兆网信号线最高频率仅125MHz，1GHz 带宽示波器即可
- OSI 七层：应用(HTTP/FTP/DNS/Telnet)/表示/会话/传输(TCP/UDP)/网络(IP)/数据链路(帧MAC CRC)/物理；硬件主要涉物理层+数据链路层；物理层=数据→电/光/无线信号，只管比特透明传输；数据链路层=可靠传输（帧、MAC寻址、CRC）；1000BASE-T: 1000=1000Mbps -T=双绞线；1000BASE-X=光纤
- 拓扑：主控MAC→PHY→网络变压器→RJ45→网线；PHY 与网变间=MDI 接口 4对差分 PAM5；PHY 与 MAC 间：控制通路 MDIO（低速）+数据通路 RGMII/GMII（高速）
- RTL8211FD：内部 LDO1→Core 1.0V/A FE 1.0V；LDO2→IO 2.5/1.8/1.5V；25MHz XTAL；125MHz free-run；数字模拟混合（含ADC/DAC）；Echo Canceler 回声消除分离 MDI 收发→全双工千兆；框图：MDIP/MDIN[3:0]↔10M TX/RX、DAC、Echo Canceler、ADC、FFE、DFE、PCS TX/RX、Phase Selector、PLL、SWREG、Bandgap、MDC/MDIO/INTB/PMEB、LED
- YT8531（裕泰国产）pin 兼容 RTL8211、JL2121（景略）；原理图：RGMII RX/TX 串阻33Ω；MDIO/MDC/INT 4.7K 上拉 VCCIO；CLKOUT125；XTAL 25M；PHYRSTB 0R+4.7K DNP 上拉；RSET 2.8K；AVDD10 磁珠/电感1.2Ω+1µF；REG_OUT 1R0 电感（<0.5cm）；EPAD 散热=GND
- RGMII：12根单端：6 TX（TXCLK/TXCTL/TXD0-3）+6 RX（RXCLK/RXCTL/RXD0-3）；125MHz DDR 双沿采样；速率=125MHz×2×4=1000Mbps；方向：RXD PHY→MAC（收到的数据）TXD MAC→PHY（发送）；RX 侧串阻 22~33Ω 在 PHY 端（发送端匹配），TX 串阻在主控端；电平可配 1.5/1.8/2.5/3.3V；相位延迟 2ns 可开关（TX/RX 独立，RTL8211 10.6.2）
- 2ns 延时：不开延时时钟与数据相位相同不便采样（主芯片内部延时才能采样）；开 2ns 后采样沿对准数据稳定窗口，建立保持充足（125MHz 周期 8ns）
- MDIO：配置专用低速接口；需上拉；拓扑类似 IIC 但 IO=三态门（高阻输入+推挽输出）；配置 PHY 状态/寄存器/PHY 地址/LINK 状态；最多 32 设备；上拉 1.5~2K；速度 2.5~25MHz（供应商有差；RTL8211 MDC 最小周期 80ns→最高 12.5MHz）；Table57：MDC 高/低脉宽 min32ns 周期 min80ns MDIO 建立/保持 min10ns 有效 max300ns
- MDI：PHY-网变-RJ45-网线；4对差分 PAM5 内嵌时钟；PAM5 电平 0/±0.5/±1V 表示 0,±1,±2→每采样周期 2bit；周期8ns=125MHz；总带宽=125M×2(PAM5)×4(对)=1000Mbps；实测发送幅值接近±1V；1GHz 示波器即可
- PHY 其他引脚：INT/RSTn（3.3V）；25MHz 输入+125MHz 输出；LED 指示 LINK/ACTIVE/速度；电源 1.0V 数字/模拟+3.3V+IO；自带 1.0V（DCDC/LDO）；EPAD 散热=GND
- RJ45 线序（T568B）：1 DATA_A+白橙 2 A−橙 3 B+白绿 4 C+蓝 5 C−白蓝 6 B−绿 7 D+白棕 8 D−棕；1&2=A、3&6=B、4&5=C、7&8=D；网变与 RJ45 连接也需注意 3-4-5-6 线序；按 1-2-3-4-5-6-7-8 成对则仅 1-2 与 7-8 是差分对→只能百兆
- PHY-网变-RJ45 原理图：G24P02S_1000_BASE_MAGNETICS，75Ω/2%×4（Bob Smith 75Ω 共模端接），1000pF/2KV×4+1000pF/2KV（PE）
- RJ45 两类：不带网变（8pin 信号+4pin LED+2pin 金属壳接 HGND 分地；自行设计网变+防护：复杂占空间但防护灵活 EMC 好，工业级）；带网变（HR915320：内部 4 组 1CT-1CT 变压器+Bob Smith 4×75Ω+1000pF 2KV；尺寸略大于独立 RJ45 但小于 RJ45+网变；消费级）
- 十/百/千兆区别：百兆仅用 4 芯 1-2-3-6（2对）；MLT-3 电平 125MHz 8b/10b→125×0.8=100Mbps（一对发一对接收）；百兆眼图易测（MLT-3 两层眼，TX/RX 分开）；千兆 PAM5 发送接收共用差分对波形叠加不易分辨一般不测眼图；十兆 2 对差分 ≥±1V 曼彻斯特编码 20MHz（实测 ±2.4V 周期50ns）；百兆/十兆 PHY 与主控：SPI（<100MHz）或 MII/RMII；MII 四线 25MHz（百兆）/2.5MHz（十兆）；RMII 两线 25MHz 双沿
- PCB 设计三要点：RGMII、MDI、隔离分地
- RGMII（RK3588）：单端 50Ω±10%；(TXD0-3,TXEN) to TXCLK 等长<120mil；(RXD0-3,RXDV) to RXCLK<120mil；走线<5inches(5000mil)；RGMII 线间距≥2倍线宽；与其它信号≥3倍（至少2倍）；数据线以各自时钟为基准
- MDI：内嵌时钟仅需对内等长：对内5mil（P-N），对间100~200mil；差分100Ω；<2000mil；差分对间 5w
- 隔离分地：RJ45 地平面（含金属外壳连设备壳/地）与板内 GND 隔离（防 EMC 耦合），通过网络变压器+分地实现；RJ45-网变尽量靠近面积小；网变下方挖空+分地；附近避免走线；网变初级+RJ45 HGND(Earth GND) 与其他 GND/信号/电源层至少分隔 20mil
- 要点：标准化强方案固定；4点：RGMII（电平采样沿速率双沿）/MDI（PAM5 速率实现 RJ45 线序）/PHY 电路（RGMII 配置）/PCB（高速设计+隔离防护）；社招：故障定位（主控-PHY 或 PHY-RJ45）、易错点（2ns 采样沿、电压配置、3-4-5-6 线序）、EMC（RE 辐射超标/SURGE）
- 资料：TI《以太网 PHY PCB 设计布局检查清单》、瑞芯微《RK3588 PCB 设计指导白皮书》、MICROCHIP《千兆位以太网设计指南 AN2054》、《千兆网接口1000BASE-T电路设计.pdf》附加文档（RGMII 12线125M DDR 2ns、MDIO 32设备上拉1.5~10K、Bob Smith、PHY 电源 1.0V DVDD/AVDD LDO 去耦、25M 晶振 125M CLKOUT、LED 限流）

## 文章6 hdmi-pcie-usb（p55–66）
- HDMI 接口：4 对高速差分（1 对时钟 HDMI_TXCLK P/N + 3 对数据 TX0~3 P/N）+4 根低速单端（DDC SCL/SDA=IIC、HPD 热拔插检测、CEC 设备互联非必要）+5V 供电+GND
- EMC：高速差分 TVS 阵列（AZ1145-04F）；单端低速 TVS（USD5341N）；速率越高 TVS 结电容越小
- TMDS 拓扑：AVcc=3.3V，RT=50Ω；Transmitter=SOC/GPU，Receiver=LCD；Z0 单端50Ω 差分100Ω
- Source 端：空闲3.3V；差模 Vswing AC ±400~600mV（测试点发送端插座 TP1）；V_H≤165MHz AVcc±10mV、>165MHz (AVcc−200mV)~(AVcc+10mV)；V_L≤165MHz (AVcc−600)~(AVcc−400)、>165MHz (AVcc−700)~(AVcc−400)
- Sink 端：差模 AC 需大于±150mV 才能识别；不超过±1200mV 否则损坏；V_ICM ≤165MHz (AVcc−300mV)~(AVcc−37.5mV)、>165MHz (AVcc−400)~
- 速率：HDMI2.1 之前 1 对时钟+3 对数据；2.1 新增 FRL 4 对 SERDES 内嵌时钟（类 PCIE）；表：1.0 总带宽4.95G 数据3.96G 单对1.65G 1080p@60；1.4 10.2/8.16/3.4G 4K@30；2.0 18/14.4/6G 4K@60；2.1 48/42.6/12G 8K@30；总带宽=全部（编码后图像+同步+控制）；数据带宽=仅图像；单对速率×3（1.0~2.0）/×4（2.1）=总；硬件关注单对速率（物理层测试即此频率）
- 时钟频率=Hpix×Vpix×fps：1080p 2200(有效1920)×1125(有效1080)×60=148.5MHz；4K@30=297MHz；4K@60=594MHz；8K@30=1188MHz（像素总数 VESA 规定）
- +5V：发送端4.8~5.3V 接收端4.7~5.3V 过流<0.5A；低速信号以5V为标准
- DDC：专用 IIC，5V 电平，上拉 1.5K~2K；DDC 电容：Source/Sink 50pF Cable 700pF；Source 上拉 1.5k~2.0k，Sink SCL 上拉 47k
- HPD：高电平=有设备接入，主设备通过 IIC 读从设备型号；从设备拉低 HPD≥100ms 再拉高让主设备重新读取；主=输入 从=输出；5V 电平，低阈值0.4V 高阈值2.4V；输出阻抗 1000Ω±20%
- HDMI PCB（RK3588）：差分 100Ω±10%；对内时延差<6mil；时钟与数据等长<480mil；走线 2.0<6inches / 2.1<4inches（原因：插损衰减+码间干扰，过长接收幅值<±150mV）；电容要求 2.1 220nF 0201（FRL AC 耦合）；对间距 ≥5 倍线宽(2.0)/≥7 倍(2.1)（边缘距离非中心距）；与其它信号 ≥5/≥7 倍；过孔建议≤2 个（过孔阻抗不连续+残桩，HDI 盲埋孔或背钻，见第八章）；ESD TVS 结电容：2.0 及以下<0.35pF、2.1<0.15pF；回流地孔；连接器焊盘挖空保阻抗连续、TVS 焊盘下挖空
- 通用准则：差分阻抗 90/100Ω、对内 5mil、过孔≤2、对间距按速度 3W/5W/7W
- 要点：显示接口 HDMI/DP/LVDS/MIPI-DSI，HDMI 最通用；架构（1+3+4根单端+电源GND）；社招：编码协议、版本速率、测试（位置/阈值/眼图/一致性）
- PCIE：Gen1~6；Gen1~5 二值电平 Gen6 PAM4（类千兆 MDI）；X1~X16=lane 数（X1=1上+1下）；表：Gen1 2.5Gbps 8b/10b X16=4GB/s；Gen2 5 8b/10b 8；Gen3 8 128b/130b 15.75；Gen4 16 128b/130b 31.5；带宽计算：Gen2 5Gbps×80%×16/8=8GB/s；X4=2GB/s；总带宽与 lane 数正比；Gen3 8×98.5%×16/8=15.75GB/s；Gen3+ 预加重/去加重（应对插损与 ISI，见第八章）
- RC（Root Complex：CPU+主板）vs EP（Endpoint：板卡 Add-in Card）
- 金手指引脚 4 类：电源（+12V/+3.3V/3.3V_AUX 三轨，主板供电，限流：75W slot 5.5A(66W)/3A(9.9W)/375mA(1.24W)；+12V+3.3V 主功率，3.3V_AUX 睡眠唤醒持续供电）；GND（供电回流+高速回流）；低速（SMCLK/SMDAT=SMBUS 特殊 IIC 监控供电温度风扇可不使用；PRSNT1/PRSNTx1/x4/x8 插入检测，确认 X1/X4/X8 以分配资源，Mute Last/Break First；WAKE# 开漏输出板卡→主板唤醒；PERST# 主板→板卡复位；TCK/TDI/TDO/TMS/TRST#=JTAG；REFCLK+/−100MHz）；高速（X8=1 路时钟+8 路 TX+8 路 RX；时钟 100MHz ±300ppm、支持展频、抖动要求严；数据通路内嵌时钟不需组内等长，CDR 恢复；TX EP→RC 加 100nF（gen2）/220nF（gen3）交流耦合靠近金手指；RX RC→EP）
- USB：1.0 Low 1.5M/Full 12M 半双工 5V0.5A；2.0 High 480M 半双工 5V0.5A；3.0 Super 5G 全双工 5V0.9A；供电 5V±5%→4.75~5.25V；长线+大电流压降注意
- USB3=3 对差分：D+/D− 双向 480M；SSTx 主控→从 5G 主控末端靠近连接器 100nF 耦合；SSRx 从→主 5G
- USB 电路（HOST）：Load Switch 供电控制（USB_VBUS_EN0 GPIO→EN）；MT9700 限流：EN 控制通断，ISET 对地电阻配置限流 I=6.8kΩ/R_SET(kΩ)；5.1K→1.3A；表：600mA→11.3K、800→8.45、1000→6.8、1500→4.53、2000→3.4；USB2.0/3.0 限流 0.5A/0.9A，考虑压降余量 USB3 限流一般 1.1~1.3A
- TVS：3 对差分均需 ESD，注意结电容（2.0<1.5pF、3.0<0.5pF）；共模电感 90Ω@100MHz（RE 超标时）；D_P/N 和 SSRX 串 0Ω 便于调试，SSTX 已有电容尽量不串；布局从外到内：连接器-TVSS-共模电感-AC 耦合电容（仅TX）-主芯片
- PCIE PCB（RK3588）：差分 85Ω±10%（80~90 之间）；对内时延差<6mil；对内等长 5mil；走线<6inches；电容 100nF(2.0)/220nF(3.0) 0201；对间距≥4 倍(2.0)/≥5 倍(3.0)；RefCLK 时延差<12mil、100Ω；与其它信号 ≥3 倍(至少4)/≥5 倍；过孔≤2；内嵌时钟→对间不需等长（与 HDMI 不同）；不做热拔插不需 TVS；回流孔；板卡金手指焊盘挖空参考、耦合电容焊盘挖空
- USB PCB：差分 90Ω±10%；对内时延差 2.0<20mil、3.0<6mil；对内等长 5mil；走线<6inches；过孔 2.0 ≤4(不超6)、3.0 ≤2；3.0 电容 100nF 0201（SSTX）；对间距≥4 倍(3.0)；内嵌时钟对间不需等长
- 要点：USB 与 PCIE 相似（SOC 资源互换；均仅对内 P-N 等长、内嵌时钟、TX/RX 数量相等、TX 侧耦合电容）；区别：USB 热拔插对接接口需 ESD，PCIE 内部接口不做；掌握原理图结构+PCB 规则（阻抗等长过孔间距）、区分信号方向、USB 供电限流与 EMC
