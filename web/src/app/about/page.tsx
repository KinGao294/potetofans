"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Database,
  FileCheck2,
  Github,
  Scale,
  ShieldAlert,
  Trash2,
  UserCheck,
} from "lucide-react";
import { PERSON_INFO, SITE_INFO } from "@/data/site-data";
import {
  CHALLENGE_STORAGE_KEY,
  CHEER_STORAGE_KEY,
  STUDY_STORAGE_KEY,
} from "@/lib/storage";

export default function AboutPage() {
  const [clearedMsg, setClearedMsg] = useState<string | null>(null);

  const handleClearAllLocalData = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STUDY_STORAGE_KEY);
    window.localStorage.removeItem(CHALLENGE_STORAGE_KEY);
    window.localStorage.removeItem(CHEER_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("potetofans-study-updated"));
    window.dispatchEvent(new CustomEvent("potetofans-pr-updated"));
    window.dispatchEvent(new CustomEvent("potetofans-cheer-updated"));
    setClearedMsg("已清除本机浏览器中保存的全部打卡、PR 挑战与待审留言记录。");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-ink-900/15 pb-8">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-amberpoteto-600">
          ABOUT & COMPLIANCE · 关于本站与合规声明
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-ink-900 sm:text-5xl">
          关于 potetofans
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-500 sm:text-base">
          清晰交代非官方边界、可核对公开事实来源、本地存储隐私说明以及尊重本人意愿的修改/撤下通道。
        </p>
      </div>

      {/* 1. Unofficial Statement */}
      <section className="mt-10 rounded-3xl border border-amberpoteto-600/35 bg-stage-900 p-6 text-cream-50 sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amberpoteto-400/45 bg-amberpoteto-500/15 px-3.5 py-1 font-mono text-xs font-semibold text-amberpoteto-400">
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Unofficial Fan Site · 非官方粉丝站声明</span>
        </div>
        <h2 className="mt-4 font-serif text-2xl font-bold">
          本站由粉丝自发建设，绝非官方网站
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-cream-200/85">
          <p>
            <strong>{SITE_INFO.name}</strong> 是为 X 平台账号{" "}
            <a
              href={PERSON_INFO.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amberpoteto-400 underline underline-offset-4"
            >
              @{PERSON_INFO.xUsername}
            </a>
            （中文社区昵称：「{PERSON_INFO.communityNicknameZh}」）打 Call
            的民间非营利粉丝应援站。本站与 @{PERSON_INFO.xUsername}{" "}
            本人、SpaceX Super Intelligence（SpaceXSI）、Grok Bot
            或任何提及机构之间均无官方隶属、授权、商业合作或背书关系。
          </p>
          <p className="font-mono text-xs text-cream-300/75">
            potetofans is an independent, non-commercial, unofficial fan tribute
            site. All check-in cards and the 2,000 PR monthly challenge are
            fan-initiated and are not official certificates, official events, or
            official KPIs.
          </p>
        </div>
      </section>

      {/* 2. Verifiable Public Facts Only */}
      <section className="mt-10 rounded-3xl border border-ink-900/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-amberpoteto-600">
          <UserCheck className="h-4 w-4" />
          <span>VERIFIABLE FACTS ONLY · 仅收录可核对公开信息</span>
        </div>
        <h2 className="mt-2 font-serif text-2xl font-bold text-ink-900">
          关于 @{PERSON_INFO.xUsername} 的公开事实基线
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-ink-500">
          本站绝不编造未经核实的个人履历、出生信息或私人背景。下列每一项均直接对应公开主页与官方演讲页可核对内容：
        </p>

        <dl className="mt-6 divide-y divide-ink-900/10 text-sm">
          <div className="grid gap-1 py-3.5 sm:grid-cols-[200px_1fr]">
            <dt className="font-mono text-xs font-semibold text-ink-500">
              官方 X 账号
            </dt>
            <dd>
              <a
                href={PERSON_INFO.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-ink-900 underline decoration-amberpoteto-500/60 underline-offset-4 hover:text-amberpoteto-600"
              >
                <span>
                  @{PERSON_INFO.xUsername}（显示名：{PERSON_INFO.xDisplayName}）
                </span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <span className="ml-2 text-xs text-ink-400">
                （账号注册于 {PERSON_INFO.xCreatedAt}）
              </span>
            </dd>
          </div>

          <div className="grid gap-1 py-3.5 sm:grid-cols-[200px_1fr]">
            <dt className="font-mono text-xs font-semibold text-ink-500">
              公开署名与昵称
            </dt>
            <dd className="text-ink-900">
              官方博客与演讲署名：{PERSON_INFO.officialBlogName}（AI Engineer
              官方演讲页与 YouTube 署名：{PERSON_INFO.officialTalkCredit}
              ）；中文社区昵称：「{PERSON_INFO.communityNicknameZh}」
            </dd>
          </div>

          <div className="grid gap-1 py-3.5 sm:grid-cols-[200px_1fr]">
            <dt className="font-mono text-xs font-semibold text-ink-500">
              X 公开 Bio（{PERSON_INFO.currentXBioAsOf}）
            </dt>
            <dd className="space-y-1.5">
              <p className="font-mono text-xs text-ink-900 sm:text-sm">
                “{PERSON_INFO.currentXBio}”
              </p>
              <p className="text-xs text-ink-500">
                X 关联标识：{PERSON_INFO.xAffiliationBadge}
              </p>
            </dd>
          </div>

          <div className="grid gap-1 py-3.5 sm:grid-cols-[200px_1fr]">
            <dt className="font-mono text-xs font-semibold text-ink-500">
              官方个人博客与演讲页
            </dt>
            <dd className="flex flex-wrap gap-4">
              <a
                href={PERSON_INFO.officialBlog}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-amberpoteto-600 hover:underline"
              >
                <span>no.lol 官方博客</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={PERSON_INFO.officialSpeaking}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-amberpoteto-600 hover:underline"
              >
                <span>no.lol/speaking</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href={PERSON_INFO.speakerdeck}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-amberpoteto-600 hover:underline"
              >
                <span>Speaker Deck</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </dd>
          </div>

          <div className="grid gap-1 py-3.5 sm:grid-cols-[200px_1fr]">
            <dt className="font-mono text-xs font-semibold text-ink-500">
              历史文案区分说明
            </dt>
            <dd className="text-xs leading-relaxed text-ink-600">
              {PERSON_INFO.historicalNoteZh}
            </dd>
          </div>
        </dl>
      </section>

      {/* 3. Content & Copyright Principles */}
      <section className="mt-8 rounded-3xl border border-ink-900/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-amberpoteto-600">
          <FileCheck2 className="h-4 w-4" />
          <span>CONTENT INTEGRITY · 内容与版权合规准则</span>
        </div>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700">
          <li>
            <strong>1. 图片真实分类：</strong>
            官网博客演讲照标明「公开照片」，X 头像标明「官方头像（插画，非实拍）」，Cybercab
            / Crocs / 门铃猫横幅标明「公开动态，非人像」。绝不用 AI
            生成她的仿真人脸照片来充数。
          </li>
          <li>
            <strong>2. 视频官方嵌入：</strong>
            演讲视频仅使用 YouTube 官方 iframe
            嵌入并提供原视频、官方演讲页与本人 X 帖链接，绝不重托管视频源文件，亦不虚构历史视频嵌入。
          </li>
          <li>
            <strong>3. 文章仅做短导读：</strong>
            每篇文章仅提供 80–150
            字中文导读并导流回她的原发布页（X 或 no.lol），绝不转载全文、绝不链向第三方全文抄袭站。尚未核对精确单页链接的博客文章先链回{" "}
            <code className="rounded bg-cream-200 px-1 py-0.5 font-mono text-xs">
              https://www.no.lol/
            </code>{" "}
            并公开标注待补全。
          </li>
          <li>
            <strong>4. 无商业化与无假官方：</strong>
            一期不做付费会员、不做周边商店、不做官方证书、不做公开刷榜、不做无审核留言墙。
          </li>
        </ul>
      </section>

      {/* 4. LocalStorage Privacy */}
      <section className="mt-8 rounded-3xl border border-ink-900/10 bg-cream-50 p-6 sm:p-8">
        <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-amberpoteto-600">
          <Database className="h-4 w-4" />
          <span>LOCAL-FIRST PRIVACY · 本地存储与隐私说明</span>
        </div>
        <h2 className="mt-2 font-serif text-2xl font-bold text-ink-900">
          打卡、PR 记录与留言草稿仅存于你的浏览器
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">
          第一期全站采用纯前端本地优先设计，无需注册账号、无需登录、无后端数据库采集个人隐私。你的视频/文章学习打卡进度（
          <code className="rounded bg-cream-200 px-1.5 py-0.5 font-mono text-xs">
            {STUDY_STORAGE_KEY}
          </code>
          ）、每月 2,000 PR 挑战提交列表（
          <code className="rounded bg-cream-200 px-1.5 py-0.5 font-mono text-xs">
            {CHALLENGE_STORAGE_KEY}
          </code>
          ）以及应援墙待审草稿（
          <code className="rounded bg-cream-200 px-1.5 py-0.5 font-mono text-xs">
            {CHEER_STORAGE_KEY}
          </code>
          ）均仅存储在你当前浏览器的{" "}
          <code className="rounded bg-cream-200 px-1.5 py-0.5 font-mono text-xs">
            localStorage
          </code>{" "}
          中。你可随时通过各页面的 JSON 备份功能导出，或点击下方按钮一键清除。
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleClearAllLocalData}
            className="inline-flex items-center gap-1.5 rounded-full border border-seal-600/35 bg-white px-4 py-2 text-xs font-semibold text-seal-700 transition hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>一键清除本机全部本地存储数据</span>
          </button>
          {clearedMsg && (
            <span className="text-xs font-medium text-emerald-800">
              {clearedMsg}
            </span>
          )}
        </div>
      </section>

      {/* 5. Takedown Policy */}
      <section
        id="takedown"
        className="mt-8 rounded-3xl border border-ink-900/15 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-amberpoteto-600">
          <Scale className="h-4 w-4" />
          <span>TAKEDOWN & CORRECTION · 尊重本人意愿与撤下通道</span>
        </div>
        <h2 className="mt-2 font-serif text-2xl font-bold text-ink-900">
          修改、纠错与无条件下架通道
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">
          本站一切内容均以尊重 @{PERSON_INFO.xUsername} 本人为最高前提。如 @
          {PERSON_INFO.xUsername}{" "}
          本人或相关权利人对站内任何图片展示、短导读表述、外链信息或功能模块有修改、隐藏或整体下架的意愿，请随时通过开源仓库
          GitHub Issue 告知，维护者将在第一时间无条件配合更新或下架。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={SITE_INFO.repoIssues}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-stage-900 px-5 py-2.5 text-xs font-semibold text-cream-50 transition hover:bg-amberpoteto-600 sm:text-sm"
          >
            <Github className="h-4 w-4" />
            <span>提交纠错 / 撤下请求（GitHub Issues）</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href={SITE_INFO.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/15 px-5 py-2.5 text-xs font-medium text-ink-900 transition hover:bg-cream-200 sm:text-sm"
          >
            <span>查看项目源码仓库</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
