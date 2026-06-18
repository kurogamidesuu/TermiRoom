const Header = ({ showSidenav, setShowSidenav, theme }) => {
  if (showSidenav) return null;

  return (
    <button
      className={`w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-md cursor-pointer transition-colors hover:bg-white/10 ${theme.navBtn?.bg || ""}`}
      onClick={() => setShowSidenav(true)}
      aria-label="Open Menu"
    >
      <span
        className={`w-5 h-[2px] rounded-full ${theme.navBtn?.btn || "bg-gray-400"}`}
      ></span>
      <span
        className={`w-5 h-[2px] rounded-full ${theme.navBtn?.btn || "bg-gray-400"}`}
      ></span>
      <span
        className={`w-5 h-[2px] rounded-full ${theme.navBtn?.btn || "bg-gray-400"}`}
      ></span>
    </button>
  );
};

export default Header;
