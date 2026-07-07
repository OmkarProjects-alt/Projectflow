import { create } from "zustand";
import { getUsers } from "../services/users.service";
import { removeMember } from "../services/project.service"

export const useUserStore = create((set) => ({
    users: [],
    loading: false,
    messages: { isMessage: false,  String: "", success: false, },
    removingMember: false,

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
       sort = "all"
    ) => {

        set({
            loading: true,
        });

        try {

            const result =
                await getUsers(page, limit, search, sort);

            if(result.data.success){

                set({
                    users: result.data.users,
                    pagination: result.data.pagination,
                    loading:false
                });

            }

        } catch(error){

            set({
                loading:false,
                messages:{
                    isMessage:true,
                    String:error?.response?.data?.error || error.message
                }
            });

        }

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