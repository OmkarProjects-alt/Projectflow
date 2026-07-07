let Ioinstance = null

module.exports = {
    setIo: (io) => {
        Ioinstance = io;
    },

    getIo: () => {
        if(!Ioinstance) {
            throw new Error("Socket.IO instance not initialized");
        }

        return Ioinstance
    }
}