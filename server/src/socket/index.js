const socketMap = require("../utils/socketMap");

module.exports = function (io) {

    io.on("connection", (socket) => {

        console.log("Socket Connected:", socket.id);

        const broadcastUserStatus = (userId, isOnline) => {
            io.emit("user:status", { userId, isOnline });
        };

        socket.on("register", ({ userId }) => {

            if (!socketMap.has(userId)) socketMap.set(userId, new Set());
            socketMap.get(userId).add(socket.id);

            if (socketMap.get(userId).size === 1) {
                broadcastUserStatus(userId, true);
            }

        }); 

        socket.on("join-project", (projectIds) => {
            console.log("ids", projectIds)

            projectIds.forEach((projectId) => {
                socket.join(`project:${projectId.pid}`);
                console.log(
                    `${socket.id} joined project-${projectId.pid}`
                );
            })
        });

        socket.on("leave-project", (projectId) => {

            socket.leave(`project:${projectId}`);

        });

        socket.on("disconnect", () => {

            for (const [userId, sockets] of socketMap.entries()) {

                sockets.delete(socket.id);

                if (sockets.size === 0) {
                    socketMap.delete(userId);
                    broadcastUserStatus(userId, false);
                }

            }

            console.log(
                "Disconnected:",
                socket.id
            );

        });

    });

};