import { createContext, useContext, useState, useEffect } from "react";
import { themes } from "../utils/themeStore";
import { getTheme, setTheme } from "../api/utils";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeIndex, setThemeIndex] = useState(0);
  const [theme, setThemeState] = useState(themes[0]);
  const [themeLoading, setThemeLoading] = useState(false);

  const applyTheme = (index) => {
    setThemeIndex(index);
    setThemeState(themes[index]);
  };

  const refreshThemeFromBackend = async () => {
    setThemeLoading(true);
    try {
      const index = await getTheme();
      applyTheme(index);
    } catch {
      applyTheme(0);
    } finally {
      setThemeLoading(false);
    }
  };

  useEffect(() => {
    refreshThemeFromBackend();
  }, []);

  const setThemeByName = async (name) => {
    const index = themes.findIndex(
      (t) => t.name.toLowerCase() === name.toLowerCase(),
    );
    if (index === -1) return false;
    applyTheme(index);
    await setTheme(index);
    return true;
  };

  const cycleTheme = async () => {
    const newIndex = (themeIndex + 1) % themes.length;
    applyTheme(newIndex);
    await setTheme(newIndex);
  };

  const listThemes = () => themes.map((t) => t.name);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setThemeByName,
        cycleTheme,
        listThemes,
        themeLoading,
        refreshThemeFromBackend,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
