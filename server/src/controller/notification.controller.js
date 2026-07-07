const {
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    acceptProjectInvite,
    rejectProjectInvite
} = require("../services/notification.service");

const getNotifications = async (req, res) => {

    const result = await fetchNotifications(
        req.user.uid,
        req.query
    );

    res.status(200).json({
        success: true,
        notifications: result.notifications,
        unreadCount: result.unreadCount,
        pagination: result.pagination,
    });
};

const readNotification = async (req, res) => {

    const notification =
        await markAsRead(
            req.params.id,
            req.user.uid
        );

    res.status(200).json({
        success: true,
        notification,
    });
};

const readAllNotifications = async (
    req,
    res
) => {

    await markAllAsRead(req.user.uid);

    res.status(200).json({
        success: true,
        message:
            "All notifications marked as read.",
    });
};

const removeNotification = async (
    req,
    res
) => {

    await deleteNotification(
        req.params.id,
        req.user.uid
    );

    res.status(200).json({
        success: true,
        message: "Notification deleted.",
    });
};

const acceptInvite = async (req, res) => {

    await acceptProjectInvite(
        req.params.nid,
        req.user.uid,
        req.user.name,
    );

    res.json({
        success:true,
        message:"Invitation accepted"
    });

};

const rejectInvite= async (req,res) => {

    await rejectProjectInvite(
        req.params.nid,
        req.user.uid,
        req.user.name
    );

    res.json({
        success:true,
        message:"Invitation rejected"
    });

};

module.exports = {
    getNotifications,
    readNotification,
    readAllNotifications,
    removeNotification,
    rejectInvite,
    acceptInvite,
};