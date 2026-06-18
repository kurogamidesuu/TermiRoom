import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Input from "./Input";
import { executeCommand } from "../commands/parser/parser";
import {
  getServerHistory,
  setServerHistory,
  clearHistoryCache,
} from "../utils/historyStore";
import Sidenav from "./Sidenav";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useDirectory } from "../context/DirectoryContext";
import { logout as apiLogout } from "../api/auth";
import { getPath } from "../api/file";
import History from "./History";

const Terminal = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [showSidenav, setShowSidenav] = useState(false);
  const [showThemeName, setShowThemeName] = useState(false);
  const [loginView, setLoginView] = useState(true);

  const {
    isLoggedIn,
    username,
    currDir,
    setCurrDir,
    login,
    logout,
    isLoading,
  } = useAuth();
  const {
    theme,
    cycleTheme,
    setThemeByName,
    listThemes,
    refreshThemeFromBackend,
  } = useTheme();
  const { directory, setDirectory } = useDirectory();

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      logout();
      setHistory([]);
      setHistoryLoading(false);
      clearHistoryCache();
    }
  };

  const handleSubmit = async () => {
    const helpers = {
      setThemeByName,
      cycleTheme,
      listThemes,
      theme,
      directory,
      setDirectory,
      currDir,
      setCurrDir,
      username,
      setUsername: (newName) => login(newName, currDir),
    };

    let parsedCmd = await executeCommand(input, helpers);
    if (parsedCmd === null || parsedCmd === undefined) return;

    if (parsedCmd === "__CLEAR__") {
      setHistory([]);
      await setServerHistory([]);
      setInput("");
      return;
    }

    if (parsedCmd === "__LOGOUT__") {
      await handleLogout();
      setInput("");
      return;
    }

    const newHistory = [
      ...history,
      {
        type: "input",
        user: username,
        dirName: directoryString(),
        command: input,
      },
      ...(parsedCmd !== ""
        ? [{ type: "output", text: String(parsedCmd) }]
        : []),
    ];

    setHistory(newHistory);
    setInput("");

    setServerHistory(newHistory).catch((error) => {
      console.error("Background history sync failed.", error);
    });
  };

  const directoryString = () => {
    if (!directory || !Array.isArray(directory) || directory.length === 0) {
      return "/";
    }
    return "/" + directory.join("/") + "/";
  };

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      (async () => {
        setHistoryLoading(true);
        const [historyData, pathArr] = await Promise.all([
          getServerHistory(),
          currDir ? getPath(currDir) : Promise.resolve([]),
        ]);
        setHistory(historyData);
        setDirectory(pathArr);
        setHistoryLoading(false);
        await refreshThemeFromBackend();
      })();
    } else {
      setHistory([]);
      setHistoryLoading(false);
      setDirectory([]);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    setShowThemeName(true);
    const timeout = setTimeout(() => setShowThemeName(false), 1000);
    return () => clearTimeout(timeout);
  }, [theme]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111111]">
        <div className="text-green-400 font-[Hack] text-sm">
          Loading Environment...
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return loginView ? (
      <LoginPage setLoginView={setLoginView} />
    ) : (
      <SignupPage setLoginView={setLoginView} />
    );
  }

  if (historyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#111111]">
        <div className="text-green-400 font-[Hack] text-sm">
          Restoring Session...
        </div>
      </div>
    );
  }

  const commandHistory = history
    .filter((item) => item.type === "input")
    .map((item) => item.command);

  return (
    /* DESKTOP BACKGROUND */
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 bg-gradient-to-tl ${theme.bg}`}
    >
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      {/* THE APP WINDOW */}
      <div
        onClick={handleTerminalClick}
        className={`relative z-10 flex flex-col w-full max-w-4xl h-[75vh] min-h-[500px] rounded-lg shadow-2xl overflow-hidden border border-slate-300/15 bg-gradient-to-br ${theme.bg} ${theme.text} font-[Hack] text-xs cursor-text`}
      >
        {/* TOP BAR */}
        <div className="relative flex-none flex items-center px-4 h-10 bg-black/25 border-b border-white/10 select-none z-30">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]/60"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/60"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]/60"></div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 text-[11px] text-slate-200/70 font-sans tracking-wider font-semibold">
            termiRoom
          </div>

          <div className="ml-auto flex items-center">
            <Header
              showSidenav={showSidenav}
              setShowSidenav={setShowSidenav}
              theme={theme}
            />
          </div>
        </div>

        {/* TERMINAL BODY WRAPPER */}
        <div className="relative flex-1 min-h-0 flex flex-col">
          {/* SIDENAV */}
          <div
            className={`absolute top-0 right-0 h-full w-64 ${theme.sidenav} backdrop-blur-md border-l border-white/10 z-20 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              showSidenav
                ? "translate-x-0 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
                : "translate-x-full"
            }`}
          >
            <Sidenav
              setShowSidenav={setShowSidenav}
              theme={theme}
              cycleTheme={cycleTheme}
            />
          </div>

          {/* THEME TOAST NOTIFICATION */}
          {showThemeName && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <div className="px-4 py-1.5 rounded-md text-xs bg-black/80 text-white backdrop-blur-sm border border-white/10 shadow-lg">
                {theme.name}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar overflow-hidden">
            <History history={history} theme={theme} />

            {/* INPUT LINE */}
            <div className="flex items-start w-full mt-1 ml-1">
              <span className={`mr-2 shrink-0 ${theme.username}`}>
                {`${username}@termiRoom:~${directoryString()}$`}
              </span>
              <Input
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                inputRef={inputRef}
                commandHistory={commandHistory}
              />
            </div>
            <div ref={bottomRef} className="h-4" />
          </div>
        </div>
      </div>
      <h2 className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white text-xs tracking-wide">
        Made by{" "}
        <a
          href="https://github.com/kurogamidesuu"
          className={`${theme.username} hover:underline`}
          target="#"
        >
          Kurogami
        </a>
      </h2>
    </div>
  );
};

export default Terminal;
