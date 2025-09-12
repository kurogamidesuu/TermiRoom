import { useEffect, useRef, useState, lazy, Suspense } from "react"
import Header from "./Header";
import Input from "./Input";
import { executeCommand } from "../commands/parser/parser"; 
import { clearUsername, getUsername, onUsernameChange } from "../utils/usernameStore";
import { getServerHistory, setServerHistory } from "../utils/historyStore";
import Sidenav from "./Sidenav";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { DirectoryProvider, useDirectory } from "../context/DirectoryContext";

const History = lazy(() => import('./History'));

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [showSidenav, setShowSidenav] = useState(false);
  const [showThemeName, setShowThemeName] = useState(false);
  const [loginView, setLoginView] = useState(true);
  const [UIusername, setUIusername] = useState('');
  
  const {isLoggedIn, username, login, logout, isLoading} = useAuth();
  const {theme, cycleTheme, setThemeByName, listThemes, refreshThemeFromBackend} = useTheme();
  const {directory, setDirectory} = useDirectory();
  
  const bottomRef = useRef(null);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      logout();
      setHistory([]);
      setHistoryLoading(false);
      clearUsername();
    } catch(error) {
      console.error('Logout failed: ', error);
    }
  };

  const handleSubmit = async () => {
    let parsedCmd = await executeCommand(input, {
      setThemeByName,
      cycleTheme,
      listThemes,
      theme,
      setDirectory,
    });
    if(!parsedCmd) return;

    if(parsedCmd === '__CLEAR__') {
      setHistory([]);
      await setServerHistory([]);
      setInput('');
      return;
    }

    if(parsedCmd === '__LOGOUT__') {
      handleLogout();
      location.reload();
      return;
    }

    const newHistory = [
      ...history,
      {
        type: 'input',
        user: username,
        dirName: directory,
        command: input
      },
      {
        type: 'output',
        text: parsedCmd
      }
    ];

    setHistory(newHistory);
    await setServerHistory(newHistory);
    setInput('');
  }

  useEffect(() => {
    const fetchAndSet = async () => {
      const name = await getUsername();
      setUIusername(name);
    }
    fetchAndSet();

    const unsubscribe = onUsernameChange((newName) => {
      setUIusername(newName || '');
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadUserHistory = async () => {
      setHistoryLoading(true);
      const historyData = await getServerHistory();
      setHistory(historyData);
      setHistoryLoading(false);
    };

    const loadUserTheme = async () => {
      await refreshThemeFromBackend();
    }

    if(isLoggedIn) {
      loadUserHistory();
      loadUserTheme();
    } else {
      setHistory([]);
      setHistoryLoading(false);
    }
  }, [isLoggedIn]);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [history]);

  useEffect(() => {
    setShowThemeName(true);

    const timeout = setTimeout(() => {
      setShowThemeName(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [theme]);

  if(isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-green-400">Loading...</div>
      </div>
    );
  }

  if(!isLoggedIn) {
    return loginView ? (
      <LoginPage setLoginView={setLoginView} login={login} />
    )  : (
      <SignupPage setLoginView={setLoginView} login={login} />
    );
  }

  if(historyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-green-400">Loading terminal history...</div>
      </div>
    );
  }

  return (
    <>
      <div style={{overflowAnchor: 'none'}} className={`flex flex-col w-full min-h-screen ${theme.text} bg-linear-to-b ${theme.bg} font-mono font-[Hack] text-sm sm:text-xs md:text-sm lg:text-sm`}>
        {/* Header */}
        <Header
          showSidenav={showSidenav} 
          setShowSidenav={setShowSidenav} 
          theme={theme}
        />

        {/* Sidenav */}
        <div className={`w-100 h-full fixed right-0 transition-transform duration-400 ease-in-out z-0  ${showSidenav ? 'opacity-100' : 'translate-x-full'}`}>
          <Sidenav 
            setShowSidenav={setShowSidenav}
            theme={theme}
            cycleTheme={cycleTheme}
          />
        </div>

        {/* theme toast */}
        {showThemeName && (
          <div className={`fixed w-full h-screen flex items-end justify-center`}>
            <div className={`mb-5 p-3 rounded-lg text-xl ${theme.text} bg-zinc-900/20`}>Theme: {theme.name}</div>
          </div>
        )}
        
          <div className="pl-2 pt-18" >

            {/* history */}
            <Suspense fallback={<h1>loading...</h1>}>
              <History 
                history={history}
                theme={theme}
              />
            </Suspense>

            {/* Input area */}
            <div className="flex w-full pl-1 font-[Hack]">
              <span className={`mr-1.5 ${theme.username}`}>{`${UIusername}@termiRoom:~${directory}$ `}</span>
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
  )
}

export default Terminal