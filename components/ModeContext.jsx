"use client";
import React, { useState } from "react";
import { modeContext } from "@/app/context/context";

const ModeContext = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  let darkModeDiv = document.querySelector("#darkMode");

  // Toggle Dark Mode Function
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    if (darkModeDiv.classList.contains("dark")) {
      darkModeDiv.classList.remove("dark");
    } else {
      darkModeDiv.classList.add("dark");
    }
  };

  return (
    <div>
      <modeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
        {children}
      </modeContext.Provider>
    </div>
  );
};

export default ModeContext;
