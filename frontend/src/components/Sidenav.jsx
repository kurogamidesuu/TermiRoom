import NavButton from "./NavButton";

const Sidenav = ({ setShowSidenav, theme, cycleTheme }) => {
  return (
    <div className="w-full h-full flex flex-col pt-4">
      <div className="flex items-center justify-between px-5 mb-8">
        <h1
          className={`text-lg font-extrabold font-mono tracking-tight ${theme.username}`}
        >
          &lt;TermiRoom /&gt;
        </h1>

        <button
          className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-colors hover:bg-white/10 bg-gradient-to-br ${theme.navBtn?.bg || ""}`}
          onClick={() => setShowSidenav(false)}
          aria-label="Close Menu"
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            <span
              className={`absolute w-full h-[2px] rounded-full rotate-45 ${theme.navBtn?.btn || "bg-gray-400"}`}
            ></span>
            <span
              className={`absolute w-full h-[2px] rounded-full -rotate-45 ${theme.navBtn?.btn || "bg-gray-400"}`}
            ></span>
          </div>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center gap-4 px-4">
        <NavButton name="Toggle theme" theme={theme} cycleTheme={cycleTheme} />
        <NavButton name="Reset terminal" theme={theme} />
      </div>
    </div>
  );
};

export default Sidenav;
