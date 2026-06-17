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
      // theme
      setThemeByName,
      cycleTheme,
      listThemes,
      theme,
      // directory
      directory,
      setDirectory,
      currDir,
      setCurrDir,
      // user
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
      console.error(
        "Background history sync failed, but UI is unaffected.",
        error,
      );
    });
  };

  const directoryString = () => {
    if (!directory || !Array.isArray(directory) || directory.length === 0) {
      return "/";
    }
    return "/" + directory.join("/") + "/";
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-green-400">Loading...</div>
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-green-400">Loading terminal history...</div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{ overflowAnchor: "none" }}
        className={`flex flex-col w-full min-h-screen ${theme.text} bg-linear-to-b ${theme.bg} font-[Hack] text-[12px]`}
      >
        <Header
          showSidenav={showSidenav}
          setShowSidenav={setShowSidenav}
          theme={theme}
        />

        <div
          className={`w-100 h-full fixed right-0 transition-transform duration-400 ease-in-out z-10 ${showSidenav ? "translate-x-0" : "translate-x-full"}`}
        >
          <Sidenav
            setShowSidenav={setShowSidenav}
            theme={theme}
            cycleTheme={cycleTheme}
          />
        </div>

        {showThemeName && (
          <div className="fixed w-full h-screen flex items-end justify-center">
            <div
              className={`mb-5 p-3 rounded-lg text-xl ${theme.text} bg-zinc-900/20`}
            >
              Theme: {theme.name}
            </div>
          </div>
        )}

        <div className="pl-2 pt-18">
          <History history={history} theme={theme} />

          <div className="flex w-full pl-1 font-[Hack]">
            <span className={`mr-1.5 ${theme.username}`}>
              {`${username}@termiRoom:~${directoryString()}$ `}
            </span>
            <Input
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </div>
    </>
  );
};

export default Terminal;
