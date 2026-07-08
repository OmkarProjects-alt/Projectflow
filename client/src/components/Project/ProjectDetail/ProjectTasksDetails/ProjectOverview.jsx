import React from "react";
import { useTheme } from "../../../../context/ThemeProvider";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import CommonCharter from "../../../common/CommonCharter";

// Loading Skeleton Component
const ProjectOverviewSkeleton = ({ theme }) => {
  return (
    <div className={`${theme.card.primary} ${theme.border} rounded-2xl p-3 px-3 animate-pulse`}>
      <div className="h-7 w-48 rounded bg-gray-700 mb-4" />
      <div className="flex flex-col items-center justify-center py-8">
        <div className="h-50 w-50 rounded-full bg-gray-700 mb-4" />
        <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-700/50">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-600" />
                <div className="h-4 w-20 rounded bg-gray-600" />
              </div>
              <div className="h-4 w-6 rounded bg-gray-600" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectOverview = ({ tasks = [], loading }) => {
  const { theme } = useTheme();

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const review = tasks.filter(
    (task) => task.status === "Review"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const todo = tasks.filter(
    (task) => task.status === "Todo"
  ).length;

  const chartData = [
    {
      name: "Completed",
      value: completed,
      color: theme.chart.green,
    },
    {
      name: "Review",
      value: review,
      color: theme.chart.purple,
    },
    {
      name: "In Progress",
      value: inProgress,
      color: theme.chart.blue,
    },
    {
      name: "To Do",
      value: todo,
      color: theme.chart.gray,
    },
  ];

  const totalTasks = tasks.length;

  const classes = {
    top: "flex justify-between overflow-y-auto flex-col items-center sm:flex-row",
    chartHight: "h-50",
    width: "w-50 sm:w-40",
    grid: "grid-cols-1",
  };

  // Show loading skeleton while fetching data
  if (loading) {
    return <ProjectOverviewSkeleton theme={theme} />;
  }

  return (
    <div className={`${theme.card.primary} ${theme.border} ${theme.text.primary} border rounded-2xl p-3 px-3`}>
      <h2 className="text-xl font-semibold mb-2">
        Task Status Overview
      </h2>

      <CommonCharter
        chartData={chartData}
        total={totalTasks}
        className={classes}
      />
    </div>
  );
};

export default ProjectOverview;