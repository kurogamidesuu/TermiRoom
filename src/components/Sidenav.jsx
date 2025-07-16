import NavButton from "./NavButton"

const Sidenav = ({setShowSidenav, setTheme}) => {

  return (
    <div className='w-100 h-full bg-linear-to-t from-green-950 to-green-900 border-l-3 border-emerald-950 fixed right-0 opacity-85'>
      <div className="flex justify-between">
        <h1 className=" mt-2.5 ml-5 text-3xl text-emerald-600 font-extrabold font-mono ">{`<TermiRoom />`}</h1>
        <button
        className='h-10 w-10 bg-emerald-950 text-2xl cursor-pointer mt-2.5 mr-5 z-5 rounded-md flex items-center justify-center'
        onClick={() => setShowSidenav(false)}
        >
          <span className='h-1.5 w-8 bg-green-500 absolute rounded-sm rotate-45'></span>
          <span className='h-8 w-1.5 bg-green-500 absolute rounded-sm rotate-45'></span>
        </button>
      </div>
      <div className="h-full flex flex-col items-center gap-3 pt-20">
        <NavButton name='Toggle theme' setTheme={setTheme} />
        <NavButton name='Reset terminal' />
      </div>
    </div>
  )
}

export default Sidenav