import { createContext, useContext, useEffect, useState } from "react";

const DirectoryContext = createContext();

export const DirectoryProvider = ({children}) => {
  const [directory, setDirectory] = useState([]);

  useEffect(() => {
      const fetchAndSet = async () => {
        try {
          const res = await fetch('/api/file/path');
          if(res.ok) {
            const data = await res.json();
            const pathArr = data.pathArr;
            setDirectory(pathArr);
          }

        } catch (error) {
          console.error(`Error occurred: ${error}`)
        }
      }
  
      fetchAndSet();
    }, []);

  return (
    <DirectoryContext.Provider value={{directory, setDirectory}}>
      {children}
    </DirectoryContext.Provider>
  )
};

export const useDirectory = () => useContext(DirectoryContext);