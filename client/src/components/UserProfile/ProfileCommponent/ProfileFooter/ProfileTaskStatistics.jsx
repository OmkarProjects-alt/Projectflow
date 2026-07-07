import React, { useMemo } from "react";
import { useTheme } from "../../../../context/ThemeProvider";
import { useTaskStore } from "../../../../store/tasksStore";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CommonCharter from "../../../common/CommonCharter";
import { BarChart3, TrendingUp } from "lucide-react";

const ProfileTaskStatistics = ({ user, isCurrentUser }) => {
  const { theme } = useTheme();
  const allTasks = useTaskStore((state) => state.allTasks);

  const today = new Date().toISOString().split("T")[0];
  
  const userTasks = useMemo(() => {
    return allTasks.filter(
      (task) => task.assigned_to === user?.uid
    );
  }, [user?.uid, allTasks]);
  
  const totalTasks = userTasks.length;

  const stats = useMemo(() => {
    const result = {
      completed: 0,
      inProgress: 0,
      review: 0,
      overdue: 0,
      todo: 0,
    };

    userTasks.forEach((task) => {
      const status = task.status?.toLowerCase();

      if (status === "completed") result.completed++;
      else if (status === "in progress") result.inProgress++;
      else if (status === "review") result.review++;
      else if (status === "todo") result.todo++;

      if (
        task.deadline < today &&
        status !== "completed"
      ) {
        result.overdue++;
      }
    });

    return result;
  }, [userTasks, today]);
  
  const chartData = [
    {
      name: "Completed",
      value: stats.completed,
      color: theme.chart.green || "#22c55e",
    },
    {
      name: "In Progress",
      value: stats.inProgress,
      color: theme.chart.blue || "#3b82f6",
    },
    {
      name: "Review",
      value: stats.review,
      color: theme.chart.amber || "#f59e0b",
    },
    {
      name: "Overdue",
      value: stats.overdue,
      color: theme.chart.red || "#ef4444",
    },
    {
      name: "Todo",
      value: stats.todo,
      color: theme.chart.gray || "#6b7280",
    }
  ].filter((item) => item.value > 0);

  const pieData = totalTasks === 0
    ? [{ name: "No Tasks", value: 1, color: theme.chart.gray || "#6b7280" }]
    : chartData;

  const classes = {
    top: "h-[350px]",
    grid: "grid-cols-2",
    width: "",
    chartHight: "h-55"
  };

  // Calculate completion rate
  const completionRate = totalTasks > 0 
    ? Math.round((stats.completed / totalTasks) * 100) 
    : 0;

  return (
    <div className={`
      ${theme.card.primary}
      p-6
      max-h-[500px]
      overflow-y-auto
      transition-all
      duration-300
      scrollbar-thin
      scrollbar-thumb-gray-700
      scrollbar-track-transparent
    `}>
      {/* Header */}
      <div className={`
        sticky
        top-0
        z-10
        pb-4
        mb-4
        border-b
        ${theme.table.divider}
        bg-[#0b1423e4]
        backdrop-blur-sm
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`
              p-2 rounded-lg
              bg-blue-500/10
              ${theme.text.info}
            `}>
              <BarChart3 size={22} />
            </div>
            <h2 className={`text-xl font-semibold ${theme.text.primary}`}>
              Task Statistics
            </h2>
            <span className={`
              text-xs
              ${theme.text.muted}
              bg-white/5
              px-2 py-0.5
              rounded-full
            `}>
              {totalTasks} tasks
            </span>
          </div>

          {/* Completion Rate Badge */}
          {totalTasks > 0 && (
            <div className={`
              flex items-center gap-1.5
              px-3 py-1.5
              rounded-lg
              ${theme.card.secondary}
            `}>
              <TrendingUp className={`h-4 w-4 ${theme.text.success}`} />
              <span className={`text-sm font-semibold ${theme.text.primary}`}>
                {completionRate}%
              </span>
              <span className={`text-xs ${theme.text.muted}`}>
                completed
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <CommonCharter 
        chartData={chartData}
        total={totalTasks}
        className={classes}
      />

      {/* Quick Stats Footer */}
      {totalTasks > 0 && (
        <div className={`
          mt-4
          pt-4
          border-t
          ${theme.table.divider}
          grid
          grid-cols-2
          sm:grid-cols-5
          gap-2
        `}>
          <div className="text-center">
            <p className={`text-lg font-bold ${theme.text.success}`}>
              {stats.completed}
            </p>
            <p className={`text-xs ${theme.text.muted}`}>Completed</p>
          </div>
          <div className="text-center">
            <p className={`text-lg font-bold ${theme.text.info}`}>
              {stats.inProgress}
            </p>
            <p className={`text-xs ${theme.text.muted}`}>In Progress</p>
          </div>
          <div className="text-center">
            <p className={`text-lg font-bold ${theme.text.warning}`}>
              {stats.review}
            </p>
            <p className={`text-xs ${theme.text.muted}`}>Review</p>
          </div>
          <div className="text-center">
            <p className={`text-lg font-bold ${theme.text.muted}`}>
              {stats.todo}
            </p>
            <p className={`text-xs ${theme.text.muted}`}>Todo</p>
          </div>
          <div className="text-center">
            <p className={`text-lg font-bold ${theme.text.danger}`}>
              {stats.overdue}
            </p>
            <p className={`text-xs ${theme.text.muted}`}>Overdue</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTaskStatistics;