import { create } from "zustand";
import { globalSearch } from "../services/search.service";

export const useSearchStore = create((set, get) => ({
  loading: false,

  results: {
    projects: [],
    tasks: [],
    members: [],
    activities: [],
  },

  searchText: "",

  cache: {},

  //---------------------------------------

  setSearchText(text) {
    set({
      searchText: text,
    });
  },

  //---------------------------------------

  clearSearch() {
    set({
      searchText: "",

      results: {
        projects: [],
        tasks: [],
        members: [],
        activities: [],
      },
    });
  },

  //---------------------------------------

  search: async (query) => {
    query = query.trim();

    if (!query) {
      set({
        results: {
          projects: [],
          tasks: [],
          members: [],
          activities: [],
        },

        loading: false,
      });

      return;
    }

    //---------------------------------------
    // Cache
    //---------------------------------------

    const cache = get().cache;

    if (cache[query]) {
      set({
        results: cache[query],

        loading: false,
      });

      return;
    }

    //---------------------------------------

    set({
      loading: true,
    });

    try {
      const response = await globalSearch(query);

      const results = response.data.results;

      set((state) => ({
        results,

        loading: false,

        cache: {
          ...state.cache,

          [query]: results,
        },
      }));
    } catch (error) {
      console.log(error);

      set({
        loading: false,
      });
    }
  },
}));
