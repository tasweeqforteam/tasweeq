"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translations, type Dict, type Lang } from "@/lib/i18n";

type Theme = "light" | "dark";

type LanguageCtx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: Dict;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
};

type ThemeCtx = {
  theme: Theme;
  toggleTheme: () => void;
};

const LanguageContext = createContext<LanguageCtx | null>(null);
const ThemeContext = createContext<ThemeCtx | null>(null);

function applyLang(lang: Lang) {
  const el = document.documentElement;
  el.lang = lang;
  el.dir = lang === "ar" ? "rtl" : "ltr";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [theme, setThemeState] = useState<Theme>("light");

  // Hydrate from the values the pre-paint script already applied to <html>
  useEffect(() => {
    const el = document.documentElement;
    const initialLang = (el.lang === "ar" ? "ar" : "en") as Lang;
    const initialTheme = (el.dataset.theme === "dark" ? "dark" : "light") as Theme;
    setLangState(initialLang);
    setThemeState(initialTheme);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    applyLang(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === "en" ? "ar" : "en";
      applyLang(next);
      try {
        localStorage.setItem("lang", next);
      } catch {}
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch {}
      return next;
    });
  }, []);

  const languageValue = useMemo<LanguageCtx>(
    () => ({ lang, dir: lang === "ar" ? "rtl" : "ltr", t: translations[lang], setLang, toggleLang }),
    [lang, setLang, toggleLang]
  );

  const themeValue = useMemo<ThemeCtx>(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <LanguageContext.Provider value={languageValue}>{children}</LanguageContext.Provider>
    </ThemeContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within Providers");
  return ctx;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within Providers");
  return ctx;
}

/** Runs before paint to set lang/dir/theme from storage or system — avoids FOUC. */
export const themeInitScript = `(function(){try{
var ls=localStorage.getItem('theme');
var t=ls||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
document.documentElement.dataset.theme=t;
var l=localStorage.getItem('lang')||'en';
document.documentElement.lang=l;
document.documentElement.dir=(l==='ar'?'rtl':'ltr');
}catch(e){}})();`;
