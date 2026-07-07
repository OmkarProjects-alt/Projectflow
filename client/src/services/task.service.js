import api from '../utils/api';
import axios from 'axios';

export const createNewTask = (data) => {
    return api.post('/task/create', 
        data,
    );
}

export const getMyTask = (page, limit) => {
    return api.get(`/task?page=${page}&limit=${limit}`,
        {},
    );
};

export const getTaskCreatedByMe = (page, limit, pid) => {
    return api.get(`/task/my-project-task/${pid}?page=${page}&limit=${limit}`,
        {},
    );
};

export const updateTask = (taskId, updatedData) => {
    return api.patch(`/task/${taskId}`,
        updatedData,
    );
};

export const deleteTask = (taskId) => {
    return api.delete(`/task/${taskId}`,
        {}
    );
};

export const updateStatus = (taskId, status) => {
    return api.patch(`/task/status/${taskId}`,
        { status },
    );
};


export const getCurrentTask = (taskId) => {
    return api.get(`/task/${taskId}`,
        {},
    );
};


export const getAllTasks = () => {
    return api.get('/task/all',
        {},
    );
};

export const getAllTasksStatus = (projectId) => {
    return api.get(`/task/status/${projectId}`,
        {},
    );
};


export const getAllMyTasksStatus = () => {
    return api.get('/task/status', 
        {},
    );
};

export const FetchAllMyTasksOfProject = (pid) => {
    return api.get(`/task/${pid}/project`,
        {}
    );
};