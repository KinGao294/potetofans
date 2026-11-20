"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Lock,
  Play,
  Quote,
  RotateCcw,
  Sparkles,
  Tv,
} from "lucide-react";
import {
  HISTORICAL_TALKS,
  PERSON_INFO,
  SourcedQuote,
  TALKS,
  TalkItem,
} from "@/data/site-data";
import { useStudyCheckin } from "@/lib/storage";
import { CardStudioModal } from "@/components/CardStudioModal";
import { CardRenderConfig } from "@/lib/card-canvas";

export default function TalksPage() {
  const { state, hydrated, unlockItem, checkInItem, undoCheckIn } =
    useStudyCheckin();
  const [playingMap, setPlayingMap] = useState<Record<string, boolean>>({});
  const [noteInput, setNoteInput] = useState("");
  const [nickInput, setNickInput] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [cardModal, setCardModal] = useState<{
    title: string;
    filename: string;
    config: CardRenderConfig;
    xShareText: string;
  } | null>(null);

  const featuredTalk = TALKS[0];
  const isUnlocked = Boolean(state.unlockedMap[featuredTalk.id]);
  const checkinRecord = state.checkedInMap[featuredTalk.id];

  const handlePlayEmbed = (talk: TalkItem) => {
    setPlayingMap((prev) => ({ ...prev, [talk.id]: true }));
    unlockItem(talk.id, "video", "embed_play");
    setFeedbackMsg(null);
  };

  const handleOutboundVideoClick = (talk: TalkItem) => {
    unlockItem(talk.id, "video", "outbound_click");
    setFeedbackMsg(null);
  };

  const openVideoCheckinCard = (talk: TalkItem, note?: string, nick?: string) => {
    const cleanDate = new Date().toISOString().slice(0, 10);
    setCardModal({
      title: "视频打卡卡 · Video Check-in Card",
      filename: `potetofans-video-checkin-${talk.id}.png`,
      xShareText: `刚在非官方粉丝站 potetofans 完成 @poteto 演讲《${talk.title}》的视频打卡！Review Proof, Not Code！`,
      config: {
        kind: "video-checkin",
        theme: "stage",
        badgeText: `VIDEO CHECK-IN · ${talk.event}`,
        headline: talk.title,
        bodyText:
          note && note.trim().length > 0
            ? `我的收获：「${note.trim()}」`
            : "「Review Proof, Not Code」—— 已完成本场公开演讲观看与自证打卡。",
        subline: `讲者署名：${PERSON_INFO.officialTalkCredit} · ${talk.date}`,
        nickname: nick,
        dateLabel: cleanDate,
        imageUrl: talk.thumbnail,
        imageNote: `${talk.event} 官方视频封面`,
        footerStamp: "UNOFFICIAL VIDEO CHECK-IN CARD · 非官方粉丝共学卡",
      },
    });
  };

  const openQuoteCard = (talk: TalkItem, quote: SourcedQuote) => {
    setCardModal({
      title: "演讲金句卡 · Quote Card",
      filename: `potetofans-quote-${quote.id}.png`,
      xShareText: `“${quote.text}” — @poteto (${talk.event})`,
      config: {
        kind: "quote",
        theme: "cream",
        badgeText: `SOURCED QUOTE · ${talk.event}`,
        headline: `“${quote.text}”`,
        bodyText: `出自公开演讲《${talk.title}》相关可核验公开内容。本站仅摘录公开标题/预告原话，完整观点请观看 YouTube 官方原视频。`,
        subline: `来源：${quote.attributionZh}`,
        footerStamp: "UNOFFICIAL FAN QUOTE CARD · 非官方粉丝金句卡",
      },
    });
  };

  const handleCompleteCheckin = () => {
    const res = checkInItem(featuredTalk.id, "video", {
      personalNote: noteInput,
      nickname: nickInput,
    });
    if (!res.ok) {
      setFeedbackMsg(res.error || "请先观看视频后再打卡。");
      return;
    }
    setFeedbackMsg("视频打卡成功！已同步至「学习打卡区」。");
    openVideoCheckinCard(featuredTalk, noteInput, nickInput);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="border-b border-ink-900/15 pb-8">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-amberpoteto-600">
          STAGE & VIDEO CHECK-IN · 公开演讲舞台
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-ink-900 sm:text-5xl">
          演讲与视频打卡
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-500 sm:text-base">
          仅使用 YouTube 官方公开嵌入播放器与原视频链接，绝不重托管版权视频。在站内触发播放或点击「原视频」观看后，即可解锁诚实自证视频打卡并生成专属视频打卡卡。
        </p>
      </div>

      {/* Featured Talk Stage */}
      <section
        id={featuredTalk.id}
        className="mt-10 overflow-hidden rounded-3xl border border-ink-900/10 bg-stage-900 text-cream-50 shadow-xl"
      >
        <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
          {/* Official YouTube Click-to-Play Facade / Iframe */}
          <div className="relative bg-black">
            {playingMap[featuredTalk.id] ? (
              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${featuredTalk.youtubeId}?autoplay=1&rel=0`}
                  title={featuredTalk.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handlePlayEmbed(featuredTalk)}
                className="group relative block aspect-video w-full overflow-hidden text-left focus:outline-none"
              >
                <img
                  src={featuredTalk.thumbnail}
                  alt={featuredTalk.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 transition group-hover:bg-black/35">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amberpoteto-500 text-stage-950 shadow-xl transition group-hover:scale-110">
                    <Play className="ml-1 h-7 w-7 fill-current" />
                  </span>
                  <span className="mt-3 rounded-full bg-stage-950/85 px-4 py-1.5 text-xs font-medium text-cream-50">
                    点击加载 YouTube 官方嵌入视频并解锁打卡
                  </span>
                </div>
              </button>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-stage-950 px-5 py-3 text-xs text-cream-300/80">
              <span>
                如当前网络无法加载 YouTube 嵌入播放器，请直接点击右侧「前往 YouTube 原视频」观看（同样解锁打卡）。
              </span>
              <a
                href={featuredTalk.videoYoutube}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleOutboundVideoClick(featuredTalk)}
                className="inline-flex items-center gap-1 font-semibold text-amberpoteto-400 hover:underline"
              >
                <span>前往原视频</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Talk Meta + Links */}
          <div className="flex flex-col justify-between p-6 sm:p-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="rounded-full bg-amberpoteto-500/20 px-3 py-1 font-semibold text-amberpoteto-400">
                  {featuredTalk.event}
                </span>
                <span className="text-cream-300/75">{featuredTalk.date}</span>
              </div>

              <h2 className="font-serif text-2xl font-bold leading-snug text-cream-50 sm:text-3xl">
                {featuredTalk.title}
              </h2>

              <p className="font-mono text-xs text-cream-300/80">
                官方署名：{PERSON_INFO.officialTalkCredit}
              </p>

              <ul className="space-y-2.5 border-t border-white/10 pt-4 text-sm leading-relaxed text-cream-200/90">
                {featuredTalk.highlightsZh.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amberpoteto-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Official Links */}
            <div className="mt-6 space-y-2.5 border-t border-white/10 pt-5">
              <p className="font-mono text-[11px] uppercase tracking-wider text-cream-300/70">
                官方与本人公开出处链接
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={featuredTalk.videoYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleOutboundVideoClick(featuredTalk)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amberpoteto-500 px-3 py-2.5 text-xs font-semibold text-stage-950 transition hover:bg-amberpoteto-400"
                >
                  <span>YouTube 原视频</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href={featuredTalk.officialTalkPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 px-3 py-2.5 text-xs font-medium text-cream-100 transition hover:border-amberpoteto-400 hover:text-amberpoteto-400"
                >
                  <span>官方演讲页</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href={featuredTalk.announcementPost}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-cream-200 transition hover:border-amberpoteto-400"
                >
                  <span>本人发布帖 ↗</span>
                </a>
                <a
                  href={featuredTalk.earlierAnnouncement}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-cream-200 transition hover:border-amberpoteto-400"
                >
                  <span>演讲预告帖 ↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Video Check-in Action Panel */}
        <div className="border-t border-white/10 bg-stage-950/90 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amberpoteto-400">
                  VIDEO CHECK-IN · 视频打卡
                </span>
                {hydrated && checkinRecord && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>
                      已打卡 · {checkinRecord.checkedInAt.slice(0, 10)}
                    </span>
                  </span>
                )}
              </div>
              <p className="text-sm text-cream-200/85">
                {!hydrated
                  ? "正在同步本机打卡状态…"
                  : checkinRecord
                  ? "你已完成本场演讲的视频打卡！记录已自动同步至「学习打卡区」。"
                  : isUnlocked
                  ? "已检测到你触发播放或跳转原视频，现在可以诚实自证完成本场视频打卡！"
                  : "打卡不得替代观看：请先点击上方播放视频或「YouTube 原视频」链接，解锁后即可打卡。"}
              </p>
              {feedbackMsg && (
                <p className="text-xs font-medium text-amberpoteto-400">
                  {feedbackMsg}
                </p>
              )}
            </div>

            {hydrated && checkinRecord ? (
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    openVideoCheckinCard(
                      featuredTalk,
                      checkinRecord.personalNote,
                      checkinRecord.nickname
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-full bg-amberpoteto-500 px-5 py-2.5 text-sm font-semibold text-stage-950 transition hover:bg-amberpoteto-400"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>生成 / 重制视频打卡卡 PNG</span>
                </button>
                <Link
                  href="/checkin"
                  className="rounded-full border border-white/20 px-4 py-2.5 text-xs font-medium text-cream-100 hover:bg-white/10"
                >
                  去学习打卡区查看汇总
                </Link>
                <button
                  type="button"
                  onClick={() => undoCheckIn(featuredTalk.id)}
                  className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3.5 py-2.5 text-xs text-cream-300 hover:border-seal-600 hover:text-red-300"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>撤回打卡</span>
                </button>
              </div>
            ) : (
              <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[440px]">
                {isUnlocked && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      type="text"
                      maxLength={80}
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="本机一句观看收获（选填，≤80字）"
                      className="rounded-xl border border-white/15 bg-stage-900 px-3.5 py-2 text-xs text-cream-50 placeholder:text-cream-300/50 focus:border-amberpoteto-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      maxLength={20}
                      value={nickInput}
                      onChange={(e) => setNickInput(e.target.value)}
                      placeholder="打卡署名昵称（选填）"
                      className="rounded-xl border border-white/15 bg-stage-900 px-3.5 py-2 text-xs text-cream-50 placeholder:text-cream-300/50 focus:border-amberpoteto-400 focus:outline-none"
                    />
                  </div>
                )}
                <button
                  type="button"
                  disabled={!isUnlocked}
                  onClick={handleCompleteCheckin}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${
                    isUnlocked
                      ? "bg-amberpoteto-500 text-stage-950 hover:bg-amberpoteto-400"
                      : "cursor-not-allowed border border-white/15 bg-white/5 text-cream-300/60"
                  }`}
                >
                  {isUnlocked ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>我已认真看完 · 完成视频打卡</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>先播放或打开原视频后解锁打卡</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sourced Quotes Section */}
      <section className="mt-14">
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-amberpoteto-600">
            VERIFIED QUOTES · 可核验原话摘录
          </p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-ink-900">
            可制作金句卡的公开原句
          </h2>
          <p className="mt-1 text-xs text-ink-500">
            严格仅摘录官方演讲标题、封面主标题与她本人的公开预告帖原话，绝不编造台词或凭空补写逐字稿。
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featuredTalk.sourcedQuotes.map((quote) => (
            <div
              key={quote.id}
              className="flex flex-col justify-between rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm"
            >
              <div>
                <Quote className="h-5 w-5 text-amberpoteto-500" />
                <p className="mt-3 font-serif text-lg font-bold leading-snug text-ink-900">
                  “{quote.text}”
                </p>
                <p className="mt-2 text-xs text-ink-500">
                  {quote.attributionZh}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-ink-900/10 pt-3">
                <a
                  href={quote.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-ink-500 underline-offset-4 hover:text-amberpoteto-600 hover:underline"
                >
                  查看出处 ↗
                </a>
                <button
                  type="button"
                  onClick={() => openQuoteCard(featuredTalk, quote)}
                  className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-3 py-1.5 text-xs font-medium text-ink-900 transition hover:bg-stage-900 hover:text-cream-50"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>生成金句卡</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Historical Talks (No fabricated embeds) */}
      <section className="mt-16 rounded-3xl border border-ink-900/10 bg-cream-50 p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-ink-900/10 pb-5 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-amberpoteto-600">
              <Tv className="h-3.5 w-3.5" />
              <span>ARCHIVE · 历史公开演讲索引</span>
            </div>
            <h2 className="mt-1.5 font-serif text-2xl font-bold text-ink-900">
              历史演讲记录（官方外链）
            </h2>
            <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-ink-500">
              {HISTORICAL_TALKS.noteZh}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={HISTORICAL_TALKS.sourceSpeakingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-stage-900 px-4 py-2 text-xs font-semibold text-cream-50 transition hover:bg-amberpoteto-600"
            >
              <span>no.lol/speaking 官方列表</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a
              href={HISTORICAL_TALKS.sourceSpeakerdeckUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/15 bg-white px-4 py-2 text-xs font-medium text-ink-900 transition hover:bg-cream-200"
            >
              <span>Speaker Deck 幻灯片</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <ul className="mt-5 divide-y divide-ink-900/10">
          {HISTORICAL_TALKS.items.map((item, index) => (
            <li
              key={item.id}
              className="flex flex-col justify-between gap-2 py-4 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs font-semibold text-amberpoteto-600">
                  0{index + 1}
                </span>
                <p className="text-sm font-medium text-ink-900">
                  {item.summary}
                </p>
              </div>
              <a
                href={HISTORICAL_TALKS.sourceSpeakingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-xs text-ink-500 hover:text-amberpoteto-600"
              >
                <span>查看官方记录</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {cardModal && (
        <CardStudioModal
          open={Boolean(cardModal)}
          onClose={() => setCardModal(null)}
          title={cardModal.title}
          filename={cardModal.filename}
          config={cardModal.config}
          xShareText={cardModal.xShareText}
        />
      )}
    </div>
  );
}
