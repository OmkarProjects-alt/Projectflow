import React from "react";
import { useTheme } from "../../context/ThemeProvider";

const DashboardHeader = ({ userName = "User" }) => {

  const { theme } = useTheme();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      
      <div>
        <h1 className={`${theme.text.heading}`}>
          Welcome back, {userName} 👋
        </h1>

        <p className={`${theme.text.secondary} mt-1`}>
          Manage your projects, tasks, and deadlines efficiently.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition"
        >
          + New Task
        </button>

        <button
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition"
        >
          + New Project
        </button>
      </div>

    </div>
  );
};

export default DashboardHeader;