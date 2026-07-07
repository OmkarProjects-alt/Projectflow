import api from "../utils/api";

// export const getActivities = (
//     page = 1,
//     limit = 10
// ) => {

//     return api.get(
//         `/activities?page=${page}&limit=${limit}`
//     );

// };

export const getActivities = ({
    page = 1,
    limit = 10,
    search = "",
    type = "all",
    projectId = "",
    actorId = "",
    startDate = "",
    endDate = ""
}) => {

    return api.get("/activities", {

        params: {

            page,
            limit,
            search,
            type,
            projectId,
            actorId,
            startDate,
            endDate,

        },

    });

};