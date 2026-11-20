import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Camera,
  CheckCircle2,
  Flame,
  Heart,
  Play,
  ShieldAlert,
} from "lucide-react";
import {
  ARTICLES,
  CHALLENGE_INFO,
  CHEER_PRESETS,
  PERSON_INFO,
  PHOTOS,
  SITE_INFO,
  TALKS,
} from "@/data/site-data";
import { HomeLiveStatus } from "@/components/HomeLiveStatus";

export default function HomePage() {
  const heroPortrait = PHOTOS.find((p) => p.id === "nolol-speaking")!;
  const heroTalkCover = PHOTOS.find((p) => p.id === "talk-thumb-aie-2026")!;
  const xAvatar = PHOTOS.find((p) => p.id === "x-avatar")!;
  const featuredTalk = TALKS[0];
  const featuredArticles = ARTICLES.slice(0, 3);

  return (
    <div>
      {/* 1. HERO — Stage Black Magazine Cover (3-Second Clarity) */}
      <section className="stage-grid-bg relative overflow-hidden border-b border-white/10 text-cream-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          {/* Editorial Issue Bar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-cream-300/80">
            <span>ISSUE NO. 01 · POTETOFANS TRIBUTE</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amberpoteto-400/50 bg-amberpoteto-500/15 px-3 py-1 font-semibold text-amberpoteto-400">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Unofficial Fan Site · 非官方粉丝应援站</span>
            </span>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            {/* Left Copy */}
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-amberpoteto-400">
                  FOR @{PERSON_INFO.xUsername} · {PERSON_INFO.officialBlogName}（
                  {PERSON_INFO.xDisplayName}）
                </p>
                <h1 className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-cream-50 sm:text-6xl">
                  为土豆女神
                  <span className="mt-1 block text-amberpoteto-400">
                    @{PERSON_INFO.xUsername} 打 Call
                  </span>
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-cream-200/85 sm:text-lg">
                  这是一个由粉丝自发建设的
                  <strong className="font-semibold text-cream-50">
                    非官方民间应援与共学站
                  </strong>
                  ：收藏公开演讲现场照与舞台瞬间，把她的演讲与博客变成可打卡学习清单，并发起每月
                  2,000 个 PR 的粉丝自挑战。
                </p>
              </div>

              {/* Verified Current X Bio Box */}
              <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 sm:p-5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-mono font-semibold uppercase tracking-wider text-amberpoteto-400">
                    公开 X 简介（核对日期 {PERSON_INFO.currentXBioAsOf}）
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-cream-200">
                    {PERSON_INFO.xAffiliationBadge}
                  </span>
                </div>
                <p className="font-mono text-sm leading-relaxed text-cream-100">
                  “{PERSON_INFO.currentXBio}”
                </p>
                <p className="mt-2 text-[11px] text-cream-300/70">
                  来源：
                  <a
                    href={PERSON_INFO.xUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-white/30 underline-offset-4 hover:text-amberpoteto-400"
                  >
                    https://x.com/poteto
                  </a>{" "}
                  · 本站不冒充官网，亦不使用已过时的旧站点职务描述。
                </p>
              </div>

              {/* Hero CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/challenge"
                  className="inline-flex items-center gap-2 rounded-full bg-amberpoteto-500 px-6 py-3 text-sm font-semibold text-stage-950 transition hover:bg-amberpoteto-400"
                >
                  <Flame className="h-4 w-4" />
                  <span>进入每月 2,000 PR 挑战区</span>
                </Link>
                <Link
                  href="/checkin"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-medium text-cream-50 transition hover:border-amberpoteto-400 hover:bg-white/15"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>开始学习打卡</span>
                </Link>
                <a
                  href={PERSON_INFO.xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-cream-200 transition hover:border-cream-100 hover:text-cream-50"
                >
                  <span>关注 @{PERSON_INFO.xUsername}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Right Visual Editorial Collage */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-stage-900 shadow-2xl">
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={heroPortrait.src}
                    alt={`${PERSON_INFO.communityNicknameZh} ${heroPortrait.captionZh}`}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-stage-950/90 px-4 py-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-amberpoteto-500/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-amberpoteto-400">
                      {heroPortrait.displayBadge}
                    </span>
                    <span className="text-cream-200">
                      {heroPortrait.captionZh}
                    </span>
                  </div>
                  <a
                    href={heroPortrait.sourcePage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 text-cream-300/80 underline-offset-4 hover:text-amberpoteto-400 hover:underline"
                  >
                    <span>no.lol</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Secondary Stage Talk Strip */}
              <Link
                href="/talks"
                className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-stage-900/90 p-3 transition hover:border-amberpoteto-400/60"
              >
                <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-xl border border-white/10">
                  <img
                    src={heroTalkCover.src}
                    alt={featuredTalk.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                    <Play className="h-5 w-5 fill-cream-50 text-cream-50" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-amberpoteto-400">
                    FEATURED TALK · {featuredTalk.event}
                  </p>
                  <p className="truncate font-serif text-sm font-bold text-cream-50">
                    {featuredTalk.title}
                  </p>
                  <p className="truncate text-xs text-cream-300/80">
                    点击前往观看官方嵌入视频并完成视频打卡 →
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE LOCAL STATUS STRIP */}
      <HomeLiveStatus />

      {/* 3. EDITORIAL DIRECTORY — 5 SECTIONS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-ink-900/15 pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-amberpoteto-600">
              CONTENTS · 第一期全模块导览
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-ink-900 sm:text-4xl">
              看舞台、学文章、挑战 2,000 PR
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink-500">
            不做伪百科，不搬运全文，不虚构人像。每一处浏览都能导向官方原链，或沉淀为你本机的打卡与挑战纪念卡。
          </p>
        </div>

        {/* 01 Gallery + 02 Talk Preview */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Gallery Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-ink-900/10 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amberpoteto-600">
                  01 · GALLERY
                </span>
                <Camera className="h-4 w-4 text-ink-400" />
              </div>
              <h3 className="mt-3 font-serif text-2xl font-bold text-ink-900">
                美照馆：克制且诚实的公开视觉归档
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                每张图片严格标注来源页面与类型标签——区分「公开照片」「官方头像（插画，非实拍）」与「公开动态，非人像」，绝不用
                AI 捏造她的仿真人脸填数。
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[heroPortrait, heroTalkCover, xAvatar].map((photo) => (
                  <div
                    key={photo.id}
                    className="overflow-hidden rounded-2xl border border-ink-900/10 bg-cream-100"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={photo.src}
                        alt={photo.captionZh}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="truncate px-2.5 py-2 text-[11px] font-medium text-ink-700">
                      {photo.displayBadge}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink-900 transition hover:text-amberpoteto-600"
              >
                <span>浏览完整美照馆（共 {PHOTOS.length} 组公开素材）</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Talks Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-ink-900/10 bg-stage-900 p-6 text-cream-50 shadow-sm sm:p-8">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amberpoteto-400">
                  02 · STAGE & TALKS
                </span>
                <Play className="h-4 w-4 text-amberpoteto-400" />
              </div>
              <h3 className="mt-3 font-serif text-2xl font-bold text-cream-50">
                {featuredTalk.title}
              </h3>
              <p className="mt-1 font-mono text-xs text-cream-300/75">
                {featuredTalk.event} · {featuredTalk.date} ·{" "}
                {PERSON_INFO.officialTalkCredit}
              </p>

              <div className="mt-5 overflow-hidden rounded-2xl border border-white/15">
                <img
                  src={featuredTalk.thumbnail}
                  alt={featuredTalk.title}
                  className="aspect-video w-full object-cover"
                />
              </div>

              <ul className="mt-5 space-y-2 text-sm text-cream-200/85">
                {featuredTalk.highlightsZh.map((hl, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amberpoteto-400" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/talks"
                className="inline-flex items-center gap-2 rounded-full bg-amberpoteto-500 px-5 py-2.5 text-sm font-semibold text-stage-950 transition hover:bg-amberpoteto-400"
              >
                <span>观看嵌入视频 & 视频打卡</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={featuredTalk.videoYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-cream-300 hover:text-amberpoteto-400"
              >
                <span>YouTube 原视频</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* 03 CHALLENGE SPOTLIGHT BANNER */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-amberpoteto-500/35 bg-gradient-to-br from-stage-950 via-stage-900 to-[#241B12] p-7 text-cream-50 shadow-xl sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-amberpoteto-400/45 bg-amberpoteto-500/15 px-3.5 py-1 font-mono text-xs font-semibold text-amberpoteto-400">
                <Flame className="h-3.5 w-3.5" />
                <span>03 · UNOFFICIAL FAN CHALLENGE · 挑战区</span>
              </div>
              <h3 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">
                每月挑战 <span className="text-amberpoteto-400">2,000 个 PR</span>
                ：提交你自己的公开 GitHub PR
              </h3>
              <p className="text-sm leading-relaxed text-cream-200/85 sm:text-base">
                {CHALLENGE_INFO.framingZh}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/challenge"
                  className="inline-flex items-center gap-2 rounded-full bg-amberpoteto-500 px-6 py-3 text-sm font-semibold text-stage-950 transition hover:bg-amberpoteto-400"
                >
                  <span>立即提交我的 PR / 生成挑战卡</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={SITE_INFO.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-cream-100 transition hover:border-amberpoteto-400 hover:text-amberpoteto-400"
                >
                  <span>也可给 potetofans 仓库开 PR</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-black/30 p-6 font-mono">
              <div className="flex items-center justify-between text-xs text-cream-300/75">
                <span>MONTHLY TARGET</span>
                <span>LOCAL-FIRST</span>
              </div>
              <p className="mt-3 text-5xl font-bold tracking-tight text-amberpoteto-400">
                2,000{" "}
                <span className="text-lg font-normal text-cream-200">PRs</span>
              </p>
              <div className="mt-4 space-y-2 border-t border-white/10 pt-4 font-sans text-xs text-cream-200/80">
                <p>✓ 校验任意公开 github.com/.../pull/... 链接并写入本机</p>
                <p>✓ 大号进度环 + 一键导出 Unofficial Fan Challenge PNG</p>
                <p>✓ 一期免登录、不做公开刷榜、不发官方证书</p>
              </div>
            </div>
          </div>
        </div>

        {/* 04 Articles + 05 Cheer Preview */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          {/* Articles */}
          <div className="rounded-3xl border border-ink-900/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amberpoteto-600">
                04 · ARTICLES & CHECK-IN
              </span>
              <BookOpen className="h-4 w-4 text-ink-400" />
            </div>
            <h3 className="mt-3 font-serif text-2xl font-bold text-ink-900">
              文章导读：只做短导读与原文直链
            </h3>
            <p className="mt-2 text-sm text-ink-500">
              尊重原创版权，绝不转载全文。点击「阅读原文」跳往她的 X 或
              no.lol 原页后，即可解锁文章打卡。
            </p>

            <div className="mt-6 divide-y divide-ink-900/10">
              {featuredArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex flex-col justify-between gap-2 py-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-mono text-[11px] text-ink-500">
                      <span>{article.date}</span>
                      <span>·</span>
                      <span>{article.platform}</span>
                    </div>
                    <p className="mt-0.5 font-serif text-base font-bold text-ink-900">
                      {article.title}
                    </p>
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-ink-900/15 px-3.5 py-1.5 text-xs font-medium text-ink-900 transition hover:bg-stage-900 hover:text-cream-50"
                  >
                    <span>阅读原文</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink-900 transition hover:text-amberpoteto-600"
              >
                <span>查看全部 {ARTICLES.length} 篇文章导读并打卡</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Cheer Preview */}
          <div className="flex flex-col justify-between rounded-3xl border border-ink-900/10 bg-cream-200/70 p-6 sm:p-8">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amberpoteto-600">
                  05 · CHEER WALL
                </span>
                <Heart className="h-4 w-4 text-seal-600" />
              </div>
              <h3 className="mt-3 font-serif text-2xl font-bold text-ink-900">
                应援打 Call
              </h3>
              <p className="mt-2 text-sm text-ink-700">
                一键复制打 Call 文案、导出应援海报 PNG；自定义留言默认先审后发，拒绝无审核垃圾墙。
              </p>

              <div className="mt-5 space-y-3">
                {CHEER_PRESETS.slice(0, 2).map((preset) => (
                  <blockquote
                    key={preset.id}
                    className="rounded-2xl border border-ink-900/10 bg-cream-50 p-4 text-xs leading-relaxed text-ink-700"
                  >
                    “{preset.text}”
                  </blockquote>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/cheer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-stage-900 px-5 py-3 text-sm font-semibold text-cream-50 transition hover:bg-amberpoteto-600"
              >
                <span>进入应援墙 · 制打 Call 海报</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
