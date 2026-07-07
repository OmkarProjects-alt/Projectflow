import React, { useMemo } from "react";
import FormateDate from '../../../utils/FormateDate';
import { useTaskStore } from "../../../store/tasksStore";
import { ClockFadingIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeProvider";

const UpcomingDeadlines = () => {
  const { theme } = useTheme();
  const tasks = useTaskStore((state) => state.MyTasks);

  const UpCommingDeadLineTasks = useMemo(() => {
    return tasks.filter((task) => {
      const days = FormateDate(task.deadline, "convertToDays");
      if (days < 7 && days > 0) {
        return task;
      }
      return null;
    });
  }, [tasks]);

  if (UpCommingDeadLineTasks.length === 0) {
    return (
      <div className={`${theme.card.primary} ${theme.border} p-5`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 items-center">
            <ClockFadingIcon className={`h-6 w-6 ${theme.text.warning}`} />
            <h3 className={`text-lg font-semibold ${theme.text.primary}`}>
              Upcoming Deadlines
            </h3>
          </div>
          <Link
            className={`flex gap-2 ${theme.text.info} items-center text-sm hover:gap-3 transition-all duration-200`}
            to={'/projectflow/tasks'}
          >
            View All
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <p className={`${theme.text.muted} text-center py-8`}>
          No upcoming deadlines in the next 7 days
        </p>
      </div>
    );
  }

  return (
    <div className={`${theme.card.primary} ${theme.border} p-5`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 items-center">
          <ClockFadingIcon className={`h-6 w-6 ${theme.text.warning}`} />
          <h3 className={`text-lg font-semibold ${theme.text.primary}`}>
            Upcoming Deadlines
          </h3>
        </div>
        <Link
          className={`flex gap-2 ${theme.text.info} items-center text-sm hover:gap-3 transition-all duration-200`}
          to={'/projectflow/tasks'}
        >
          View All
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {UpCommingDeadLineTasks.map((task, index) => (
          <Link
            key={task.id || index}
            to={`/projectflow/tasks/${task.id}`}
            className={`
              flex items-center justify-between
              p-3 rounded-lg
              ${theme.card.hover}
              transition-all duration-200
              group
            `}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Date Badge */}
              <div className={`
                flex flex-col items-center
                ${theme.text.info}
                p-2 px-4 rounded-lg
                bg-blue-500/10
                dark:bg-blue-500/20
                shrink-0
                min-w-15
              `}>
                <p className="text-xs font-medium uppercase">
                  {FormateDate(task.deadline, "month")}
                </p>
                <p className={`text-2xl font-bold ${theme.text.primary}`}>
                  {FormateDate(task.deadline, "day")}
                </p>
              </div>

              {/* Task Title */}
              <div className="flex-1 min-w-0">
                <h2 className={`${theme.text.primary} font-medium truncate group-hover:text-blue-400 transition-colors duration-200`}>
                  {task.title}
                </h2>
                {task.projectName && (
                  <p className={`${theme.text.muted} text-xs truncate`}>
                    {task.projectName}
                  </p>
                )}
              </div>
            </div>

            {/* Days Badge */}
            <div className={`
              shrink-0
              px-3 py-1
              rounded-full
              text-sm
              font-medium
              ${theme.status.overdue}
              ml-2
            `}>
              In {FormateDate(task.deadline, "convertToDays")} days
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;