import { useState, useEffect } from "react";

const Spinner = ({ theme }) => {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length);
    }, 80);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`flex items-center space-x-3 mt-2 ${theme.command || theme.username}`}
    >
      <span className="font-bold text-lg">{frames[frame]}</span>
      <span className="opacity-80 animate-pulse tracking-wide">
        Executing...
      </span>
    </div>
  );
};

export default Spinner;
