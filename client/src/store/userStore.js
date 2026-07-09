import { create } from "zustand";
import { getUsers } from "../services/users.service";
import { removeMember } from "../services/project.service"

export const useUserStore = create((set, get) => ({
    users: [],
    loading: false,
    messages: { isMessage: false,  String: "", success: false, },
    removingMember: false,

    onlineUsers: {},
    setUserStatus: (uid, isOnline) => set(state => ({
        onlineUsers: {
            ...state.onlineUsers,
            [uid]: isOnline,
        },
    })),

    usersCache: {},

    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
    },


    fetchUsers: async (
        page = 1,
        limit = 10,
        search = "",
        sort = "all",
        projectId = ""
    ) => {

        const key = `${page}-${limit}-${search}-${sort}-${projectId}`;

        const cache = get().usersCache[key];

        if (cache) {
            set({
                users: cache.users,
                pagination: cache.pagination,
                loading: false,
            });
            return;
        }

        set({ loading: true });

        try {

            const result = await getUsers(
                page,
                limit,
                search,
                sort,
                projectId
            );

            if (result.data.success) {

                set((state) => ({
                    users: result.data.users,
                    pagination: result.data.pagination,
                    loading: false,

                    usersCache: {
                        ...state.usersCache,
                        [key]: {
                            users: result.data.users,
                            pagination: result.data.pagination,
                        },
                    },
                }));

            }

        } catch (error) {

            set({
                loading: false,
                messages: {
                    isMessage: true,
                    String:
                        error?.response?.data?.error ||
                        error.message,
                },
            });

        }

    },

    clearUsersCache: () => {
        set({
            usersCache: {},
        });
    },


    removeMember: async (
        projectId,
        memberId
    ) => {

        try {

            set({
                removingMember: true,
            });

            const result =
                await removeMember(
                    projectId,
                    memberId
                );

            if (result.data.success) {

                set(state => ({

                    users:
                        state.users.filter(
                            member =>
                                member.uid !== memberId
                        ),

                }));

            }

            return result.data;

        } finally {

            set({
                removingMember: false,
            });

        }

    },

    removeMemberLocally: (
        memberId
    ) => {

        set(state => ({

            users:
                state.users.filter(
                    member =>
                        member.uid !== memberId
                ),

        }));

    },

}))