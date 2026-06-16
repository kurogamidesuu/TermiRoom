import { createContext, useState, useEffect, useContext } from "react";
import { checkAuth } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [currDir, setCurrDir] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const data = await checkAuth();
        if (data.authenticated) {
          setIsLoggedIn(true);
          setUsername(data.user.username);
          setCurrDir(data.currDir);
        }
      } catch {
        console.error("Failed to verify user.");
        // defaults
      } finally {
        setIsLoading(false);
      }
    };
    verify();
  }, []);

  const login = (username, currDir) => {
    setIsLoggedIn(true);
    setUsername(username);
    setCurrDir(currDir);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setCurrDir(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        username,
        currDir,
        setCurrDir,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
