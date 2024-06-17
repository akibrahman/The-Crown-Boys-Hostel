"use client";

import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeSwitch = () => {
  const [darkMode, setdarkMode] = useState(true);
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme == "dark") setdarkMode(true);
  }, []);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  return (
    <div
      onClick={() => setdarkMode(!darkMode)}
      className="cursor-pointer hidden"
    >
      {darkMode ? (
        <FaSun className="text-xl duration-300 transition-all" />
      ) : (
        <FaMoon className="text-xl duration-300 transition-all" />
      )}
    </div>
  );
};

export default ThemeSwitch;
