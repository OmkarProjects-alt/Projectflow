import React from 'react'
import { useTheme } from '../../../../context/ThemeProvider'
import CommonCards from '../../../common/CommonCards';

const StateSection = ({ project, tasks }) => {
  const { theme } = useTheme();

  const totalTask = tasks?.length || 0;

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

  const completionPercentage = totalTask > 0 
    ? Math.round((completedTask / totalTask) * 100) 
    : 0;

  return (
    <div className="space-y-4">
      {tasks?.length === 0 ? (
        <div className={`
          ${theme.card.primary}
          p-8
          text-center
          transition-all
          duration-300
        `}>
          <div className="flex flex-col items-center gap-2">
            <div className={`
              p-4 rounded-full
              bg-gray-500/10
              ${theme.text.muted}
            `}>
              <svg 
                className="h-10 w-10" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <p className={`${theme.text.primary} text-lg font-medium`}>
              No tasks available
            </p>
            <p className={`${theme.text.muted} text-sm`}>
              Create tasks to track your project progress
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Progress Overview Bar */}
          <div className={`
            ${theme.card.primary}
            ${theme.border}
            p-4
            flex
            flex-col
            sm:flex-row
            items-start
            sm:items-center
            justify-between
            gap-3
          `}>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className={`text-sm font-medium ${theme.text.secondary}`}>
                Project Progress
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
                {completedTask} / {totalTask} tasks
              </span>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            <CommonCards
              title="Total Task"
              value={totalTask}
              textColor={theme.text.info}
              className="col-span-1"
            />
            <CommonCards
              title="Completed"
              value={completedTask}
              textColor={theme.text.success}
              className="col-span-1"
            />
            <CommonCards
              title="In Progress"
              value={InProgressTask}
              textColor={theme.text.info}
              className="col-span-1"
            />
            <CommonCards
              title="To Do"
              value={AllTodo}
              textColor={theme.text.muted}
              className="col-span-1"
            />
            <CommonCards
              title="Review"
              value={AllReview}
              textColor={theme.text.warning}
              className="col-span-1"
            />
          </div>

          {/* Quick Stats Footer */}
          <div className={`
            ${theme.card.secondary}
            ${theme.border}
            p-3
            flex
            flex-wrap
            items-center
            justify-between
            gap-2
            text-xs
          `}>
            <div className={`${theme.text.muted}`}>
              <span className="font-medium">Total Tasks:</span> {totalTask}
            </div>
            <div className={`${theme.text.muted}`}>
              <span className="font-medium">Completed:</span> {completedTask}
            </div>
            <div className={`${theme.text.muted}`}>
              <span className="font-medium">In Progress:</span> {InProgressTask}
            </div>
            <div className={`${theme.text.muted}`}>
              <span className="font-medium">To Do:</span> {AllTodo}
            </div>
            <div className={`${theme.text.muted}`}>
              <span className="font-medium">Review:</span> {AllReview}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default StateSection