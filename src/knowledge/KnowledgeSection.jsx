import { Activity, ArrowLeftRight, ArrowUpRight, Binary, BookOpen, CircuitBoard, Clock, Crosshair, Cpu, Download, Eye, Globe, Lightbulb, Magnet, MemoryStick, Milestone, Monitor, MoveHorizontal, Network, PlugZap, Power, Radio, RadioTower, Route, ScanLine, Signal, Timer, TimerReset, ToggleLeft, Triangle, Waves, Workflow, Blend, Layers, Waypoints, Ruler, Gauge, Cable, AudioLines, Zap, BatteryCharging } from "lucide-react";
import { knowledgeChapters, legacyArticle, reviewArticles } from "./articles.js";

const articleIcons = {
  resistor: CircuitBoard,
  capacitor: Waves,
  inductor: Radio,
  "ferrite-bead": Magnet,
  diode: Zap,
  triode: Activity,
  optocoupler: Lightbulb,
  mosfet: ToggleLeft,
  "switching-regulator": PlugZap,
  "linear-regulator": BatteryCharging,
  mcu: Cpu,
  fpga: Binary,
  ddr: MemoryStick,
  "reset-watchdog": TimerReset,
  "pcb-routing": Route,
  "pcb-decoupling": Clock,
  "pcb-copper-pour": Blend,
  "pcb-ground-design": Layers,
  "pcb-high-speed": Waypoints,
  "pcb-fab-hdi": Ruler,
  "pcb-power-layout": Gauge,
  "opamp-basics": Triangle,
  "opamp-circuits": Workflow,
  "opamp-apps": Cable,
  "adc-primer": AudioLines,
  "vref-precision": Crosshair,
  "iic-spi": Network,
  "setup-hold-time": Timer,
  "rs232-rs485": RadioTower,
  lvds: ArrowLeftRight,
  "gigabit-ethernet": Globe,
  "hdmi-pcie-usb": Monitor,
  "pi-pdn": Power,
  "transmission-line-termination": Signal,
  "si-measurement": ScanLine,
  "length-matching": MoveHorizontal,
  "si-routing": Milestone,
  "eye-diagram-jitter": Eye
};

export default function KnowledgeSection() {
  return (
    <section className="knowledge-finale section-screen" id="knowledge" tabIndex="-1">
      <div className="wide-container knowledge-inner">
        <div className="knowledge-heading">
          <div>
            <p className="eyebrow">Knowledge Column</p>
            <h2>把器件的参数表，变成可回答的工程问题。</h2>
          </div>
          <div className="knowledge-heading-copy">
            <p>面向硬件面试复习，分八章整理无源器件、基础半导体器件、电源类、主控芯片、PCB Layout、模拟器件、高速接口与 SI/PI 的原理、参数、设计规则、典型电路与易错点。</p>
          </div>
        </div>

        {Object.values(knowledgeChapters).map((chapter) => {
          const chapterArticles = reviewArticles.filter((article) => article.chapter === chapter.id);
          const chapterDownload = `${import.meta.env.BASE_URL}${chapter.downloadHref}`;
          return (
            <div className="knowledge-chapter" key={chapter.id}>
              <header className="knowledge-chapter-heading">
                <div>
                  <p className="eyebrow">{chapter.index}</p>
                  <h3>{chapter.title}</h3>
                </div>
                <div className="knowledge-chapter-copy">
                  <p>{chapter.description}</p>
                  <a className="knowledge-download" href={chapterDownload} download>
                    <Download size={18} />下载{chapter.index}完整课件
                  </a>
                </div>
              </header>

              <div className="knowledge-grid">
                {chapterArticles.map((article, index) => {
                  const Icon = articleIcons[article.slug];
                  return (
                    <a className="knowledge-card" href={article.hash} key={article.slug}>
                      <div className="knowledge-card-copy">
                        <span className="knowledge-index">0{index + 1}</span>
                        <span className="knowledge-meta"><BookOpen size={16} />{article.readingTime}</span>
                        <Icon className="knowledge-card-icon" size={32} aria-hidden="true" />
                        <h4>{article.title}</h4>
                        <p>{article.summary}</p>
                        <strong>开始复习 <ArrowUpRight size={18} /></strong>
                      </div>
                    </a>
                  );
                })}
              </div>

              {chapter.id === "passive" && (
                <a className="knowledge-legacy" href={legacyArticle.hash}>
                  <span><small>延伸阅读</small><strong>{legacyArticle.title}</strong></span>
                  <span>{legacyArticle.readingTime}<ArrowUpRight size={18} /></span>
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
