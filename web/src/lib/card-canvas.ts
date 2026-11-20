export type CardTheme = "stage" | "cream";

export type CardKind =
  | "fan"
  | "quote"
  | "video-checkin"
  | "article-checkin"
  | "study-checkin"
  | "challenge"
  | "cheer";

export interface CardRenderConfig {
  kind: CardKind;
  theme: CardTheme;
  badgeText: string;
  headline: string;
  bodyText: string;
  subline?: string;
  nickname?: string;
  dateLabel?: string;
  imageUrl?: string;
  imageNote?: string;
  progressCurrent?: number;
  progressGoal?: number;
  extraLines?: string[];
  footerStamp: string;
}

const CANVAS_W = 960;
const CANVAS_H = 1200;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const paragraphs = text.split(/\n/);
  const lines: string[] = [];

  for (const para of paragraphs) {
    let current = "";
    for (const char of Array.from(para)) {
      const test = current + char;
      if (ctx.measureText(test).width > maxWidth && current.length > 0) {
        lines.push(current);
        current = char;
        if (lines.length >= maxLines) break;
      } else {
        current = test;
      }
    }
    if (lines.length < maxLines && current) {
      lines.push(current);
    }
    if (lines.length >= maxLines) break;
  }

  if (lines.length === maxLines) {
    const last = lines[maxLines - 1];
    if (ctx.measureText(last).width > maxWidth - 24) {
      lines[maxLines - 1] = last.slice(0, Math.max(1, last.length - 1)) + "…";
    }
  }
  return lines;
}

export async function renderCardToCanvas(
  canvas: HTMLCanvasElement,
  config: CardRenderConfig
): Promise<void> {
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const isStage = config.theme === "stage";
  const bg = isStage ? "#101015" : "#FAF6EE";
  const panelBg = isStage ? "#181820" : "#FFFFFF";
  const borderCol = isStage ? "rgba(255,255,255,0.14)" : "rgba(26,23,21,0.14)";
  const primaryText = isStage ? "#FAF6EE" : "#1A1715";
  const secondaryText = isStage ? "#B8B0A6" : "#6F665E";
  const accent = isStage ? "#E8A95B" : "#B56A20";
  const stampColor = "#C23F3F";

  // 1. Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Subtle ambient editorial gradient
  const grad = ctx.createRadialGradient(
    CANVAS_W * 0.85,
    CANVAS_H * 0.12,
    40,
    CANVAS_W * 0.85,
    CANVAS_H * 0.12,
    560
  );
  grad.addColorStop(
    0,
    isStage ? "rgba(232,169,91,0.18)" : "rgba(212,136,54,0.14)"
  );
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Outer editorial hairline frame
  ctx.strokeStyle = borderCol;
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 40, 40, CANVAS_W - 80, CANVAS_H - 80, 24);
  ctx.stroke();

  // 2. Top Editorial Header Bar
  ctx.fillStyle = accent;
  ctx.font = "700 22px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText("POTETOFANS · @POTETO", 84, 108);

  const dateStr =
    config.dateLabel || new Date().toISOString().slice(0, 10);
  ctx.fillStyle = secondaryText;
  ctx.font = "500 20px ui-monospace, SFMono-Regular, Menlo, monospace";
  const dateWidth = ctx.measureText(dateStr).width;
  ctx.fillText(dateStr, CANVAS_W - 84 - dateWidth, 108);

  // Header divider
  ctx.strokeStyle = borderCol;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(84, 132);
  ctx.lineTo(CANVAS_W - 84, 132);
  ctx.stroke();

  // Pill Badge
  ctx.font = "700 20px 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif";
  const badgePaddingX = 22;
  const badgeW = ctx.measureText(config.badgeText).width + badgePaddingX * 2;
  drawRoundedRect(ctx, 84, 162, badgeW, 44, 22);
  ctx.fillStyle = isStage
    ? "rgba(232,169,91,0.18)"
    : "rgba(181,106,32,0.12)";
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.fillText(config.badgeText, 84 + badgePaddingX, 191);

  let cursorY = 264;

  // 3. Special Layout for PR Challenge Ring
  if (config.kind === "challenge" && typeof config.progressGoal === "number") {
    const current = config.progressCurrent || 0;
    const goal = config.progressGoal || 2000;
    const pct = Math.min(1, current / goal);

    // Headline
    ctx.fillStyle = primaryText;
    ctx.font = "700 46px Georgia, 'Noto Serif SC', serif";
    const headLines = wrapTextLines(ctx, config.headline, CANVAS_W - 168, 2);
    for (const line of headLines) {
      ctx.fillText(line, 84, cursorY);
      cursorY += 58;
    }

    // Center Progress Ring
    const cx = CANVAS_W / 2;
    const cy = cursorY + 190;
    const radius = 158;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = isStage
      ? "rgba(255,255,255,0.1)"
      : "rgba(26,23,21,0.1)";
    ctx.lineWidth = 22;
    ctx.stroke();

    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + Math.PI * 2 * Math.max(pct, current > 0 ? 0.015 : 0);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.strokeStyle = accent;
    ctx.lineCap = "round";
    ctx.lineWidth = 22;
    ctx.stroke();

    // Numbers inside ring
    ctx.fillStyle = primaryText;
    ctx.font = "700 72px ui-monospace, SFMono-Regular, Menlo, monospace";
    const numText = current.toLocaleString("en-US");
    const numW = ctx.measureText(numText).width;
    ctx.fillText(numText, cx - numW / 2, cy + 12);

    ctx.fillStyle = secondaryText;
    ctx.font = "600 24px ui-monospace, SFMono-Regular, Menlo, monospace";
    const goalText = `/ ${goal.toLocaleString("en-US")} PRs`;
    const goalW = ctx.measureText(goalText).width;
    ctx.fillText(goalText, cx - goalW / 2, cy + 54);

    ctx.fillStyle = accent;
    ctx.font = "700 22px ui-monospace, SFMono-Regular, Menlo, monospace";
    const pctText = `${((current / goal) * 100).toFixed(2)}%`;
    const pctW = ctx.measureText(pctText).width;
    ctx.fillText(pctText, cx - pctW / 2, cy + 92);

    cursorY = cy + radius + 56;
  } else {
    // Optional photo cover block
    if (config.imageUrl) {
      try {
        const img = await loadImage(config.imageUrl);
        const boxX = 84;
        const boxY = 232;
        const boxW = CANVAS_W - 168;
        const boxH = 380;

        ctx.save();
        drawRoundedRect(ctx, boxX, boxY, boxW, boxH, 18);
        ctx.clip();

        // Cover-fit crop
        const imgRatio = img.width / img.height;
        const boxRatio = boxW / boxH;
        let sx = 0;
        let sy = 0;
        let sw = img.width;
        let sh = img.height;
        if (imgRatio > boxRatio) {
          sw = img.height * boxRatio;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / boxRatio;
          sy = (img.height - sh) * 0.25; // favor upper framing for portraits
        }
        ctx.drawImage(img, sx, sy, sw, sh, boxX, boxY, boxW, boxH);

        // Soft bottom caption scrim
        const scrim = ctx.createLinearGradient(0, boxY + boxH - 90, 0, boxY + boxH);
        scrim.addColorStop(0, "rgba(0,0,0,0)");
        scrim.addColorStop(1, "rgba(0,0,0,0.68)");
        ctx.fillStyle = scrim;
        ctx.fillRect(boxX, boxY + boxH - 90, boxW, 90);

        if (config.imageNote) {
          ctx.fillStyle = "#FAF6EE";
          ctx.font =
            "500 18px 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif";
          ctx.fillText(config.imageNote, boxX + 20, boxY + boxH - 22);
        }
        ctx.restore();

        cursorY = boxY + boxH + 64;
      } catch {
        cursorY = 276;
      }
    }

    // Headline
    ctx.fillStyle = primaryText;
    ctx.font = "700 44px Georgia, 'Noto Serif SC', serif";
    const headLines = wrapTextLines(ctx, config.headline, CANVAS_W - 168, 3);
    for (const line of headLines) {
      ctx.fillText(line, 84, cursorY);
      cursorY += 56;
    }
    cursorY += 12;
  }

  // Study progress bar if study-checkin
  if (
    config.kind === "study-checkin" &&
    typeof config.progressGoal === "number"
  ) {
    const current = config.progressCurrent || 0;
    const goal = Math.max(1, config.progressGoal);
    const barX = 84;
    const barW = CANVAS_W - 168;
    const barH = 22;

    drawRoundedRect(ctx, barX, cursorY, barW, barH, 11);
    ctx.fillStyle = isStage
      ? "rgba(255,255,255,0.12)"
      : "rgba(26,23,21,0.1)";
    ctx.fill();

    const fillW = Math.max(20, (barW * current) / goal);
    drawRoundedRect(ctx, barX, cursorY, Math.min(barW, fillW), barH, 11);
    ctx.fillStyle = accent;
    ctx.fill();

    cursorY += 56;
  }

  // 4. Body Panel
  const panelTop = cursorY;
  const panelBottom = CANVAS_H - 196;
  const panelHeight = Math.max(150, panelBottom - panelTop);

  drawRoundedRect(ctx, 84, panelTop, CANVAS_W - 168, panelHeight, 18);
  ctx.fillStyle = panelBg;
  ctx.fill();
  ctx.strokeStyle = borderCol;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  let innerY = panelTop + 50;
  ctx.fillStyle = primaryText;
  ctx.font = "500 28px 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif";
  const bodyLines = wrapTextLines(ctx, config.bodyText, CANVAS_W - 232, 5);
  for (const line of bodyLines) {
    ctx.fillText(line, 116, innerY);
    innerY += 42;
  }

  if (config.extraLines && config.extraLines.length > 0) {
    innerY += 8;
    ctx.fillStyle = secondaryText;
    ctx.font = "500 21px 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif";
    for (const extra of config.extraLines.slice(0, 3)) {
      const wrapped = wrapTextLines(ctx, extra, CANVAS_W - 232, 1);
      if (wrapped[0]) {
        ctx.fillText(wrapped[0], 116, innerY);
        innerY += 32;
      }
    }
  }

  if (config.subline) {
    ctx.fillStyle = secondaryText;
    ctx.font = "500 20px 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif";
    ctx.fillText(config.subline, 116, panelBottom - 26);
  }

  // Stamp seal on right side of panel for check-in / challenge cards
  if (
    config.kind === "video-checkin" ||
    config.kind === "article-checkin" ||
    config.kind === "study-checkin" ||
    config.kind === "challenge"
  ) {
    ctx.save();
    ctx.translate(CANVAS_W - 180, panelTop + 62);
    ctx.rotate(-0.14);
    drawRoundedRect(ctx, -84, -26, 168, 52, 8);
    ctx.strokeStyle = stampColor;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = stampColor;
    ctx.font = "800 18px ui-monospace, SFMono-Regular, Menlo, monospace";
    const stampTxt =
      config.kind === "challenge" ? "PR CHALLENGE" : "CHECKED IN";
    const sw = ctx.measureText(stampTxt).width;
    ctx.fillText(stampTxt, -sw / 2, 7);
    ctx.restore();
  }

  // 5. Mandatory Unofficial Footer Bar (baked into pixels, cannot be removed)
  const footerY = CANVAS_H - 150;
  ctx.strokeStyle = borderCol;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(84, footerY);
  ctx.lineTo(CANVAS_W - 84, footerY);
  ctx.stroke();

  if (config.nickname) {
    ctx.fillStyle = primaryText;
    ctx.font = "600 22px 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif";
    ctx.fillText(`FROM · ${config.nickname}`, 84, footerY + 42);
  } else {
    ctx.fillStyle = primaryText;
    ctx.font = "600 22px 'PingFang SC', 'Noto Sans SC', system-ui, sans-serif";
    ctx.fillText("土豆女神 · @poteto · https://x.com/poteto", 84, footerY + 42);
  }

  ctx.fillStyle = accent;
  ctx.font = "700 20px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(config.footerStamp, 84, footerY + 82);
}

export function downloadCanvasPng(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
