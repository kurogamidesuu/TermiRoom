
const NavButton = ({name, theme, cycleTheme}) => {

  const handleReset = () => {
    localStorage.removeItem('cmdHistory');
    location.reload();
  }

  const handleTheme = () => {
    cycleTheme();
  }

  return (
    <div 
      className={`w-[90%] h-16 bg-linear-to-t ${theme.bg} rounded-lg hover:bg-black transition background duration:500 ease cursor-pointer ${theme.text}`}
      onClick={() => {
        if(name === 'Toggle theme') handleTheme();
        else if(name === 'Reset terminal') handleReset();
      }}
    >
      <div className='mt-6 ml-5 font-[Hack] text-md'>{name}</div>
    </div>
  )
}

export default NavButton