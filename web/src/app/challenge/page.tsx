"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Calendar,
  Download,
  ExternalLink,
  Flame,
  GitPullRequest,
  Github,
  Info,
  Plus,
  ShieldAlert,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { CHALLENGE_INFO, PERSON_INFO, SITE_INFO } from "@/data/site-data";
import {
  formatMonthLabel,
  getCurrentMonthKey,
  usePrChallenge,
} from "@/lib/storage";
import { CardStudioModal } from "@/components/CardStudioModal";
import { CardRenderConfig } from "@/lib/card-canvas";

export default function ChallengePage() {
  const { items, hydrated, addPr, removePr, importPrJson, resetPrs } =
    usePrChallenge();

  const currentMonthKey = useMemo(() => getCurrentMonthKey(), []);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [prUrl, setPrUrl] = useState("");
  const [prNote, setPrNote] = useState("");
  const [repoFilter, setRepoFilter] = useState("");
  const [formMsg, setFormMsg] = useState<{
    type: "ok" | "error";
    text: string;
  } | null>(null);
  const [cardConfig, setCardConfig] = useState<CardRenderConfig | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const availableMonths = useMemo(() => {
    const set = new Set<string>([currentMonthKey]);
    for (const item of items) {
      set.add(item.monthKey);
    }
    return Array.from(set).sort().reverse();
  }, [items, currentMonthKey]);

  const monthItems = useMemo(
    () => items.filter((item) => item.monthKey === selectedMonth),
    [items, selectedMonth]
  );

  const filteredItems = useMemo(() => {
    const q = repoFilter.trim().toLowerCase();
    if (!q) return monthItems;
    return monthItems.filter(
      (item) =>
        item.repoFullName.toLowerCase().includes(q) ||
        String(item.prNumber).includes(q) ||
        (item.note && item.note.toLowerCase().includes(q))
    );
  }, [monthItems, repoFilter]);

  const monthLabel = formatMonthLabel(selectedMonth);
  const count = hydrated ? monthItems.length : 0;
  const goal = CHALLENGE_INFO.monthlyGoal;
  const pctRaw = (count / goal) * 100;
  const pctClamped = Math.min(100, pctRaw);
  const remaining = Math.max(0, goal - count);

  const uniqueReposCount = useMemo(
    () => new Set(monthItems.map((i) => i.repoFullName.toLowerCase())).size,
    [monthItems]
  );

  // SVG Ring math
  const radius = 98;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (circumference * (count > 0 ? Math.max(pctClamped, 0.8) : 0)) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addPr(prUrl, prNote, selectedMonth);
    if (!res.ok) {
      setFormMsg({
        type: "error",
        text: res.error || "提交失败，请检查 PR 链接格式。",
      });
      return;
    }
    setPrUrl("");
    setPrNote("");
    setFormMsg({
      type: "ok",
      text: `已记录 ${res.item!.repoFullName}#${res.item!.prNumber} 到「${monthLabel.zh}」本机挑战进度！`,
    });
  };

  const openChallengeCard = () => {
    const recentRepos = Array.from(
      new Set(monthItems.map((x) => x.repoFullName))
    )
      .slice(0, 3)
      .map((r) => `• ${r}`);

    setCardConfig({
      kind: "challenge",
      theme: "stage",
      badgeText: `UNOFFICIAL FAN CHALLENGE · ${monthLabel.en.toUpperCase()}`,
      headline: `${monthLabel.en} · 2,000 PR 粉丝挑战`,
      bodyText: `${monthLabel.en} · ${count.toLocaleString()} / ${goal.toLocaleString()} PRs · Unofficial Fan Challenge。受 @${PERSON_INFO.xUsername} 公开演讲启发，把高吞吐、高质量工程实践变成每日公开 PR。`,
      extraLines:
        recentRepos.length > 0
          ? ["近期记录仓库：", ...recentRepos]
          : ["本机记录于 potetofans 非官方粉丝站 · 欢迎任何公开 GitHub 仓库 PR"],
      subline: "本进度仅代表当前浏览器本地记录，非官方统计，亦非本人或公司 KPI",
      progressCurrent: count,
      progressGoal: goal,
      dateLabel: selectedMonth,
      footerStamp: "UNOFFICIAL FAN CHALLENGE · 非官方粉丝挑战",
    });
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `potetofans-pr-challenge-${selectedMonth}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setFormMsg({ type: "ok", text: "已导出本机 PR 挑战记录 JSON 备份。" });
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = importPrJson(String(reader.result || ""));
      setFormMsg({
        type: res.ok ? "ok" : "error",
        text: res.ok
          ? `已成功导入 ${res.count} 条有效 GitHub PR 记录！`
          : res.error || "导入失败。",
      });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div>
      {/* 1. STAGE-BLACK CHALLENGE COMMAND HERO */}
      <section className="stage-grid-bg border-b border-white/10 text-cream-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {/* Unofficial Challenge Banner */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-amberpoteto-400/50 bg-amberpoteto-500/15 px-3.5 py-1 font-mono text-xs font-semibold text-amberpoteto-400">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>
                UNOFFICIAL FAN CHALLENGE · 粉丝发起的非官方挑战（非本人或公司官方活动）
              </span>
            </span>

            <div className="flex items-center gap-2 font-mono text-xs text-cream-300">
              <Calendar className="h-3.5 w-3.5 text-amberpoteto-400" />
              <label htmlFor="challenge-month" className="sr-only">
                选择统计月份
              </label>
              <select
                id="challenge-month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="rounded-full border border-white/20 bg-stage-900 px-3 py-1 text-xs text-cream-50 focus:border-amberpoteto-400 focus:outline-none"
              >
                {availableMonths.map((mk) => (
                  <option key={mk} value={mk}>
                    {formatMonthLabel(mk).zh} ({mk})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left Heading + Inspiration */}
            <div className="space-y-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-amberpoteto-400">
                  MONTHLY SELF-CHALLENGE · {monthLabel.en.toUpperCase()}
                </p>
                <h1 className="mt-2 font-serif text-4xl font-bold leading-tight sm:text-5xl">
                  挑战区：每月{" "}
                  <span className="text-amberpoteto-400">2,000 个 PR</span>
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-cream-200/85 sm:text-base">
                  {CHALLENGE_INFO.framingZh}
                </p>
              </div>

              {/* Inspiration Source Links */}
              <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 sm:p-5">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-amberpoteto-400">
                  灵感出处 · 并非官方 KPI
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-cream-200/80">
                  2,000 个 PR 是粉丝站点自设的趣味月度自我挑战目标，绝非 @
                  {PERSON_INFO.xUsername} 本人或 SpaceXSI / Grok Bot
                  下达的官方指标。欢迎先回看激发这一灵感的原演讲与预告帖：
                </p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  <a
                    href={CHALLENGE_INFO.talkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-cream-100 transition hover:border-amberpoteto-400 hover:text-amberpoteto-400"
                  >
                    <span>AIE 演讲视频：All Code Is Slop (Except Mine)</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={CHALLENGE_INFO.announcementPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-cream-100 transition hover:border-amberpoteto-400 hover:text-amberpoteto-400"
                  >
                    <span>她关于 11,000 PRs 的预告帖</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openChallengeCard}
                  className="inline-flex items-center gap-2 rounded-full bg-amberpoteto-500 px-6 py-3 text-sm font-semibold text-stage-950 transition hover:bg-amberpoteto-400"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>生成挑战卡 PNG 分享</span>
                </button>
                <a
                  href="#submit-pr"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-medium text-cream-50 transition hover:border-amberpoteto-400"
                >
                  <Plus className="h-4 w-4" />
                  <span>提交我的公开 PR</span>
                </a>
              </div>
            </div>

            {/* Right Giant Progress Ring & Bar */}
            <div className="rounded-3xl border border-white/15 bg-stage-950/85 p-6 shadow-2xl sm:p-8">
              <div className="flex flex-col items-center">
                <div className="relative flex h-60 w-60 items-center justify-center">
                  <svg
                    className="h-full w-full -rotate-90"
                    viewBox="0 0 220 220"
                    aria-label={`本月已记录 ${count} / ${goal} 个 PR`}
                  >
                    <circle
                      cx="110"
                      cy="110"
                      r={radius}
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="14"
                    />
                    <circle
                      cx="110"
                      cy="110"
                      r={radius}
                      fill="none"
                      stroke="#E8A95B"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-amberpoteto-400">
                      本月已记录
                    </span>
                    <span className="mt-1 font-mono text-5xl font-bold tracking-tight text-cream-50">
                      {count.toLocaleString()}
                    </span>
                    <span className="mt-1 font-mono text-sm text-cream-300/80">
                      / {goal.toLocaleString()} PRs
                    </span>
                    <span className="mt-1.5 rounded-full bg-amberpoteto-500/20 px-2.5 py-0.5 font-mono text-xs font-semibold text-amberpoteto-400">
                      {pctRaw.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Linear Progress Bar */}
                <div className="mt-5 w-full space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs text-cream-300/80">
                    <span>{monthLabel.zh}</span>
                    <span>距离 2,000 还差 {remaining.toLocaleString()} 个</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amberpoteto-600 to-amberpoteto-400 transition-all duration-500"
                      style={{
                        width: `${count > 0 ? Math.max(pctClamped, 1) : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Mini Metrics */}
                <div className="mt-5 grid w-full grid-cols-2 gap-3 font-mono">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                    <p className="text-[11px] text-cream-300/70">本月涉及仓库</p>
                    <p className="mt-1 text-xl font-bold text-cream-50">
                      {hydrated ? uniqueReposCount : 0}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                    <p className="text-[11px] text-cream-300/70">累计总记录</p>
                    <p className="mt-1 text-xl font-bold text-cream-50">
                      {hydrated ? items.length : 0}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-center text-[11px] leading-relaxed text-cream-300/70">
                  {CHALLENGE_INFO.localNoticeZh}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SUBMIT FORM + CONTRIBUTE TO POTETOFANS */}
      <section
        id="submit-pr"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          {/* Submit PR Form */}
          <div className="rounded-3xl border border-ink-900/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-amberpoteto-600">
              <GitPullRequest className="h-4 w-4" />
              <span>SUBMIT YOUR PR · 提交自己的公开 PR</span>
            </div>
            <h2 className="mt-2 font-serif text-2xl font-bold text-ink-900 sm:text-3xl">
              粘贴你的公开 GitHub PR 链接
            </h2>
            <p className="mt-1.5 text-sm text-ink-500">
              不限仓库！只要是公开可访问的{" "}
              <code className="rounded bg-cream-200 px-1.5 py-0.5 font-mono text-xs text-ink-900">
                https://github.com/owner/repo/pull/123
              </code>{" "}
              链接，通过格式校验后即刻记录到本机浏览器{" "}
              <code className="rounded bg-cream-200 px-1.5 py-0.5 font-mono text-xs text-ink-900">
                localStorage
              </code>
              。
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="pr-url-input"
                  className="mb-1.5 block text-xs font-semibold text-ink-700"
                >
                  公开 GitHub PR URL（必填）
                </label>
                <input
                  id="pr-url-input"
                  type="url"
                  required
                  value={prUrl}
                  onChange={(e) => setPrUrl(e.target.value)}
                  placeholder="https://github.com/KinGao294/potetofans/pull/1"
                  className="w-full rounded-2xl border border-ink-900/15 bg-cream-50 px-4 py-3 font-mono text-sm text-ink-900 placeholder:text-ink-400 focus:border-amberpoteto-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="pr-note-input"
                  className="mb-1.5 block text-xs font-semibold text-ink-700"
                >
                  本次 PR 简短备注（选填，≤ 80 字，仅存本机）
                </label>
                <input
                  id="pr-note-input"
                  type="text"
                  maxLength={80}
                  value={prNote}
                  onChange={(e) => setPrNote(e.target.value)}
                  placeholder="例如：修复移动端导航无障碍焦点 / 补充博客精确链接"
                  className="w-full rounded-2xl border border-ink-900/15 bg-cream-50 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-amberpoteto-600 focus:bg-white focus:outline-none"
                />
              </div>

              {formMsg && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-xs font-medium sm:text-sm ${
                    formMsg.type === "ok"
                      ? "border-emerald-700/25 bg-emerald-50 text-emerald-900"
                      : "border-seal-600/35 bg-red-50 text-seal-700"
                  }`}
                >
                  {formMsg.text}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-stage-900 px-6 py-3 text-sm font-semibold text-cream-50 transition hover:bg-amberpoteto-600"
                >
                  <Plus className="h-4 w-4" />
                  <span>记录到 {monthLabel.zh} 进度</span>
                </button>
                <button
                  type="button"
                  onClick={openChallengeCard}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/15 bg-cream-50 px-5 py-3 text-sm font-medium text-ink-900 transition hover:bg-cream-200"
                >
                  <Sparkles className="h-4 w-4 text-amberpoteto-600" />
                  <span>生成挑战卡 PNG</span>
                </button>
              </div>
            </form>
          </div>

          {/* Contribute to potetofans + Phase 1 Boundaries */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-amberpoteto-600/30 bg-cream-200/75 p-6">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-amberpoteto-600">
                <Github className="h-4 w-4" />
                <span>OPEN SOURCE · 欢迎给本站开 PR</span>
              </div>
              <h3 className="mt-2 font-serif text-xl font-bold text-ink-900">
                也可以直接向 potetofans 仓库提交 PR！
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-700">
                不管是补充可核验的公开演讲照、完善{" "}
                <code className="rounded bg-white/80 px-1 py-0.5 font-mono">
                  no.lol
                </code>{" "}
                待补全文章链接、改进无障碍体验、优化排版文案还是修 Bug，都非常欢迎向本站开源仓库开
                PR——当然，<strong>不限制只能提交本站仓库</strong>
                ，任何你参与的公开 GitHub 开源项目 PR 都可以记录！
              </p>
              <a
                href={SITE_INFO.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-stage-900 px-4 py-2 text-xs font-semibold text-cream-50 transition hover:bg-amberpoteto-600"
              >
                <span>前往 KinGao294/potetofans</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="rounded-3xl border border-ink-900/10 bg-white p-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-ink-900">
                <Info className="h-4 w-4 text-amberpoteto-600" />
                <span>第一期挑战区边界说明</span>
              </div>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-ink-500">
                <li>• 只接受公开 GitHub PR URL，免站点登录。</li>
                <li>
                  • 一期不做公开排行榜（避免刷量内卷与隐私纠纷）、不做付费、不做官方证书。
                </li>
                <li>
                  • 所有记录仅保存在当前浏览器 localStorage，可随时导出 JSON 备份。
                </li>
                <li>
                  • 导出挑战卡强制携带{" "}
                  <span className="font-mono font-semibold text-ink-900">
                    Unofficial Fan Challenge
                  </span>{" "}
                  标识。
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. RECORDED PR LIST */}
        <div className="mt-12 rounded-3xl border border-ink-900/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-ink-900/10 pb-5 md:flex-row md:items-center">
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink-900">
                {monthLabel.zh} 已记录 PR 列表（{count}）
              </h2>
              <p className="mt-0.5 text-xs text-ink-500">
                展示仓库名、PR 编号、提交时间与原始链接
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={repoFilter}
                onChange={(e) => setRepoFilter(e.target.value)}
                placeholder="筛选仓库名或 PR 号…"
                className="rounded-full border border-ink-900/15 bg-cream-50 px-4 py-1.5 text-xs text-ink-900 placeholder:text-ink-400 focus:border-amberpoteto-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleExportJson}
                className="inline-flex items-center gap-1 rounded-full border border-ink-900/15 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-700 hover:bg-cream-200"
              >
                <Download className="h-3.5 w-3.5" />
                <span>备份 JSON</span>
              </button>
              <button
                type="button"
                onClick={() => importInputRef.current?.click()}
                className="inline-flex items-center gap-1 rounded-full border border-ink-900/15 bg-white px-3.5 py-1.5 text-xs font-medium text-ink-700 hover:bg-cream-200"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>导入</span>
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept="application/json"
                onChange={handleImportJson}
                className="hidden"
              />
              {hydrated && items.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    resetPrs();
                    setFormMsg({ type: "ok", text: "已清空全部本机 PR 记录。" });
                  }}
                  className="rounded-full border border-ink-900/15 px-3 py-1.5 text-xs text-ink-500 hover:border-seal-600 hover:text-seal-600"
                >
                  清空全部
                </button>
              )}
            </div>
          </div>

          {!hydrated ? (
            <p className="py-10 text-center text-sm text-ink-400">
              正在读取本机 PR 挑战记录…
            </p>
          ) : filteredItems.length === 0 ? (
            <div className="my-6 rounded-2xl border border-dashed border-ink-900/15 bg-cream-50 p-10 text-center">
              <Flame className="mx-auto h-8 w-8 text-amberpoteto-500" />
              <p className="mt-3 font-serif text-lg font-bold text-ink-900">
                {monthItems.length === 0
                  ? `${monthLabel.zh} 还没有记录任何 PR`
                  : "没有匹配的 PR 记录"}
              </p>
              <p className="mt-1 text-xs text-ink-500">
                在上方表单粘贴你的公开 GitHub PR 链接，点亮本月的第 1 个进度！
              </p>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-ink-900/10">
              {filteredItems.map((item) => {
                const dateDisplay = new Date(item.submittedAt).toLocaleString(
                  "zh-CN",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );
                return (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-stage-900 px-2.5 py-0.5 font-mono text-xs font-semibold text-amberpoteto-400">
                          #{item.prNumber}
                        </span>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 truncate font-mono text-sm font-semibold text-ink-900 hover:text-amberpoteto-600 hover:underline"
                        >
                          <span>{item.repoFullName}</span>
                          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        </a>
                      </div>
                      {item.note && (
                        <p className="text-xs text-ink-700">{item.note}</p>
                      )}
                      <p className="font-mono text-[11px] text-ink-400">
                        记录时间：{dateDisplay}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-ink-900/15 px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-cream-200"
                      >
                        <span>打开 GitHub PR</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => removePr(item.id)}
                        aria-label={`删除 ${item.repoFullName}#${item.prNumber}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink-900/10 text-ink-400 transition hover:border-seal-600 hover:text-seal-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {cardConfig && (
        <CardStudioModal
          open={Boolean(cardConfig)}
          onClose={() => setCardConfig(null)}
          title="生成 2,000 PR 挑战卡 · Unofficial Fan Challenge"
          filename={`potetofans-pr-challenge-${selectedMonth}-${count}.png`}
          config={cardConfig}
          xShareText={`${monthLabel.en} · ${count} / ${goal} PRs · Unofficial Fan Challenge! 受 @poteto 演讲启发记录自己的公开 GitHub PR（via potetofans 非官方粉丝站）`}
        />
      )}
    </div>
  );
}
