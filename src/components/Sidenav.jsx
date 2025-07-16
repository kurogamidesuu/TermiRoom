import NavButton from "./NavButton"

const Sidenav = ({setShowSidenav, theme, cycleTheme}) => {

  return (
    <div className='w-100 h-full bg-linear-to-t from-zinc-950/50 via-slate-900/50 to-slate-700/80 fixed right-0 opacity-89'>
      <div className="flex justify-between">
        <h1 className={`mt-2.5 ml-5 text-3xl ${theme.username} font-extrabold font-mono`}>{`<TermiRoom />`}</h1>
        <button
        className={`h-10 w-10 bg-linear-to-t ${theme.navBtn.bg} text-2xl cursor-pointer mt-2.5 mr-5 z-5 rounded-md flex items-center justify-center`}
        onClick={() => setShowSidenav(false)}
        >
          <span className={`h-1.5 w-8 ${theme.navBtn.btn} absolute rounded-sm rotate-45`}></span>
          <span className={`h-8 w-1.5 ${theme.navBtn.btn} absolute rounded-sm rotate-45`}></span>
        </button>
      </div>
      <div className="h-full flex flex-col items-center gap-3 pt-20">
        <NavButton name='Toggle theme' theme={theme} cycleTheme={cycleTheme} />
        <NavButton name='Reset terminal' theme={theme} />
      </div>
    </div>
  )
}

export default Sidenav