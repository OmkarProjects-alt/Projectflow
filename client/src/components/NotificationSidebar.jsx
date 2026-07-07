import {
    X,
    Bell,
    Trash2,
    CheckCheck,
    CheckCircle,
    AlertCircle,
    Info,
    UserPlus,
    Check,
    XCircle,
    Loader2
} from "lucide-react";
import { useTheme } from "../context/ThemeProvider";
import { useNotificationStore } from "../store/notificationStore";
import { useSocket } from "../context/SocketContext";
import { useState } from "react";
import gsap from "gsap";
import { useError } from "../context/ErrorAndSuccessMsgContext";

export default function NotificationSidebar({
    open,
    onClose,
}) {
    const { theme } = useTheme();
    const { addMessage } = useError();
    const [isClosing, setIsClosing] = useState(false);
    const [processingInvites, setProcessingInvites] = useState({});

    const socket = useSocket();

    const {
        notifications,
        unreadCount,
        markAllRead,
        removeNotification,
        markAsRead,
        acceptProjectInvite,
        rejectProjectInvite,
    } = useNotificationStore();

    const getNotificationIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'success':
                return <CheckCircle size={18} className="text-green-400" />;
            case 'error':
                return <AlertCircle size={18} className="text-red-400" />;
            case 'warning':
                return <AlertCircle size={18} className="text-amber-400" />;
            case 'info':
                return <Info size={18} className="text-blue-400" />;
            case 'project_invite':
                return <UserPlus size={18} className="text-purple-400" />;
            default:
                return <Bell size={18} className="text-blue-400" />;
        }
    };

    const getNotificationBg = (type) => {
        switch (type?.toLowerCase()) {
            case 'success':
                return 'bg-green-500/10 border-green-500/20';
            case 'error':
                return 'bg-red-500/10 border-red-500/20';
            case 'warning':
                return 'bg-amber-500/10 border-amber-500/20';
            case 'info':
                return 'bg-blue-500/10 border-blue-500/20';
            case 'project_invite':
                return 'bg-purple-500/10 border-purple-500/20';
            default:
                return 'bg-blue-500/5 border-blue-500/10';
        }
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    const handleRemove = (nid, e) => {
        e.stopPropagation();
        const element = document.getElementById(`notification-${nid}`);
        if (element) {
            gsap.to(element, {
                opacity: 0,
                x: 100,
                duration: 0.3,
                ease: "power2.inOut",
                onComplete: () => removeNotification(nid)
            });
        } else {
            removeNotification(nid);
        }
    };

    const handleAcceptInvite = async (nid, projectId, e) => {
        console.log("accept", nid)
        e.stopPropagation();
        setProcessingInvites(prev => ({ ...prev, [nid]: 'accept' }));
        try {
            const result = await acceptProjectInvite(nid, projectId);
                console.log("result all accept", result)
            if (result?.data?.success) {
                addMessage(result?.data?.message || "Successfully joined the project!", true);
                removeNotification(nid);
                socket.emit(
                    "join-project",
                    [projectId]
                );
            } else {
                addMessage(result?.data?.message || "Failed to accept invitation");
            }
        } catch (error) {
            addMessage(error?.response?.data?.message || "Failed to accept invitation");
        } finally {
            setProcessingInvites(prev => ({ ...prev, [nid]: null }));
        }
    };

    const handleRejectInvite = async (nid, e) => {
        e.stopPropagation();
        setProcessingInvites(prev => ({ ...prev, [nid]: 'reject' }));
        try {
            const result = await rejectProjectInvite(nid);
            console.log("Result Data", result);
            if (result?.data?.success) {
                addMessage(result?.message || "Invitation declined", true);
                removeNotification(nid);
            } else {
                addMessage(result?.message || "Failed to decline invitation");
            }
        } catch (error) {
            console.log("error", error?.message)
            addMessage(error?.response?.data?.message || "Failed to decline invitation");
        } finally {
            setProcessingInvites(prev => ({ ...prev, [nid]: null }));
        }
    };

    console.log("my all not", notifications)

    const isInvitation = (notification) => {
        return notification?.type?.toLowerCase() === 'project_invite';
    };

    const getSenderDisplay = (notification) => {
        if (notification.sender_name) {
            return notification.sender_name;
        }
        if (notification.sender_id) {
            return `User ${notification.sender_id.slice(0, 8)}`;
        }
        return 'Someone';
    };

    return (
        <>
            <div
                onClick={handleClose}
                className={`
                    fixed inset-0
                    bg-black/50
                    backdrop-blur-sm
                    z-40
                    transition-opacity
                    duration-300
                    ${open && !isClosing
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"}
                `}
            />

            <div
                className={`
                    fixed
                    top-0
                    right-0
                    h-screen
                    w-[420px]
                    max-w-full
                    z-50
                    ${theme.card.primary}
                    border-l
                    ${theme.table.divider}
                    transition-transform
                    duration-300
                    ease-in-out
                    ${open && !isClosing
                        ? "translate-x-0"
                        : "translate-x-full"}
                    flex
                    flex-col
                `}
            >
                {/* Header */}
                <div className={`flex items-center justify-between p-5 border-b ${theme.table.divider} flex-shrink-0`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-blue-500/10 ${theme.text.info}`}>
                            <Bell size={20} />
                        </div>
                        <div>
                            <h2 className={`text-lg font-semibold ${theme.text.primary}`}>
                                Notifications
                            </h2>
                            {unreadCount > 0 && (
                                <span className={`text-xs ${theme.text.muted}`}>
                                    {unreadCount} unread
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className={`p-1.5 rounded-lg ${theme.text.muted} hover:${theme.text.primary} hover:bg-gray-200/20 dark:hover:bg-gray-800/50 transition-colors`}
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Actions */}
                <div className={`flex items-center justify-between p-4 border-b ${theme.table.divider} flex-shrink-0`}>
                    <button
                        onClick={markAllRead}
                        disabled={unreadCount === 0}
                        className={`
                            flex items-center gap-2
                            text-sm font-medium
                            ${unreadCount > 0 
                                ? `${theme.text.info} hover:${theme.text.primary} cursor-pointer` 
                                : `${theme.text.muted} cursor-not-allowed opacity-50`
                            }
                            transition-colors
                            duration-200
                        `}
                    >
                        <CheckCheck size={18} />
                        Mark all read
                    </button>

                    <span className={`text-xs ${theme.text.muted}`}>
                        {notifications.length} total
                    </span>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className={`p-4 rounded-full bg-gray-500/10 ${theme.text.muted} mb-4`}>
                                <Bell size={48} />
                            </div>
                            <p className={`text-lg font-medium ${theme.text.primary}`}>
                                All caught up!
                            </p>
                            <p className={`text-sm ${theme.text.muted} mt-1`}>
                                No new notifications to show
                            </p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                id={`notification-${notification.nid}`}
                                key={notification.nid}
                                onClick={() => !isInvitation(notification) && markAsRead(notification.nid)}
                                className={`
                                    p-4
                                    rounded-xl
                                    border
                                    ${getNotificationBg(notification.type)}
                                    hover:bg-white/5
                                    transition-all
                                    duration-200
                                    ${!isInvitation(notification) ? 'cursor-pointer' : ''}
                                    group
                                    ${!notification.is_read ? 'border-l-4 border-l-blue-500' : ''}
                                `}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-1.5 rounded-lg mt-0.5 ${getNotificationBg(notification.type)}`}>
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className={`font-semibold ${theme.text.primary} text-sm truncate`}>
                                                {notification.title}
                                            </h4>
                                            {!notification.is_read && (
                                                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                            )}
                                        </div>
                                        
                                        <p className={`${theme.text.secondary} text-sm mt-0.5`}>
                                            {isInvitation(notification) 
                                                ? `${getSenderDisplay(notification)} invited you to join a project`
                                                : notification.message
                                            }
                                        </p>

                                        {isInvitation(notification) && notification.project_id && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className={`text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20`}>
                                                    Project Invitation
                                                </span>
                                                {notification.sender_role && (
                                                    <span className={`text-xs ${theme.text.muted}`}>
                                                        • {notification.sender_role}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className={`text-xs ${theme.text.muted}`}>
                                                {new Date(notification.created_at).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                            {notification.type && (
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${theme.text.muted} bg-white/5`}>
                                                    {notification.type.replace('_', ' ')}
                                                </span>
                                            )}
                                        </div>

                                        {/* Action Buttons for Invitations */}
                                        {isInvitation(notification) && (
                                            <div className="flex items-center gap-2 mt-3">
                                                <button
                                                    onClick={(e) => handleAcceptInvite(notification.nid, notification.project_id, e)}
                                                    disabled={processingInvites[notification.nid] === 'accept' || processingInvites[notification.nid] === 'reject'}
                                                    className={`
                                                        flex items-center gap-1.5
                                                        px-4 py-1.5
                                                        rounded-lg
                                                        text-sm font-medium
                                                        ${theme.button.success}
                                                        text-white
                                                        transition-all
                                                        duration-200
                                                        hover:scale-[1.02]
                                                        active:scale-[0.98]
                                                        ${processingInvites[notification.nid] ? 'opacity-60 cursor-not-allowed' : ''}
                                                    `}
                                                >
                                                    {processingInvites[notification.nid] === 'accept' ? (
                                                        <>
                                                            <Loader2 size={14} className="animate-spin" />
                                                            Accepting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Check size={14} />
                                                            Accept
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={(e) => handleRejectInvite(notification.nid, e)}
                                                    disabled={processingInvites[notification.nid] === 'accept' || processingInvites[notification.nid] === 'reject'}
                                                    className={`
                                                        flex items-center gap-1.5
                                                        px-4 py-1.5
                                                        rounded-lg
                                                        text-sm font-medium
                                                        ${theme.button.secondary}
                                                        ${theme.text.secondary}
                                                        transition-all
                                                        duration-200
                                                        hover:${theme.text.danger}
                                                        hover:bg-red-500/10
                                                        ${processingInvites[notification.nid] ? 'opacity-60 cursor-not-allowed' : ''}
                                                    `}
                                                >
                                                    {processingInvites[notification.nid] === 'reject' ? (
                                                        <>
                                                            <Loader2 size={14} className="animate-spin" />
                                                            Declining...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle size={14} />
                                                            Decline
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={(e) => handleRemove(notification.nid, e)}
                                        className={`
                                            p-1.5 rounded-lg
                                            ${theme.text.muted}
                                            hover:${theme.text.danger}
                                            hover:bg-red-500/10
                                            transition-all
                                            duration-200
                                            opacity-0
                                            group-hover:opacity-100
                                            flex-shrink-0
                                        `}
                                        aria-label="Delete notification"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className={`p-4 border-t ${theme.table.divider} flex-shrink-0 text-center`}>
                        <button
                            onClick={() => {
                                notifications.forEach(n => removeNotification(n.nid));
                            }}
                            className={`text-xs ${theme.text.muted} hover:${theme.text.danger} transition-colors duration-200`}
                        >
                            Clear all notifications
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}