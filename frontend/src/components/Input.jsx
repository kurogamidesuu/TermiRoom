import { useEffect, useRef } from "react";

const Input = ({input, setInput, handleSubmit}) => {

  const inputRef = useRef(null);

  useEffect(() => {
    const handleClick = () => {
      inputRef.current?.focus({ preventScroll: true });
    }

    window.addEventListener('click', handleClick);

    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <input
        className='focus:outline-none caret-transparent w-full'
        type='text'
        autoFocus
        ref={inputRef}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if(e.key === 'Enter') handleSubmit();
        }}
      />
  )
}

export default Input