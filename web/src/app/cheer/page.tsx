"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  Heart,
  Send,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  APPROVED_CHEER_SAMPLES,
  CHEER_PRESETS,
  PERSON_INFO,
} from "@/data/site-data";
import { usePendingCheers } from "@/lib/storage";
import { CardStudioModal } from "@/components/CardStudioModal";
import { CardRenderConfig } from "@/lib/card-canvas";

const CHEER_TAGS = ["日常打 Call", "演讲共鸣", "读文收获", "PR 挑战打卡"];

export default function CheerPage() {
  const { items: pendingItems, hydrated, submitPendingCheer, removePendingCheer } =
    usePendingCheers();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [tag, setTag] = useState(CHEER_TAGS[0]);
  const [content, setContent] = useState("");
  const [formNotice, setFormNotice] = useState<{
    type: "ok" | "error";
    text: string;
  } | null>(null);
  const [cardModal, setCardModal] = useState<{
    title: string;
    filename: string;
    config: CardRenderConfig;
    xShareText: string;
  } | null>(null);

  const handleCopyPreset = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore clipboard failures
    }
  };

  const openCheerPoster = (posterText: string, posterNick?: string, posterTag?: string) => {
    setCardModal({
      title: "打 Call 应援海报 · Cheer Poster",
      filename: "potetofans-cheer-poster.png",
      xShareText: `${posterText} @${PERSON_INFO.xUsername} (via potetofans Unofficial Fan Site)`,
      config: {
        kind: "cheer",
        theme: "stage",
        badgeText: `CHEER POSTER · ${posterTag || "日常打 Call"}`,
        headline: `为土豆女神 @${PERSON_INFO.xUsername} 打 Call`,
        bodyText: `“${posterText}”`,
        subline: "非官方民间粉丝应援海报 · 点击关注 @poteto 官方 X 主页",
        nickname: posterNick || "匿名土豆粉",
        imageUrl: "/images/nolol-profile.webp",
        imageNote: "公开演讲现场照 · 来源 no.lol",
        footerStamp: "UNOFFICIAL FAN CHEER POSTER · 非官方粉丝应援站",
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = submitPendingCheer(nickname, tag, content);
    if (!res.ok || !res.item) {
      setFormNotice({
        type: "error",
        text: res.error || "提交失败，请检查留言内容。",
      });
      return;
    }

    const submitted = res.item;
    setContent("");
    setFormNotice({
      type: "ok",
      text: "留言已保存为「待审核」状态，不会立刻公开上墙！你可以在下方查看自己的待审记录，也可以现在直接生成一张专属打 Call 海报 PNG 带走分享。",
    });
    openCheerPoster(submitted.content, submitted.nickname, submitted.tag);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-ink-900/15 pb-8">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-amberpoteto-600">
          CHEER WALL · 应援打 Call 墙
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-ink-900 sm:text-5xl">
          应援墙
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-500 sm:text-base">
          这里准备了可直接复制或制成海报的打 Call 文案。一期严守
          <strong className="font-semibold text-ink-900">先审后发</strong>
          红线，绝不做无审核公开垃圾墙：你提交的留言仅先在本机保存为「待审核」状态，不会立刻上墙，但可以立即用你的文字在浏览器本地生成高清打
          Call 海报带走分享。
        </p>
      </div>

      {/* Section 1: Copyable Preset Cheer Lines */}
      <section className="mt-10">
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-bold text-ink-900">
            01 · 一键复制打 Call 文案
          </h2>
          <p className="mt-1 text-xs text-ink-500">
            挑一句你喜欢的应援文案，一键复制、直接跳 X 发帖，或导出杂志风打 Call 海报 PNG。
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CHEER_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="flex flex-col justify-between rounded-3xl border border-ink-900/10 bg-white p-6 shadow-sm transition hover:border-amberpoteto-500/50"
            >
              <div>
                <span className="inline-block rounded-full bg-cream-200 px-3 py-1 font-mono text-[11px] font-semibold text-ink-700">
                  {preset.tag}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-ink-900">
                  “{preset.text}”
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-ink-900/10 pt-4">
                <button
                  type="button"
                  onClick={() => handleCopyPreset(preset.id, preset.text)}
                  className="inline-flex items-center gap-1 rounded-full bg-stage-900 px-3.5 py-1.5 text-xs font-medium text-cream-50 transition hover:bg-amberpoteto-600"
                >
                  {copiedId === preset.id ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>复制文案</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    openCheerPoster(preset.text, "土豆粉", preset.tag)
                  }
                  className="inline-flex items-center gap-1 rounded-full border border-ink-900/15 bg-cream-50 px-3 py-1.5 text-xs font-medium text-ink-900 hover:bg-cream-200"
                >
                  <Sparkles className="h-3 w-3 text-amberpoteto-600" />
                  <span>制海报</span>
                </button>
                <a
                  href={`https://x.com/intent/tweet?text=${encodeURIComponent(
                    preset.xShareText
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-xs text-ink-500 hover:text-amberpoteto-600"
                >
                  <span>去 X</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Moderated Submission Form + My Local Pending Queue */}
      <section className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Form */}
        <div className="rounded-3xl border border-ink-900/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-amberpoteto-600">
            <Heart className="h-4 w-4 text-seal-600" />
            <span>02 · SUBMIT CHEER · 投稿应援留言（先审后发）</span>
          </div>
          <h2 className="mt-2 font-serif text-2xl font-bold text-ink-900">
            写下你的打 Call 留言
          </h2>

          <div className="mt-3 flex items-start gap-2 rounded-2xl border border-amberpoteto-600/25 bg-amberpoteto-500/10 p-3.5 text-xs leading-relaxed text-ink-700">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amberpoteto-600" />
            <span>
              <strong>重要说明：</strong>此为非官方粉丝应援墙投稿，
              <strong>非发给 @{PERSON_INFO.xUsername} 本人的私信</strong>
              。第一期纯前端运行，提交后将提示「待审核，不会立刻上墙」并仅保存在你本机浏览器，同时立即为你生成可下载的打
              Call 海报 PNG。
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="cheer-nick"
                  className="mb-1.5 block text-xs font-semibold text-ink-700"
                >
                  展示昵称（留空默认「匿名土豆粉」）
                </label>
                <input
                  id="cheer-nick"
                  type="text"
                  maxLength={20}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="匿名土豆粉"
                  className="w-full rounded-xl border border-ink-900/15 bg-cream-50 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-amberpoteto-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="cheer-tag"
                  className="mb-1.5 block text-xs font-semibold text-ink-700"
                >
                  应援标签
                </label>
                <select
                  id="cheer-tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full rounded-xl border border-ink-900/15 bg-cream-50 px-3.5 py-2.5 text-sm text-ink-900 focus:border-amberpoteto-600 focus:bg-white focus:outline-none"
                >
                  {CHEER_TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <label
                  htmlFor="cheer-content"
                  className="font-semibold text-ink-700"
                >
                  打 Call 留言（1–140 字，不支持外部链接）
                </label>
                <span className="font-mono text-ink-400">
                  {content.length} / 140
                </span>
              </div>
              <textarea
                id="cheer-content"
                rows={4}
                maxLength={140}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="写下你喜欢她演讲、文章或工程态度的理由吧…"
                className="w-full rounded-2xl border border-ink-900/15 bg-cream-50 p-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-amberpoteto-600 focus:bg-white focus:outline-none"
              />
            </div>

            {formNotice && (
              <div
                className={`rounded-2xl border p-3.5 text-xs leading-relaxed sm:text-sm ${
                  formNotice.type === "ok"
                    ? "border-amberpoteto-600/35 bg-amberpoteto-500/10 text-ink-900"
                    : "border-seal-600/35 bg-red-50 text-seal-700"
                }`}
              >
                {formNotice.text}
              </div>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-stage-900 px-6 py-3 text-sm font-semibold text-cream-50 transition hover:bg-amberpoteto-600"
            >
              <Send className="h-4 w-4" />
              <span>提交待审留言并生成打 Call 海报</span>
            </button>
          </form>
        </div>

        {/* My Pending Local Queue */}
        <div className="rounded-3xl border border-ink-900/10 bg-cream-50 p-6 sm:p-8">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-ink-500">
            <Clock className="h-4 w-4 text-amberpoteto-600" />
            <span>MY PENDING QUEUE · 我的待审核留言（仅本机可见）</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-ink-500">
            你在上方提交的留言保存在本机浏览器中，状态固定为「待审核，不会立刻上墙」，其他访客看不到。
          </p>

          <div className="mt-5 space-y-3">
            {!hydrated ? (
              <p className="py-6 text-center text-xs text-ink-400">读取中…</p>
            ) : pendingItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink-900/15 bg-white/60 p-6 text-center text-xs text-ink-500">
                暂无待审核留言。提交后会显示在这里，并可随时重制打 Call 海报。
              </div>
            ) : (
              pendingItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-amberpoteto-600/25 bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-ink-900">
                        {item.nickname}
                      </span>
                      <span className="rounded-full bg-amberpoteto-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-amberpoteto-600">
                        待审核 · 不会立刻上墙
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label="删除本机待审留言"
                      onClick={() => removePendingCheer(item.id)}
                      className="text-ink-400 hover:text-seal-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-ink-700">
                    {item.content}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-ink-400">
                    <span>
                      {item.tag} · {item.createdAt.slice(0, 10)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        openCheerPoster(item.content, item.nickname, item.tag)
                      }
                      className="font-medium text-amberpoteto-600 hover:underline"
                    >
                      重制海报 PNG
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Section 3: Curated Approved Editorial Starter Wall */}
      <section className="mt-14">
        <div className="mb-5">
          <h2 className="font-serif text-2xl font-bold text-ink-900">
            03 · 精选应援语展示（人工审核通过示例）
          </h2>
          <p className="mt-1 text-xs text-ink-500">
            所有公开上墙留言均须经维护者人工审核入库，杜绝广告与恶意内容。
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {APPROVED_CHEER_SAMPLES.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-ink-900/10 bg-stage-900 p-6 text-cream-50"
            >
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="rounded-full bg-amberpoteto-500/20 px-2.5 py-0.5 text-amberpoteto-400">
                  {item.tag}
                </span>
                <span className="text-cream-300/60">{item.date}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-cream-100">
                “{item.content}”
              </p>
              <p className="mt-4 border-t border-white/10 pt-3 font-mono text-xs text-cream-300/80">
                — {item.nickname}
              </p>
            </div>
          ))}
        </div>
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
