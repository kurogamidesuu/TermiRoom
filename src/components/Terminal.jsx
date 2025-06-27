import { useEffect, useRef, useState } from "react"
import Header from "./Header";
import Input from "./Input";
import { executeCommand } from "../commands/parser/parser";

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const handleSubmit = () => {
    const parsedCmd = executeCommand(input);

    if(parsedCmd === '__CLEAR__') {
      setHistory([]);
      setInput('');
      return;
    }

    setHistory(currState => [...currState, input, parsedCmd]);
    setInput('');
  }
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView();

    const handleUpKey = (e) => {
      if (e.key === 'ArrowUp') {
        const prevCommand = history[history.length - 2];
        if(prevCommand) {
          setInput(prevCommand);
        }
      }
    }

    window.addEventListener('keydown', (e) => handleUpKey(e));

    return window.removeEventListener('keydown', (e) => handleUpKey(e));

  }, [history]);
  
  return (
    <>
      <div className="block w-full min-h-screen h-auto bg-black text-lime-600 font-mono font-thin">
        <Header />
        <div className="pl-2">
          <div className="pl-1" >
            {history.map((cmd, index) => {
              return (<pre key={index}>{`> ${cmd}`}</pre>)
            })}
          </div>
          <div className="flex w-full pl-1" ref={bottomRef}>
            <span className="mr-2">{'>'}</span>
            <Input 
              input={input}
              inputRef={inputRef}
              setInput={setInput}
              handleSubmit={handleSubmit} />
          </div>
        </div>
      </div>  
    </>
  )
}

export default Terminal