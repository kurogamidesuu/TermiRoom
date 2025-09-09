import { createContext, useState, useEffect, useContext } from "react"

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
      const checkAuthStatus = async () => {
        try {
          const res = await fetch('/api/auth/check', {
            credentials: 'include'
          });
  
          if(res.ok) {
            const data = await res.json();
            setIsLoggedIn(true);
            setUsername(data.user.username);
          } else {
            setIsLoggedIn(false);
            setUsername('');
          }
        } catch(error) {
          console.error('Auth check failed: ', error);
          setIsLoggedIn(false);
          setUsername('');
        } finally {
          setIsLoading(false);
        }
      };
  
      checkAuthStatus();
    }, []);

    const login = (username) => {
      setIsLoggedIn(true);
      setUsername(username);
    };

    const logout = () => {
      setIsLoggedIn(false);
      setUsername('');
    };

    return (
      <AuthContext.Provider value={{isLoggedIn, username, login, logout, isLoading}}>
        {children}
      </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);