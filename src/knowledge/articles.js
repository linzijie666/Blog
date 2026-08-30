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

export function getArticleBySlug(slug) {
  return articleRegistry.find((article) => article.slug === slug) ?? null;
}
