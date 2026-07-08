import React, { useMemo, useState } from "react";
import { useTaskStore } from "../../../store/tasksStore";
import { useTheme } from "../../../context/ThemeProvider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Area,
  ComposedChart,
} from "recharts";
import { CalendarDays, TrendingUp, TrendingDown, Activity, CheckCircle, Clock } from "lucide-react";

const TasksActivity = () => {
  const tasks = useTaskStore((state) => state.MyTasks);
  const { theme } = useTheme();
  const [filter, setFilter] = useState("7");

  const { chartData, stats } = useMemo(() => {
    const data = [];
    const totalDays =
      filter === "7"
        ? 7
        : filter === "30"
        ? 30
        : filter === "90"
        ? 90
        : filter === "180"
        ? 180
        : 365;

    let totalAssigned = 0;
    let totalCompleted = 0;

    for (let i = totalDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const fullDate = date.toISOString().split("T")[0];

      let label;
      if (totalDays <= 7) {
        label = date.toLocaleDateString("en-US", { weekday: "short" });
      } else if (totalDays <= 30) {
        label = date.toLocaleDateString("en-US", { day: "numeric" });
      } else if (totalDays <= 90) {
        label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else {
        label = date.toLocaleDateString("en-US", { month: "short" });
      }

      const Assigned = tasks.filter(
        (task) => task.created_at?.split("T")[0] === fullDate
      ).length;

      // For completed tasks, we check if status is completed and use Assigned_at as fallback
      // since updated_at doesn't exist in the data
      const completed = tasks.filter(
        (task) =>
          task.status?.toLowerCase() === "completed" &&
          task.created_at?.split("T")[0] === fullDate
      ).length;

      totalAssigned += Assigned;
      totalCompleted += completed;

      data.push({
        day: label,
        fullDate,
        Assigned,
        completed,
        completionRate: Assigned > 0 ? Math.round((completed / Assigned) * 100) : 0,
      });
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (task) => task.status?.toLowerCase() === "completed"
    ).length;
    const inProgressTasks = tasks.filter(
      (task) => task.status?.toLowerCase() === "in progress"
    ).length;
    const todoTasks = tasks.filter(
      (task) => task.status?.toLowerCase() === "todo"
    ).length;
    const reviewTasks = tasks.filter(
      (task) => task.status?.toLowerCase() === "review"
    ).length;
    const overdueTasks = tasks.filter((task) => {
      const today = new Date().toISOString().split("T")[0];
      return (
        task.deadline?.split("T")[0] < today &&
        task.status?.toLowerCase() !== "completed"
      );
    }).length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      chartData: data,
      stats: {
        total: totalTasks,
        completed: completedTasks,
        inProgress: inProgressTasks,
        todo: todoTasks,
        review: reviewTasks,
        overdue: overdueTasks,
        completionRate,
        totalAssigned,
        totalCompleted,
      },
    };
  }, [tasks, filter]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`
          ${theme.card.secondary}
          p-3
          rounded-lg
          shadow-xl
          border
          ${theme.table.divider}
          min-w-37.5
        `}>
          <p className={`text-xs font-medium ${theme.text.primary} mb-1`}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <span className={`${theme.text.muted}`}>{entry.name}:</span>
              <span className={`font-semibold ${theme.text.primary}`}>{entry.value}</span>
            </div>
          ))}
          {payload.length > 0 && payload[0]?.payload?.completionRate > 0 && (
            <div className="flex items-center justify-between gap-4 text-sm mt-1 pt-1 border-t border-gray-700/30">
              <span className={`${theme.text.muted}`}>Rate:</span>
              <span className={`font-semibold ${theme.text.success}`}>
                {payload[0].payload.completionRate}%
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex items-center justify-center gap-4 mt-3">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <span
              className="w-3 h-0.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className={`text-xs ${theme.text.secondary}`}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const getTrendIcon = () => {
    if (stats.completionRate >= 70) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (stats.completionRate >= 40) return <Activity className="h-4 w-4 text-amber-400" />;
    return <TrendingDown className="h-4 w-4 text-red-400" />;
  };

  return (
    <div className={`
      ${theme.card.primary}
      ${theme.table.divider}
      border
      rounded-xl
      p-5
      h-full
      min-h-95
      transition-all
      duration-300
      hover:shadow-lg
      hover:shadow-blue-500/5
    `}>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-blue-500/10 ${theme.text.info}`}>
            <Activity size={20} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${theme.text.primary}`}>
              Task Activity
            </h3>
            <p className={`text-xs ${theme.text.muted}`}>
              Assigned vs Completed Tasks
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">

          <div className="flex items-center gap-3">
            {/* Quick Stats */}
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/5">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                <span className={`text-xs font-medium ${theme.text.primary}`}>
                  {stats.completionRate}%
                </span>
              </div>
              <div className="w-px h-4 bg-gray-700/50" />
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                <span className={`text-xs ${theme.text.muted}`}>
                  {stats.overdue} overdue
                </span>
              </div>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`
                ${theme.input.select}
                rounded-lg
                px-3 py-1.5
                text-sm
                outline-none
                cursor-pointer
                w-full sm:w-auto
                border
                ${theme.table.divider}
              `}
            >
              <option value="7">7 Days</option>
              <option value="30">30 Days</option>
              <option value="90">90 Days</option>
              <option value="180">180 Days</option>
              <option value="365">Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className={`p-2 rounded-lg bg-blue-500/5 border border-blue-500/10`}>
          <p className={`text-xs ${theme.text.muted}`}>Assigned</p>
          <p className={`text-lg font-bold ${theme.text.info}`}>{stats.totalAssigned}</p>
        </div>
        <div className={`p-2 rounded-lg bg-green-500/5 border border-green-500/10`}>
          <p className={`text-xs ${theme.text.muted}`}>Completed</p>
          <p className={`text-lg font-bold ${theme.text.success}`}>{stats.totalCompleted}</p>
        </div>
        <div className={`p-2 rounded-lg bg-purple-500/5 border border-purple-500/10`}>
          <p className={`text-xs ${theme.text.muted}`}>Rate</p>
          <div className="flex items-center gap-1.5">
            <p className={`text-lg font-bold ${theme.text.primary}`}>{stats.completionRate}%</p>
            {getTrendIcon()}
          </div>
        </div>
        <div className={`p-2 rounded-lg bg-amber-500/5 border border-amber-500/10`}>
          <p className={`text-xs ${theme.text.muted}`}>Overdue</p>
          <p className={`text-lg font-bold ${theme.text.danger}`}>{stats.overdue}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-60 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="AssignedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke={theme.table?.divider || "#263041"}
              strokeDasharray="3 3"
              opacity={0.5}
            />

            <XAxis
              dataKey="day"
              stroke="#9ca3af"
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
              tickMargin={8}
            />

            <YAxis
              stroke="#9ca3af"
              tick={{ fontSize: 10 }}
              allowDecimals={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend content={<CustomLegend />} />

            <Area
              type="monotone"
              dataKey="Assigned"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#AssignedGradient)"
              dot={{ r: 3, strokeWidth: 1 }}
              activeDot={{ r: 5 }}
              name="Assigned"
            />

            <Area
              type="monotone"
              dataKey="completed"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#completedGradient)"
              dot={{ r: 3, strokeWidth: 1 }}
              activeDot={{ r: 5 }}
              name="Completed"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Stats */}
      {tasks.length > 0 && (
        <div className={`mt-3 pt-2 border-t ${theme.table.divider} flex flex-wrap items-center justify-between gap-2`}>
          <div className="flex items-center gap-4">
            <span className={`text-xs ${theme.text.muted}`}>
              Total: <span className={`font-medium ${theme.text.primary}`}>{stats.total}</span>
            </span>
            <span className={`text-xs ${theme.text.muted}`}>
              Todo: <span className={`font-medium ${theme.text.muted}`}>{stats.todo}</span>
            </span>
            <span className={`text-xs ${theme.text.muted}`}>
              Progress: <span className={`font-medium ${theme.text.info}`}>{stats.inProgress}</span>
            </span>
            <span className={`text-xs ${theme.text.muted}`}>
              Review: <span className={`font-medium ${theme.text.warning}`}>{stats.review}</span>
            </span>
          </div>
          <span className={`text-xs ${theme.text.muted}`}>
            {filter === "7" ? "Last 7 days" :
             filter === "30" ? "Last 30 days" :
             filter === "90" ? "Last 90 days" :
             filter === "180" ? "Last 180 days" :
             "Last year"}
          </span>
        </div>
      )}
    </div>
  );
};

export default TasksActivity;