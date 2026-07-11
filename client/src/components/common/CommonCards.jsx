import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeProvider';
import {
  ClipboardList,
  CircleDashed,
  LoaderCircle,
  Eye,
  CheckCircle2,
  User,
  FolderKanban,
  CalendarDays,
  Activity,
  ArrowRight,
  Users,
  Clock,
  TrendingUp,
  BarChart3,
  Folder
} from "lucide-react";

const CommonCards = ({
  title,
  value,
  textColor = "text-blue-400",
  link,
  from,
  subtitle,
  trend,
  trendPercentage,
  className = "",
  onClick,
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Icon mapping for better performance and maintainability
  const iconMap = useMemo(() => ({
    "Total Task": ClipboardList,
    "Completed": CheckCircle2,
    "In Progress": LoaderCircle,
    "To Do": CircleDashed,
    "Review": Eye,
    "Assigned To": User,
    "Assigned By": User,
    "Project": FolderKanban,
    "Deadline": CalendarDays,
    "Status": Activity,
    "Team": Users,
    "Time": Clock,
    "Progress": TrendingUp,
    "Analytics": BarChart3,
    "Projects": Folder,
    "Tasks": ClipboardList,
    "Pending": Clock
  }), []);

  const getIcon = () => {
    const IconComponent = iconMap[title];
    return IconComponent ? <IconComponent className="w-8 h-8" /> : null;
  };

  const getNavigationPath = () => {
    if (!link) return null;

    const pathMap = {
      "TaskCard": {
        "Assigned To": '/projectflow/user',
        "Assigned By": '/projectflow/user',
        "Project": '/projectflow/projects',
      }
    };

    return pathMap[from]?.[title] || null;
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (link && getNavigationPath()) {
      navigate(`${getNavigationPath()}/${link}`);
    }
  };

  const navigationPath = getNavigationPath();
  const isClickable = link && navigationPath;

  const getTrendColor = () => {
    if (!trend) return theme.text.muted;
    return trend === 'up' ? theme.text.success : theme.text.danger;
  };

  return (
    <div
      className={`
        relative
        group
        flex 
        flex-col
        justify-between 
        ${theme.card.primary}
        ${theme.text.primary}
        ${theme.border}
        px-5 
        py-4 
        transition-all 
        duration-300
        ${isClickable ? `${theme.card.hover} cursor-pointer` : ''}
        ${className}
      `}
      onClick={handleCardClick}
      role={isClickable ? "button" : "presentation"}
      tabIndex={isClickable ? 0 : -1}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className='flex items-start gap-4'>
        {/* Icon Section */}
        <div className="flex flex-col items-start gap-2">
          <div className={`
            ${textColor}
            w-14 h-14
            flex 
            items-center 
            justify-center
            rounded-lg
            bg-white/5
            transition-all
            duration-300
            group-hover:scale-110
            group-hover:bg-white/10
          `}>
            {getIcon()}
          </div>

          {isClickable && (
            <Link
              to={`${navigationPath}/${link}`}
              className={`
                text-xs 
                ${theme.text.info}
                flex 
                items-center 
                gap-1
                transition-all
                duration-200
                group-hover:gap-2
                font-medium
              `}
              onClick={(e) => e.stopPropagation()}
            >
              View Details
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`${theme.text.secondary} text-sm font-medium tracking-wide`}>
              {title}
            </h3>
            {trend && (
              <span className={`text-xs font-medium ${getTrendColor()} flex items-center gap-0.5`}>
                {trend === 'up' ? '↑' : '↓'}
                {trendPercentage && `${trendPercentage}%`}
              </span>
            )}
          </div>
          
          <div className="flex items-baseline gap-3 mt-1">
            <p className={`
              font-bold 
              ${from === "TaskCard" ? "text-xl" : "text-2xl"} 
              transition-all
              duration-300
              group-hover:scale-105
              origin-left
            `}>
              {value}
            </p>
          </div>

          {subtitle && (
            <p className={`${theme.text.muted} text-xs mt-1`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar indicator */}
      {trend && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-500/20 to-transparent rounded-b-xl overflow-hidden">
          <div 
            className={`h-full bg-linear-to-r ${trend === 'up' ? 'from-green-400 to-emerald-400' : 'from-red-400 to-rose-400'} transition-all duration-1000`}
            style={{ width: trendPercentage ? `${Math.min(trendPercentage, 100)}%` : '50%' }}
          />
        </div>
      )}
    </div>
  );
};

export default CommonCards;