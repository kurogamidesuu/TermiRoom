import { useEffect, useRef, useState } from "react"
import Header from "./Header";
import Input from "./Input";
import { executeCommand } from "../commands/parser/parser"; 
import { getUsername, onUsernameChange } from "../utils/usernameStore";
import { getLocalHistory, setLocalHistory } from "../utils/historyStore";
import Sidenav from "./Sidenav";
import { useTheme } from "../context/ThemeContext";

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(getLocalHistory());
  const [username, setUsername] = useState('');
  const [showSidenav, setShowSidenav] = useState(false);
  const [showThemeName, setShowThemeName] = useState(false);

  const {theme, cycleTheme} = useTheme();
  
  const bottomRef = useRef(null);

  const handleSubmit = async () => {
    let parsedCmd = await executeCommand(input);
    if(!parsedCmd) return;

    if(parsedCmd === '__CLEAR__') {
      setHistory([]);
      setLocalHistory([]);
      setInput('');
      return;
    }

    setHistory(currState => [
      ...currState, 
      {
        type: 'input',
        user: username,
        command: input
      },
      {
        type: 'output',
        text: parsedCmd
      }
    ]);
    setInput('');
  }
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    
    setLocalHistory(history);
  }, [history]);

  useEffect(() => {
    const current = getUsername();
    setUsername(current);

    const unsubscribe = onUsernameChange((newName) => {
      setUsername(newName);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setShowThemeName(true);

    const timeout = setTimeout(() => {
      setShowThemeName(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [theme]);
  
  return (
    <>
      <div style={{overflowAnchor: 'none'}} className={`flex flex-col w-full min-h-screen ${theme.text} bg-linear-to-b ${theme.bg} font-mono font-[Hack] text-sm sm:text-xs md:text-sm lg:text-sm`}>
        <Header
          showSidenav={showSidenav} 
          setShowSidenav={setShowSidenav} 
          theme={theme} 
        />
        <div className={`w-100 h-full fixed right-0 transition-transform duration-400 ease-in-out z-0  ${showSidenav ? 'opacity-100' : 'translate-x-full'}`}>
          <Sidenav 
            setShowSidenav={setShowSidenav}
            theme={theme}
            cycleTheme={cycleTheme}
          />
        </div>
        {showThemeName && (
          <div className={`fixed w-full h-screen flex items-end justify-center`}>
            <div className={`mb-5 p-3 rounded-lg text-xl ${theme.text} bg-zinc-900/20`}>Theme: {theme.name}</div>
          </div>
          )}
        <div className="pl-2 pt-18" >
          <div className="pl-1" >
            {history.map((entry, index) => {
              if(entry.type === 'input') {
                return (
                  <pre className="font-[Hack] whitespace-pre-wrap break-words leading-relaxed mb-1" key={index}>
                    <span className={theme.username}>{`${entry.user}@termiRoom:~$ `}</span>
                    <span>{entry.command}</span>
                  </pre>
                )
              } else if(entry.type === 'output') {
                return (
                  <pre className="font-[Hack] whitespace-pre-wrap break-words leading-relaxed mb-1" key={index}>
                    <span>{entry.text}</span>
                  </pre>
                )
              }
            })}
          </div>
          <div className="flex w-full pl-1 font-[Hack]">
            <span className={`mr-1.5 ${theme.username}`}>{`${username}@termiRoom:~$ `}</span>
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