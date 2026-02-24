const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const { connectionRequest } = require("../models/connectionRequest")

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

        socket.on("sendMessage", async ({firstName, userId, targetUserId, photo ,text}) => {
            //save message to DB
            try{
                const roomId = getSecureRoomId(userId, targetUserId);
                console.log(firstName + "" + text);

                const existingConn = await connectionRequest.findOne({
                    $or:[
                        {fromUserId: userId , toUserId: targetUserId},
                        {fromUserId: userId , toUserId: targetUserId},
                    ],
                    status: "accepted",
            })

            if(!existingConn){
                console.log("Unauthorized chat attempt")
                return socket.emit("errorMessage", "You are not connected with this user!")
            }

                let chat = await Chat.findOne({
                    participants: {$all: [userId, targetUserId]}
                })

                if(!chat){
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    })
                }

                chat.messages.push({
                    senderId: userId,
                    text
                })

                await chat.save()
                io.to(roomId).emit("messageReceived", {
                    firstName,
                    photo,
                    text,
                });
            }
            catch (err) {
                console.error(err)
            }
        })

        socket.on("disconnect", () => {

        })
    })
}

module.exports = initializeSocket