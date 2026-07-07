const Router = require("express").Router();

const authMiddleware = require("../middleware/authMiddleware");

const asyncHandler = require("../utils/asyncHandler");

const {
    getNotifications,
    readNotification,
    readAllNotifications,
    removeNotification,
    acceptInvite,
    rejectInvite
} = require("../controller/notification.controller");

Router.get(
    "/",
    authMiddleware,
    asyncHandler(getNotifications)
);

Router.put(
    "/read/:id",
    authMiddleware,
    asyncHandler(readNotification)
);

Router.put(
    "/read-all",
    authMiddleware,
    asyncHandler(readAllNotifications)
);

Router.delete(
    "/:id",
    authMiddleware,
    asyncHandler(removeNotification)
);

Router.post(
    "/:nid/accept",
    authMiddleware,
    asyncHandler(acceptInvite)
);

Router.post(
    "/:nid/reject",
    authMiddleware,
    asyncHandler(rejectInvite)
);

module.exports = Router;