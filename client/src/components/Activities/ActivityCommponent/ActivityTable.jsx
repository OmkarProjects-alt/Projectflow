import React, { useEffect, useState, useMemo } from 'react'
import { useActivityStore } from '../../../store/activityStore';
import { useProjectStore } from '../../../store/projectStore';
import { useTheme } from '../../../context/ThemeProvider';
import {
  Activity,
  FolderKanban,
  UserPlus,
  UserMinus,
  UserCheck,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Flag,
  Users,
  Loader2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ActivityTable = () => {
  const { theme } = useTheme();
  const {
    fetchActivities,
    loading,
  } = useActivityStore();

  const activities = useActivityStore((state) => state.activities);
  const pagination = useActivityStore((state) => state.pagination);

  const MyProjects = useProjectStore((state) => state.MyProjects);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(pagination.page);
  const [projectId, setProjectId] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const ITEMS_PER_PAGE = pagination.limit;

  console.log("all activities", activities, "and my pagination", pagination);

  useEffect(() => {

    fetchActivities({

        page: currentPage,

        limit: 10,

        search: debouncedSearch,

        type:
            filterType === "My_Projects" ||
            filterType === "Assigned_Project"
                ? "all"
                : filterType,

        projectId,

    });

  }, [
      currentPage,
      debouncedSearch,
      filterType,
      projectId,
  ]);


  useEffect(() => {
      const timer = setTimeout(() => {
          setDebouncedSearch(searchQuery);
      }, 500);

      return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {

      setCurrentPage(1);

  }, [
      debouncedSearch,
      filterType,
      projectId,
  ]);

  const getActivityIcon = (type) => {
    const iconMap = {
      'PROJECT_CREATED': <FolderKanban size={18} className="text-emerald-400" />,
      'PROJECT_UPDATED': <Edit size={18} className="text-blue-400" />,
      'MEMBER_INVITED': <UserPlus size={18} className="text-purple-400" />,
      'MEMBER_JOINED': <UserCheck size={18} className="text-green-400" />,
      'MEMBER_REMOVED': <UserMinus size={18} className="text-red-400" />,
      'TASK_CREATED': <CheckCircle size={18} className="text-blue-400" />,
      'TASK_ASSIGNED': <Users size={18} className="text-amber-400" />,
      'TASK_UPDATED': <Edit size={18} className="text-indigo-400" />,
      'TASK_STATUS_CHANGED': <Clock size={18} className="text-cyan-400" />,
      'TASK_PRIORITY_CHANGED': <Flag size={18} className="text-orange-400" />,
      'TASK_COMPLETED': <CheckCircle size={18} className="text-green-400" />,
      'TASK_DELETED': <Trash2 size={18} className="text-red-400" />,
    };
    return iconMap[type] || <Activity size={18} className="text-neutral-400" />;
  };

  const getActivityBg = (type) => {
    const bgMap = {
      'PROJECT_CREATED': 'bg-emerald-500/10 border-emerald-500/20',
      'PROJECT_UPDATED': 'bg-blue-500/10 border-blue-500/20',
      'MEMBER_INVITED': 'bg-purple-500/10 border-purple-500/20',
      'MEMBER_JOINED': 'bg-green-500/10 border-green-500/20',
      'MEMBER_REMOVED': 'bg-red-500/10 border-red-500/20',
      'TASK_CREATED': 'bg-blue-500/10 border-blue-500/20',
      'TASK_ASSIGNED': 'bg-amber-500/10 border-amber-500/20',
      'TASK_UPDATED': 'bg-indigo-500/10 border-indigo-500/20',
      'TASK_STATUS_CHANGED': 'bg-cyan-500/10 border-cyan-500/20',
      'TASK_PRIORITY_CHANGED': 'bg-orange-500/10 border-orange-500/20',
      'TASK_COMPLETED': 'bg-green-500/10 border-green-500/20',
      'TASK_DELETED': 'bg-red-500/10 border-red-500/20',
    };
    return bgMap[type] || 'bg-neutral-500/5 border-neutral-500/10';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      'PROJECT_CREATED': theme.text.success,
      'PROJECT_UPDATED': theme.text.info,
      'MEMBER_INVITED': theme.text.warning,
      'MEMBER_JOINED': theme.text.success,
      'MEMBER_REMOVED': theme.text.danger,
      'TASK_CREATED': theme.text.info,
      'TASK_ASSIGNED': theme.text.warning,
      'TASK_UPDATED': theme.text.info,
      'TASK_STATUS_CHANGED': theme.text.info,
      'TASK_PRIORITY_CHANGED': theme.text.warning,
      'TASK_COMPLETED': theme.text.success,
      'TASK_DELETED': theme.text.danger,
    };
    return colorMap[type] || theme.text.muted;
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = theme.avatar || [
      'from-blue-500 to-blue-700',
      'from-purple-500 to-purple-700',
      'from-amber-500 to-orange-600',
      'from-emerald-500 to-green-700',
      'from-pink-500 to-rose-700',
      'from-cyan-500 to-sky-700',
      'from-indigo-500 to-indigo-700',
      'from-red-500 to-red-700',
    ];
    const hash = name ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    return colors[hash % colors.length];
  };

  const activityTypes = [
    'all',
    'My_Projects',
    'Assigned_Project',
    'PROJECT_CREATED',
    'PROJECT_UPDATED',
    'MEMBER_INVITED',
    'MEMBER_JOINED',
    'MEMBER_REMOVED',
    'TASK_CREATED',
    'TASK_ASSIGNED',
    'TASK_UPDATED',
    'TASK_STATUS_CHANGED',
    'TASK_PRIORITY_CHANGED',
    'TASK_COMPLETED',
    'TASK_DELETED'
  ];

  const filteredActivities = useMemo(() => {

    let result = activities;

    if(filterType === "My_Projects") {
      MyProjects.forEach((project) => {
        result = result.filter(
          (activity) => activity.project_id === project.pid
        );
      });
    }

    if(filterType === "Assigned_Project") {
      MyProjects.forEach((project) => {
        result = result.filter(
          (activity) => activity.project_id !== project.pid
        );
      });
    }

    return result;
  }, [activities, filterType, fetchActivities])


  const totalPages = pagination.totalPages
  const from =
    pagination.total === 0
        ? 0
        : (pagination.page - 1) * pagination.limit + 1;

  const to =
      Math.min(pagination.page * pagination.limit, pagination.total);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`
              px-3 py-1.5
              rounded-lg
              text-sm
              font-medium
              transition-all
              duration-200
              ${currentPage === i
                ? `${theme.button.primary} text-white shadow-lg shadow-blue-500/20`
                : `${theme.button.secondary} ${theme.text.secondary} hover:${theme.text.primary}`
              }
            `}
          >
            {i}
          </button>
        );
      }
    } else {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
            ${currentPage === 1
              ? `${theme.button.primary} text-white shadow-lg shadow-blue-500/20`
              : `${theme.button.secondary} ${theme.text.secondary} hover:${theme.text.primary}`
            }
          `}
        >
          1
        </button>
      );

      if (currentPage > 4) {
        buttons.push(
          <span key="ellipsis1" className={`${theme.text.muted} px-1`}>...</span>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${currentPage === i
                ? `${theme.button.primary} text-white shadow-lg shadow-blue-500/20`
                : `${theme.button.secondary} ${theme.text.secondary} hover:${theme.text.primary}`
              }
            `}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 3) {
        buttons.push(
          <span key="ellipsis2" className={`${theme.text.muted} px-1`}>...</span>
        );
      }

      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
            ${currentPage === totalPages
              ? `${theme.button.primary} text-white shadow-lg shadow-blue-500/20`
              : `${theme.button.secondary} ${theme.text.secondary} hover:${theme.text.primary}`
            }
          `}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  const getTypeDisplay = (type) => {
    return type?.replace(/_/g, ' ') || 'Activity';
  };

  if (loading) {
    return (
      <div className={`${theme.card.primary} rounded-xl p-12 flex items-center justify-center`}>
        <Loader2 className={`h-8 w-8 ${theme.text.info} animate-spin`} />
      </div>
    );
  }

  return (
    <div className={`${theme.card.primary} rounded-xl overflow-hidden transition-all duration-300`}>
      {/* Header */}
      <div className={`p-4 border-b ${theme.table.divider}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-blue-500/10 ${theme.text.info}`}>
              <Activity size={20} />
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${theme.text.primary}`}>
                Activity Log
              </h2>
              <p className={`text-xs ${theme.text.muted}`}>
                {filteredActivities.length} total activities
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:min-w-[200px]">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted} h-4 w-4`} />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  w-full pl-9 pr-4 py-2
                  ${theme.input.input}
                  rounded-lg
                  text-sm
                  transition-all
                  duration-200
                  focus:ring-2
                  focus:ring-blue-500/50
                `}
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme.text.muted} h-4 w-4`} />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`
                  pl-9 pr-8 py-2
                  ${theme.input.select}
                  rounded-lg
                  text-sm
                  cursor-pointer
                  appearance-none
                  bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')]
                  bg-no-repeat
                  bg-[length:18px]
                  bg-[right_12px_center]
                  min-w-[140px]
                  transition-all
                  duration-200
                `}
              >
                {activityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Activities' : getTypeDisplay(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className={`${theme.table.header}`}>
            <tr className={`${theme.table.divider} border-b`}>
              <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                Actor
              </th>
              <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                Project name
              </th>
              <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                Activity
              </th>
              <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                Type
              </th>
              <th className={`py-3 px-4 text-left text-xs font-medium ${theme.text.secondary} uppercase tracking-wider`}>
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-center">
                  <div className={theme.text.muted}>
                    <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium">No activities found</p>
                    <p className="text-xs mt-1">
                      {searchQuery || filterType !== 'all' 
                        ? 'Try adjusting your search or filter'
                        : 'Activities will appear here as team members work'
                      }
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredActivities.map((activity) => {
                const avatarColor = getAvatarColor(activity.actor_name);
                const initials = getInitials(activity.actor_name);
                const activityBg = getActivityBg(activity.type);
                const activityColor = getActivityColor(activity.type);

                return (
                  <tr
                    key={activity.aid}
                    className={`
                      ${theme.table.row}
                      ${theme.table.divider}
                      border-b
                      transition-all
                      duration-200
                      hover:shadow-md
                    `}
                  >
                    {/* Actor */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-8 h-8
                          rounded-full
                          bg-gradient-to-br
                          ${avatarColor}
                          flex items-center justify-center
                          text-white text-xs font-semibold
                          flex-shrink-0
                          shadow-md
                        `}>
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className={`${theme.text.primary} text-sm font-medium truncate max-w-32`}>
                            {activity.actor_name || 'Unknown User'}
                          </p>
                          <p className={`${theme.text.muted} text-xs truncate max-w-32`}>
                            {activity.actor_email || 'No email'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                            <div 
                                className={`
                                    w-8 h-8
                                    rounded-full
                                    bg-gradient-to-br
                                    ${getAvatarColor(activity?.project_name)}
                                    flex items-center justify-center
                                    text-white text-xs font-semibold
                                    flex-shrink-0
                                    shadow-md
                                `}
                            >
                                {getInitials(activity?.project_name)}
                            </div>
                            <div className="min-w-0">
                                <p className={`${theme.text.primary} text-sm font-medium truncate max-w-32`}>
                                    {activity.project_name || 'Unknown Project'}
                                </p>
                            </div>
                      </div>
                    </td>

                    {/* Activity */}
                    <td className="px-4 py-3.5">
                      <div className="min-w-0">
                        <p className={`${theme.text.primary} text-sm truncate max-w-60`}>
                          {activity.title || 'Activity'}
                        </p>
                        {activity.message && (
                          <p className={`${theme.text.muted} text-xs truncate max-w-60 mt-0.5`}>
                            {activity.message}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`p-1 rounded ${activityBg}`}>
                          {getActivityIcon(activity.type)}
                        </span>
                        <span className={`text-xs font-medium ${activityColor}`}>
                          {getTypeDisplay(activity.type)}
                        </span>
                      </div>
                    </td>

                    {/* Time */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col">
                        <span className={`${theme.text.secondary} text-sm`}>
                          {getTimeAgo(activity.created_at)}
                        </span>
                        <span className={`${theme.text.muted} text-xs`}>
                          {new Date(activity.created_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredActivities.length > 0 && (
        <div className={`
          flex flex-col sm:flex-row items-center justify-between
          gap-3 p-4
          ${theme.table.divider}
          border-t
        `}>
          <span className={`${theme.text.muted} text-sm`}>
            Showing {from} - {to} of {pagination.total} activities
          </span>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className={`
                flex items-center gap-1
                px-3 py-1.5
                rounded-lg
                text-sm
                ${theme.button.secondary}
                ${theme.text.secondary}
                transition-all
                duration-200
                disabled:opacity-40
                disabled:cursor-not-allowed
                hover:${theme.text.primary}
              `}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>

            {renderPaginationButtons()}

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`
                flex items-center gap-1
                px-3 py-1.5
                rounded-lg
                text-sm
                ${theme.button.secondary}
                ${theme.text.secondary}
                transition-all
                duration-200
                disabled:opacity-40
                disabled:cursor-not-allowed
                hover:${theme.text.primary}
              `}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivityTable