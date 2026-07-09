import api from '../utils/api'

export const globalSearch = (query) => {

    return api.get("/search", {
        params: {
            query,
        },
    });

};