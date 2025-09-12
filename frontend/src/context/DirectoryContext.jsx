import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentDirectoryId, getFileNodeById } from "../commands/ls";

const DirectoryContext = createContext();

export const DirectoryProvider = ({children}) => {
  const [directory, setDirectory] = useState('');

  useEffect(() => {
      const fetchAndSet = async () => {
        const dirId = await getCurrentDirectoryId();
        const dir = await getFileNodeById(dirId);
        const dirName = dir.name;
        setDirectory(dirName);
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