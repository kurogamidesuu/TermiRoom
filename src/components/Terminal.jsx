import { useEffect, useRef, useState } from "react"
import Header from "./Header";
import Input from "./Input";
import { executeCommand } from "../commands/parser/parser"; 
import { getUsername, onUsernameChange } from "../utils/usernameStore";
import { getLocalHistory, setLocalHistory } from "../utils/historyStore";

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(getLocalHistory());
  const [username, setUsername] = useState('');
  
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
      <div className="block w-full min-h-screen h-auto text-green-600 font-[Hack] text-sm">
        <Header />
        <div className="pl-2">
          <div className="pl-1" >
            {history.map((entry, index) => {
              if(entry.type === 'input') {
                return (
                  <pre className="font-[Hack] whitespace-pre-wrap break-words leading-relaxed mb-1" key={index}>
                    <span className="text-yellow-500">{`${entry.user}@termiRoom:~$ `}</span>
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
          <div className="flex w-full pl-1" ref={bottomRef}>
            <span className="mr-1.5 text-yellow-500">{`${username}@termiRoom:~$ `}</span>
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