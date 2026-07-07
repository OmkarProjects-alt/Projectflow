import api from "../utils/api";

export const getNotifications = (
    page = 1,
    limit = 20
) => {
    return api.get(
        `/notification?page=${page}&limit=${limit}`
    );
}

export const readNotification = (id) => {
    return api.put(
        `/notification/read/${id}`
    );
}

export const readAllNotifications = () => {
    return api.put(
        "/notification/read-all"
    );
}

export const deleteNotification = (id) => {
    return api.delete(
        `/notification/${id}`
    );
}

export const acceptInvite=(nid)=>{
    console.log("chek notification id", nid);
    return api.post(
        `/notification/${nid}/accept`,
        {}
    );
}

export const rejectInvite=(nid)=> {
    return api.post(
        `/notification/${nid}/reject`,
        {}
    );
}