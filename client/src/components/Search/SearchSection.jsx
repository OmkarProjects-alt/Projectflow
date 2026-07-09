import { Link } from "react-router-dom";
import { useSearchStore } from "../../store/searchStore";
import { useTheme } from "../../context/ThemeProvider";
import { 
  FolderKanban, 
  FileText, 
  Users, 
  Activity,
  ChevronRight 
} from "lucide-react";

const SearchSection = ({ title, items, type }) => {
  const { theme } = useTheme();
  const { clearSearch } = useSearchStore();

  if (!items || items.length === 0) return null;

  const getIcon = () => {
    const iconClass = "text-gray-400";
    switch (type) {
      case 'project':
        return <FolderKanban size={16} className={`${iconClass} ${theme.text.info}`} />;
      case 'task':
        return <FileText size={16} className={`${iconClass} ${theme.text.success}`} />;
      case 'member':
        return <Users size={16} className={`${iconClass} ${theme.text.primary}`} />;
      case 'activity':
        return <Activity size={16} className={`${iconClass} text-orange-400`} />;
      default:
        return null;
    }
  };

  const getLink = (item) => {
    switch (type) {
      case 'project':
        return `/projectflow/projects/${item.id || item.pid}`;
      case 'task':
        return `/projectflow/task/${item.id || item.tid}`;
      case 'member':
        return `/profile/${item.id || item.uid}`;
      default:
        return '#';
    }
  };

  const getTitle = (item) => {
    return item.title || item.name || item.label || 'Untitled';
  };

  const getSubtitle = (item) => {
    if (type === 'project') return item.status || 'Project';
    if (type === 'task') return item.status || 'Task';
    if (type === 'member') return item.email || item.role || 'Member';
    if (type === 'activity') return item.description || 'Activity';
    return '';
  };

  const getStatusColor = (status) => {
    const statusMap = {
      "active": theme.status?.progress || "",
      "planning": theme.status?.todo || "",
      "on-hold": theme.status?.review || "",
      "completed": theme.status?.completed || "",
      "cancelled": theme.status?.overdue || "",
    };
    return statusMap[status?.toLowerCase()] || "";
  };

  return (
    <div className="py-1 sm:py-2 first:pt-1 sm:first:pt-2 last:pb-1 sm:last:pb-2">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5">
        <div className="hidden sm:block">
          {getIcon()}
        </div>
        <h3 className={`text-[10px] sm:text-xs font-semibold ${theme.text.muted} uppercase tracking-wider`}>
          {title}
        </h3>
        <span className={`text-[8px] sm:text-[10px] ${theme.text.muted} bg-neutral-800 px-1.5 py-0.5 rounded-full`}>
          {items.length}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-0.5">
        {items.map((item, index) => {
          const key = item.id || item.tid || item.pid || item.uid || index;
          const title = getTitle(item);
          const subtitle = getSubtitle(item);
          const link = getLink(item);
          const status = item.status;
          const statusColor = getStatusColor(status);

          return (
            <Link
              key={key}
              to={link}
              onClick={clearSearch}
              className={`
                flex
                items-center
                gap-2 sm:gap-3
                px-3 sm:px-4
                py-2 sm:py-2.5
                mx-0.5 sm:mx-1
                rounded-lg
                hover:bg-neutral-800/50
                transition-all
                duration-150
                group
                cursor-pointer
                active:bg-neutral-800/70
              `}
            >
              {/* Icon - Hidden on very small screens */}
              <div className={`
                hidden sm:flex
                p-1.5
                rounded-lg
                bg-neutral-800/50
                group-hover:bg-neutral-700/50
                transition-colors
                duration-200
              `}>
                {getIcon()}
              </div>

              {/* Mobile Icon - Smaller */}
              <div className={`
                flex sm:hidden
                p-1
                rounded-lg
                bg-neutral-800/50
                group-hover:bg-neutral-700/50
                transition-colors
                duration-200
              `}>
                {type === 'project' && <FolderKanban size={14} className={theme.text.info} />}
                {type === 'task' && <FileText size={14} className={theme.text.success} />}
                {type === 'member' && <Users size={14} className={theme.text.primary} />}
                {type === 'activity' && <Activity size={14} className="text-orange-400" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`
                  text-xs sm:text-sm 
                  ${theme.text.primary} 
                  truncate 
                  group-hover:${theme.text.info} 
                  transition-colors 
                  duration-200
                `}>
                  {title}
                </p>
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  {subtitle && (
                    <p className={`text-[10px] sm:text-xs ${theme.text.muted} truncate max-w-[100px] sm:max-w-none`}>
                      {subtitle}
                    </p>
                  )}
                  {status && (
                    <span className={`
                      text-[8px] sm:text-[10px] 
                      px-1 sm:px-1.5 
                      py-0.5 
                      rounded-full 
                      ${statusColor}
                      truncate
                      max-w-[50px] sm:max-w-none
                    `}>
                      {status}
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight 
                size={14} 
                className={`
                  ${theme.text.muted} 
                  opacity-0 
                  group-hover:opacity-100 
                  transition-all 
                  duration-200 
                  group-hover:translate-x-0.5
                  flex-shrink-0
                `} 
              />
            </Link>
          );
        })}
      </div>

      {/* Divider */}
      <div className={`mx-3 sm:mx-4 mt-1 sm:mt-2 h-px bg-neutral-800`} />
    </div>
  );
};

export default SearchSection;