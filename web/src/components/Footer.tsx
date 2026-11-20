import Link from "next/link";
import { ArrowUpRight, Github, ShieldAlert } from "lucide-react";
import { PERSON_INFO, SITE_INFO } from "@/data/site-data";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-stage-950 text-cream-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Prominent Unofficial Declaration */}
        <div className="mb-10 rounded-2xl border border-amberpoteto-400/30 bg-stage-900/90 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-amberpoteto-400/40 bg-amberpoteto-500/15 px-3 py-1 font-mono text-xs font-semibold tracking-wide text-amberpoteto-400">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Unofficial Fan Site / 非官方粉丝站</span>
              </div>
              <p className="max-w-3xl text-sm leading-relaxed text-cream-200/90">
                <strong className="font-semibold text-cream-50">
                  {SITE_INFO.name}
                </strong>{" "}
                是由粉丝自发建设的非官方应援站，并非官方网站，与{" "}
                <a
                  href={PERSON_INFO.xUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-amberpoteto-400/60 underline-offset-4 hover:text-amberpoteto-400"
                >
                  @{PERSON_INFO.xUsername}
                </a>{" "}
                本人及其就职或关联机构无任何官方隶属、商业合作或背书关系。
              </p>
              <p className="font-mono text-xs text-cream-300/75">
                Unofficial Fan Tribute Site. Not affiliated with or endorsed by
                @poteto or any associated organization.
              </p>
            </div>

            <a
              href={PERSON_INFO.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-amberpoteto-500 px-5 py-2.5 text-sm font-semibold text-stage-950 transition hover:bg-amberpoteto-400"
            >
              <span>访问 @poteto 官方 X 主页</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {/* Column 1: Sources */}
          <div className="space-y-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-amberpoteto-400">
              内容来源说明 · Credits
            </h2>
            <p className="text-sm leading-relaxed text-cream-200/80">
              站内人物简介仅引用{" "}
              <a
                href={PERSON_INFO.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-cream-50"
              >
                X 公开主页
              </a>{" "}
              可核对信息；公开图片均标注来源页面与真实类型（含插画及非人像动态）；演讲采用
              YouTube 官方嵌入；文章仅提供中文短导读与原文直链，不转载正文。
            </p>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="space-y-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-amberpoteto-400">
              站点导览 · Directory
            </h2>
            <div className="grid grid-cols-2 gap-2 text-sm text-cream-200/85">
              <Link href="/gallery" className="hover:text-amberpoteto-400">
                美照馆
              </Link>
              <Link href="/talks" className="hover:text-amberpoteto-400">
                演讲与视频打卡
              </Link>
              <Link href="/articles" className="hover:text-amberpoteto-400">
                文章导读与打卡
              </Link>
              <Link href="/checkin" className="hover:text-amberpoteto-400">
                学习打卡区
              </Link>
              <Link href="/challenge" className="hover:text-amberpoteto-400">
                2000 PR 挑战区
              </Link>
              <Link href="/cheer" className="hover:text-amberpoteto-400">
                应援墙
              </Link>
              <Link href="/about" className="hover:text-amberpoteto-400">
                关于与撤下通道
              </Link>
              <a
                href={PERSON_INFO.officialBlog}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-amberpoteto-400"
              >
                <span>no.lol 官方博客</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Column 3: Repo & Takedown */}
          <div className="space-y-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-amberpoteto-400">
              开源共建与尊重意愿 · Open Source
            </h2>
            <p className="text-sm leading-relaxed text-cream-200/80">
              打卡进度、PR 挑战记录与待审留言草稿均只保存在访客本地浏览器
              <code className="mx-1 rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs">
                localStorage
              </code>
              ，免登录、零云端隐私采集。如本人希望修改或下架任何内容，维护者将第一时间配合处理。
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={SITE_INFO.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-medium text-cream-50 transition hover:border-amberpoteto-400 hover:text-amberpoteto-400"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub 仓库</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
              <Link
                href="/about#takedown"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-medium text-cream-50 transition hover:border-amberpoteto-400 hover:text-amberpoteto-400"
              >
                <span>纠错与撤下通道</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-cream-300/70 sm:flex-row sm:items-center">
          <p>
            © 2026 {SITE_INFO.name} · Unofficial Fan Site for @
            {PERSON_INFO.xUsername}（{PERSON_INFO.communityNicknameZh}）
          </p>
          <p className="font-mono">
            {SITE_INFO.domainStatus} · Pure Frontend Local-First
          </p>
        </div>
      </div>
    </footer>
  );
}
