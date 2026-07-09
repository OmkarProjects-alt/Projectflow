import React from "react";
import { useTheme } from "../../../context/ThemeProvider";
import { useTaskStore } from "../../../store/tasksStore";
import { useProjectStore } from "../../../store/projectStore";
import CommonCharter from "../../common/CommonCharter";
import { Loader2 } from "lucide-react";

const ProjectOverview = () => {
  const { theme } = useTheme();
  const tasks = useTaskStore((state) => state.MyTasks);
  const projects = useProjectStore((state) => state.MyProjects);

  const TaskLoading = useTaskStore((state) => state.loading);
  const ProjectLoading = useProjectStore((state) => state.loading);

  const isLoading = TaskLoading || ProjectLoading;

  const total = projects.length;
  const hasProjects = projects.length > 0;

  const chartData = hasProjects
    ? [
        {
          name: "Planning",
          color: "#7C3AED",
          value: projects?.filter(
            (project) => project.status === "Planning"
          ).length,
        },
        {
          name: "On Hold",
          color: "#F59E0B",
          value: projects?.filter(
            (project) => project.status === "On Hold" || project.status === "on-hold"
          ).length,
        },
        {
          name: "Active",
          color: "#3B82F6",
          value: projects?.filter(
            (project) => project.status.toLowerCase() === "active"
          ).length,
        },
        {
          name: "Completed",
          color: "#22C55E",
          value: projects?.filter(
            (project) => project.status === "Completed"
          ).length,
        },
      ]
    : [{ name: "No Projects", value: 1, color: theme.chart?.gray || "#6B7280" }];

  const classes = {
    top: "flex items-center justify-between w-full flex-col md:flex-row lg:flex-col ",
    grid: "grid-cols-1 ",
    width: "w-55 md:w-50 lg:w-55",
    chartHight: "h-56",
  };

  return (
    <div className={`
      ${theme.card.primary}
      ${theme.table.divider}
      border
      rounded-xl
      p-3
      h-full
      transition-all
      duration-300
      w-full
    `}>
      <h2 className={`text-xl font-semibold ${theme.text.primary} mb-4`}>
        Project Overview
      </h2>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-56 gap-4">
          <Loader2 className={`h-8 w-8 ${theme.text.info} animate-spin`} />
          <p className={`text-sm ${theme.text.muted}`}>Loading projects...</p>
        </div>
      ) : (
        <CommonCharter chartData={chartData} total={total} className={classes} />
      )}
    </div>
  );
};

export default ProjectOverview;