import { createContext, useContext, useState } from "react";

const DirectoryContext = createContext();

export const DirectoryProvider = ({ children }) => {
  const [directory, setDirectory] = useState([]);

  return (
    <DirectoryContext.Provider value={{ directory, setDirectory }}>
      {children}
    </DirectoryContext.Provider>
  );
};

export const useDirectory = () => useContext(DirectoryContext);
