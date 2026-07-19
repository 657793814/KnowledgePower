"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import THEMES, { getThemeById, DEFAULT_THEME_ID } from "./theme-presets";
import type { ThemeId, ThemePreset } from "./theme-presets";

/* ─── Context Type ─── */
type ThemeCtx = {
  themeId: ThemeId;
  theme: ThemePreset;
  themes: ThemePreset[];
  setTheme: (id: ThemeId) => void;
  loading: boolean;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

/* ─── LOCAL_STORAGE_KEY ─── */
const LS_KEY = "zdknow…e_id";

/* ─── Apply everything to body ─── */
function applyTheme(preset: ThemePreset) {
  const { cssVars, bgImage, bgTint } = preset;
  const body = document.body;

  // CSS 变量
  for (const [key, val] of Object.entries(cssVars)) {
    body.style.setProperty(key, val);
  }

  // 主题图片 + 叠加 tint 色层
  body.style.backgroundImage = `url('${bgImage}')`;
  body.style.backgroundSize = 'cover';
  body.style.backgroundPosition = 'center';
  body.style.backgroundRepeat = 'no-repeat';
  body.style.backgroundAttachment = 'fixed';
  body.style.backgroundColor = bgTint; // 作为 tint 底色，图片加载前可见
  // 用伪元素做 tint 叠加（实际通过 body::before）
  let bgOverlay = document.getElementById('theme-bg-overlay');
  if (!bgOverlay) {
    bgOverlay = document.createElement('div');
    bgOverlay.id = 'theme-bg-overlay';
    bgOverlay.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      z-index: -1; pointer-events: none;
      background: ${bgTint};
      mix-blend-mode: multiply;
    `;
    document.body.appendChild(bgOverlay);
  } else {
    bgOverlay.style.background = bgTint;
  }
}

/* ─── Provider ─── */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME_ID);
  const [loading, setLoading] = useState(true);

  // Init: load saved theme from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY) as ThemeId | null;
      const id = saved && THEMES.find((t) => t.id === saved) ? saved : DEFAULT_THEME_ID;
      setThemeId(id);
      applyTheme(getThemeById(id));
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist + apply when theme changes
  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
    const preset = getThemeById(id);
    applyTheme(preset);
    try {
      localStorage.setItem(LS_KEY, id);
    } catch {
      // localStorage unavailable (private browsing, etc.)
    }
  }, []);

  const value = useMemo<ThemeCtx>(
    () => ({
      themeId,
      theme: getThemeById(themeId),
      themes: THEMES,
      setTheme,
      loading,
    }),
    [themeId, setTheme, loading],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ─── Hook ─── */
export function useTheme(): ThemeCtx {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within <ThemeProvider>");
  }
  return ctx;
}
