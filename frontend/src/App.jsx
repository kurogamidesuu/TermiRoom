import Terminal from "./components/Terminal";
import { AuthProvider } from "./context/AuthContext";
import { DirectoryProvider } from "./context/DirectoryContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <DirectoryProvider>
      <AuthProvider>
        <ThemeProvider >
          <Terminal />
        </ThemeProvider>
      </AuthProvider>
    </DirectoryProvider>
  );
}

export default App;
