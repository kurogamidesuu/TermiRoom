import Terminal from "./components/Terminal";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider >
      <Terminal />
    </ThemeProvider>
  );
}

export default App;
