import Terminal from "./components/Terminal";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider >
        <Terminal />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
