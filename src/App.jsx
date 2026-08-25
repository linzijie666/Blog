import { useEffect, useLayoutEffect, useState } from "react";
import {
  Activity,
  Award,
  ArrowDown,
  Cpu,
  ExternalLink,
  Github,
  GraduationCap,
  Mail,
  MapPin,
  MemoryStick,
  Radio,
  ShieldCheck,
  X,
  Zap
} from "lucide-react";
import TextType from "./components/TextType";
import ShinyText from "./components/ShinyText";
import KnowledgeArticle from "./knowledge/KnowledgeArticle.jsx";
import KnowledgeSection from "./knowledge/KnowledgeSection.jsx";
import ReviewArticle from "./knowledge/ReviewArticle.jsx";
import { resolveKnowledgeRoute, scrollToHomeAnchor } from "./knowledge/route.js";
import "./knowledge/knowledge.css";

const email = "850207333@qq.com";

const heroVideoUrl =
  "https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const navItems = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Knowledge", href: "#knowledge" }
];

const stats = [
  { value: "14/141", label: "通信工程专业排名" },
  { value: "92%", label: "100W Buck 降压效率" },
  { value: "12mV", label: "100W 输出纹波峰峰值" },
  { value: "3项", label: "2025 省/校级竞赛获奖" }
];

const resumeHighlights = [
  {
    label: "教育背景",
    value: "广东海洋大学 · 通信工程",
    detail: "本科在读，2023.09-至今，专业前 10%（14/141）"
  },
  {
    label: "硬件实习",
    value: "珠海全志科技 · 硬件实习生",
    detail: "2026.01-2026.05，A527/V881 平台电源与板级测试"
  }
];

const honors = [
  { date: "2025.04", title: "第十二届大唐杯信息技术通信比赛", result: "省级二等奖" },
  { date: "2025.04", title: "第十六届蓝桥杯 EDA 设计比赛", result: "省级三等奖" },
  { date: "2025.05", title: "电子设计大赛", result: "校级三等奖" }
];

const projects = [
  {
    title: "电子蝴蝶：ESP-01S 物联网呼吸灯装置",
    type: "ESP-01S / MQTT / 微信小程序",
    image: assetPath("images/projects/electronic-butterfly.jpg"),
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
    title: "100W 双向数字 DC-DC 变换器",
    type: "STM32G474 / HRTIM / 4层板 / 双环控制",
    date: "2025.10 - 2025.12",
    image: assetPath("images/projects/dc-dc-100w/efficiency.jpg"),
    description:
      "以 STM32G474 为主控完成 4 层板双向 Buck-Boost 变换器，从功率架构、驱动保护、四通道采样到双环控制独立完成全流程调试。",
    tags: ["STM32G474", "40V 输入", "5A 输出", "92% Buck", "12mV 纹波"],
    github: "https://github.com/linzijie666/4-queue.git",
    metrics: [
      { value: "40V", label: "输入规格" },
      { value: "5A", label: "最大输出" },
      { value: "92%", label: "Buck 降压效率" },
      { value: "84.7%", label: "Boost 升压效率" },
      { value: "12mV", label: "纹波峰峰值" }
    ],
    gallery: [
      {
        src: assetPath("images/projects/dc-dc-100w/board.jpg"),
        label: "实物板",
        alt: "100W 双向 DC-DC 变换器实物板"
      },
      {
        src: assetPath("images/projects/dc-dc-100w/efficiency.jpg"),
        label: "带载效率测试",
        alt: "100W 双向 DC-DC 变换器带载效率测试"
      },
      {
        src: assetPath("images/projects/dc-dc-100w/ringing.jpg"),
        label: "振铃问题定位",
        alt: "示波器显示的功率级振铃波形"
      },
      {
        src: assetPath("images/projects/dc-dc-100w/driver-waveform.jpg"),
        label: "驱动板波形",
        alt: "半桥驱动板互补 PWM 波形"
      },
      {
        src: assetPath("images/projects/dc-dc-100w/sampling-schematic.jpg"),
        label: "采样电路",
        alt: "四通道电压电流采样原理图"
      },
      {
        src: assetPath("images/projects/dc-dc-100w/pcb.jpg"),
        label: "主控 PCB",
        alt: "STM32G474 主控 PCB 布局"
      }
    ],
    detail: {
      software:
        "基于 STM32G474RET6 的高分辨率定时器输出 200kHz 互补对称 PWM，结合 STM32CubeMX/C 开发流程构建电压电流双环控制，并在调试阶段围绕采样、死区和保护策略迭代参数。",
      hardware:
        "采用 4 层板和 Buck/Boost 半桥功率架构，基于 40V 输入规格选用 60V、Rds(on)=1.8mΩ 的 CSD18540 MOS 管；使用 NSI6602 完成 12V 半桥驱动，设置 100ns 硬件死区，并通过栅极电阻与快恢复二极管抑制振铃和尖峰。",
      bom: [
        "STM32G474RET6 主控与 4 层 PCB",
        "CSD18540 60V 低导通电阻 MOS 管",
        "NSI6602 12V 半桥驱动芯片",
        "RS8559XQ 运算放大器与四通道电压/电流采样",
        "LL4148 快恢复二极管与 10Ω 栅极电阻",
        "Buck/Boost 半桥功率电路与输入输出滤波"
      ],
      cost: "个人项目，围绕 100W 级双向变换器完成器件选型、4 层板设计、焊接调试与性能验证。",
      stack: [
        "C",
        "STM32CubeMX",
        "STM32G474",
        "HRTIM 200kHz",
        "4层 PCB",
        "NSI6602",
        "双环控制"
      ],
      result:
        "在 40V 输入、20V 额定输出条件下，实测最大输出电流 5A。带载测试中 Buck 降压效率约 92%，Boost 升压效率 84.7%，输出纹波峰峰值 12mV；电压调整率 0.8%，负载调整率 0.5%。"
    }
  },
  {
    title: "小智 AI 设计工程",
    type: "OSHWHub / 小智 AI / 锂电池供电",
    image: assetPath("images/projects/xiaozhi-ai.jpg"),
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
    title: "原理图与 PCB",
    description: "熟练使用 Cadence、Altium Designer、立创 EDA，独立完成原理图和 2-4 层板 PCB 设计。"
  },
  {
    icon: MemoryStick,
    title: "电源拓扑与选型",
    description: "熟悉 Buck、Boost、Buck-Boost、全桥等拓扑，能完成 MCU 外围、电容、电阻、电感和 MOS 管选型。"
  },
  {
    icon: Activity,
    title: "板级调试与测量",
    description: "熟练使用示波器、逻辑分析仪、信号发生器、可调电源、电子负载和万用表完成验证。"
  },
  {
    icon: Radio,
    title: "STM32 / C / C++",
    description: "基于 STM32CubeMX 和 STM32 平台进行 C/C++ 开发，覆盖定时器、ADC、采样控制和外设联调。"
  },
  {
    icon: ShieldCheck,
    title: "接口与通信",
    description: "熟悉 SPI、I2C、UART、USB 等接口及通信协议硬件设计，能结合波形与时序定位问题。"
  },
  {
    icon: Zap,
    title: "可靠性与测试",
    description: "参与纹波、噪声、上电时序、过冲、HTOL、冷热冲击和高低温循环等板级测试与报告整理。"
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

  const sourceUrl = project.source;
  const sourceLabel = project.sourceLabel ?? "Source Link";

  return (
    <div className="detail-overlay" role="dialog" aria-modal="true" aria-labelledby="project-detail-title">
      <button className="detail-backdrop" type="button" aria-label="关闭项目详情" onClick={onClose} />
      <article className="detail-panel">
        <div className="detail-body">
          <div className="detail-topline">
            <div>
              <p className="eyebrow">{project.type}</p>
              {project.date && <span className="detail-date">{project.date}</span>}
            </div>
            <button className="detail-close" type="button" aria-label="关闭项目详情" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <h2 id="project-detail-title">{project.title}</h2>
          <p className="detail-summary">{project.description}</p>

          <div className="detail-action-row">
            {project.github && (
              <a className="primary-button" href={project.github} target="_blank" rel="noreferrer">
                <Github size={18} />
                GitHub
              </a>
            )}
            {sourceUrl && (
              <a className="ghost-button" href={sourceUrl} target="_blank" rel="noreferrer">
                <ExternalLink size={18} />
                {sourceLabel}
              </a>
            )}
          </div>

          {project.metrics && (
            <div className="project-metrics" aria-label="关键测试结果">
              {project.metrics.map((metric) => (
                <div className="project-metric" key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          )}

          {project.gallery && (
            <section className="project-gallery" aria-labelledby="project-gallery-title">
              <div className="project-gallery-heading">
                <div>
                  <h3 id="project-gallery-title">工程证据</h3>
                  <p>从实物、效率测试到波形和原理图，展示可以复核的调试过程。</p>
                </div>
                <span>{project.gallery.length} 张图</span>
              </div>
              <div className="project-gallery-grid">
                {project.gallery.map((image) => (
                  <figure className="project-gallery-item" key={image.src}>
                    <img src={image.src} alt={image.alt} loading="lazy" />
                    <figcaption>{image.label}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

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
  const [heroVideoEnabled, setHeroVideoEnabled] = useState(false);
  const [locationHash, setLocationHash] = useState(() => window.location.hash);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(min-width: 769px) and (prefers-reduced-motion: no-preference)"
    );
    const updateVideoAvailability = () => setHeroVideoEnabled(mediaQuery.matches);

    updateVideoAvailability();
    mediaQuery.addEventListener?.("change", updateVideoAvailability);

    return () => mediaQuery.removeEventListener?.("change", updateVideoAvailability);
  }, []);

  useEffect(() => {
    const updateHash = () => setLocationHash(window.location.hash);

    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  useLayoutEffect(() => {
    scrollToHomeAnchor(locationHash);
  }, [locationHash]);

  const knowledgeRoute = resolveKnowledgeRoute(locationHash);
  if (knowledgeRoute === "capacitor-inductor") {
    return <KnowledgeArticle email={email} />;
  }
  if (knowledgeRoute) {
    return <ReviewArticle slug={knowledgeRoute} email={email} />;
  }

  return (
    <div
      className="site-shell"
      style={{ "--hero-poster-image": `url("${assetPath("images/hero-poster.svg")}")` }}
    >
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
          {heroVideoEnabled && (
            <video
              className="hero-video"
              src={heroVideoUrl}
              poster={assetPath("images/hero-poster.svg")}
              preload="metadata"
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          )}
          <div className="hero-noise" />
          <div className="hero-content wide-container">
            <p className="eyebrow">Hardware Engineer Candidate / Embedded Systems</p>
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
              通信工程本科生，专注电源硬件、板级调试和 STM32 嵌入式开发；从器件选型、PCB 设计到测试验证，关注每一个可以测量的工程结果。
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
            <span>A527 Platform</span>
            <span>STM32G474</span>
            <span>Power Electronics</span>
            <span>Board Test</span>
          </div>
        </section>

        <section className="section-block" id="experience">
          <div className="wide-container experience-grid">
            <div className="profile-visual">
              <img src={assetPath("images/profile.svg")} alt="硬件工程师人物视觉" />
              <div className="profile-badge">
                <span>Available for</span>
                <strong>Embedded Projects</strong>
              </div>
            </div>
            <div className="experience-copy">
              <p className="eyebrow">Profile</p>
              <h2>把电源、信号与固件串成可验证的硬件系统。</h2>
              <p>
                我正在积累从原理图、功率器件与电源树，到板级调试、信号测试和嵌入式控制的完整经验。最近在全志科技参与 A527 平台 IC 封装验证评估板卡与 MR123/V881 芯片测试，完成多轨供电设计、纹波与时序验证，并参与可靠性测试。
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
              <div className="resume-highlights" aria-label="简历重点经历">
                {resumeHighlights.map((item) => (
                  <article className="resume-highlight" key={item.label}>
                    <p>{item.label}</p>
                    <h3>{item.value}</h3>
                    <span>{item.detail}</span>
                  </article>
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
                    {project.date && <small className="project-date">{project.date}</small>}
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
                这些能力来自课程、竞赛、个人项目和硬件实习的交叉验证，重点覆盖电源设计、PCB 实现、仪器测量与板级可靠性测试。
              </p>
            </div>
            <div className="capability-grid">
              {capabilities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article
                    className={`capability-card ${
                      index === 1
                        ? "capability-card-primary"
                        : `capability-card-supporting capability-card-supporting-${index}`
                    }`}
                    key={item.title}
                  >
                    <div className="icon-box">
                      <Icon size={24} />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                );
              })}
            </div>
            <div className="honors-block">
              <div className="honors-heading">
                <div>
                  <p className="eyebrow">Competitions & Awards</p>
                  <h3>用可测量的结果说明硬件能力。</h3>
                </div>
                <Award size={28} />
              </div>
              <div className="honor-grid">
                {honors.map((honor) => (
                  <article className="honor-card" key={honor.title}>
                    <div className="honor-icon">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <span>{honor.date}</span>
                      <h4>{honor.title}</h4>
                      <strong>{honor.result}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <KnowledgeSection />
      </main>

      <a className="floating-link" href={`mailto:${email}`} aria-label="发送邮件联系我">
        <Mail size={20} />
      </a>

      {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  );
}

export default App;
