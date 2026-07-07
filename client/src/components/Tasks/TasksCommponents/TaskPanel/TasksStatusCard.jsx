import React from 'react'
import { useTheme } from '../../../../context/ThemeProvider'
import {
  ClipboardList,
  CircleDashed,
  LoaderCircle,
  Eye,
  CircleCheckBig,
  ClockAlert,
  ArrowRight 
} from "lucide-react";

const TasksStatusCard = ({ title, detail, total, TextColor, onClick }) => {
  const { theme } = useTheme();

  const getIcon = (title) => {
    const iconMap = {
      "Total Task": <ClipboardList size={28} />,
      "To Do": <CircleDashed size={28} />,
      "In Progress": <LoaderCircle size={28} />,
      "Review": <Eye size={28} />,
      "Completed": <CircleCheckBig size={28} />,
      "Overdue": <ClockAlert size={28} />
    };
    return iconMap[title] || <ClipboardList size={28} />;
  };

  // Get status color based on title
  const getStatusColor = (title) => {
    const colorMap = {
      "Total Task": theme.text.info,
      "To Do": theme.text.muted,
      "In Progress": theme.text.info,
      "Review": theme.text.warning,
      "Completed": theme.text.success,
      "Overdue": theme.text.danger
    };
    return colorMap[title] || theme.text.info;
  };

  const iconColor = getStatusColor(title);

  return (
    <div className={`
      ${theme.card.primary}
      ${theme.card.hover}
      ${theme.border}
      px-5
      py-4
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-xl
      hover:shadow-blue-500/5
      group
      cursor-pointer
    `}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`
          p-2.5 rounded-xl
          bg-white/5
          ${iconColor}
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:bg-white/10
          shrink-0
        `}>
          {getIcon(title)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`${theme.text.secondary} text-sm font-medium truncate`}>
            {title}
          </h3>
          <p className={`text-3xl font-bold ${theme.text.primary} mt-1`}>
            {total || 0}
          </p>
          {detail && (
            <p className={`${theme.text.muted} text-xs mt-0.5`}>
              {detail}
            </p>
          )}
        </div>
      </div>

      {/* Footer - View Details Link */}
      <div className="flex items-center justify-end mt-3 pt-2 border-t border-gray-700/30">
        <button 
          onClick={onClick}
          className={`
            flex items-center gap-1.5
            text-xs
            ${theme.text.info}
            hover:${theme.text.primary}
            transition-all
            duration-200
            group-hover:gap-2
            cursor-pointer
          `}
        >
          <span>View Details</span>
          <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  )
}

export default TasksStatusCard