import { getLocalTheme } from "../utils/themeStore"

const Header = ({showSidenav, setShowSidenav}) => {
  const handleSideNav = () => {
    setShowSidenav(true)
  }

  return (
    <div className={`h-15 w-full fixed py-3 mb-3 bg-linear-to-t from-transparent from-5% ${getLocalTheme().header} to-95% flex justify-center items-center w-f`}>
      <div 
      className={`${showSidenav ? 'hidden' : ''} w-10 h-10 bg-linear-to-t ${getLocalTheme().navBtn.bg} ml-auto mr-5 rounded-md cursor-pointer flex flex-col items-center justify-center gap-1.5`}
      onClick={handleSideNav}
      >
        <span className={`w-8 h-1.5 rounded-md ${getLocalTheme().navBtn.btn}`}></span>
        <span className={`w-8 h-1.5 rounded-md ${getLocalTheme().navBtn.btn}`}></span>
        <span className={`w-8 h-1.5 rounded-md ${getLocalTheme().navBtn.btn}`}></span>
      </div>
    </div>
  )
}

export default Header