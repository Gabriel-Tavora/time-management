import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const THEME_STORAGE_KEY = "theme";
const DEFAULT_THEME = "light";
const VALID_THEMES = ["light", "dark"];

const ThemeContext = createContext(null);

/**
 * ThemeProvider - Envolve toda a aplicação para gerenciar o tema globalmente.
 * Coloque no App.js ou main.jsx, envolvendo as rotas.
 * 
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({ children, options = {} }) {
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
      // localStorage indisponível
    }
    return defaultTheme;
  });

  // Aplica o tema no DOM sempre que mudar
  useEffect(() => {
    if (!VALID_THEMES.includes(theme)) return;

    document.documentElement.setAttribute(attribute, theme);

    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // localStorage indisponível
    }
  }, [theme, attribute, storageKey]);

  // Escuta mudanças no localStorage de outras abas/páginas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === storageKey && VALID_THEMES.includes(e.newValue)) {
        setThemeState(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [storageKey]);

  const setTheme = useCallback((newTheme) => {
    if (VALID_THEMES.includes(newTheme)) {
      setThemeState(newTheme);
    }
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const isDark = theme === "dark";

  const value = {
    theme,
    setTheme,
    toggle,
    isDark,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}


export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de um <ThemeProvider>");
  }
  return context;
}