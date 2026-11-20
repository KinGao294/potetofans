"use client";

import { useCallback, useEffect, useState } from "react";

// ============================================================
// 1. Study Check-in State (localStorage only, zero login)
// ============================================================

export interface UnlockRecord {
  type: "video" | "article";
  unlockedAt: string;
  trigger: "embed_play" | "outbound_click";
}

export interface CheckinRecord {
  type: "video" | "article";
  checkedInAt: string;
  personalNote?: string;
  nickname?: string;
}

export interface StudyProgressState {
  schemaVersion: 1;
  unlockedMap: Record<string, UnlockRecord>;
  checkedInMap: Record<string, CheckinRecord>;
}

export const STUDY_STORAGE_KEY = "potetofans_study_progress_v1";

const DEFAULT_STUDY_STATE: StudyProgressState = {
  schemaVersion: 1,
  unlockedMap: {},
  checkedInMap: {},
};

function readStudyStorage(): StudyProgressState {
  if (typeof window === "undefined") return DEFAULT_STUDY_STATE;
  try {
    const raw = window.localStorage.getItem(STUDY_STORAGE_KEY);
    if (!raw) return DEFAULT_STUDY_STATE;
    const parsed = JSON.parse(raw) as Partial<StudyProgressState>;
    return {
      schemaVersion: 1,
      unlockedMap:
        parsed.unlockedMap && typeof parsed.unlockedMap === "object"
          ? parsed.unlockedMap
          : {},
      checkedInMap:
        parsed.checkedInMap && typeof parsed.checkedInMap === "object"
          ? parsed.checkedInMap
          : {},
    };
  } catch {
    return DEFAULT_STUDY_STATE;
  }
}

function writeStudyStorage(state: StudyProgressState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STUDY_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("potetofans-study-updated"));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function useStudyCheckin() {
  const [state, setState] = useState<StudyProgressState>(DEFAULT_STUDY_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readStudyStorage());
    setHydrated(true);

    const onSync = () => setState(readStudyStorage());
    window.addEventListener("storage", onSync);
    window.addEventListener("potetofans-study-updated", onSync);
    return () => {
      window.removeEventListener("storage", onSync);
      window.removeEventListener("potetofans-study-updated", onSync);
    };
  }, []);

  const unlockItem = useCallback(
    (
      itemId: string,
      type: "video" | "article",
      trigger: "embed_play" | "outbound_click"
    ) => {
      const current = readStudyStorage();
      if (current.unlockedMap[itemId]) return;
      const next: StudyProgressState = {
        ...current,
        unlockedMap: {
          ...current.unlockedMap,
          [itemId]: {
            type,
            unlockedAt: new Date().toISOString(),
            trigger,
          },
        },
      };
      writeStudyStorage(next);
      setState(next);
    },
    []
  );

  const checkInItem = useCallback(
    (
      itemId: string,
      type: "video" | "article",
      options?: { personalNote?: string; nickname?: string }
    ): { ok: boolean; error?: string } => {
      const current = readStudyStorage();
      if (!current.unlockedMap[itemId]) {
        return {
          ok: false,
          error:
            type === "video"
              ? "请先点击播放演讲视频或「前往原视频」再完成视频打卡。"
              : "请先点击「阅读原文」前往原始页面阅读后再完成文章打卡。",
        };
      }
      const cleanNote = (options?.personalNote || "").trim().slice(0, 80);
      const cleanNick = (options?.nickname || "").trim().slice(0, 20);
      const next: StudyProgressState = {
        ...current,
        checkedInMap: {
          ...current.checkedInMap,
          [itemId]: {
            type,
            checkedInAt: new Date().toISOString(),
            personalNote: cleanNote || undefined,
            nickname: cleanNick || undefined,
          },
        },
      };
      writeStudyStorage(next);
      setState(next);
      return { ok: true };
    },
    []
  );

  const undoCheckIn = useCallback((itemId: string) => {
    const current = readStudyStorage();
    if (!current.checkedInMap[itemId]) return;
    const nextChecked = { ...current.checkedInMap };
    delete nextChecked[itemId];
    const next: StudyProgressState = {
      ...current,
      checkedInMap: nextChecked,
    };
    writeStudyStorage(next);
    setState(next);
  }, []);

  const importStudyJson = useCallback(
    (rawJson: string): { ok: boolean; error?: string } => {
      try {
        const parsed = JSON.parse(rawJson) as Partial<StudyProgressState>;
        if (
          !parsed ||
          typeof parsed !== "object" ||
          !parsed.unlockedMap ||
          !parsed.checkedInMap
        ) {
          return { ok: false, error: "JSON 格式不符合打卡备份规范。" };
        }
        const next: StudyProgressState = {
          schemaVersion: 1,
          unlockedMap: parsed.unlockedMap,
          checkedInMap: parsed.checkedInMap,
        };
        writeStudyStorage(next);
        setState(next);
        return { ok: true };
      } catch {
        return { ok: false, error: "无法解析该 JSON 文件。" };
      }
    },
    []
  );

  const resetStudy = useCallback(() => {
    writeStudyStorage(DEFAULT_STUDY_STATE);
    setState(DEFAULT_STUDY_STATE);
  }, []);

  return {
    state,
    hydrated,
    unlockItem,
    checkInItem,
    undoCheckIn,
    importStudyJson,
    resetStudy,
  };
}

// ============================================================
// 2. Monthly 2,000 PR Challenge State (localStorage only)
// ============================================================

export interface PrSubmission {
  id: string;
  url: string;
  owner: string;
  repo: string;
  repoFullName: string;
  prNumber: number;
  monthKey: string; // e.g. "2026-11"
  submittedAt: string;
  note?: string;
}

export const CHALLENGE_STORAGE_KEY = "potetofans_pr_challenge_v1";

const GITHUB_PR_REGEX =
  /^https:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\/pull\/(\d+)(?:\/(?:files|commits|checks)?)?(?:[?#].*)?$/i;

export function parseGitHubPrUrl(input: string): {
  valid: boolean;
  canonicalUrl?: string;
  owner?: string;
  repo?: string;
  repoFullName?: string;
  prNumber?: number;
  error?: string;
} {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, error: "请粘贴一个公开的 GitHub Pull Request URL。" };
  }
  const match = trimmed.match(GITHUB_PR_REGEX);
  if (!match) {
    return {
      valid: false,
      error:
        "URL 格式不正确，请输入标准的公开 GitHub PR 链接，例如：https://github.com/KinGao294/potetofans/pull/1",
    };
  }
  const [, owner, repo, prStr] = match;
  const prNumber = Number.parseInt(prStr, 10);
  if (!Number.isFinite(prNumber) || prNumber <= 0) {
    return { valid: false, error: "PR 编号无效。" };
  }
  const canonicalUrl = `https://github.com/${owner}/${repo}/pull/${prNumber}`;
  return {
    valid: true,
    canonicalUrl,
    owner,
    repo,
    repoFullName: `${owner}/${repo}`,
    prNumber,
  };
}

export function getCurrentMonthKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function formatMonthLabel(monthKey: string): {
  zh: string;
  en: string;
} {
  const [yStr, mStr] = monthKey.split("-");
  const y = Number(yStr) || 2026;
  const m = Number(mStr) || 11;
  const enMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return {
    zh: `${y} 年 ${m} 月`,
    en: `${enMonths[Math.max(0, Math.min(11, m - 1))]} ${y}`,
  };
}

function readPrStorage(): PrSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CHALLENGE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PrSubmission[]) : [];
  } catch {
    return [];
  }
}

function writePrStorage(items: PrSubmission[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHALLENGE_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("potetofans-pr-updated"));
  } catch {
    // Ignore quota errors
  }
}

export function usePrChallenge() {
  const [items, setItems] = useState<PrSubmission[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readPrStorage());
    setHydrated(true);

    const onSync = () => setItems(readPrStorage());
    window.addEventListener("storage", onSync);
    window.addEventListener("potetofans-pr-updated", onSync);
    return () => {
      window.removeEventListener("storage", onSync);
      window.removeEventListener("potetofans-pr-updated", onSync);
    };
  }, []);

  const addPr = useCallback(
    (
      urlInput: string,
      noteInput?: string,
      targetMonthKey?: string
    ): { ok: boolean; error?: string; item?: PrSubmission } => {
      const parsed = parseGitHubPrUrl(urlInput);
      if (
        !parsed.valid ||
        !parsed.canonicalUrl ||
        !parsed.owner ||
        !parsed.repo ||
        !parsed.repoFullName ||
        !parsed.prNumber
      ) {
        return { ok: false, error: parsed.error };
      }

      const monthKey = targetMonthKey || getCurrentMonthKey();
      const current = readPrStorage();
      const duplicate = current.find(
        (x) =>
          x.url.toLowerCase() === parsed.canonicalUrl!.toLowerCase() &&
          x.monthKey === monthKey
      );
      if (duplicate) {
        return {
          ok: false,
          error: `本月已记录过 ${parsed.repoFullName}#${parsed.prNumber}，请勿重复提交。`,
        };
      }

      const newItem: PrSubmission = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        url: parsed.canonicalUrl,
        owner: parsed.owner,
        repo: parsed.repo,
        repoFullName: parsed.repoFullName,
        prNumber: parsed.prNumber,
        monthKey,
        submittedAt: new Date().toISOString(),
        note: (noteInput || "").trim().slice(0, 80) || undefined,
      };

      const next = [newItem, ...current];
      writePrStorage(next);
      setItems(next);
      return { ok: true, item: newItem };
    },
    []
  );

  const removePr = useCallback((id: string) => {
    const current = readPrStorage();
    const next = current.filter((x) => x.id !== id);
    writePrStorage(next);
    setItems(next);
  }, []);

  const importPrJson = useCallback(
    (rawJson: string): { ok: boolean; error?: string; count?: number } => {
      try {
        const parsed = JSON.parse(rawJson);
        if (!Array.isArray(parsed)) {
          return { ok: false, error: "JSON 文件应为 PR 记录数组。" };
        }
        const validItems: PrSubmission[] = [];
        for (const row of parsed) {
          if (row && typeof row.url === "string") {
            const check = parseGitHubPrUrl(row.url);
            if (
              check.valid &&
              check.canonicalUrl &&
              check.owner &&
              check.repo &&
              check.repoFullName &&
              check.prNumber
            ) {
              validItems.push({
                id:
                  typeof row.id === "string"
                    ? row.id
                    : `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                url: check.canonicalUrl,
                owner: check.owner,
                repo: check.repo,
                repoFullName: check.repoFullName,
                prNumber: check.prNumber,
                monthKey:
                  typeof row.monthKey === "string" &&
                  /^\d{4}-\d{2}$/.test(row.monthKey)
                    ? row.monthKey
                    : getCurrentMonthKey(),
                submittedAt:
                  typeof row.submittedAt === "string"
                    ? row.submittedAt
                    : new Date().toISOString(),
                note:
                  typeof row.note === "string"
                    ? row.note.slice(0, 80)
                    : undefined,
              });
            }
          }
        }
        writePrStorage(validItems);
        setItems(validItems);
        return { ok: true, count: validItems.length };
      } catch {
        return { ok: false, error: "无法解析该 JSON 文件。" };
      }
    },
    []
  );

  const resetPrs = useCallback(() => {
    writePrStorage([]);
    setItems([]);
  }, []);

  return {
    items,
    hydrated,
    addPr,
    removePr,
    importPrJson,
    resetPrs,
  };
}

// ============================================================
// 3. Pending Cheer Submissions (localStorage only, never auto-published)
// ============================================================

export interface PendingCheerItem {
  id: string;
  nickname: string;
  tag: string;
  content: string;
  createdAt: string;
  status: "pending";
}

export const CHEER_STORAGE_KEY = "potetofans_pending_cheers_v1";

function readCheerStorage(): PendingCheerItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CHEER_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PendingCheerItem[]) : [];
  } catch {
    return [];
  }
}

function writeCheerStorage(items: PendingCheerItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHEER_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("potetofans-cheer-updated"));
  } catch {
    // Ignore
  }
}

export function usePendingCheers() {
  const [items, setItems] = useState<PendingCheerItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readCheerStorage());
    setHydrated(true);

    const onSync = () => setItems(readCheerStorage());
    window.addEventListener("storage", onSync);
    window.addEventListener("potetofans-cheer-updated", onSync);
    return () => {
      window.removeEventListener("storage", onSync);
      window.removeEventListener("potetofans-cheer-updated", onSync);
    };
  }, []);

  const submitPendingCheer = useCallback(
    (
      nickname: string,
      tag: string,
      content: string
    ): { ok: boolean; error?: string; item?: PendingCheerItem } => {
      const cleanContent = content.trim();
      if (!cleanContent) {
        return { ok: false, error: "请先写下你的打 Call 留言。" };
      }
      if (cleanContent.length > 140) {
        return { ok: false, error: "留言请控制在 140 字以内。" };
      }
      if (/https?:\/\/|www\./i.test(cleanContent)) {
        return {
          ok: false,
          error: "为防止广告链接，应援留言请不要包含外部网址。",
        };
      }
      if (/<script|<\/|javascript:/i.test(cleanContent)) {
        return { ok: false, error: "留言包含不支持的特殊标签内容。" };
      }

      const item: PendingCheerItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        nickname: nickname.trim().slice(0, 20) || "匿名土豆粉",
        tag: tag || "日常打 Call",
        content: cleanContent,
        createdAt: new Date().toISOString(),
        status: "pending",
      };

      const current = readCheerStorage();
      const next = [item, ...current];
      writeCheerStorage(next);
      setItems(next);
      return { ok: true, item };
    },
    []
  );

  const removePendingCheer = useCallback((id: string) => {
    const current = readCheerStorage();
    const next = current.filter((x) => x.id !== id);
    writeCheerStorage(next);
    setItems(next);
  }, []);

  const clearAllPendingCheers = useCallback(() => {
    writeCheerStorage([]);
    setItems([]);
  }, []);

  return {
    items,
    hydrated,
    submitPendingCheer,
    removePendingCheer,
    clearAllPendingCheers,
  };
}
