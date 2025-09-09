import { useState } from "react"
import Input from "./Input";
import { useAuth } from "../context/AuthContext";

const SignupPage = ({ setLoginView }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    'Please enter a username to register, or type `login` to go back to login.'
  ]);
  const [step, setStep] = useState('username');
  const [currUsername, setCurrUsername] = useState(null);

  const {login} = useAuth();

  const handleUsername = async (name) => {
    setCurrUsername(name);
    setHistory([...history, `Set password for "${name}":`]);
    setStep('password');
    setInput('');
  };

  const handlePassword = async (password) => {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: currUsername, password }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setHistory([
          ...history,
          `Registration successful! You are now logged in as ${data.user.username}.`,
        ]);
        login(data.user.username);
        setStep('done');
      } else {
        setHistory([...history, data.error || 'Registration failed.']);
        setInput('');
      }
    } catch (error) {
      console.error('An error occurred: ', error);
      setHistory([...history, 'Network/server error.']);
      setInput('');
    }
  };

  const handleSignup = async () => {
    if (input === 'login') {
      setLoginView(true);
      return;
    }
    if (step === 'username') {
      const newUser = input.trim();
      if (!newUser) return;
      await handleUsername(newUser);
    } else if (step === 'password') {
      const password = input.trim();
      if (!password) return;
      await handlePassword(password);
    }
  };

  return (
    <>
      <div className="pb-3">
        {history.map((line, index) => (
          <div key={index} className="font-bold">{line}</div>
        ))}
      </div>
      <div className="flex w-full font-[Hack]">
        <span className='mr-1.5'>{`signup@termiRoom:~$ `}</span>
        <Input
          input={input}
          setInput={setInput}
          handleSubmit={handleSignup}
        />
      </div>
    </>
  );
};

export default SignupPage;
