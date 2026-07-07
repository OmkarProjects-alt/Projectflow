import { create } from "zustand";

import {
    getNotifications,
    readNotification,
    readAllNotifications,
    deleteNotification,
    acceptInvite,
    rejectInvite,
} from "../services/notification.service";

export const useNotificationStore = create((set) => ({

    notifications: [],
    unreadCount: 0,
    pagination: {},

    loading: false,

    fetchNotifications: async (
        page = 1
    ) => {

        set({ loading: true });

        try {

            const result =
                await getNotifications(page);

            set({
                notifications:
                    result.data.notifications,

                unreadCount:
                    result.data.unreadCount,

                pagination:
                    result.data.pagination,
            });

        } finally {

            set({
                loading: false,
            });

        }

    },

    acceptProjectInvite: async (nid) => {
        try {

            const result = await acceptInvite(nid);

            if (result.data.success) {

                set((state) => ({
                    notifications: state.notifications.filter(
                        (n) => n.nid !== nid
                    ),
                    unreadCount: Math.max(
                        0,
                        state.unreadCount - 1
                    ),
                }));

            }

            return result;

        } catch (error) {
            throw error;
        }
    },

    rejectProjectInvite: async (nid) => {
        try {

            const result = await rejectInvite(nid);

            if (result.data.success) {

                set((state) => ({
                    notifications: state.notifications.filter(
                        (n) => n.nid !== nid
                    ),
                    unreadCount: Math.max(
                        0,
                        state.unreadCount - 1
                    ),
                }));

            }

            return result;

        } catch (error) {
            throw error;
        }
    },

    addNotification: (notification) =>
        set((state) => ({

            notifications: [
                notification,
                ...state.notifications,
            ],

            unreadCount:
                state.unreadCount + 1,

        })),

    markAsRead: async (id) => {

        await readNotification(id);

        set((state) => ({

            notifications:
                state.notifications.map((n) =>
                    n.nid === id
                        ? {
                              ...n,
                              is_read: true,
                          }
                        : n
                ),

            unreadCount:
                Math.max(
                    state.unreadCount - 1,
                    0
                ),

        }));

    },

    markAllRead: async () => {

        await readAllNotifications();

        set((state) => ({

            unreadCount: 0,

            notifications:
                state.notifications.map(
                    (n) => ({
                        ...n,
                        is_read: true,
                    })
                ),

        }));

    },

    removeNotification: async (id) => {

        await deleteNotification(id);

        set((state) => ({

            notifications:
                state.notifications.filter(
                    (n) => n.nid !== id
                ),

        }));

    },

}));