"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Download,
  ExternalLink,
  Info,
  Sparkles,
  X,
} from "lucide-react";
import {
  PERSON_INFO,
  PHOTOS,
  PhotoItem,
  SITE_INFO,
} from "@/data/site-data";
import { CardStudioModal } from "@/components/CardStudioModal";
import { CardRenderConfig } from "@/lib/card-canvas";

type GalleryFilter = "all" | "portrait" | "avatar" | "moment";

export default function GalleryPage() {
  const [filter, setFilter] = useState<GalleryFilter>("all");
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);
  const [cardConfig, setCardConfig] = useState<CardRenderConfig | null>(null);

  const portraitPhotos = PHOTOS.filter((p) => p.gallerySection === "portrait");
  const avatarPhotos = PHOTOS.filter((p) => p.gallerySection === "avatar");
  const momentPhotos = PHOTOS.filter((p) => p.gallerySection === "moment");

  const openFanCardForPhoto = (photo: PhotoItem) => {
    setCardConfig({
      kind: "fan",
      theme: "stage",
      badgeText: `DIGITAL FAN CARD · ${photo.displayBadge}`,
      headline: `土豆女神 · @${PERSON_INFO.xUsername}`,
      bodyText: `${photo.captionZh}。来源：${photo.sourceLabel}。为认真写代码、在舞台闪闪发光的 @poteto 打 Call！`,
      subline: `素材出处：${photo.sourcePage}`,
      imageUrl: photo.src,
      imageNote: `${photo.displayBadge} · ${photo.sourceLabel}`,
      footerStamp: "UNOFFICIAL FAN CARD · 非官方粉丝应援卡",
    });
  };

  const renderCard = (photo: PhotoItem) => {
    const badgeColor =
      photo.gallerySection === "portrait"
        ? "border-amberpoteto-600/35 bg-amberpoteto-500/15 text-amberpoteto-600"
        : photo.gallerySection === "avatar"
        ? "border-sky-700/30 bg-sky-500/10 text-sky-800"
        : "border-ink-900/20 bg-cream-200 text-ink-700";

    return (
      <article
        key={photo.id}
        className="group flex flex-col overflow-hidden rounded-3xl border border-ink-900/10 bg-white shadow-sm transition hover:border-amberpoteto-500/60 hover:shadow-md"
      >
        <button
          type="button"
          onClick={() => setLightboxPhoto(photo)}
          className="relative block w-full overflow-hidden bg-stage-900 text-left focus:outline-none"
        >
          <div className="aspect-[4/3] w-full overflow-hidden">
            <img
              src={photo.src}
              alt={`${photo.captionZh}（${photo.displayBadge}）`}
              className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-stage-950/85 px-3 py-1 font-mono text-[11px] font-semibold text-cream-50 backdrop-blur-sm">
            {photo.displayBadge}
          </span>
        </button>

        <div className="flex flex-1 flex-col justify-between p-5">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badgeColor}`}
              >
                {photo.displayBadge}
              </span>
              <span className="font-mono text-[11px] text-ink-400">
                非 AI 生成
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-ink-900">
              {photo.captionZh}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-ink-500">
              出处说明：{photo.sourceLabel}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-ink-900/10 pt-3.5">
            <a
              href={photo.sourcePage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-ink-700 underline decoration-ink-900/25 underline-offset-4 hover:text-amberpoteto-600"
            >
              <span>核验原始出处</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openFanCardForPhoto(photo)}
                className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-3 py-1.5 text-xs font-medium text-ink-900 transition hover:bg-stage-900 hover:text-cream-50"
              >
                <Sparkles className="h-3 w-3" />
                <span>制应援卡</span>
              </button>
              <button
                type="button"
                onClick={() => setLightboxPhoto(photo)}
                className="rounded-full border border-ink-900/15 px-3 py-1.5 text-xs font-medium text-ink-700 transition hover:bg-cream-100"
              >
                看大图
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-ink-900/15 pb-8">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-amberpoteto-600">
          GALLERY ARCHIVE · 公开素材归档
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-ink-900 sm:text-5xl">
          美照馆
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-500 sm:text-base">
          所有展示图片均来自可核验的公开页面并附带原始出处链接。我们坚持诚实标注：官网演讲照标注为
          <strong className="font-semibold text-ink-900">「公开照片」</strong>，X
          头像标注为
          <strong className="font-semibold text-ink-900">
            「官方头像（插画，非实拍）」
          </strong>
          ，车辆 / 鞋子 / 横幅猫明确归类为
          <strong className="font-semibold text-ink-900">
            「公开动态，非人像」
          </strong>
          ，绝不混充人像精选，也绝不用 AI 伪造她的仿真人脸照片填数。
        </p>

        {/* Filter Pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { id: "all", label: `全部公开素材 (${PHOTOS.length})` },
            {
              id: "portrait",
              label: `公开照片与舞台 (${portraitPhotos.length})`,
            },
            {
              id: "avatar",
              label: `官方头像插画 (${avatarPhotos.length})`,
            },
            {
              id: "moment",
              label: `公开动态，非人像 (${momentPhotos.length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as GalleryFilter)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition sm:text-sm ${
                filter === tab.id
                  ? "bg-stage-900 text-cream-50"
                  : "border border-ink-900/15 bg-white text-ink-700 hover:bg-cream-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section A: Public Portraits & Stage */}
      {(filter === "all" || filter === "portrait") && (
        <section className="mt-10">
          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink-900">
                01 · 公开人像与演讲舞台
              </h2>
              <p className="text-xs text-ink-500">
                目前公开可核验的人像素材较少，我们宁缺毋滥，绝不使用 AI 生成假人脸写真来凑数。
              </p>
            </div>
            <a
              href={SITE_INFO.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-amberpoteto-600 hover:underline"
            >
              <span>欢迎提 PR 补充更多公开演讲实拍</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {portraitPhotos.map(renderCard)}
          </div>
        </section>
      )}

      {/* Section B: Official Avatar Illustration */}
      {(filter === "all" || filter === "avatar") && (
        <section className="mt-14">
          <div className="mb-5">
            <h2 className="font-serif text-2xl font-bold text-ink-900">
              02 · 官方头像（插画，非实拍）
            </h2>
            <p className="text-xs text-ink-500">
              @{PERSON_INFO.xUsername} 当前 X 主页公开使用的可爱烤红薯/土豆插画头像。
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {avatarPhotos.map(renderCard)}
          </div>
        </section>
      )}

      {/* Section C: Public Moments (Not Portraits) */}
      {(filter === "all" || filter === "moment") && (
        <section className="mt-14">
          <div className="mb-5 rounded-2xl border border-ink-900/10 bg-cream-200/70 p-4">
            <div className="flex items-start gap-2.5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amberpoteto-600" />
              <div>
                <h2 className="font-serif text-xl font-bold text-ink-900">
                  03 · 公开动态记录（非人像）
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-ink-700">
                  以下图片为她本人在 X 公开分享的生活/活动动态与主页横幅（Cybercab
                  车辆、AIE 演讲日 Crocs 鞋子特写、门铃猫横幅），单独陈列并统一标注「公开动态，非人像」，绝不当成人像写真展示。
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {momentPhotos.map(renderCard)}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stage-950/88 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/15 bg-stage-900 p-4 text-cream-50 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-amberpoteto-500/20 px-3 py-1 font-mono text-xs font-semibold text-amberpoteto-400">
                  {lightboxPhoto.displayBadge}
                </span>
                <span className="text-sm font-medium text-cream-100">
                  {lightboxPhoto.captionZh}
                </span>
              </div>
              <button
                type="button"
                aria-label="关闭灯箱"
                onClick={() => setLightboxPhoto(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-cream-100 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex max-h-[62vh] items-center justify-center overflow-hidden rounded-2xl bg-black/50">
              <img
                src={lightboxPhoto.src}
                alt={lightboxPhoto.captionZh}
                className="max-h-[62vh] w-auto object-contain"
              />
            </div>

            <div className="mt-4 flex flex-col justify-between gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
              <div className="text-xs text-cream-300/80">
                <p>来源说明：{lightboxPhoto.sourceLabel}</p>
                <a
                  href={lightboxPhoto.sourcePage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-amberpoteto-400 hover:underline"
                >
                  <span>{lightboxPhoto.sourcePage}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={lightboxPhoto.src}
                  download
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-cream-50 hover:bg-white/10"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>保存原图</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const target = lightboxPhoto;
                    setLightboxPhoto(null);
                    openFanCardForPhoto(target);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amberpoteto-500 px-4 py-2 text-xs font-semibold text-stage-950 hover:bg-amberpoteto-400"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>用此图制作应援卡 PNG</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card Studio Modal */}
      {cardConfig && (
        <CardStudioModal
          open={Boolean(cardConfig)}
          onClose={() => setCardConfig(null)}
          title="制作数字应援卡"
          filename="potetofans-fan-card.png"
          config={cardConfig}
        />
      )}
    </div>
  );
}
