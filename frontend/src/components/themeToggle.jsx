import { useTheme } from "../app";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="ml-4 px-3 py-1 rounded-full border text-sm bg-white/10 text-white hover:bg-white/20 transition"
    >
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </button>
  );
};

export default ThemeToggle;