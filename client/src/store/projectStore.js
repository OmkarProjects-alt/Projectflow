import { create } from 'zustand'
import { getProjects, getAssignedProject } from '../services/project.service'

export const useProjectStore = create((set) => ({

    // My project, project's that created by me
    MyProjects: [],
    loading: false,
    messages: { message: "", success: false},


    fetchProjects: async () => {
        try {
            set({
                loading: false,
                messages: { message: ""},
            });

            const result = await getProjects();

            if(result.data.success) {
                set({
                    MyProjects: result.data.projects,
                    loading: false,
                });
            }
        } catch (message) {
            set({
                loading: false,
                messages: { message: error?.response?.data?.message || error.message}
            });
        }
    },

    setProjects: (MyProjects) => 
        set({MyProjects}),
    
    addProject: (project) => 
        set((state) => ({
            MyProjects: [project, ...state.MyProjects]
        })),
        
        updateProject: (updatedProject) =>
            set((state) => ({
                MyProjects: state.MyProjects.map((project) => 
                    project.pid === updatedProject.pid
                ? updatedProject
                : project
            ),
        })),
        
        deleteProject: (id) => 
            set((state) => ({
                MyProjects: state.MyProjects.filter(
                    (project) => project.id !== id
            ),
        })),


    // assigned Project that project are project which task are assigned to me by someones project
    assignedProject: [],
    assignedPagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
    },

    FecthAssignedProjects : async (
        page = 1,
        limit = 10,
    ) => {
        try {
            const result = await getAssignedProject(page, limit);
            if(result?.data?.success) {
                set({
                    assignedProject: result?.data?.projects,

                    assignedPagination: result.data.pagination
                })
                console.log("my all projects" , result?.data?.projects);
            }
        } catch(error) {
            set({
                loading: false,
                messages: { message: error?.response?.data?.message || error.message}
            });
        } finally {
            set({
                loading: false,
            })
        }
    },

    setAssignedProjects: (projects) =>
        set({ assignedProject: projects }),
}))