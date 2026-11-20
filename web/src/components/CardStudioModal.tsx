"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Download, Sparkles, X } from "lucide-react";
import {
  CardRenderConfig,
  CardTheme,
  downloadCanvasPng,
  renderCardToCanvas,
} from "@/lib/card-canvas";

interface CardStudioModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  filename: string;
  config: CardRenderConfig;
  xShareText?: string;
  allowNicknameEdit?: boolean;
  allowThemeToggle?: boolean;
}

export function CardStudioModal({
  open,
  onClose,
  title,
  filename,
  config,
  xShareText,
  allowNicknameEdit = true,
  allowThemeToggle = true,
}: CardStudioModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<CardTheme>(config.theme);
  const [nickname, setNickname] = useState(config.nickname || "");
  const [rendering, setRendering] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTheme(config.theme);
    setNickname(config.nickname || "");
  }, [config.theme, config.nickname, open]);

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    let active = true;
    setRendering(true);
    renderCardToCanvas(canvasRef.current, {
      ...config,
      theme,
      nickname: nickname.trim() || undefined,
    }).finally(() => {
      if (active) setRendering(false);
    });
    return () => {
      active = false;
    };
  }, [open, config, theme, nickname]);

  if (!open) return null;

  const shareText =
    xShareText ||
    `${config.headline} — via potetofans (Unofficial Fan Site for @poteto)`;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    downloadCanvasPng(canvasRef.current, filename);
  };

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failures
    }
  };

  const xIntentUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stage-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-ink-900/15 bg-cream-50 p-5 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-ink-900/10 pb-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-amberpoteto-600" />
            <div>
              <h3 className="font-serif text-lg font-bold text-ink-900 sm:text-xl">
                {title}
              </h3>
              <p className="text-xs text-ink-500">
                纯浏览器本地 Canvas 高清渲染（960×1200 PNG），不上传任何文字至服务器
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭制卡窗口"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/15 text-ink-700 transition hover:bg-cream-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.15fr_1fr]">
          {/* Preview Canvas */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-ink-900/10 bg-cream-200/70 p-4">
            <div className="relative w-full max-w-[360px] overflow-hidden rounded-xl shadow-lg">
              <canvas
                ref={canvasRef}
                className="h-auto w-full block"
              />
              {rendering && (
                <div className="absolute inset-0 flex items-center justify-center bg-stage-950/40 text-xs font-medium text-cream-50">
                  渲染中…
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              {allowThemeToggle && (
                <div>
                  <label className="mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-ink-500">
                    卡片配色主题
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTheme("stage")}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                        theme === "stage"
                          ? "border-stage-900 bg-stage-900 text-cream-50"
                          : "border-ink-900/15 bg-white text-ink-700 hover:bg-cream-100"
                      }`}
                    >
                      深色舞台黑
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme("cream")}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                        theme === "cream"
                          ? "border-amberpoteto-600 bg-cream-200 text-ink-900"
                          : "border-ink-900/15 bg-white text-ink-700 hover:bg-cream-100"
                      }`}
                    >
                      奶油画报白
                    </button>
                  </div>
                </div>
              )}

              {allowNicknameEdit && (
                <div>
                  <label
                    htmlFor="card-nickname"
                    className="mb-1.5 block font-mono text-xs font-semibold uppercase tracking-wider text-ink-500"
                  >
                    署名昵称（选填，≤ 20 字）
                  </label>
                  <input
                    id="card-nickname"
                    type="text"
                    maxLength={20}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="例如：爱写代码的小土豆"
                    className="w-full rounded-xl border border-ink-900/15 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-amberpoteto-600 focus:outline-none"
                  />
                </div>
              )}

              <div className="rounded-xl border border-amberpoteto-600/25 bg-amberpoteto-500/10 p-3.5 text-xs leading-relaxed text-ink-700">
                <strong className="font-semibold text-ink-900">
                  非官方标识声明：
                </strong>
                导出图片底部将自动保留{" "}
                <span className="font-mono font-semibold text-amberpoteto-600">
                  {config.footerStamp}
                </span>{" "}
                标识，纯属粉丝自发纪念与分享，非官方认证证书。
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleDownload}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-stage-900 px-5 py-3 text-sm font-semibold text-cream-50 transition hover:bg-amberpoteto-600"
              >
                <Download className="h-4 w-4" />
                <span>下载高清 PNG 图片</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyShare}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ink-900/15 bg-white px-4 py-2.5 text-xs font-medium text-ink-900 transition hover:bg-cream-200"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-700" />
                      <span>已复制文案</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>复制分享文案</span>
                    </>
                  )}
                </button>
                <a
                  href={xIntentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ink-900/15 bg-white px-4 py-2.5 text-xs font-medium text-ink-900 transition hover:bg-cream-200"
                >
                  <span>去 X 发帖</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
