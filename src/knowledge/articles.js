const reviewArticleDefinitions = [
  {
    slug: "resistor",
    title: "电阻：从参数选型到 0Ω 电阻的工程用法",
    summary: "系统复习电阻的精度、耐压、功率与降额，并串联分压、匹配、采样、限流和 0Ω 电阻的典型面试问题。",
    readingTime: "约 12 分钟",
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
    title: "电容：去耦、储能与高频模型复习",
    summary: "从电容的七类功能出发，掌握介质类型、MLCC 温度等级、直流偏压、ESR/ESL 与 PDN 并联设计。",
    readingTime: "约 15 分钟",
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
    title: "电感：DCR、饱和电流与功率选型",
    summary: "围绕储能机理、感值、DCR、饱和电流和温升电流，建立开关电源功率电感的完整选型流程。",
    readingTime: "约 10 分钟",
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
    title: "磁珠：高频噪声抑制与电感辨析",
    summary: "理解磁珠如何把高频噪声转化为损耗，并掌握阻抗曲线、额定电流、直流偏置和磁珠与电感的选用边界。",
    readingTime: "约 8 分钟",
    sections: [
      ["principle", "磁珠为什么能抑制高频噪声"],
      ["parameters", "阻抗曲线与额定参数"],
      ["applications", "电源与信号线应用"],
      ["comparison", "磁珠和电感的异同"],
      ["workflow", "选型流程与易错点"],
      ["interview", "面试自测"]
    ]
  }
];

export const reviewArticles = reviewArticleDefinitions.map((article, index, articles) => ({
  ...article,
  hash: `#/knowledge/${article.slug}`,
  previousSlug: articles[index - 1]?.slug ?? null,
  nextSlug: articles[index + 1]?.slug ?? null,
  category: "无源器件 / 硬件面试复习"
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
