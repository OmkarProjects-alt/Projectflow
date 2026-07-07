import React, { useState, useMemo } from 'react'
import { useTaskStore } from '../../../store/tasksStore'
import { useTheme } from '../../../context/ThemeProvider'
import { ArrowRight, CheckSquare, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import FormateDate from "../../../utils/FormateDate";

const MyTasks = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState("all");

  const Tasks = useTaskStore((state) => state.MyTasks);

  const filterTasks = useMemo(() => {
    if (filter === "all") return Tasks;

    if (filter === "overdue") {
      return Tasks.filter((task) => {
        const deadline = new Date(task.deadline);
        const currentDate = new Date();
        return deadline < currentDate;
      });
    }

    return Tasks.filter((task) => 
      task.status?.toLowerCase() === filter
    );
  }, [Tasks, filter]);

  const ButtonActions = [
    { name: "All", value: "all" },
    { name: "In Progress", value: "in progress" },
    { name: "Completed", value: "completed" },
    { name: "Overdue", value: "overdue" },
  ];

  const StatusColor = {
    "Todo": theme.status.todo,
    "In Progress": theme.status.progress,
    "Completed": theme.status.completed,
    "Review": theme.status.review,
    "Overdue": theme.status.overdue,
  };

  const getStatusColor = (status) => {
    return StatusColor[status] || theme.status.todo;
  };

  // Priority indicators
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return theme.priority.high;
      case 'medium':
        return theme.priority.medium;
      case 'low':
        return theme.priority.low;
      default:
        return theme.text.muted;
    }
  };

  return (
    <div className={`${theme.card.primary} ${theme.border} max-h-125 h-full flex flex-col`}>
      {/* Header Section */}
      <div className='flex items-center justify-between px-5 py-3 border-b border-gray-800/50'>
        <div className='flex items-center gap-2'>
          <CheckSquare className={`h-5 w-5 ${theme.text.info}`} />
          <h1 className={`text-lg font-bold ${theme.text.primary}`}>
            My Tasks
          </h1>
          <span className={`text-xs ${theme.text.muted} bg-white/5 px-2 py-0.5 rounded-full`}>
            {filterTasks?.length || 0}
          </span>
        </div>

        <Link
          className={`flex text-sm ${theme.text.info} items-center gap-1 hover:gap-2 transition-all duration-200`}
          to={'/projectflow/tasks'}
        >
          View all
          <ArrowRight className='h-4 w-4' />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className={`flex items-center gap-1 px-5 ${theme.text.secondary} border-b ${theme.table.divider} overflow-x-auto scrollbar-hide`}>
        {ButtonActions.map((btn) => (
          <button
            key={btn.value}
            className={`
              pb-2.5 px-3 text-sm
              transition-all duration-200
              whitespace-nowrap
              ${filter === btn.value 
                ? `${theme.text.info} border-b-2 border-blue-500 font-semibold` 
                : `hover:${theme.text.primary}`
              }
            `}
            onClick={() => setFilter(btn.value)}
          >
            {btn.name}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className='flex-1 overflow-y-auto p-2 space-y-1'>
        {filterTasks?.length === 0 ? (
          <div className={`${theme.text.muted} text-center py-8`}>
            <CheckSquare className='h-12 w-12 mx-auto mb-2 opacity-20' />
            <p className='text-sm'>No tasks found</p>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className={`text-xs ${theme.text.info} hover:underline mt-1`}
              >
                Clear filter
              </button>
            )}
          </div>
        ) : (
          filterTasks.slice(0, 5).map((task) => (
            <Link
              key={task.id || task.taskId}
              to={`/projectflow/task/${task.tid}`}
              className={`
                flex items-center justify-between
                px-3 py-2.5
                rounded-lg
                ${theme.card.hover}
                transition-all duration-200
                group
                cursor-pointer
              `}
            >
              {/* Task Title */}
              <div className='flex-1 min-w-0'>
                <p className={`${theme.text.primary} text-sm font-medium truncate group-hover:text-blue-400 transition-colors duration-200`}>
                  {task.title || "Untitled Task"}
                </p>
                {task.projectName && (
                  <p className={`${theme.text.muted} text-xs truncate mt-0.5`}>
                    {task.projectName}
                  </p>
                )}
              </div>

              {/* Status Badge */}
              <div className='flex items-center gap-3 shrink-0 ml-3'>
                <span className={`
                  text-xs px-2.5 py-1 rounded-full
                  ${getStatusColor(task.status)}
                `}>
                  {task.status || "Todo"}
                </span>

                {/* Priority Indicator (optional) */}
                {task.priority && (
                  <span className={`
                    hidden sm:inline-block
                    w-2 h-2 rounded-full
                    ${getPriorityColor(task.priority)}
                  `} />
                )}

                {/* Deadline */}
                <span className={`${theme.text.muted} text-xs hidden md:inline-block`}>
                  {FormateDate(task.deadline, "toLocal")}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Footer - View All Link */}
      {filterTasks?.length > 5 && (
        <div className='px-3 py-2 border-t border-gray-800/50 text-center'>
          <Link
            to={'/projectflow/tasks'}
            className={`text-xs ${theme.text.info} hover:underline transition-all duration-200`}
          >
            View all {filterTasks.length} tasks
          </Link>
        </div>
      )}
    </div>
  )
}

export default MyTasks;