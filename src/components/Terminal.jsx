import { useEffect, useRef, useState } from "react"
import Header from "./Header";
import Input from "./Input";
import { executeCommand } from "../commands/parser/parser"; 
import { getUsername, onUsernameChange } from "../utils/usernameStore";
import { getLocalHistory, setLocalHistory } from "../utils/historyStore";
import Sidenav from "./Sidenav";
import { getLocalTheme } from "../utils/themeStore";

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(getLocalHistory());
  const [username, setUsername] = useState('');
  const [showSidenav, setShowSidenav] = useState(false);
  
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

  
  return (
    <>
      <div className={`block w-full min-h-screen h-auto ${getLocalTheme().text} bg-linear-to-b ${getLocalTheme().bg} font-mono font-[Hack] text-sm overflow-hidden`}>
        <Header showSidenav={showSidenav} setShowSidenav={setShowSidenav} />
        <div className={`w-100 h-full fixed right-0 transition all duration-400 z-0  ${showSidenav ? 'opacity-100' : 'translate-x-full'}`}>
          <Sidenav setShowSidenav={setShowSidenav} />
        </div>
        <div className="pl-2 pt-18">
          <div className="pl-1" >
            {history.map((entry, index) => {
              if(entry.type === 'input') {
                return (
                  <pre className="font-[Hack] whitespace-pre-wrap break-words leading-relaxed mb-1" key={index}>
                    <span className={getLocalTheme().username}>{`${entry.user}@termiRoom:~$ `}</span>
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
          <div className="flex w-full pl-1 font-[Hack]" ref={bottomRef}>
            <span className={`mr-1.5 ${getLocalTheme().username}`}>{`${username}@termiRoom:~$ `}</span>
            <Input 
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit} />
          </div>
        </div>
      </div>  
    </>
  )
}

export default Terminal