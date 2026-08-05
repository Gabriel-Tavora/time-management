import { useState, useEffect, useCallback } from "react";

const THEME_STORAGE_KEY = "theme";
const DEFAULT_THEME = "light";
const VALID_THEMES = ["light", "dark"];

/**
 * @param {Object} options - Opções de configuração
 * @param {string} options.storageKey - Chave do localStorage (padrão: "theme")
 * @param {string} options.defaultTheme - Tema inicial se não houver no storage (padrão: "light")
 * @param {string} options.attribute padrão: "data-theme")
 * @returns {Object} { theme, setTheme, toggle, isDark }
 */
export function useTheme(options = {}) {
  const {
    storageKey = THEME_STORAGE_KEY,
    defaultTheme = DEFAULT_THEME,
    attribute = "data-theme",
  } = options;

  const [theme, setThemeState] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && VALID_THEMES.includes(stored)) {
        return stored;
      }
    } catch {
    }
    return defaultTheme;
  });

  useEffect(() => {
    if (!VALID_THEMES.includes(theme)) return;

    document.documentElement.setAttribute(attribute, theme);

    try {
      localStorage.setItem(storageKey, theme);
    } catch {
    }
  }, [theme, attribute, storageKey]);

  const setTheme = useCallback((newTheme) => {
    if (VALID_THEMES.includes(newTheme)) {
      setThemeState(newTheme);
    }
  }, []);


  const toggle = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const isDark = theme === "light";

  return {
    theme,      
    setTheme,   
    toggle,     
    isDark,     
  };
}