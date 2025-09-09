import {createContext, useContext, useState, useEffect } from "react";
import { themes } from "../utils/themeStore";

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const [themeIndex, setThemeIndex] = useState(0);
  const [theme, setTheme] = useState(themes[0]);
  const [themeLoading, setThemeLoading] = useState(false);

  const refreshThemeFromBackend = async () => {
    setThemeLoading(true);
    try {
      const res = await fetch('/api/user/theme', {
        credentials: 'include'
      });
      if(res.ok) {
        const data = await res.json();
        setThemeIndex(data.themeIndex);
        setTheme(themes[data.themeIndex]);
      }
    } catch {
      setThemeIndex(0);
      setTheme(themes[0]);
    }
    setThemeLoading(false);
  }

  useEffect(() => {
    refreshThemeFromBackend();
  }, [])

  const setThemeByName = async (name) => {
    const index = themes.findIndex(t => t.name.toLowerCase() === name.toLowerCase());
    if(index === -1) {
      return false;
    }
    setThemeIndex(index);
    setTheme(themes[index]);
    await fetch('/api/user/theme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({themeIndex: index})
    });
    return true;
  };

  const cycleTheme = async () => {
    const newIndex = (themeIndex + 1) % themes.length;
    setThemeIndex(newIndex);
    setTheme(themes[newIndex]);
    await fetch('/api/user/theme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({themeIndex: newIndex})
    });
  };

  const listThemes = () => themes.map(t => t.name);

  return (
    <ThemeContext.Provider value={{theme, setThemeByName, cycleTheme, listThemes, themeLoading, refreshThemeFromBackend}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);