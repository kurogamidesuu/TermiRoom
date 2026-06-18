import { useState, useEffect } from "react";

const Input = ({
  input,
  setInput,
  handleSubmit,
  inputRef,
  commandHistory = [],
}) => {
  const [cursorPos, setCursorPos] = useState(0);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tempInput, setTempInput] = useState("");

  useEffect(() => {
    if (input.length === 0 && historyIndex === -1) {
      setCursorPos(0);
    }
  }, [input, historyIndex]);

  const updateCursor = (e) => {
    setCursorPos(e.target.selectionStart || 0);
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    setCursorPos(e.target.selectionStart || 0);
  };

  const setInputAndCursor = (newText) => {
    setInput(newText);
    setTimeout(() => {
      setCursorPos(newText.length);
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newText.length, newText.length);
      }
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setHistoryIndex(-1);
      setTempInput("");
      handleSubmit();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      if (newIndex === historyIndex) return;

      if (historyIndex === -1) {
        setTempInput(input);
      }

      setHistoryIndex(newIndex);
      const historicalCommand =
        commandHistory[commandHistory.length - 1 - newIndex];
      setInputAndCursor(historicalCommand);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;

      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);

      if (newIndex === -1) {
        setInputAndCursor(tempInput);
      } else {
        const historicalCommand =
          commandHistory[commandHistory.length - 1 - newIndex];
        setInputAndCursor(historicalCommand);
      }
      return;
    }

    setTimeout(() => {
      if (inputRef.current) {
        setCursorPos(inputRef.current.selectionStart || 0);
      }
    }, 0);
  };

  const before = input.substring(0, cursorPos);
  const char = input.substring(cursorPos, cursorPos + 1);
  const after = input.substring(cursorPos + 1);

  const charUnderCursor = char === "" || char === " " ? "\u00A0" : char;

  return (
    <div className="relative flex-1">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={updateCursor}
        onClick={updateCursor}
        className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
        autoFocus
        autoComplete="off"
        spellCheck="false"
        autoCorrect="off"
        autoCapitalize="off"
      />

      <div className="w-full pointer-events-none">
        <span className="whitespace-pre-wrap break-all">{before}</span>

        <span className="inline-block bg-current align-text-bottom">
          <span className="text-black">{charUnderCursor}</span>
        </span>

        <span className="whitespace-pre-wrap break-all">{after}</span>
      </div>
    </div>
  );
};

export default Input;
