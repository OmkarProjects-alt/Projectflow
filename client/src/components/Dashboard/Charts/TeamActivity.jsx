import React, { useState, useEffect, useMemo } from 'react'
import { useSocket } from '../../../context/SocketContext';
import { useTheme } from '../../../context/ThemeProvider';
import { useActivityStore } from '../../../store/activityStore';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
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
  Loader2
} from 'lucide-react';

const TeamActivity = () => {
  const {
    activities,
    fetchActivities,
    addActivity,
    loading,
  } = useActivityStore();

  const socket = useSocket();
  const { theme } = useTheme();
  const [visibleActivities, setVisibleActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    const handleActivity = (activity) => {
      addActivity(activity);
    };

    socket?.on("activity", handleActivity);

    return () => {
      socket?.off("activity", handleActivity);
    };
  }, [socket]);

  useEffect(() => {
    setVisibleActivities(activities.slice(0, 5));
  }, [activities]);

  console.log("my all activitys", activities);

  const getActivityIcon = (type) => {
    const iconMap = {
      'PROJECT_CREATED': <FolderKanban size={16} className="text-emerald-400" />,
      'PROJECT_UPDATED': <Edit size={16} className="text-blue-400" />,
      'MEMBER_INVITED': <UserPlus size={16} className="text-purple-400" />,
      'MEMBER_JOINED': <UserCheck size={16} className="text-green-400" />,
      'MEMBER_REMOVED': <UserMinus size={16} className="text-red-400" />,
      'TASK_CREATED': <CheckCircle size={16} className="text-blue-400" />,
      'TASK_ASSIGNED': <Users size={16} className="text-amber-400" />,
      'TASK_UPDATED': <Edit size={16} className="text-indigo-400" />,
      'TASK_STATUS_CHANGED': <Clock size={16} className="text-cyan-400" />,
      'TASK_PRIORITY_CHANGED': <Flag size={16} className="text-orange-400" />,
      'TASK_COMPLETED': <CheckCircle size={16} className="text-green-400" />,
      'TASK_DELETED': <Trash2 size={16} className="text-red-400" />,
    };
    return iconMap[type] || <Activity size={16} className="text-neutral-400" />;
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
      day: 'numeric'
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

  const formatMessage = (message) => {
    if (!message) return '';
    return message.length > 60 ? message.slice(0, 60) + '...' : message;
  };

  if (loading) {
    return (
      <div className={`w-full rounded-2xl ${theme.card.primary} ${theme.table.divider} border ${theme.text.primary} p-6 flex items-center justify-center min-h-50`}>
        <Loader2 className={`h-6 w-6 ${theme.text.info} animate-spin`} />
      </div>
    );
  }

  return (
    <div className={`w-full rounded-2xl ${theme.card.primary} ${theme.table.divider} border ${theme.text.primary} flex flex-col max-h-133`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${theme.table.divider} shrink-0`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-blue-500/10 ${theme.text.info}`}>
            <Activity size={18} />
          </div>
          <h3 className={`font-semibold ${theme.text.primary}`}>Team Activity</h3>
          {activities.length > 0 && (
            <span className={`text-xs ${theme.text.muted} bg-white/5 px-2 py-0.5 rounded-full`}>
              {activities.length}
            </span>
          )}
        </div>
        <Link
          to="/projectflow/activity"
          className={`flex items-center gap-1 text-xs ${theme.text.info} hover:${theme.text.primary} transition-colors duration-200 group`}
        >
          View All
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {visibleActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className={`p-3 rounded-full bg-gray-500/10 ${theme.text.muted} mb-3`}>
              <Activity size={24} />
            </div>
            <p className={`text-sm font-medium ${theme.text.primary}`}>No activity yet</p>
            <p className={`text-xs ${theme.text.muted} mt-1`}>
              Team activities will appear here
            </p>
          </div>
        ) : (
          visibleActivities.map((activity, index) => {
            const avatarColor = getAvatarColor(activity.actor_name);
            const initials = getInitials(activity.actor_name);
            const activityBg = getActivityBg(activity.type);
            const activityColor = getActivityColor(activity.type);

            return (
              <div
                key={activity.aid || index}
                className={`
                  p-3 rounded-xl
                  border
                  ${activityBg}
                  transition-all
                  duration-300
                  hover:bg-white/5
                  group
                  animate-in
                  fade-in
                  slide-in-from-right-4
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={`
                    shrink-0
                    w-8 h-8
                    rounded-full
                    bg-linear-to-br
                    ${avatarColor}
                    flex
                    items-center
                    justify-center
                    text-white
                    text-xs
                    font-semibold
                    shadow-md
                    transition-transform
                    duration-200
                    group-hover:scale-105
                  `}>
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-medium ${theme.text.primary} text-sm truncate`}>
                        {activity.actor_name || 'Unknown User'}
                      </span>
                      <span className={`text-xs ${theme.text.muted} truncate`}>
                        {formatMessage(activity.message)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <div className={`p-0.5 rounded ${activityBg}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <span className={`text-xs ${activityColor}`}>
                        {activity.type?.replace(/_/g, ' ') || 'Activity'}
                      </span>
                      <span className={`text-xs ${theme.text.muted}`}>
                        •
                      </span>
                      <span className={`text-xs ${theme.text.muted}`}>
                        {getTimeAgo(activity.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {activities.length > 5 && (
        <div className={`p-3 border-t ${theme.table.divider} shrink-0 text-center`}>
          <Link
            to="/projectflow/activity"
            className={`text-xs ${theme.text.info} hover:${theme.text.primary} transition-colors duration-200`}
          >
            View all {activities.length} activities
          </Link>
        </div>
      )}
    </div>
  )
}

export default TeamActivity;