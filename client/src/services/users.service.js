import api from '../utils/api';

export const getUsers = (
    page = 1,
    limit = 10,
    search,
    sort,
    projectId
) => {
   return api.get(`/users?page=${page}&limit=${limit}&search=${search}&sort=${sort}&projectId=${projectId}`);
}

export const updateUserProfile = (data) => {
    return api.patch("/users/profile", data);
};

export const searchProjectMembers = (
    projectId,
    query
) => {

    return api.get(
        `/users/search-members`,
        {
            params: {
                projectId,
                query,
            },
        }
    );

};