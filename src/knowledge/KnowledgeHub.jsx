import { useLayoutEffect, useRef, useState } from "react";
import { resetArticleScroll } from "./route.js";
import { Activity, ArrowLeftRight, ArrowUpRight, Binary, BookOpen, CircuitBoard, Clock, Crosshair, Cpu, Download, Eye, Globe, Lightbulb, Magnet, MemoryStick, Milestone, Monitor, MoveHorizontal, Network, PlugZap, Power, Radio, RadioTower, Route, ScanLine, Signal, Timer, TimerReset, ToggleLeft, Triangle, Waves, Workflow, Blend, Layers, Waypoints, Ruler, Gauge, Cable, AudioLines, Zap, BatteryCharging } from "lucide-react";
import { knowledgeChapters, legacyArticle, reviewArticles, filterReviewArticles } from "./articles.js";

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

export default function KnowledgeHub() {
  const [query, setQuery] = useState("");
  const [chapterId, setChapterId] = useState("all");
  const mainRef = useRef(null);
  const chapters = Object.values(knowledgeChapters);
  const results = filterReviewArticles(query, chapterId);
  const clearFilters = () => { setQuery(""); setChapterId("all"); };
  useLayoutEffect(() => {
    const previousTitle = document.title;
    document.title = "硬件知识库 | LzjEngineer";
    resetArticleScroll();
    mainRef.current?.focus({ preventScroll: true });
    return () => { document.title = previousTitle; };
  }, []);
  return (
    <div className="knowledge-hub"><header className="article-site-header"><a className="brand" href="#hero"><span className="brand-mark">LZJ</span><span><strong>LzjEngineer</strong><small>Knowledge Library</small></span></a><a className="article-back" href="#hero">← 返回作品集</a></header><main className="hub-main" ref={mainRef} tabIndex="-1">
      <div className="wide-container knowledge-inner">
        <header className="hub-hero"><p className="eyebrow">Knowledge Library</p><h1>硬件知识库</h1><p>从器件原理到板级设计，按章节查阅你的下一道工程问题。</p><div className="hub-stats"><span><b>{chapters.length}</b> Chapters</span><span><b>{reviewArticles.length}</b> Articles</span><span><b>{chapters.filter(c => c.downloadHref).length}</b> PDFs</span></div></header>
        <div className="hub-tools">
          <label htmlFor="knowledge-search">搜索知识库</label>
          <input id="knowledge-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索标题、摘要或章节，例如：RGMII" />
          <nav className="hub-filters" aria-label="章节筛选"><button type="button" aria-pressed={chapterId === "all"} onClick={() => setChapterId("all")}>全部</button>{chapters.map(chapter => <button type="button" key={chapter.id} aria-pressed={chapterId === chapter.id} onClick={() => setChapterId(chapter.id)}>{chapter.index} · {chapter.title}</button>)}</nav>
          <div className="hub-result-bar"><p role="status" aria-live="polite">共 {results.length} 篇复习文章</p>{(query || chapterId !== "all") && <button type="button" onClick={clearFilters}>清除筛选</button>}</div>
        </div>
        {results.length === 0 && <div className="hub-empty"><h2>没有找到相关文章</h2><p>试试其他关键词，或清除筛选后浏览全部章节。</p></div>}
        {Object.values(knowledgeChapters).map((chapter) => {
          const chapterArticles = results.filter((article) => article.chapter === chapter.id);
          if (!chapterArticles.length) return null;
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
                  const Icon = articleIcons[article.slug] ?? BookOpen;
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

              {chapter.id === "passive" && !query.trim() && (
                <a className="knowledge-legacy" href={legacyArticle.hash}>
                  <span><small>延伸阅读</small><strong>{legacyArticle.title}</strong></span>
                  <span>{legacyArticle.readingTime}<ArrowUpRight size={18} /></span>
                </a>
              )}
            </div>
          );
        })}
      </div>
    </main></div>
  );
}
