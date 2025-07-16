import { setLocalTheme } from "../utils/themeStore";


const NavButton = ({name}) => {
  const handleReset = () => {
    localStorage.removeItem('cmdHistory');
    location.reload();
  }

  const handleTheme = () => {
    setLocalTheme();
    location.reload();
  }

  return (
    <div 
      className='w-[90%] h-16 bg-linear-to-t from-green-900 to-green-800 rounded-lg hover:bg-black transition background duration:500 ease cursor-pointer text-green-100/60'
      onClick={() => {
        if(name === 'Toggle theme') handleTheme();
        else if(name === 'Reset terminal') handleReset();
      }}
    >
      <div className='mt-6 ml-5'>{name}</div>
    </div>
  )
}

export default NavButton