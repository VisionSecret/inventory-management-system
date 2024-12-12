import React from "react";
import { useContext } from "react";
import { modeContext } from "@/app/context/context";

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useContext(modeContext);

  return (
    <nav className="px-5 py-2 dark:border-b-2 border-b-2">
      <div className="flex justify-between items-center">
        <div className=" text-xl font-bold">
          inventory management system
        </div>
        <div className="flex items-center">
          <ul className="flex justify-between items-center gap-8 mr-10">
            <li className=" text-lg font-semibold">
              Home
            </li>
            <li className=" text-lg font-semibold">
              About
            </li>
            <li className=" text-lg font-semibold">
              Contact
            </li>
          </ul>
          <button
            onClick={toggleDarkMode}
            className="ml-4 dark:bg-white dark:text-black border border-zinc-800 bg-black font-semibold py-2 px-4 rounded transition duration-300"
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
