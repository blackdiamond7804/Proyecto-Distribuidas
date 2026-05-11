const Room = require("../models/Room");

const Message = require("../models/Message");

const UserSession = require(
    "../models/UserSession"
);

const {
  processMessageWorker,
} = require("../services/socketService");

const messageCooldown = new Map();
const inactivityTimers = new Map();

const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log(
            `✅ User connected: ${socket.id}`
        );

        /*
        =========================
        JOIN ROOM
        =========================
        */

        socket.on(
            "joinRoom",
            async ({
                roomId,
                nickname,
                deviceId,
            }) => {
                try {
                    const room = await Room.findOne({
                        roomId,
                    });

                    if (!room) {
                        socket.emit("errorMessage", {
                            message: "Room not found",
                        });
                        return;
                    }

                    socket.join(roomId);

                    if (
                        inactivityTimers.has(socket.id)
                    ) {
                        clearTimeout(
                            inactivityTimers.get(socket.id)
                        );
                    }

                    const timer = setTimeout(() => {
                        socket.disconnect(true);
                    }, 30 * 60 * 1000);

                    inactivityTimers.set(
                        socket.id,
                        timer
                    );

                    await UserSession.findOneAndUpdate(
                        { deviceId },
                        {
                            socketId: socket.id,
                            lastSeen: new Date(),
                        }
                    );

                    const updatedRoom = await Room.findOne({
                        roomId,
                    });

                    io.to(roomId).emit(
                        "userList",
                        updatedRoom.activeUsers
                    );

                    const messages =
                        await Message.find({ roomId }).sort({
                            createdAt: 1,
                        });

                    socket.emit("previousMessages", messages);

                    io.to(roomId).emit("systemMessage", {
                        message: `${nickname} joined the room`,
                    });
                } catch (error) {
                    socket.emit("errorMessage", {
                        message: error.message,
                    });
                }
            }
        );

        /*
        =========================
        SEND MESSAGE
        =========================
        */

        socket.on(
            "sendMessage",
            async ({
                roomId,
                nickname,
                content,
                isTemporary,
                destroyAfter,
            }) => {
                try {
                    if (!content?.trim()) return;

                    const cooldownKey = `${socket.id}-${roomId}`;

                    const lastMessageTime = messageCooldown.get(
                        cooldownKey
                    );

                    const now = Date.now();

                    if (
                        lastMessageTime &&
                        now - lastMessageTime < 1000
                    ) {
                        socket.emit("errorMessage", {
                            message:
                            "You are sending messages too fast",
                        });

                        return;
                    }

                    messageCooldown.set(
                        cooldownKey,
                        now
                    );

                    if (
                        inactivityTimers.has(socket.id)
                    ) {
                        clearTimeout(
                            inactivityTimers.get(socket.id)
                        );

                        const timer = setTimeout(() => {
                            socket.disconnect(true);
                        }, 30 * 60 * 1000);

                        inactivityTimers.set(
                            socket.id,
                            timer
                        );
                    }

                    const workerResult =
                        await processMessageWorker({
                            roomId,
                            nickname,
                            content,
                        });

                    if (!workerResult.success) {
                        throw new Error(
                            workerResult.error
                        );
                    }

                    const message = new Message({
                        roomId,
                        nickname,
                        content,
                        type: "text",
                        isTemporary,
                        destroyAfter,
                    });

                    await message.save();

                    io.to(roomId).emit(
                        "receiveMessage",
                        message
                    );
                } catch (error) {
                    socket.emit("errorMessage", {
                        message: error.message,
                    });
                }
            }
        );

        /*
        =========================
        SEND FILE MESSAGE
        =========================
        */

        socket.on(
            "sendFileMessage",
            async ({
                roomId,
                nickname,
                fileUrl,
                fileName,
                isTemporary,
                destroyAfter,
            }) => {
                try {
                    const message = new Message({
                        roomId,
                        nickname,
                        type: "file",
                        fileUrl,
                        content: fileName,
                        isTemporary: Boolean(isTemporary),
                        destroyAfter:
                            Number(destroyAfter) || null,
                    });

                    await message.save();

                    io.to(roomId).emit(
                        "receiveMessage",
                        message
                    );
                } catch (error) {
                    socket.emit("errorMessage", {
                        message: error.message,
                    });
                }
            }
        );

        /*
        =========================
        TYPING
        =========================
        */

        socket.on(
            "typing",
            ({ roomId, nickname }) => {
                socket.to(roomId).emit("typing", {
                    nickname,
                });
            }
        );

        /*
        =========================
        STOP TYPING
        =========================
        */

        socket.on(
            "stopTyping",
            ({ roomId, nickname }) => {
                socket.to(roomId).emit(
                    "stopTyping",
                    {
                        nickname,
                    }
                );
            }
        );

        socket.on(
            "messageRead",
            async ({ messageId, readerNickname }) => {
                try {
                    const message =
                    await Message.findById(
                        messageId
                    );

                    if (
                        !message ||
                        message.isRead ||
                        !message.isTemporary ||
                        message.nickname === readerNickname
                    ) {
                        return;
                    }

                    message.isRead = true;

                    message.readAt = new Date();

                    await message.save();

                    io.to(message.roomId).emit(
                        "messageReadUpdate",
                        {
                            messageId,
                            readAt: message.readAt,
                        }
                    );

                    /*
                    =========================
                    AUTO DESTROY
                    =========================
                    */

                    setTimeout(async () => {
                        try {
                            const msg =
                            await Message.findById(
                                messageId
                            );

                            if (!msg) return;

                            /*
                            DELETE FILE
                            */

                            if (
                                msg.type === "file" &&
                                msg.fileUrl
                            ) {
                                const fs = require("fs");

                                const path = require("path");

                                const filePath = path.join(
                                    __dirname,
                                    "..",
                                    msg.fileUrl
                                );

                                if (
                                    fs.existsSync(
                                        filePath
                                    )
                                ) {
                                    fs.unlinkSync(
                                        filePath
                                    );
                                }
                            }

                            /*
                            DELETE MESSAGE
                            */

                            await Message.findByIdAndDelete(
                                messageId
                            );

                            io.to(msg.roomId).emit(
                                "messageDeleted",
                                {
                                    messageId,
                                }
                            );
                        } catch (error) {
                            console.log(error);
                        }
                    }, message.destroyAfter);
                } catch (error) {
                    console.log(error);
                }
            }
        );

        /*
        =========================
        DISCONNECT
        =========================
        */

        socket.on("disconnect", async () => {
            try {
                console.log(
                    `❌ User disconnected: ${socket.id}`
                );

                const session =
                    await UserSession.findOne({
                        socketId: socket.id,
                    });

                if (!session) return;

                const room = await Room.findOne({
                    roomId: session.roomId,
                });

                if (!room) return;

                room.activeUsers =
                    room.activeUsers.filter(
                        (user) =>
                            user.deviceId !==
                                session.deviceId
                    );

                await room.save();

                io.to(room.roomId).emit(
                    "userList",
                    room.activeUsers
                );

                io.to(room.roomId).emit(
                    "systemMessage",
                    {
                        message: `${session.nickname} left the room`,
                    }
                );

                await UserSession.deleteOne({
                    deviceId: session.deviceId,
                });
            } catch (error) {
                console.error(error);
            }
        });
    });
};

module.exports = socketHandler;