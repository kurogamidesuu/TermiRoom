import { useState } from "react"
import Input from "./Input";
import { useAuth } from "../context/AuthContext";

const LoginPage = ({setLoginView}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState(['Please enter username to login [or type `register` to register]']);
  const [step, setStep] = useState('username');
  const [currUsername, setCurrUsername] = useState(null);

  const {login} = useAuth();

  const handleUsername = async (name) => {
    try {
      const res = await fetch(`/api/login/${name}`);
      const data = await res.json();

      if(!res.ok) {
        setHistory([...history, data.error]);
        setInput('');
        return;
      }

      setHistory([...history, `Hello ${data.username}! Please enter your password`]);
      setCurrUsername(data.username);
      setStep('password');
    } catch(error) {
      console.error('Something went wrong! ', error);
      setHistory([...history, 'Network error occurred.']);
    }
    setInput('');
  }

  const handlePassword = async (password) => {
    try {
      const res = await fetch(`/api/login/${currUsername}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({password}),
        credentials: 'include'
      });

      const data = await res.json();

      if(!res.ok) {
        setHistory([...history, data.error]);
        setInput('');
        return;
      }

      setHistory([...history, `You are logged in!`]);
      setStep('done');
      login(data.user.username);
    } catch(error) {
      console.error('Something went wrong! ', error);
      setHistory([...history, 'Network error occurred.']);
    }

    setInput('');
  }

  const handleLogin = async () => {
    if(input === 'register') {
      setLoginView(false);
      return;
    }

    if(step === 'username') {
      const newUser = input.trim();
      if(!newUser) return;
      await handleUsername(newUser);
    } else if(step === 'password') {
      const password = input.trim();
      if(!password) return;
      await handlePassword(password);
    }
  }

  const headText = `
████████╗███████╗██████╗ ███╗   ███╗██╗██████╗  ██████╗  ██████╗ ███╗   ███╗
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║
   ██║   █████╗  ██████╔╝██╔████╔██║██║██████╔╝██║   ██║██║   ██║██╔████╔██║
   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██╔══██╗██║   ██║██║   ██║██║╚██╔╝██║
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║  ██║╚██████╔╝╚██████╔╝██║ ╚═╝ ██║
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝
                                                                            
  `;

  return (
    <div style={{overflowAnchor: 'none'}} className={`flex flex-col w-full min-h-screen pl-3 text-green-600 bg-linear-to-b from-[#101020] to-[#101010] font-mono font-[Hack] text-sm sm:text-xs md:text-sm lg:text-sm`}>
      <pre>{headText}</pre>
      <div className="pb-3">
        {history.map((line, index) => (
          <div key={index} className="font-bold">{line}</div>
        ))}
      </div>
      <div className="flex w-full font-[Hack]">
        <span className='mr-1.5 text-[#efb100]'>{`login@termiRoom:~$ `}</span>
        <Input
          input={input}
          setInput={setInput}
          handleSubmit={handleLogin}
        />
      </div>
    </div>
  )
}

export default LoginPage