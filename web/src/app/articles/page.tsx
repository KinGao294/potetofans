"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Lock,
  Quote,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { ARTICLES, ArticleItem, PERSON_INFO } from "@/data/site-data";
import { useStudyCheckin } from "@/lib/storage";
import { CardStudioModal } from "@/components/CardStudioModal";
import { CardRenderConfig } from "@/lib/card-canvas";

export default function ArticlesPage() {
  const { state, hydrated, unlockItem, checkInItem, undoCheckIn } =
    useStudyCheckin();
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [cardModal, setCardModal] = useState<{
    title: string;
    filename: string;
    config: CardRenderConfig;
    xShareText: string;
  } | null>(null);

  const openArticleCheckinCard = (article: ArticleItem, note?: string) => {
    setCardModal({
      title: "文章打卡卡 · Article Check-in Card",
      filename: `potetofans-article-checkin-${article.id}.png`,
      xShareText: `刚在非官方粉丝站 potetofans 完成 @poteto 文章《${article.title}》的原文阅读与文章打卡！`,
      config: {
        kind: "article-checkin",
        theme: "cream",
        badgeText: `ARTICLE CHECK-IN · ${article.platform}`,
        headline: article.title,
        bodyText:
          note && note.trim().length > 0
            ? `我的读后短句：「${note.trim()}」`
            : `已前往 ${article.platform} 阅读原文并完成诚实自证文章打卡。`,
        subline: `原作者：@${PERSON_INFO.xUsername} · ${article.date} · ${article.studyTopicTag}`,
        footerStamp: "UNOFFICIAL ARTICLE CHECK-IN CARD · 非官方粉丝共学卡",
      },
    });
  };

  const openArticleQuoteCard = (article: ArticleItem) => {
    setCardModal({
      title: "文章标题金句卡 · Quote Card",
      filename: `potetofans-article-quote-${article.id}.png`,
      xShareText: `推荐阅读 @poteto 的《${article.title}》（${article.url}）`,
      config: {
        kind: "quote",
        theme: "stage",
        badgeText: `ARTICLE READING PICK · ${article.platform}`,
        headline: `“${article.sourcedQuote.text}”`,
        bodyText: article.shortGuideZh,
        subline: `出处：${article.sourcedQuote.attributionZh}`,
        footerStamp: "UNOFFICIAL FAN READING CARD · 仅导读，请阅读原文",
      },
    });
  };

  const handleReadOriginal = (article: ArticleItem) => {
    unlockItem(article.id, "article", "outbound_click");
    setToastMsg(`已为《${article.title}》解锁文章打卡！读完原文后即可返回盖章。`);
  };

  const handleCheckIn = (article: ArticleItem) => {
    const note = notesMap[article.id] || "";
    const res = checkInItem(article.id, "article", { personalNote: note });
    if (!res.ok) {
      setToastMsg(res.error || "请先点击「阅读原文」前往原始页面。");
      return;
    }
    setToastMsg(`已完成《${article.title}》文章打卡并同步至学习打卡区！`);
    openArticleCheckinCard(article, note);
  };

  const checkedCount = ARTICLES.filter((a) =>
    Boolean(state.checkedInMap[a.id])
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 border-b border-ink-900/15 pb-8 lg:flex-row lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-amberpoteto-600">
            ARTICLES & READING CHECK-IN · 文章导读与原文导流
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-ink-900 sm:text-5xl">
            文章导读
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-500 sm:text-base">
            严格遵守尊重原创原则：每篇仅提供{" "}
            <strong className="font-semibold text-ink-900">
              80–150 字中文短导读 + 原文外链
            </strong>
            ，严禁转载全文、严禁链接第三方盗版搬运站。点击「阅读原文」跳往原平台后，即可解锁该篇的文章打卡。
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-ink-900/10 bg-white px-5 py-3.5 shadow-sm">
          <BookOpen className="h-5 w-5 text-amberpoteto-600" />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-500">
              本机文章打卡进度
            </p>
            <p className="font-mono text-lg font-bold text-ink-900">
              {hydrated ? `${checkedCount} / ${ARTICLES.length}` : "…"} 篇已完成
            </p>
          </div>
          <Link
            href="/checkin"
            className="ml-2 rounded-full bg-stage-900 px-3.5 py-1.5 text-xs font-medium text-cream-50 hover:bg-amberpoteto-600"
          >
            学习打卡区 →
          </Link>
        </div>
      </div>

      {toastMsg && (
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-amberpoteto-500/40 bg-amberpoteto-500/10 px-4 py-3 text-xs font-medium text-ink-900 sm:text-sm">
          <span>{toastMsg}</span>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="ml-4 text-xs text-ink-500 hover:text-ink-900"
          >
            关闭
          </button>
        </div>
      )}

      {/* Articles List */}
      <div className="mt-10 space-y-6">
        {ARTICLES.map((article, idx) => {
          const isUnlocked = Boolean(state.unlockedMap[article.id]);
          const checked = state.checkedInMap[article.id];

          return (
            <article
              key={article.id}
              id={article.id}
              className="rounded-3xl border border-ink-900/10 bg-white p-6 shadow-sm transition hover:border-amberpoteto-500/50 sm:p-8"
            >
              <div className="flex flex-col justify-between gap-4 border-b border-ink-900/10 pb-5 lg:flex-row lg:items-start">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-amberpoteto-600">
                      0{idx + 1}
                    </span>
                    <span className="rounded-full bg-cream-200 px-2.5 py-0.5 text-ink-700">
                      {article.platform}
                    </span>
                    <span className="text-ink-500">{article.date}</span>
                    <span className="rounded-full border border-ink-900/10 px-2.5 py-0.5 text-ink-500">
                      {article.studyTopicTag}
                    </span>
                    {article.needExactPermalink && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amberpoteto-600/35 bg-amberpoteto-500/10 px-2.5 py-0.5 text-[11px] text-amberpoteto-600">
                        <AlertCircle className="h-3 w-3" />
                        <span>暂链博客主页 · 精确链接待补全</span>
                      </span>
                    )}
                    {hydrated && checked && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 font-semibold text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>已打卡 · {checked.checkedInAt.slice(0, 10)}</span>
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-ink-900 sm:text-3xl">
                    {article.title}
                  </h2>
                </div>

                {/* Primary Outbound Link + Quote Card */}
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleReadOriginal(article)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-stage-900 px-5 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-amberpoteto-600"
                  >
                    <span>阅读原文</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => openArticleQuoteCard(article)}
                    className="inline-flex items-center gap-1 rounded-full border border-ink-900/15 bg-cream-50 px-3.5 py-2.5 text-xs font-medium text-ink-700 transition hover:bg-cream-200"
                  >
                    <Quote className="h-3.5 w-3.5" />
                    <span>导读卡</span>
                  </button>
                </div>
              </div>

              {/* Short Chinese Guide (80-150 chars, zero full text) */}
              <div className="mt-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-ink-400">
                  粉丝中文短导读（不替代原文）
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-700 sm:text-base">
                  {article.shortGuideZh}
                </p>
              </div>

              {/* Check-in Footer Bar */}
              <div className="mt-6 rounded-2xl border border-ink-900/10 bg-cream-50 p-4">
                {hydrated && checked ? (
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="text-xs text-ink-700">
                      <span className="font-semibold text-emerald-800">
                        ✓ 已完成文章打卡
                      </span>
                      {checked.personalNote && (
                        <span className="ml-2 text-ink-500">
                          · 本机笔记：「{checked.personalNote}」
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openArticleCheckinCard(article, checked.personalNote)
                        }
                        className="inline-flex items-center gap-1 rounded-full bg-amberpoteto-500 px-4 py-1.5 text-xs font-semibold text-stage-950 hover:bg-amberpoteto-400"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>生成文章打卡卡 PNG</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => undoCheckIn(article.id)}
                        className="inline-flex items-center gap-1 rounded-full border border-ink-900/15 px-3 py-1.5 text-xs text-ink-500 hover:border-seal-600 hover:text-seal-600"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>撤回</span>
                      </button>
                    </div>
                  </div>
                ) : hydrated && isUnlocked ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      maxLength={80}
                      value={notesMap[article.id] || ""}
                      onChange={(e) =>
                        setNotesMap((prev) => ({
                          ...prev,
                          [article.id]: e.target.value,
                        }))
                      }
                      placeholder="写一句本机读后笔记（选填，≤80字，不上传服务器）"
                      className="flex-1 rounded-xl border border-ink-900/15 bg-white px-3.5 py-2 text-xs text-ink-900 placeholder:text-ink-400 focus:border-amberpoteto-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleCheckIn(article)}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-amberpoteto-500 px-5 py-2 text-xs font-semibold text-stage-950 transition hover:bg-amberpoteto-400"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>我已读完原文 · 文章打卡</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between gap-2 text-xs text-ink-500 sm:flex-row sm:items-center">
                    <span className="inline-flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-ink-400" />
                      <span>
                        点击上方「阅读原文 ↗」前往原平台阅读后，将自动解锁本篇「文章打卡」。
                      </span>
                    </span>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleReadOriginal(article)}
                      className="font-semibold text-amberpoteto-600 hover:underline"
                    >
                      立即前往原文解锁 →
                    </a>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

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
