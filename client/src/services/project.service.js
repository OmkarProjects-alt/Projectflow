import api from '../utils/api';
import axios from 'axios';

export const createNewProject = (data) => {
    return api.post('/project/create', 
        data,
    );
}

export const getProjects = () => {
    return api.get('/project',
        {},
    );
}

export const updateProject = (projectId, UpdatedData) => {
    return api.patch(`/project/${projectId}`,
        UpdatedData,
    );
};

export const getAssignedProject = () => {
    return api.get(`/project/assigned`,
        {}
    )
};

export const getCreatedProjectsOfUser = (userId) => {
    return api.get(`/project/user-created-projects/${userId}`,
        {},
    );
};

export const getAssignedProjectsOfUser = (userId) => {
    return api.get(`/project/user-assigned-projects/${userId}`,
        {},
    );
};

export const getProjectsId = () => {
    return api.get('/project/project-ids', 
        {},
    );
};


export const inviteMembers = ({projectId, members}) => {
    return api.post("/project/invite-members", {
        projectId,
        members,
    });
};


export const removeMember = (projectId, memberId) => {
    return api.delete("/project/remove-member", {
        data: {
            projectId,
            memberId,
        },
    });
};

export const getAssignedProjectDetailsForMember = (projectId) => {
    return api.get(`/project/assigned-project-details/${projectId}`,
        {},
    );
}