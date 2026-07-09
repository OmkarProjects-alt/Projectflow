import React from "react";
import { useTheme } from "../../../context/ThemeProvider";
import {
  FolderKanban,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

const ProfileCardStateSection = ({
  title,
  value,
  detail,
}) => {
  const { theme } = useTheme();

  const getIcon = () => {
    const iconMap = {
      "Projects": <FolderKanban size={22} />,
      "Task Assigned": <ClipboardList size={22} />,
      "Task Completed": <CheckCircle2 size={22} />,
      "Overdue Tasks": <AlertTriangle size={22} />,
    };
    return iconMap[title] || <FolderKanban size={22} />;
  };

  const getColor = () => {
    const colorMap = {
      "Projects": theme.text.info,
      "Task Assigned": theme.text.warning,
      "Task Completed": theme.text.success,
      "Overdue Tasks": theme.text.danger,
    };
    return colorMap[title] || theme.text.muted;
  };

  const getIconBg = () => {
    const bgMap = {
      "Projects": "bg-blue-500/15",
      "Task Assigned": "bg-purple-500/15",
      "Task Completed": "bg-green-500/15",
      "Overdue Tasks": "bg-rose-500/15",
    };
    return bgMap[title] || "bg-gray-500/15";
  };

  const iconColor = getColor();
  const iconBg = getIconBg();
  const Icon = getIcon();

  // Determine if value is high for visual emphasis
  const isHighValue = value > 0;
  const isOverdue = title === "Overdue Tasks" && value > 0;

  return (
    <div className={`
      ${theme.card.primary}
      ${theme.card.hover}
      ${theme.border}
      p-5
      rounded-xl
      transition-all
      duration-300
      hover:-translate-y-1
      group
      min-w-[200px]
      flex-1
    `}>
      <div className="flex items-center justify-between">
        {/* Left - Title & Value */}
        <div className="flex-1 min-w-0">
          <p className={`${theme.text.muted} text-sm font-medium truncate`}>
            {title}
          </p>
          <h2 className={`
            text-3xl 
            font-bold 
            mt-1.5
            transition-all
            duration-300
            group-hover:scale-105
            origin-left
            ${isOverdue ? theme.text.danger : theme.text.primary}
          `}>
            {value || 0}
          </h2>
        </div>

        {/* Right - Icon */}
        <div className={`
          flex-shrink-0
          w-12 h-12
          rounded-xl
          flex
          items-center
          justify-center
          ${iconBg}
          ${iconColor}
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:rotate-3
        `}>
          {Icon}
        </div>
      </div>

      {/* Footer - Detail & Action */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700/30">
        <p className={`${theme.text.muted} text-sm truncate flex-1`}>
          {detail || "No data available"}
        </p>
        
        {/* View Details Arrow - Shows on hover */}
        <button className={`
          flex items-center gap-1
          text-xs
          ${theme.text.info}
          opacity-0
          group-hover:opacity-100
          transition-all
          duration-200
          hover:gap-2
          cursor-pointer
          flex-shrink-0
          ml-2
        `}>
          <span className="hidden sm:inline">View</span>
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Progress Bar for Overdue Tasks */}
      {isOverdue && (
        <div className="mt-3 h-1 bg-gray-700/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min((value / 10) * 100, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default ProfileCardStateSection;