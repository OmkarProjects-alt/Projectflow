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

const ProjectOverview = ({ tasks = [] }) => {

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
      color: `${theme.chart.green}`,
    },
    {
      name: "Review",
      value: review,
      color: `${theme.chart.purple}`,
    },
    {
      name: "In Progress",
      value: inProgress,
      color: `${theme.chart.blue}`,
    },
    {
      name: "To Do",
      value: todo,
      color: `${theme.chart.gray}`,
    },
  ];


  const totalTasks = tasks.length;

  const classes = {
    top: "flex justify-between overflow-y-auto flex-col items-center sm:flex-row",
    chartHight: "h-50",
    width: "w-50 sm:w-40  ",
    grid: "grid-cols-1",
  }

  return (
    <div className={` ${theme.card.primary} ${theme.border} ${theme.text.primary} backdrop-blur-2xl border rounded-2xl p-3 px-3`}>

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