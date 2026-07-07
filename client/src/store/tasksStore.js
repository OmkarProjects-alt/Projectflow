import { create } from 'zustand';
import {
    getMyTask, 
    getTaskCreatedByMe, 
    getAllTasks,
    getAllTasksStatus,
    getAllMyTasksStatus,
} from '../services/task.service';
import MyTasks from '../components/Dashboard/FooterSection/MyTasks';

export const useTaskStore = create((set) => ({

    MyTasks: [],
    createdTasks: [],
    allCreatedTasksStatus: [],
    allMyTasksStatus: [],
    allTasks: [],
    allTasksLoaded: false,
    messages: { isMessage: false, String: "", success: false },
    loading: false,

    MyTasksPagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
    },

    allMyStatusLoaded: false,

    fetchMyTasksStatus: async () => {
        try {
            const result = await getAllMyTasksStatus();

            if(result.data.success) {
                set({
                    allMyTasksStatus: result.data.status,
                    allMyStatusLoaded: true,
                });
                console.log("is data comming from backend status", result.data.status)
            }
        } catch (error) {
            console.log("somthing wrong", error?.response?.data?.message || error.message);
        }
    },

    fetchTasks: async (
        page = 1,
        limit = 10,
    ) => {
            try {
                set({
                    loading: false,
                    messages: { String: ""},
                });
    
                const result = await getMyTask(page, limit);
    
                if(result.data.success) {
                    const newTasks = result.data.tasks;

                    set((state) => {

                        const taskMap = new Map();

                        if(page != 1) {
                            state.MyTasks.forEach((task) => {
                                taskMap.set(task.tid, task);
                            });
                        }

                        newTasks.forEach((task) => {
                            taskMap.set(task.tid, task);
                        });

                        return {
                            MyTasks: [...taskMap.values()],
                            MyTasksPagination: result.data.pagination,
                        };
                    });
                }
            } catch (error) {
                set({
                    loading: false,
                    messages: { isMessage: true, String: error?.response?.data?.message || error.message}
                });
            }
        },

    setTasks: (tasks) => set({ MyTasks: tasks }),

    addMyTask: (task) =>
        set((state) => ({
            MyTasks: state.MyTasks.some((t) => 
                t.tid === task.tid
                ? state.MyTasks
                : [task, ...state.MyTasks],
            )
        })),

    addTask: (task) =>
        set((state) => ({
            createdTasks: state.createdTasks.some((t) => t.tid === task.tid)
            ? state.createdTasks
            : [task, ...state.createdTasks],
        })),

    updateTask: (task) => 
        set((state) => ({
            createdTasks: state.createdTasks.map((t) => 
                t.tid === task.tid
                ? task
                : t
            )
        })),

    deleteTask: (id) =>
        set((state) => ({
            createdTasks: state.createdTasks.filter(
                (task) => task.tid !== id,
            ),
        })),

    createdTasksPagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
    },

    fetchingLoading: false,


    FetchMyTasks: async (
        page = 1,
        limit = 10,
        projectId
    ) => {
        try {

            set({ fetchingLoading: true })

            const result = await getTaskCreatedByMe(page, limit, projectId);

            if (result.data.success) {
                const newTasks = result.data.tasks;

                set((state) => {
                    const taskMap = new Map();

                    if (page !== 1) {
                        state.createdTasks.forEach((task) => {
                            taskMap.set(task.tid, task);
                        });
                    }

                    newTasks.forEach((task) => {
                        taskMap.set(task.tid, task);
                    });

                    return {
                        createdTasks: [...taskMap.values()],
                        createdTasksPagination: result.data.pagination,
                    };
                });
            }
        } catch (error) {
            console.log(
                error?.response?.data?.message ||
                error?.message
            );
        } finally {
            set({ fetchingLoading: false })
        }
    },

    FetchAllTasksStatus: async (projectId) => {
        try {
            const result = await getAllTasksStatus(projectId);

            if(result.data.success) {
                set({
                    allCreatedTasksStatus: result.data.tasksStatus,
                });
                console.log("is data comming from backend status", result.data.tasksStatus)
            }
        } catch (error) {
            console.log("somthing wrong", error?.response?.data?.message || error.message);
        }
    },

    FetchAllTasks: async () => {
        try {
            set({
                allTasks: [],
                loading: true,
            })

            const result = await getAllTasks();
            if(result?.data?.success) {
                set({
                    allTasks: result?.data?.AllTasks,
                    loading: false,
                    allTasksLoaded: true,
                })
            }

        } catch(error) {
            set({
                loading: false,
                messages: { isMessage: true, String: "Server error to getting data, try again later", success: false },
            })
        }
    },


    updateMyTask: (task) => 
        set((state) => ({
            MyTasks: state.MyTasks.map((t) => 
                t.tid === task.tid
                ? task
                : t
            )
        })),
}))