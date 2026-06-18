import { useState, useEffect } from "react";

const Input = ({
  input,
  setInput,
  handleSubmit,
  inputRef,
  commandHistory = [],
  theme,
  validCommands,
}) => {
  const [cursorPos, setCursorPos] = useState(0);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tempInput, setTempInput] = useState("");

  useEffect(() => {
    if (input.length === 0 && historyIndex === -1) {
      setCursorPos(0);
    }
  }, [input, historyIndex]);

  const updateCursor = (e) => setCursorPos(e.target.selectionStart || 0);

  const handleChange = (e) => {
    setInput(e.target.value);
    setCursorPos(e.target.selectionStart || 0);
  };

  const setInputAndCursor = (newText) => {
    setInput(newText);
    setTimeout(() => {
      setCursorPos(newText.length);
      if (inputRef.current)
        inputRef.current.setSelectionRange(newText.length, newText.length);
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

      if (historyIndex === -1) setTempInput(input);
      setHistoryIndex(newIndex);
      setInputAndCursor(commandHistory[commandHistory.length - 1 - newIndex]);
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
        setInputAndCursor(commandHistory[commandHistory.length - 1 - newIndex]);
      }
      return;
    }

    setTimeout(() => {
      if (inputRef.current) setCursorPos(inputRef.current.selectionStart || 0);
    }, 0);
  };

  const renderHighlightedText = () => {
    const match = input.match(/^(\s*)([^\s]+)/);
    const cmdStart = match ? match[1].length : 0;
    const cmdEnd = match ? match[1].length + match[2].length : 0;

    const firstWord = match ? match[2] : "";

    const isValidCommand = validCommands.includes(firstWord);

    const elements = input.split("").map((char, i) => {
      const isCursor = i === cursorPos;
      const isCmd = i >= cmdStart && i < cmdEnd;

      let colorClass = "";
      if (isCmd) {
        colorClass = isValidCommand
          ? theme?.command || theme?.username || "text-green-500"
          : "";
      }

      if (isCursor) {
        const charUnderCursor = char === " " ? "\u00A0" : char;
        return (
          <span
            key={i}
            className={`inline-block bg-current animate-pulse align-text-bottom ${colorClass}`}
          >
            <span className="text-black">{charUnderCursor}</span>
          </span>
        );
      }

      return (
        <span key={i} className={colorClass}>
          {char}
        </span>
      );
    });

    if (cursorPos === input.length) {
      elements.push(
        <span
          key="cursor-end"
          className="inline-block bg-current animate-pulse align-text-bottom"
        >
          <span className="text-black">{"\u00A0"}</span>
        </span>,
      );
    }

    return elements;
  };

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

      <div className="w-full pointer-events-none whitespace-pre-wrap break-all">
        {renderHighlightedText()}
      </div>
    </div>
  );
};

export default Input;
