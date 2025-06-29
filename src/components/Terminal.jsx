import { useEffect, useRef, useState } from "react"
import Header from "./Header";
import Input from "./Input";
import { executeCommand } from "../commands/parser/parser"; 

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);

  const bottomRef = useRef(null);

  const handleSubmit = async () => {
    const parsedCmd = await executeCommand(input);
    if(!parsedCmd) return;

    if(parsedCmd === '__CLEAR__') {
      setHistory([]);
      setInput('');
      return;
    }

    setHistory(currState => [...currState, `> ${input}`, parsedCmd]);
    setInput('');
  }
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [history]);
  
  return (
    <>
      <div className="block w-full min-h-screen h-auto bg-black text-lime-600 font-[Hack] font-thin">
        <Header />
        <div className="pl-2">
          <div className="pl-1" >
            {history.map((cmd, index) => {
              return (<pre className="font-[Hack] whitespace-pre-wrap break-words leading-relaxed mb-1" key={index}>
                <code>
                  {cmd}
                </code>
              </pre>)
            })}
          </div>
          <div className="flex w-full pl-1" ref={bottomRef}>
            <span className="mr-1">{'> '}</span>
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