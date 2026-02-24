const socket = require("socket.io")

const getSecureRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_"))
    .digest("hex");
}

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
        origin: "http://localhost:5173",
        },
    });

    io.on("connection", (socket) => {
        socket.on("joinChat", ({firstName, userId, targetUserId}) => {
            const roomId = getSecureRoomId(userId, targetUserId)
            console.log(firstName + "Joined Room: " + roomId)
            socket.join(roomId)
        })

        socket.on("sendMessage", ({firstName, userId, targetUserId, photo ,text}) => {
            const roomId = getSecureRoomId(userId, targetUserId);
            console.log(firstName + "" + text)
            io.to(roomId).emit("messageReceived", {firstName,photo ,text})
        })

        socket.on("disconnect", () => {

        })
    })
}

module.exports = initializeSocket