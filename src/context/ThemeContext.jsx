import { createContext, useContext, useEffect, useState } from "react";
import { setThemeHandler } from "../commands/theme";
import { themes } from "../utils/themeStore";

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const [themeIndex, setThemeIndex] = useState(0);
  const [theme, setTheme] = useState(themes[0]);

  useEffect(() => {
    const storedIndex = JSON.parse(localStorage.getItem('themeIndex'));
    if(storedIndex !== null) {
      setThemeIndex(storedIndex);
      setTheme(themes[storedIndex]);
    }
  }, []);

  const cycleTheme = (newTheme=null) => {
    let newIndex;
    if(!newTheme) {
      newIndex = (themeIndex + 1) % themes.length;
    } else {
      newIndex = themes.findIndex(elem => elem.name.toLowerCase() === newTheme.toLowerCase());
      if(newIndex === -1) return false;
    }
    setThemeIndex(newIndex);
    setTheme(themes[newIndex]);
    localStorage.setItem('themeIndex', JSON.stringify(newIndex));
    return true;
  }
  
  useEffect(() => {
    setThemeHandler(cycleTheme);
  }, [cycleTheme]);

  return (
    <ThemeContext.Provider value={{theme, cycleTheme}} >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext);