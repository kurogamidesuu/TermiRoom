import { useState } from "react";
import Input from "./Input";
import { useAuth } from "../context/AuthContext";
import { login as apiLogin } from "../api/auth";

const LoginPage = ({ setLoginView }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    "Please enter username to login [or type `register` to create an account]",
  ]);
  const [step, setStep] = useState("username");
  const [currUsername, setCurrUsername] = useState("");

  const { login } = useAuth();

  const handleLogin = async () => {
    if (input === "register") {
      setLoginView(false);
      return;
    }

    const value = input.trim();
    if (!input) return;

    if (step === "username") {
      setCurrUsername(value);
      setHistory([...history, `Hello ${value}! Please enter your password:`]);
      setStep("password");
      setInput("");
      return;
    }

    if (step === "password") {
      try {
        const data = await apiLogin(currUsername, value);
        setHistory([...history, "You are logged in!"]);
        setStep("done");
        login(data.user.username, data.currDir);
      } catch (error) {
        setHistory([...history, error.message]);
      }
      setInput("");
    }
  };

  const headText = `
████████╗███████╗██████╗ ███╗   ███╗██╗██████╗  ██████╗  ██████╗ ███╗   ███╗
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║
   ██║   █████╗  ██████╔╝██╔████╔██║██║██████╔╝██║   ██║██║   ██║██╔████╔██║
   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██╔══██╗██║   ██║██║   ██║██║╚██╔╝██║
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║  ██║╚██████╔╝╚██████╔╝██║ ╚═╝ ██║
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝
                                                                            
  `;

  return (
    <div
      style={{ overflowAnchor: "none" }}
      className={`flex flex-col w-full min-h-screen pl-3 text-green-600 bg-linear-to-b from-[#101020] to-[#101010] font-[Hack] text-sm sm:text-xs`}
    >
      <pre>{headText}</pre>
      <div className="pb-3">
        {history.map((line, index) => (
          <div key={index} className="font-bold">
            {line}
          </div>
        ))}
      </div>
      <div className="flex w-full font-[Hack]">
        <span className="mr-1.5 text-[#efb100]">login@termiRoom:~$ </span>
        <Input input={input} setInput={setInput} handleSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
