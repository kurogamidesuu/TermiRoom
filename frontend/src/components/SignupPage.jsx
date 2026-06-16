import { useState } from "react";
import Input from "./Input";
import { useAuth } from "../context/AuthContext";
import { register as apiRegister } from "../api/auth";

const SignupPage = ({ setLoginView }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    "Please enter a username to register, or type `login` to go back.",
  ]);
  const [step, setStep] = useState("username");
  const [currUsername, setCurrUsername] = useState("");

  const { login } = useAuth();

  const handleSignup = async () => {
    if (input === "login") {
      setLoginView(true);
      return;
    }

    const value = input.trim();
    if (!value) return;

    if (step === "username") {
      setCurrUsername(value);
      setHistory([...history, `Set password for "${value}":`]);
      setStep("password");
      setInput("");
      return;
    }

    if (step === "password") {
      try {
        const data = await apiRegister(currUsername, value);
        setHistory([
          ...history,
          `Registration successful! Logged in as ${data.user.username}.`,
        ]);
        setStep("done");
        login(data.uesr.username, data.currDir);
      } catch (error) {
        setHistory([...history, error.message]);
        setInput("");
      }
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
      className={`flex flex-col w-full min-h-screen pl-3 text-green-600 bg-linear-to-b from-[#101020] to-[#101010] font-[Hack] text-sm sm:text-xs md:text-sm lg:text-sm`}
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
        <span className="mr-1.5 text-[#efb100]">signup@termiRoom:~$ </span>
        <Input input={input} setInput={setInput} handleSubmit={handleSignup} />
      </div>
    </div>
  );
};

export default SignupPage;
