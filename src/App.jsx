import { useEffect, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  Cpu,
  ExternalLink,
  Github,
  Mail,
  MapPin,
  MemoryStick,
  MessageCircle,
  Radio,
  ShieldCheck,
  X,
  Zap
} from "lucide-react";
import TextType from "./components/TextType";
import ShinyText from "./components/ShinyText";

const email = "850207333@qq.com";

const heroVideoUrl =
  "https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4";

const navItems = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Contact", href: "#contact" }
];

const stats = [
  { value: "18+", label: "硬件/固件项目" },
  { value: "6", label: "量产与样机阶段" },
  { value: "4yr", label: "嵌入式开发经验" },
  { value: "24h", label: "问题闭环响应" }
];

const projects = [
  {
    title: "电子蝴蝶：ESP-01S 物联网呼吸灯装置",
    type: "ESP-01S / MQTT / 微信小程序",
    image: "/images/projects/electronic-butterfly.jpg",
    description:
      "以蝴蝶造型 PCB 为载体的联网灯效作品，集成 24 颗蓝色 LED、Type-C 充电、锂电池供电、3.3V 稳压和 MQTT 远程控制。",
    tags: ["ESP8266 RTOS SDK", "PlatformIO", "MQTT", "PWM LED", "TP4056"],
    github: "https://github.com/linzijie666/esp01s.git",
    detail: {
      software:
        "固件基于 ESP8266 RTOS SDK 与 PlatformIO，拆分为 WiFi 连接、MQTT 客户端、PWM 灯效驱动和业务控制层。设备上电后以 Station 模式联网，订阅控制主题，并定时心跳与断线重连。",
      hardware:
        "硬件采用 ESP-01S 作为主控，GPIO2 输出 PWM 驱动灯效。板上包含 Type-C 输入、TP4056 锂电池充电管理、AP2114H-3.3V 稳压、SS8050/AO3401A 驱动与保护电路。",
      bom: [
        "ESP-01S WiFi 模块",
        "24 颗蓝色 0603 LED + 2 颗红色状态 LED",
        "TP4056 锂电池充电管理芯片",
        "AP2114H-3.3V 稳压芯片",
        "Type-C 6P 接口、SS34 肖特基、AO3401A、SS8050、0603 阻容"
      ],
      cost: "样机估算约 ¥25-45/套，主要成本来自 ESP-01S、PCB、LED、锂电池、电源管理与外壳/展示材料。",
      stack: ["C", "ESP8266 RTOS SDK", "PlatformIO", "MQTT", "JSON 控制协议", "微信小程序", "PWM 调光"],
      result:
        "实现手机端远程开关、0-100% 亮度调节、常亮/呼吸模式切换、1-5 档呼吸速度调节，以及设备状态实时回传。实物效果是可充电、可联网控制的桌面氛围灯。"
    }
  },
  {
    title: "STM32G474 同步整流 Buck-Boost 数字电源",
    type: "STM32G474 / HRTIM / ADC DMA / 双环 PID",
    image: "/images/projects/buck-boost-power.jpg",
    description:
      "基于 STM32G474RET6 的四开关同步整流 Buck-Boost 数字电源，使用 HRTIM 产生桥臂 PWM，ADC DMA 采样输入/输出电压电流，并实现电压-电流串级闭环控制。",
    tags: ["STM32G474", "Buck-Boost", "HRTIM", "ADC DMA", "PID"],
    github: "https://github.com/linzijie666/4-queue.git",
    detail: {
      software:
        "固件使用 STM32 HAL、CMake 与裸机状态机实现。HRTIM 负责 Buck/Boost 桥臂 PWM 与 ADC 硬件触发，ADC1 通过 DMA circular 搬运 4 路采样；电压外环降频运行生成电流指令，电流内环全速运行并写入 HRTIM 比较值。状态机负责软启动、运行、故障锁存和 PWM 封锁，上电会先等待 ADC DMA 首帧有效再进入软启动。",
      hardware:
        "硬件为四开关同步整流 Buck-Boost 拓扑，主控 STM32G474RET6 运行 170MHz。功率级使用 4 颗 CJAC80SN10 N-MOSFET 与 2 颗 EG3112 半桥驱动，输入范围 12V-52.7V，电压/电流经 GS8558 零漂移运放调理后送入 ADC；板上还包含 USB PD 诱骗、电源树、CH340C 调试、OLED/面板接口、蜂鸣器和风扇控制预留。",
      bom: [
        "STM32G474RET6 主控",
        "CJAC80SN10 100V/80A N-MOSFET x4",
        "EG3112 半桥驱动 x2",
        "22uH 功率电感、5mΩ 2512 电流采样电阻",
        "GS8558-SR 零漂移运放、REF3033 3.3V 精密基准",
        "TPS54360、SY8205、AMS1117 电源树",
        "CH224K USB PD 诱骗、CH340C USB-UART、OLED/按键/编码器接口"
      ],
      cost: "样机估算约 ¥180-350/套，主要成本来自 STM32G474、功率 MOSFET、半桥驱动、电感、电源管理、采样运放、PCB 和接口器件。",
      stack: [
        "C",
        "STM32 HAL",
        "STM32G474",
        "HRTIM",
        "ADC DMA",
        "串级 PID",
        "状态机",
        "CMake"
      ],
      result:
        "完成 Buck/Boost 模式 PWM 输出框架、ADC 首帧保护、软启动、故障锁存、串口 CSV 诊断输出和电压-电流双环控制链路。当前目标输出为 24V，软启动 800ms，串口每 50ms 输出 Vin/Iin/Vout/Iout、设定值、控制量、效率、状态与故障码，便于上板调试和闭环参数迭代。"
    }
  },
  {
    title: "小智 AI 设计工程",
    type: "OSHWHub / 小智 AI / 锂电池供电",
    image: "/images/projects/xiaozhi-ai.jpg",
    description:
      "第十届立创电赛项目，小智 AI 训练营成果，将原设计供电方案改为锂电池，并加入 TP4056 充电管理，实现可充放电一体的 AI 语音硬件。",
    tags: ["小智 AI", "立创电赛", "TP4056", "锂电池", "音频硬件"],
    github: "https://github.com/78/xiaozhi-sf32",
    source: "https://oshwhub.com/lzj11111111/xiaozhi-ai-design-engineering",
    sourceLabel: "OSHWHub",
    detail: {
      software:
        "程序参考小智 AI 开源固件，下载方式以串口烧录为主。作品重点围绕 AI 语音功能、电源管理和硬件装配做二次设计，便于在小体积外壳中完成语音交互与移动供电。",
      hardware:
        "在原方案基础上改为锂电池供电，并加入 TP4056 锂电池充电电路，实现充放电一体。PCB 设计中注意麦克风与功放线路包地处理，扬声器选用 8Ω 2W、30mm x 20mm 规格以适配结构空间。",
      bom: [
        "锂电池供电单元",
        "TP4056 锂电池充电管理电路",
        "8Ω 2W、30mm x 20mm 扬声器",
        "麦克风输入电路",
        "功放与音频输出电路",
        "PCB、M3 螺丝与装配结构件"
      ],
      cost: "复刻成本约 ¥50，主要成本来自电池、充电管理、音频器件、PCB 与结构装配材料。",
      stack: ["小智 AI", "音频硬件", "TP4056", "锂电池供电", "串口烧录", "立创 EDA"],
      result:
        "实现 AI 语音功能与可充放电一体的锂电池管理，整机可移动供电，支持串口下载程序，并通过 M3 螺丝完成安装固定。"
    }
  }
];

const capabilities = [
  {
    icon: Cpu,
    title: "硬件 Bring-up",
    description: "从原理图审阅、焊接检查到电源、时钟、复位、下载链路逐项验证。"
  },
  {
    icon: MemoryStick,
    title: "固件架构",
    description: "按驱动层、服务层、业务层拆分代码，降低外设变更带来的连锁影响。"
  },
  {
    icon: Activity,
    title: "信号调试",
    description: "结合示波器、逻辑分析仪和串口日志定位时序、噪声与协议边界问题。"
  },
  {
    icon: Radio,
    title: "通信协议",
    description: "熟悉 UART、I2C、SPI、CAN、RS485、MQTT、Modbus 等常用通信链路。"
  },
  {
    icon: ShieldCheck,
    title: "可靠性设计",
    description: "关注看门狗、异常恢复、掉电保护、边界输入和现场可诊断性。"
  },
  {
    icon: Zap,
    title: "性能与功耗",
    description: "围绕采样周期、PWM、DMA、睡眠模式和任务调度做资源与功耗平衡。"
  }
];

function ProjectDetail({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.classList.add("modal-open");
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [project, onClose]);

  if (!project) return null;

  const sourceUrl = project.source ?? project.github;
  const sourceLabel = project.sourceLabel ?? "Source Link";

  return (
    <div className="detail-overlay" role="dialog" aria-modal="true" aria-labelledby="project-detail-title">
      <button className="detail-backdrop" type="button" aria-label="关闭项目详情" onClick={onClose} />
      <article className="detail-panel">
        <div className="detail-body">
          <div className="detail-topline">
            <p className="eyebrow">{project.type}</p>
            <button className="detail-close" type="button" aria-label="关闭项目详情" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <h2 id="project-detail-title">{project.title}</h2>
          <p className="detail-summary">{project.description}</p>

          <div className="detail-action-row">
            <a className="primary-button" href={project.github} target="_blank" rel="noreferrer">
              <Github size={18} />
              GitHub
            </a>
            <a className="ghost-button" href={sourceUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={18} />
              {sourceLabel}
            </a>
          </div>

          <div className="detail-grid">
            <section className="detail-section">
              <h3>软件方案</h3>
              <p>{project.detail.software}</p>
            </section>
            <section className="detail-section">
              <h3>硬件方案</h3>
              <p>{project.detail.hardware}</p>
            </section>
            <section className="detail-section">
              <h3>物料选型</h3>
              <ul>
                {project.detail.bom.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section className="detail-section">
              <h3>成本</h3>
              <p>{project.detail.cost}</p>
            </section>
            <section className="detail-section">
              <h3>技术栈</h3>
              <div className="detail-stack">
                {project.detail.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </section>
            <section className="detail-section detail-section-wide">
              <h3>实际效果</h3>
              <p>{project.detail.result}</p>
            </section>
          </div>
        </div>
      </article>
    </div>
  );
}

function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#hero" aria-label="返回首页">
          <span className="brand-mark">LZJ</span>
          <span>
            <strong>LzjEngineer</strong>
            <small>Embedded Blog</small>
          </span>
        </a>
        <nav className="nav-links" aria-label="主导航">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="header-contact" href={`mailto:${email}`}>
          <Mail size={17} />
          Contact
        </a>
      </header>

      <main>
        <section className="hero section-screen" id="hero">
          <video
            className="hero-video"
            src={heroVideoUrl}
            poster="/images/hero-poster.svg"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div className="hero-noise" />
          <div className="hero-content wide-container">
            <p className="eyebrow">Hardware Engineer / Embedded Engineer</p>
            <TextType
              as="h1"
              className="hero-title"
              text="欢迎来到LzjEngineer的Blog！很高兴见到你!"
              typingSpeed={85}
              initialDelay={350}
              pauseDuration={2400}
              loop={false}
              showCursor
              cursorCharacter="_"
              cursorClassName="hero-title-cursor"
            />
            <p className="hero-copy">
              我专注硬件调试、嵌入式固件、传感器系统和物联网通信链路，把复杂问题拆成可以验证、可以复现、可以交付的工程结果。
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#projects">
                View Projects
                <ArrowDown size={18} />
              </a>
              <a className="ghost-button" href={`mailto:${email}`}>
                <Mail size={18} />
                {email}
              </a>
            </div>
          </div>
          <div className="hero-index wide-container" aria-label="当前工作方向">
            <span>STM32G4</span>
            <span>ESP8266</span>
            <span>Power Control</span>
            <span>Hardware Design</span>
          </div>
        </section>

        <section className="section-block" id="experience">
          <div className="wide-container experience-grid">
            <div className="profile-visual">
              <img src="/images/profile.svg" alt="硬件工程师人物视觉" />
              <div className="profile-badge">
                <span>Available for</span>
                <strong>Embedded Projects</strong>
              </div>
            </div>
            <div className="experience-copy">
              <p className="eyebrow">Profile</p>
              <h2>从硬件现象出发，写能在现场稳定运行的固件。</h2>
              <p>
                我的工作方式偏工程闭环：先确认电源、时钟、接口和信号质量，再通过日志、仪器和最小复现代码定位问题。相比只把功能跑通，我更在意异常路径、诊断能力和长期维护。
              </p>
              <div className="contact-grid" aria-label="联系方式">
                <a href={`mailto:${email}`}>
                  <Mail size={18} />
                  {email}
                </a>
                <a href="https://github.com/linzijie666" target="_blank" rel="noreferrer">
                  <Github size={18} />
                  GitHub Portfolio
                </a>
                <span>
                  <MapPin size={18} />
                  China / Remote
                </span>
              </div>
              <div className="stats-grid">
                {stats.map((stat) => (
                  <div className="stat-card" key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-block project-section" id="projects">
          <div className="wide-container">
            <div className="section-heading">
              <p className="eyebrow">Selected Work</p>
              <h2>
                <ShinyText
                  text="精选项目"
                  speed={2.4}
                  delay={0.35}
                  color="#edf3ff"
                  shineColor="#7cffc4"
                  spread={115}
                  direction="left"
                  className="projects-title-shine"
                />
              </h2>
              <p>
                这里展示真实项目的工程链路：从硬件选型、原理图、功率级与采样设计，到固件架构、控制策略、调试输出和 GitHub 源码。
              </p>
            </div>
            <div className="project-grid">
              {projects.map((project, index) => (
                <button
                  className={`project-card project-card-${index + 1}`}
                  key={project.title}
                  type="button"
                  onClick={() => setSelectedProject(project)}
                >
                  <img src={project.image} alt={`${project.title} 图片`} />
                  <div className="project-content">
                    <p>{project.type}</p>
                    <h3>{project.title}</h3>
                    <span>{project.description}</span>
                    <div className="tag-row">
                      {project.tags.map((tag) => (
                        <small key={tag}>{tag}</small>
                      ))}
                    </div>
                    <strong className="project-open">点击查看详细信息</strong>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section-block" id="capabilities">
          <div className="wide-container">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow">Capabilities</p>
                <h2>个人优势</h2>
              </div>
              <p>
                能力卡片先覆盖硬件、固件、调试、通信和可靠性这些核心方向，后续可以按你的真实经历继续收敛文案。
              </p>
            </div>
            <div className="capability-grid">
              {capabilities.map((item) => {
                const Icon = item.icon;
                return (
                  <article className="capability-card" key={item.title}>
                    <div className="icon-box">
                      <Icon size={24} />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="contact-finale section-screen" id="contact">
          <div className="wide-container finale-inner">
            <p className="eyebrow">Contact</p>
            <h2>如果你也在做硬件、固件或产品原型，我们可以聊聊。</h2>
            <p>
              欢迎通过邮箱或 GitHub 联系我。这个页面会继续补充真实项目截图、测试数据、演示视频和更完整的制作说明。
            </p>
            <div className="finale-actions">
              <a className="primary-button" href={`mailto:${email}`}>
                <Mail size={18} />
                Send Email
              </a>
              <a className="ghost-button" href="https://github.com/linzijie666" target="_blank" rel="noreferrer">
                <Github size={18} />
                GitHub
              </a>
              <a className="ghost-button" href="#hero">
                <MessageCircle size={18} />
                Back to Top
              </a>
            </div>
          </div>
        </section>
      </main>

      <a className="floating-link" href="#contact" aria-label="联系我">
        <ArrowUpRight size={20} />
      </a>

      {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  );
}

export default App;
