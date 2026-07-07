import React from "react";
import { useTheme } from "../../../context/ThemeProvider";
import ProjectOverview from "./ProjectOverview";
import TasksActivity from "./TasksActivity";
import TeamActivity from "./TeamActivity";

const ActivitySection = () => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Left Side - Charts Grid */}
      <div className="flex-1 min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectOverview />
          <TasksActivity />
        </div>
      </div>

      {/* Right Side - Team Activity */}
      <div className="xl:w-80 xl:min-w-[320px] w-full">
        <TeamActivity />
      </div>
    </div>
  );
};

export default ActivitySection;