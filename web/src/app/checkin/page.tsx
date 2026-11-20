"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Download,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { ARTICLES, PERSON_INFO, TALKS } from "@/data/site-data";
import { useStudyCheckin } from "@/lib/storage";
import { CardStudioModal } from "@/components/CardStudioModal";
import { CardRenderConfig } from "@/lib/card-canvas";

type CheckinFilter = "all" | "pending" | "completed";

interface UnifiedStudyItem {
  id: string;
  type: "video" | "article";
  title: string;
  subtitle: string;
  date: string;
  topic: string;
  routeHref: string;
  externalUrl: string;
}

export default function CheckinPage() {
  const {
    state,
    hydrated,
    unlockItem,
    undoCheckIn,
    importStudyJson,
    resetStudy,
  } = useStudyCheckin();
  const [tab, setTab] = useState<CheckinFilter>("all");
  const [backupMsg, setBackupMsg] = useState<string | null>(null);
  const [cardModal, setCardModal] = useState<{
    title: string;
    filename: string;
    config: CardRenderConfig;
    xShareText: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allItems: UnifiedStudyItem[] = [
    ...TALKS.map((t) => ({
      id: t.id,
      type: "video" as const,
      title: t.title,
      subtitle: `${t.event} · 官方 YouTube 嵌入演讲`,
      date: t.date,
      topic: t.studyTopicTag,
      routeHref: `/talks#${t.id}`,
      externalUrl: t.videoYoutube,
    })),
    ...ARTICLES.map((a) => ({
      id: a.id,
      type: "article" as const,
      title: a.title,
      subtitle: `${a.platform} · 原文外链导读`,
      date: a.date,
      topic: a.studyTopicTag,
      routeHref: `/articles#${a.id}`,
      externalUrl: a.url,
    })),
  ];

  const completedItems = allItems.filter((item) =>
    Boolean(state.checkedInMap[item.id])
  );
  const pendingItems = allItems.filter(
    (item) => !state.checkedInMap[item.id]
  );

  const completedVideos = completedItems.filter((x) => x.type === "video").length;
  const completedArticles = completedItems.filter(
    (x) => x.type === "article"
  ).length;
  const progressPct = Math.round(
    (completedItems.length / Math.max(1, allItems.length)) * 100
  );

  const latestCheckinDate = Object.values(state.checkedInMap)
    .map((x) => x.checkedInAt)
    .sort()
    .reverse()[0]
    ?.slice(0, 10);

  const displayedItems =
    tab === "all"
      ? allItems
      : tab === "completed"
      ? completedItems
      : pendingItems;

  const openSummaryCard = () => {
    const sampleTitles = completedItems
      .slice(0, 3)
      .map((item) => `✓ ${item.title}`);

    setCardModal({
      title: "学习打卡卡 · Study Check-in Card",
      filename: `potetofans-study-checkin-${completedItems.length}-of-${allItems.length}.png`,
      xShareText: `我在非官方粉丝站 potetofans 跟着土豆女神 @poteto 学习打卡：本机已完成 ${completedItems.length} / ${allItems.length} 项公开演讲与文章！`,
      config: {
        kind: "study-checkin",
        theme: "stage",
        badgeText: `STUDY CHECK-IN · ${completedItems.length} / ${allItems.length} COMPLETED`,
        headline: `跟着土豆女神 @${PERSON_INFO.xUsername} 学习打卡`,
        bodyText:
          completedItems.length > 0
            ? `本机已完成 ${completedItems.length} / ${allItems.length} 项公开内容（演讲 ${completedVideos}/${TALKS.length} · 文章 ${completedArticles}/${ARTICLES.length}）。`
            : "准备开启跟着 @poteto 公开演讲与博客原文的共学清单！",
        extraLines: sampleTitles,
        subline: "非官方粉丝共学纪念卡 · 记录仅存于本机浏览器",
        progressCurrent: completedItems.length,
        progressGoal: allItems.length,
        imageUrl: "/images/nolol-profile.webp",
        imageNote: "公开照片 · 官方博客 no.lol",
        footerStamp: "UNOFFICIAL STUDY CHECK-IN CARD · 非官方粉丝共学卡",
      },
    });
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `potetofans-study-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMsg("已导出本机学习打卡 JSON 备份文件。");
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = importStudyJson(String(reader.result || ""));
      setBackupMsg(
        res.ok
          ? "已成功从备份恢复本机学习打卡进度！"
          : res.error || "导入失败。"
      );
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-ink-900/15 pb-8">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-amberpoteto-600">
          STUDY CHECK-IN HUB · 共学清单枢纽
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-ink-900 sm:text-5xl">
          学习打卡区
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-500 sm:text-base">
          把土豆女神 @{PERSON_INFO.xUsername} 的公开演讲与博客原文组织成一份可逐步点亮的共学清单。免登录，进度只存在你当前浏览器本地；看完演讲或读完原文回来盖章，随时导出「学习打卡卡 PNG」。
        </p>
      </div>

      {/* Dashboard Card */}
      <section className="mt-8 rounded-3xl border border-ink-900/10 bg-stage-900 p-6 text-cream-50 shadow-xl sm:p-8">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              <span className="rounded-full bg-amberpoteto-500/20 px-3 py-1 font-semibold text-amberpoteto-400">
                LOCAL STUDY PROGRESS
              </span>
              {hydrated && latestCheckinDate && (
                <span className="text-cream-300/75">
                  最近打卡：{latestCheckinDate}
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-mono text-4xl font-bold text-amberpoteto-400 sm:text-5xl">
                {hydrated ? completedItems.length : "—"}
              </span>
              <span className="font-mono text-xl text-cream-300">
                / {allItems.length} 项公开内容已完成 ({hydrated ? progressPct : 0}%)
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-amberpoteto-500 transition-all duration-500"
                style={{ width: `${hydrated ? progressPct : 0}%` }}
              />
            </div>

            <div className="flex flex-wrap gap-6 pt-1 font-mono text-xs text-cream-200/85">
              <span>
                演讲视频打卡：{hydrated ? completedVideos : 0} / {TALKS.length}
              </span>
              <span>
                文章原文打卡：{hydrated ? completedArticles : 0} /{" "}
                {ARTICLES.length}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/[0.04] p-5">
            <button
              type="button"
              onClick={openSummaryCard}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amberpoteto-500 px-5 py-3 text-sm font-semibold text-stage-950 transition hover:bg-amberpoteto-400"
            >
              <Sparkles className="h-4 w-4" />
              <span>导出我的学习打卡卡 PNG</span>
            </button>
            <div className="flex items-start gap-2 text-[11px] leading-relaxed text-cream-300/75">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amberpoteto-400" />
              <span>
                免登录保护隐私：打卡记录仅保存在你当前浏览器的 localStorage，不会上传至任何服务器，导出卡片为非官方共学纪念卡。
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs + Backup Controls */}
      <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: `全部清单 / 能学什么 (${allItems.length})` },
            {
              id: "pending",
              label: `待打卡 / 还能打哪些 (${hydrated ? pendingItems.length : "…"})`,
            },
            {
              id: "completed",
              label: `已打卡 / 打过哪些 (${hydrated ? completedItems.length : "…"})`,
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as CheckinFilter)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition sm:text-sm ${
                tab === item.id
                  ? "bg-stage-900 text-cream-50"
                  : "border border-ink-900/15 bg-white text-ink-700 hover:bg-cream-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1 rounded-full border border-ink-900/15 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-700 hover:bg-cream-200"
          >
            <Download className="h-3.5 w-3.5" />
            <span>导出 JSON 备份</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 rounded-full border border-ink-900/15 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-700 hover:bg-cream-200"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>导入恢复</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportJsonFile}
            className="hidden"
          />
          {hydrated && completedItems.length > 0 && (
            <button
              type="button"
              onClick={() => {
                resetStudy();
                setBackupMsg("已清空本机学习打卡记录。");
              }}
              className="inline-flex items-center gap-1 rounded-full border border-ink-900/15 px-3 py-1.5 text-xs text-ink-500 hover:border-seal-600 hover:text-seal-600"
            >
              <RotateCcw className="h-3 w-3" />
              <span>重置</span>
            </button>
          )}
        </div>
      </div>

      {backupMsg && (
        <p className="mt-4 rounded-xl border border-amberpoteto-500/35 bg-amberpoteto-500/10 px-4 py-2.5 text-xs font-medium text-ink-900">
          {backupMsg}
        </p>
      )}

      {/* Checklist */}
      <div className="mt-6 space-y-4">
        {displayedItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ink-900/20 bg-cream-50 p-10 text-center">
            <p className="font-serif text-xl font-bold text-ink-900">
              {tab === "completed"
                ? "还没有已打卡条目"
                : "太棒了！当前清单已全部打卡完成"}
            </p>
            <p className="mt-2 text-sm text-ink-500">
              {tab === "completed"
                ? "先去观看一场公开演讲或阅读一篇原文，回来即可点亮你的第一枚打卡印章。"
                : "你已经完成了第一期收录的全部公开内容，快导出学习打卡卡分享吧！"}
            </p>
          </div>
        ) : (
          displayedItems.map((item) => {
            const record = state.checkedInMap[item.id];
            const isUnlocked = Boolean(state.unlockedMap[item.id]);

            return (
              <div
                key={item.id}
                className={`flex flex-col justify-between gap-4 rounded-2xl border p-5 transition sm:flex-row sm:items-center ${
                  hydrated && record
                    ? "border-emerald-700/25 bg-emerald-50/40"
                    : "border-ink-900/10 bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      item.type === "video"
                        ? "bg-stage-900 text-amberpoteto-400"
                        : "bg-cream-200 text-ink-900"
                    }`}
                  >
                    {item.type === "video" ? (
                      <Play className="h-4 w-4" />
                    ) : (
                      <BookOpen className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                      <span className="rounded-full bg-cream-200 px-2.5 py-0.5 font-semibold text-ink-700">
                        {item.type === "video" ? "演讲视频" : "原文文章"}
                      </span>
                      <span className="text-ink-500">{item.date}</span>
                      <span className="text-ink-400">· {item.topic}</span>
                      {hydrated && record ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 font-semibold text-emerald-800">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>已打卡 {record.checkedInAt.slice(0, 10)}</span>
                        </span>
                      ) : hydrated && isUnlocked ? (
                        <span className="rounded-full bg-amberpoteto-500/15 px-2.5 py-0.5 font-semibold text-amberpoteto-600">
                          已解锁 · 待盖章
                        </span>
                      ) : (
                        <span className="text-ink-400">待观看/阅读</span>
                      )}
                    </div>
                    <h3 className="mt-1 font-serif text-lg font-bold text-ink-900">
                      {item.title}
                    </h3>
                    <p className="text-xs text-ink-500">{item.subtitle}</p>
                    {hydrated && record?.personalNote && (
                      <p className="mt-1.5 text-xs text-ink-700">
                        本机收获：「{record.personalNote}」
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {hydrated && record ? (
                    <>
                      <Link
                        href={item.routeHref}
                        className="inline-flex items-center gap-1 rounded-full border border-ink-900/15 bg-white px-4 py-2 text-xs font-medium text-ink-900 hover:bg-cream-200"
                      >
                        <span>查看 / 重制单篇打卡卡</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => undoCheckIn(item.id)}
                        className="rounded-full border border-ink-900/15 px-3 py-2 text-xs text-ink-500 hover:border-seal-600 hover:text-seal-600"
                      >
                        撤回
                      </button>
                    </>
                  ) : (
                    <>
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          unlockItem(item.id, item.type, "outbound_click")
                        }
                        className="inline-flex items-center gap-1 rounded-full border border-ink-900/15 bg-white px-3.5 py-2 text-xs font-medium text-ink-700 hover:bg-cream-200"
                      >
                        <span>
                          {item.type === "video" ? "打开原视频" : "阅读原文"}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                      <Link
                        href={item.routeHref}
                        className="inline-flex items-center gap-1 rounded-full bg-stage-900 px-4 py-2 text-xs font-semibold text-cream-50 hover:bg-amberpoteto-600"
                      >
                        <span>
                          {item.type === "video"
                            ? "去看演讲并打卡"
                            : "去文章页打卡"}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
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
