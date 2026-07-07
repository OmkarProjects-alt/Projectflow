import { create } from "zustand";
import { getActivities } from "../services/activity.service";

export const useActivityStore = create((set) => ({
  activities: [],
  loading: false,

  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },

  fetchActivities: async (params = {}) => {
    const {
      page = 1,
      limit = 10,
      search = "",
      type = "all",
      projectId = "",
      actorId = "",
      startDate = "",
      endDate = "",
    } = params || {};

    try {
      set({ loading: true });

      const result = await getActivities({
        page,
        limit,
        search,
        type,
        projectId,
        actorId,
        startDate,
        endDate,
      });

      set({
        activities: result?.data?.activities || [],
        pagination: result?.data?.pagination || {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        loading: false,
      });
    } catch (error) {
      console.error(error);
      set({ loading: false });
    }
  },

  addActivity: (activity) =>
    set((state) => ({
      activities: [activity, ...state.activities].slice(0, state.pagination.limit),
    })),
}));