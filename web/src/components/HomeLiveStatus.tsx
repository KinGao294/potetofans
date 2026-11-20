"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Flame } from "lucide-react";
import { ARTICLES, CHALLENGE_INFO, TALKS } from "@/data/site-data";
import {
  formatMonthLabel,
  getCurrentMonthKey,
  usePrChallenge,
  useStudyCheckin,
} from "@/lib/storage";

export function HomeLiveStatus() {
  const { state: studyState, hydrated: studyHydrated } = useStudyCheckin();
  const { items: prItems, hydrated: prHydrated } = usePrChallenge();

  const totalStudyItems = TALKS.length + ARTICLES.length;
  const completedStudyCount = Object.keys(studyState.checkedInMap).length;
  const currentMonth = getCurrentMonthKey();
  const monthPrCount = prItems.filter((p) => p.monthKey === currentMonth).length;
  const monthLabel = formatMonthLabel(currentMonth);

  return (
    <section className="border-b border-ink-900/10 bg-cream-50">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 md:grid-cols-2 lg:px-8">
        {/* Study Check-in Strip */}
        <Link
          href="/checkin"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-ink-900/10 bg-white p-4 transition hover:border-amberpoteto-500/60 hover:shadow-sm sm:p-5"
        >
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream-200 text-amberpoteto-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-ink-500">
                本机学习打卡进度 · 免登录
              </p>
              <p className="mt-0.5 text-base font-semibold text-ink-900">
                {studyHydrated
                  ? `已完成 ${completedStudyCount} / ${totalStudyItems} 项公开演讲与文章`
                  : "正在读取本机打卡进度…"}
              </p>
              <p className="mt-0.5 text-xs text-ink-500">
                点击进入学习打卡区查看待学清单并导出学习打卡卡 PNG
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-ink-400 transition group-hover:translate-x-1 group-hover:text-amberpoteto-600" />
        </Link>

        {/* 2000 PR Challenge Strip */}
        <Link
          href="/challenge"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-stage-900/15 bg-stage-900 p-4 text-cream-50 transition hover:border-amberpoteto-400/70 sm:p-5"
        >
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amberpoteto-500/20 text-amberpoteto-400">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-amberpoteto-400">
                非官方粉丝挑战 · {monthLabel.zh}
              </p>
              <p className="mt-0.5 font-mono text-base font-bold text-cream-50">
                {prHydrated
                  ? `本月已记录 ${monthPrCount.toLocaleString()} / ${CHALLENGE_INFO.monthlyGoal.toLocaleString()} PRs`
                  : "正在读取本机 PR 记录…"}
              </p>
              <p className="mt-0.5 text-xs text-cream-300/80">
                提交公开 GitHub PR 链接，生成 Unofficial Fan Challenge 挑战卡
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-amberpoteto-400 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
