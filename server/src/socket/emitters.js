const { getIo } = require("./socketInstance");
const socketMap = require("../utils/socketMap");

const emitToProject = (
    projectId,
    event,
    data
) => {

    const io = getIo();

   const room = io.sockets.adapter.rooms.get(
        `project:${projectId}`
    );

    console.log(room);

    io.to(`project:${projectId}`).emit(
        event,
        data
    );


};

const emitToUser = (
    userId,
    event,
    data
) => {

    const io = getIo();
    console.log("befoure sending cheking", userId, event, data);
    const sockets = socketMap.get(userId);

    if (!sockets) return;
    console.log("befoure sending cheking 4", userId, event, data);
    sockets.forEach((socketId) => {

        io.to(socketId).emit(event, data);

    });

};

const emitToEveryone = (
    event,
    data
) => {

    const io = getIo();

    io.emit(event, data);

};

module.exports = {
    emitToProject,
    emitToUser,
    emitToEveryone,
};