export interface PhotoItem {
  id: string;
  src: string;
  kind:
    | "official_portrait"
    | "official_talk_thumbnail"
    | "official_avatar_illustration"
    | "official_banner"
    | "public_moment_not_portrait";
  gallerySection: "portrait" | "avatar" | "moment";
  displayBadge: string;
  aiGenerated: boolean;
  captionZh: string;
  sourcePage: string;
  sourceLabel: string;
  aspectClass: string;
}

export interface SourcedQuote {
  id: string;
  text: string;
  attributionZh: string;
  sourceUrl: string;
}

export interface TalkItem {
  id: string;
  title: string;
  event: string;
  date: string;
  youtubeId: string;
  videoYoutube: string;
  officialTalkPage: string;
  announcementPost: string;
  earlierAnnouncement: string;
  thumbnail: string;
  studyTopicTag: string;
  checkinEligible: boolean;
  highlightsZh: string[];
  sourcedQuotes: SourcedQuote[];
}

export interface HistoricalTalkNote {
  id: string;
  summary: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  date: string;
  url: string;
  needExactPermalink?: boolean;
  platform: "X article" | "no.lol";
  studyTopicTag: string;
  checkinEligible: boolean;
  shortGuideZh: string;
  sourcedQuote: SourcedQuote;
}

export interface CheerPreset {
  id: string;
  tag: string;
  text: string;
  xShareText: string;
}

export interface ApprovedCheerSample {
  id: string;
  nickname: string;
  tag: string;
  content: string;
  date: string;
}

export const SITE_INFO = {
  name: "potetofans",
  taglineZh: "为土豆女神打 Call 的非官方粉丝应援站",
  unofficial: true,
  unofficialBadgeZh: "非官方粉丝应援站",
  unofficialBadgeEn: "Unofficial Fan Site",
  repo: "https://github.com/KinGao294/potetofans",
  repoIssues: "https://github.com/KinGao294/potetofans/issues",
  domainStatus: "potetofans.com 等尚未购买，当前为本地预览版",
} as const;

export const PERSON_INFO = {
  xUsername: "poteto",
  xUrl: "https://x.com/poteto",
  xDisplayName: "lauren",
  communityNicknameZh: "土豆女神",
  officialBlogName: "Lauren Tan",
  officialBlog: "https://www.no.lol/",
  officialSpeaking: "https://www.no.lol/speaking/",
  speakerdeck: "https://speakerdeck.com/poteto",
  currentXBio:
    "grok @bot at @SpaceXSI. react compiler core team, prev cursor, meta, netflix",
  currentXBioAsOf: "2026-11-19",
  xAffiliationBadge: "SpaceX Super Intelligence",
  xCreatedAt: "2014-09-26",
  verifiedNote: "X 公开账号（非私密账号）",
  officialTalkCredit: "Lauren Tan, SpaceXSI",
  historicalNoteZh:
    "注：no.lol 首页简介中仍保留早期文案（如 Facebook / Netflix 职务描述），本站将其视为历史文案而非现职；现职简介仅以 2026-11-19 公开 X 主页 Bio 为准。",
} as const;

export const PHOTOS: PhotoItem[] = [
  {
    id: "nolol-speaking",
    src: "/images/nolol-profile.webp",
    kind: "official_portrait",
    gallerySection: "portrait",
    displayBadge: "公开照片",
    aiGenerated: false,
    captionZh: "公开演讲现场照",
    sourcePage: "https://www.no.lol/",
    sourceLabel: "官方博客 no.lol 头像/简介照片",
    aspectClass: "aspect-square",
  },
  {
    id: "talk-thumb-aie-2026",
    src: "/images/talk-aie-2026-thumb.jpg",
    kind: "official_talk_thumbnail",
    gallerySection: "portrait",
    displayBadge: "公开演讲封面",
    aiGenerated: false,
    captionZh: "AI Engineer CODE 2026 演讲封面（Review Proof, Not Code）",
    sourcePage: "https://www.youtube.com/watch?v=O_zcc6Xl12g",
    sourceLabel: "官方 YouTube 视频封面",
    aspectClass: "aspect-video",
  },
  {
    id: "x-avatar",
    src: "/images/x-avatar-400.jpg",
    kind: "official_avatar_illustration",
    gallerySection: "avatar",
    displayBadge: "官方头像（插画，非实拍）",
    aiGenerated: false,
    captionZh: "X 官方头像（插画，非实拍）",
    sourcePage: "https://x.com/poteto",
    sourceLabel: "X 公开头像",
    aspectClass: "aspect-square",
  },
  {
    id: "x-banner-cat",
    src: "/images/x-banner-1500.jpg",
    kind: "official_banner",
    gallerySection: "moment",
    displayBadge: "公开动态，非人像",
    aiGenerated: false,
    captionZh: "X 主页背景图（门铃猫，非人像）",
    sourcePage: "https://x.com/poteto",
    sourceLabel: "X 公开主页横幅",
    aspectClass: "aspect-[3/1]",
  },
  {
    id: "x-cybercab-0",
    src: "/images/x-2123090924406505846-0.jpg",
    kind: "public_moment_not_portrait",
    gallerySection: "moment",
    displayBadge: "公开动态，非人像",
    aiGenerated: false,
    captionZh: "她公开分享的 Cybercab 乘坐照片（车，不是人像）",
    sourcePage: "https://x.com/poteto/status/2123090924406505846",
    sourceLabel: "X 公开帖 2026-11-18：my first cybercab ride! so cool",
    aspectClass: "aspect-[3/4]",
  },
  {
    id: "x-cybercab-1",
    src: "/images/x-2123090924406505846-1.jpg",
    kind: "public_moment_not_portrait",
    gallerySection: "moment",
    displayBadge: "公开动态，非人像",
    aiGenerated: false,
    captionZh: "她公开分享的 Cybercab 乘坐照片（车，不是人像）",
    sourcePage: "https://x.com/poteto/status/2123090924406505846",
    sourceLabel: "X 公开帖 2026-11-18",
    aspectClass: "aspect-[4/3]",
  },
  {
    id: "x-crocs-aie",
    src: "/images/x-2120576177169637429-0.jpg",
    kind: "public_moment_not_portrait",
    gallerySection: "moment",
    displayBadge: "公开动态，非人像",
    aiGenerated: false,
    captionZh: "AIE 演讲当天她公开分享的 Crocs 照片（鞋子特写，不是人像）",
    sourcePage: "https://x.com/poteto/status/2120576177169637429",
    sourceLabel: "X 公开帖 2026-11-11",
    aspectClass: "aspect-[9/16]",
  },
];

export const TALKS: TalkItem[] = [
  {
    id: "aie-code-2026",
    title: "All Code Is Slop (Except Mine)",
    event: "AI Engineer CODE 2026",
    date: "2026-11-11",
    youtubeId: "O_zcc6Xl12g",
    videoYoutube: "https://www.youtube.com/watch?v=O_zcc6Xl12g",
    officialTalkPage: "https://ai.engineer/code/2026/talks/lauren-tan",
    announcementPost: "https://x.com/poteto/status/2121673563489140863",
    earlierAnnouncement: "https://x.com/poteto/status/2119841446308221152",
    thumbnail: "/images/talk-aie-2026-thumb.jpg",
    studyTopicTag: "AI 工程与高吞吐 PR 质量",
    checkinEligible: true,
    highlightsZh: [
      "官方演讲页与 YouTube 标题署名为 Lauren Tan, SpaceXSI。",
      "她在预告帖中自述：这次会讲 grok @bot 团队如何在不牺牲质量的前提下，上个月 ship 了 11,000 个 PR。",
      "封面标题为 Review Proof, Not Code。",
    ],
    sourcedQuotes: [
      {
        id: "q-review-proof",
        text: "Review Proof, Not Code",
        attributionZh: "AI Engineer CODE 2026 官方演讲封面标题",
        sourceUrl: "https://www.youtube.com/watch?v=O_zcc6Xl12g",
      },
      {
        id: "q-11000-prs",
        text: "how the grok @bot team shipped 11,000 PRs last month without compromising on code quality",
        attributionZh: "@poteto 公开演讲预告帖（2026-11-09）",
        sourceUrl: "https://x.com/poteto/status/2119841446308221152",
      },
      {
        id: "q-all-code-slop",
        text: "All Code Is Slop (Except Mine)",
        attributionZh: "AI Engineer CODE 2026 官方演讲标题",
        sourceUrl: "https://ai.engineer/code/2026/talks/lauren-tan",
      },
    ],
  },
];

export const HISTORICAL_TALKS = {
  sourceSpeakingUrl: "https://www.no.lol/speaking/",
  sourceSpeakerdeckUrl: "https://speakerdeck.com/poteto",
  noteZh:
    "以下历史演讲记录整理自她的官方 Speaking 页面与 Speaker Deck。一期不伪造或猜测未核实视频嵌入，如需查看幻灯片或历史议程，请直接前往官方链接。",
  items: [
    {
      id: "hist-jsla-2020",
      summary: "js.la Meetup — Just Use Any: js.la Edition (2020-01-30, Los Angeles)",
    },
    {
      id: "hist-tsconf-2019",
      summary:
        "TSConf — Just Use Any: How to Win Colleagues & Influence Your Boss (2019-10-11, Seattle)",
    },
    {
      id: "hist-types-2018",
      summary:
        "dotJS / Reactathon / React Rally — Learning to Love Type Systems (2018)",
    },
    {
      id: "hist-more",
      summary:
        "EmberConf, ElixirConf, Code Europe 等更多场次见官方 speaking 页面与 Speaker Deck",
    },
  ] as HistoricalTalkNote[],
};

export const ARTICLES: ArticleItem[] = [
  {
    id: "automate-anything-grok-bot",
    title: "Automate Anything with Grok Bot",
    date: "2026-11-18",
    url: "https://x.com/poteto/status/2123159537016533493",
    platform: "X article",
    studyTopicTag: "自动化工作流",
    checkinEligible: true,
    shortGuideZh:
      "这篇发布于 2026 年 11 月 18 日的 X 长文围绕「用 Grok Bot 自动化各种事情」展开，结合她在 SpaceXSI 从事 grok @bot 相关工作的公开实践视角。本站仅作短导读，不转载正文，建议点击「阅读原文」前往她的 X 原帖完整阅读，读完后回来完成文章打卡。",
    sourcedQuote: {
      id: "aq-grok-bot",
      text: "Automate Anything with Grok Bot",
      attributionZh: "原文标题 · X article (2026-11-18)",
      sourceUrl: "https://x.com/poteto/status/2123159537016533493",
    },
  },
  {
    id: "this-time-is-different",
    title: "This Time Is Different",
    date: "2020-05-12",
    url: "https://www.no.lol/",
    needExactPermalink: true,
    platform: "no.lol",
    studyTopicTag: "工程随笔",
    checkinEligible: true,
    shortGuideZh:
      "收录自她的个人博客 no.lol（发布日期 2020-05-12），原标题为《This Time Is Different》。本站仅做阅读索引与短导读，不搬运正文也不杜撰内容细节。因该篇精确单页链接待社区补全，目前先导向 no.lol 博客主页供你查找阅读，读完原文后即可返回完成打卡。",
    sourcedQuote: {
      id: "aq-this-time",
      text: "This Time Is Different",
      attributionZh: "原文标题 · no.lol (2020-05-12)",
      sourceUrl: "https://www.no.lol/",
    },
  },
  {
    id: "does-it-spark-joy",
    title: "Does It Spark Joy?",
    date: "2020-02-17",
    url: "https://www.no.lol/2020-01-17-does-it-spark-joy/",
    platform: "no.lol",
    studyTopicTag: "职业路径选择",
    checkinEligible: true,
    shortGuideZh:
      "发布于个人博客 no.lol 的一篇职业选择记录。在这篇文章中，她写下了自己离开 Netflix 工程管理岗位、重新回到软件工程师身份的决定与思考。如果你也在技术路线与管理岗位之间权衡，非常推荐点击「阅读原文」前往 no.lol 直接读她本人的真实文字，读完后回来点亮文章打卡。",
    sourcedQuote: {
      id: "aq-spark-joy",
      text: "Does It Spark Joy?",
      attributionZh: "原文标题 · no.lol (2020-02-17)",
      sourceUrl: "https://www.no.lol/2020-01-17-does-it-spark-joy/",
    },
  },
  {
    id: "type-narrowing",
    title: "Type Narrowing in TypeScript",
    date: "2019-12-28",
    url: "https://www.no.lol/2019-12-27-type-narrowing/",
    platform: "no.lol",
    studyTopicTag: "TypeScript 类型系统",
    checkinEligible: true,
    shortGuideZh:
      "发布于个人博客 no.lol 的 TypeScript 技术主题文章，聚焦「Type Narrowing（类型收窄）」这一日常写类型安全代码时的核心概念。与其看二手搬运，不如直接点击「阅读原文」前往她的官方博客阅读完整示例与说明；支持原创作者流量，读完后欢迎回来完成文章打卡。",
    sourcedQuote: {
      id: "aq-type-narrowing",
      text: "Type Narrowing in TypeScript",
      attributionZh: "原文标题 · no.lol (2019-12-28)",
      sourceUrl: "https://www.no.lol/2019-12-27-type-narrowing/",
    },
  },
  {
    id: "engineering-interviews",
    title: "#2 Maximizing Success in Engineering Interviews",
    date: "2019-03-25",
    url: "https://www.no.lol/2019-03-25-maximizing-success-in-engineering-interviews/",
    platform: "no.lol",
    studyTopicTag: "工程面试",
    checkinEligible: true,
    shortGuideZh:
      "这是她在个人博客 no.lol 发布的工程职业系列文章第 2 篇，主题围绕「在工程面试中最大化成功机会」。本站严格遵守只做导读不转载全文的原则，推荐准备技术面试或关注工程成长的朋友直接点击「阅读原文」前往 no.lol 原页阅读完整建议，读完后返回本站完成学习打卡。",
    sourcedQuote: {
      id: "aq-interviews",
      text: "#2 Maximizing Success in Engineering Interviews",
      attributionZh: "原文标题 · no.lol (2019-03-25)",
      sourceUrl:
        "https://www.no.lol/2019-03-25-maximizing-success-in-engineering-interviews/",
    },
  },
  {
    id: "tech-lead",
    title: "#1 Should I Become a Tech Lead?",
    date: "2019-03-09",
    url: "https://www.no.lol/2019-03-09-should-i-become-a-tech-lead/",
    platform: "no.lol",
    studyTopicTag: "工程领导力",
    checkinEligible: true,
    shortGuideZh:
      "她在个人博客 no.lol 发布的工程职业系列第 1 篇，直面许多工程师都会遇到的经典问题：「我应该成为 Tech Lead 吗？」。本站不截流、不复述正文，请点击「阅读原文」前往她的官方博客完整阅读她的原话与视角，读完后可回到本页记录你的文章打卡进度。",
    sourcedQuote: {
      id: "aq-tech-lead",
      text: "#1 Should I Become a Tech Lead?",
      attributionZh: "原文标题 · no.lol (2019-03-09)",
      sourceUrl: "https://www.no.lol/2019-03-09-should-i-become-a-tech-lead/",
    },
  },
  {
    id: "engineers-guide-to-communication",
    title: "An Engineer’s Guide to Communication",
    date: "2018-02-26",
    url: "https://www.no.lol/",
    needExactPermalink: true,
    platform: "no.lol",
    studyTopicTag: "工程沟通",
    checkinEligible: true,
    shortGuideZh:
      "收录自个人博客 no.lol（2018-02-26），主题为「写给工程师的沟通指南」。沟通能力往往决定了技术方案能否落地与团队协作效率。当前该篇精确单页链接尚待核对补全，点击「阅读原文」将先前往 no.lol 博客主页查找阅读，阅读原文后欢迎回来点亮这篇的文章打卡。",
    sourcedQuote: {
      id: "aq-comm",
      text: "An Engineer’s Guide to Communication",
      attributionZh: "原文标题 · no.lol (2018-02-26)",
      sourceUrl: "https://www.no.lol/",
    },
  },
];

export const CHALLENGE_INFO = {
  nameZh: "挑战区 · 每月 2,000 PR 非官方粉丝挑战",
  monthlyGoal: 2000,
  framingZh:
    "这是粉丝发起的非官方挑战，不是 @poteto 本人或 SpaceXSI / Grok Bot 的官方活动，也不是她本人下达的官方 KPI。灵感来自她在 AI Engineer CODE 2026 公开演讲《All Code Is Slop (Except Mine)》及预告帖中提到的高质量、高吞吐出 PR 文化（grok @bot 团队上个月在不牺牲代码质量的前提下 ship 了 11,000 个 PR）。站点把月度自挑战目标设为 2,000 个 PR，邀请同好一起把灵感变成真实的公开代码贡献。",
  localNoticeZh:
    "本进度仅代表你在当前浏览器本地记录的公开 GitHub PR 链接数，不是官方统计，也不等同于 @poteto 或她所在团队的产出。",
  talkUrl: "https://www.youtube.com/watch?v=O_zcc6Xl12g",
  talkPageUrl: "https://ai.engineer/code/2026/talks/lauren-tan",
  announcementPostUrl: "https://x.com/poteto/status/2119841446308221152",
  suggestedRepoUrl: "https://github.com/KinGao294/potetofans",
} as const;

export const CHEER_PRESETS: CheerPreset[] = [
  {
    id: "preset-stage",
    tag: "日常打 Call",
    text: "为土豆女神 @poteto 打 Call！舞台上光芒四射，代码里硬核克制，永远会被认真做工程的人打动。",
    xShareText:
      "为土豆女神 @poteto 打 Call！舞台与工程感拉满（via 非官方粉丝站 potetofans）",
  },
  {
    id: "preset-talk",
    tag: "演讲共鸣",
    text: "刚重温了 @poteto 的《All Code Is Slop (Except Mine)》——Review Proof, Not Code，看完只想立刻去把测试和验证体系补强！",
    xShareText:
      "刚看完 @poteto 在 AI Engineer CODE 2026 的演讲《All Code Is Slop (Except Mine)》，Review Proof, Not Code 太受启发！",
  },
  {
    id: "preset-challenge",
    tag: "PR 挑战打卡",
    text: "受土豆女神 @poteto 演讲启发，加入非官方每月 2000 PR 粉丝挑战！不水代码、坚持验证，从今天提交下一个公开 PR 开始。",
    xShareText:
      "受 @poteto 演讲启发加入非官方粉丝 2000 PR 挑战！高质量出 PR，慢慢累积进度（Unofficial Fan Challenge）",
  },
  {
    id: "preset-study",
    tag: "读文收获",
    text: "在 potetofans 跟着学习清单把 @poteto 的公开演讲和 no.lol 原文一篇篇读完打卡，好内容真的值得常看常新。",
    xShareText:
      "正在跟着非官方粉丝站 potetofans 的学习清单读 @poteto 的公开演讲与博客原文，继续打卡精进！",
  },
  {
    id: "preset-ts",
    tag: "读文收获",
    text: "从 TypeScript 到 React Compiler 再到 AI 工程工作流，每一次看 @poteto 的公开分享都能学到扎实的一线工程视角。",
    xShareText:
      "从 TypeScript 到 AI 工程实践，持续关注 @poteto 的公开演讲与文章分享！",
  },
  {
    id: "preset-joy",
    tag: "日常打 Call",
    text: "Does It Spark Joy? 愿土豆女神 @poteto 继续做出让自己心动、也让社区惊艳的作品，粉丝永远在台下鼓掌！",
    xShareText:
      "Does It Spark Joy? 为 @poteto 打 Call，期待更多精彩演讲与分享！",
  },
];

export const APPROVED_CHEER_SAMPLES: ApprovedCheerSample[] = [
  {
    id: "sample-1",
    nickname: "建站志愿小土豆",
    tag: "日常打 Call",
    content:
      "欢迎来到 potetofans 非官方应援站！这里保留克制与真诚，把每一份喜欢都转化成去听演讲、读原文、写高质量 PR 的行动力。",
    date: "2026-11-19",
  },
  {
    id: "sample-2",
    nickname: "TypeScript 爱好者",
    tag: "演讲共鸣",
    content:
      "Review Proof, Not Code 这句话后劲太大了。看完 AIE 2026 演讲第一时间把视频打卡点亮，也把官方演讲页收藏反复回看。",
    date: "2026-11-19",
  },
  {
    id: "sample-3",
    nickname: "开源 PR 挑战者",
    tag: "PR 挑战打卡",
    content:
      "2000 个 PR 虽然听起来像宇宙级目标，但每次记录下自己的真实公开 PR 都很有成就感，不求刷量、只求质量过关！",
    date: "2026-11-19",
  },
];

export const NAV_LINKS = [
  { href: "/", label: "首页" },
  { href: "/gallery", label: "美照馆" },
  { href: "/talks", label: "演讲" },
  { href: "/articles", label: "文章" },
  { href: "/checkin", label: "学习打卡" },
  { href: "/challenge", label: "挑战区" },
  { href: "/cheer", label: "应援墙" },
  { href: "/about", label: "关于" },
] as const;
