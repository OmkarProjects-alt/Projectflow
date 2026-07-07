import React from 'react'
import { useTheme } from '../../../../context/ThemeProvider'
import { ClipboardCheck, Sparkles } from 'lucide-react'

const TaskHeader = () => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2">
      {/* Left Section - Title */}
      <div className="flex items-center gap-3">
        <div className={`
          p-2.5 rounded-xl
          bg-blue-500/10
          ${theme.text.info}
          hidden sm:flex
        `}>
          <ClipboardCheck className="h-6 w-6" />
        </div>
        
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${theme.text.primary}`}>
            My Tasks
          </h1>
          <p className={`${theme.text.muted} text-sm mt-0.5`}>
            Tasks that are assigned to me across all projects
          </p>
        </div>
      </div>

      {/* Right Section - Status Update Card */}
      <div className={`
        flex items-center gap-3
        p-3 pr-5
        ${theme.card.primary}
        ${theme.border}
        rounded-xl
        transition-all
        duration-300
        hover:shadow-lg
        hover:shadow-blue-500/5
        w-full
        md:w-auto
      `}>
        <div className={`
          p-2.5 rounded-lg
          bg-blue-500/15
          ${theme.text.info}
        `}>
          <Sparkles size={22} />
        </div>
        
        <div>
          <h3 className={`text-sm font-semibold ${theme.text.primary}`}>
            Update Task Status
          </h3>
          <p className={`text-xs ${theme.text.muted}`}>
            Track progress and get things done
          </p>
        </div>
      </div>
    </div>
  )
}

export default TaskHeader