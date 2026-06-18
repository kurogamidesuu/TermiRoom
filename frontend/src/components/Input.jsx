import { useState, useEffect } from "react";

const Input = ({ input, setInput, handleSubmit, inputRef }) => {
  const [cursorPos, setCursorPos] = useState(0);

  useEffect(() => {
    if (input.length === 0) setCursorPos(0);
  }, [input]);

  const updateCursor = (e) => {
    setCursorPos(e.target.selectionStart || 0);
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    setCursorPos(e.target.selectionStart || 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
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
        <span className="inline-block bg-current animate-pulse align-text-center">
          <span className="text-black">{charUnderCursor}</span>
        </span>
        <span className="whitespace-pre-wrap break-all">{after}</span>
      </div>
    </div>
  );
};

export default Input;
