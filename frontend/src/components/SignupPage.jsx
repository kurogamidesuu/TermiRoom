import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { register as apiRegister } from "../api/auth";

const SignupPage = ({ setLoginView }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await apiRegister(username, password);
      login(data.user.username, data.currDir);
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] p-4 sm:p-8">
      <div className="relative flex flex-col w-full max-w-md rounded-lg shadow-2xl overflow-hidden border border-[#333] bg-[#111] font-[Hack] text-[13px] text-green-500">
        {/* macOS Top Bar */}
        <div className="relative flex-none flex items-center px-4 h-10 bg-[#1e1e1e] border-b border-[#333] select-none">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]/60"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/60"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]/60"></div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 text-[11px] text-gray-400 font-sans tracking-wider font-semibold">
            termiRoom — create_user
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 flex-1">
          <div className="mb-6">
            <h1 className="text-white text-base font-bold mb-1">
              System Allocation
            </h1>
            <p className="text-gray-400">Register a new terminal instance.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-500 mb-1">
                root@system:~$ create_username
              </label>
              <div className="flex items-center bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 focus-within:border-green-500 transition-colors">
                <span className="text-green-500 mr-2">{">"}</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-white placeholder-gray-600"
                  placeholder="new_user"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-500 mb-1">
                root@system:~$ set_password
              </label>
              <div className="flex items-center bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 focus-within:border-green-500 transition-colors">
                <span className="text-green-500 mr-2">{">"}</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-white tracking-widest placeholder-gray-600"
                  placeholder="root_123"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 mt-2 bg-red-950/30 px-3 py-2 rounded border border-red-900/50">
                [ERROR]: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/50 rounded py-2 transition-colors focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading ? "Allocating..." : "[ Allocate Resources ]"}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => setLoginView(true)}
              className="text-green-400 hover:text-green-300 underline underline-offset-4"
            >
              Return to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
