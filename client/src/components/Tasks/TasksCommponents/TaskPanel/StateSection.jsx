import React from 'react'
import { useTheme } from '../../../../context/ThemeProvider'
import TasksStatusCard from './TasksStatusCard';
import { ClipboardList, AlertCircle } from 'lucide-react'

const StateSection = ({ tasks }) => {
  const { theme } = useTheme();

  const totalTask = tasks?.length || 0;

  const overdueTasks = tasks?.filter((task) => {
    const today = new Date();
    return (
      new Date(task.deadline) < today &&
      task.status?.toLowerCase() !== "completed"
    );
  }) || [];

  const overdueCount = overdueTasks.length;

  const completedTask = tasks?.filter(
    (task) => task.status?.toLowerCase() === 'completed'
  ).length || 0;

  const InProgressTask = tasks?.filter(
    (task) => task.status?.toLowerCase() === 'in progress'
  ).length || 0;

  const AllReview = tasks?.filter(
    (task) => task.status?.toLowerCase() === 'review'
  ).length || 0;

  const AllTodo = tasks?.filter(
    (task) => task.status?.toLowerCase() === 'todo'
  ).length || 0;

  // Calculate completion percentage
  const completionPercentage = totalTask > 0 
    ? Math.round((completedTask / totalTask) * 100) 
    : 0;

  // Check if there are overdue tasks
  const hasOverdueTasks = overdueCount > 0;

  return (
    <div className="space-y-4">
      {tasks?.length === 0 ? (
        <div>
         
        </div>
      ) : (
        <>
          {/* Progress Overview */}
          <div className={`
            ${theme.card.secondary}
            ${theme.border}
            p-4
            flex
            flex-col
            sm:flex-row
            items-start
            sm:items-center
            justify-between
            gap-3
            rounded-xl
          `}>
            <div className={`flex items-center gap-3 w-full sm:w-auto`}>
              <span className={`text-sm font-medium ${theme.text.secondary}`}>
                Overall Progress
              </span>
              <div className="flex-1 sm:w-48 h-2 bg-gray-700/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <span className={`text-sm font-semibold ${theme.text.primary}`}>
                {completionPercentage}%
              </span>
              <span className={`text-xs ${theme.text.muted}`}>
                {completedTask} / {totalTask} completed
              </span>
              {hasOverdueTasks && (
                <span className={`
                  flex items-center gap-1
                  text-xs
                  ${theme.text.danger}
                  px-2 py-0.5
                  rounded-full
                  bg-red-500/10
                `}>
                  <AlertCircle className="h-3 w-3" />
                  {overdueCount} overdue
                </span>
              )}
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <TasksStatusCard
              title="Total Task"
              total={totalTask}
              TextColor={theme.text.info}
            />
            <TasksStatusCard
              title="Completed"
              total={completedTask}
              TextColor={theme.text.success}
            />
            <TasksStatusCard
              title="In Progress"
              total={InProgressTask}
              TextColor={theme.text.info}
            />
            <TasksStatusCard
              title="Review"
              total={AllReview}
              TextColor={theme.text.warning}
            />
            <TasksStatusCard
              title="To Do"
              total={AllTodo}
              TextColor={theme.text.muted}
            />
            <TasksStatusCard
              title="Overdue"
              total={overdueCount}
              TextColor={theme.text.danger}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default StateSection