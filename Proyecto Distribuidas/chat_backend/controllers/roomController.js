const bcrypt = require("bcryptjs");

const Room = require("../models/Room");

const UserSession = require(
    "../models/UserSession"
);

const {
    generateRoomData,
} = require("../services/roomService");

const {
    createRoomValidator,
    joinRoomValidator,
} = require("../utils/validators");

const createRoom = async (req, res) => {
    try {
        const { error } =
            createRoomValidator.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        const { type } = req.body;

        const {
            roomId,
            plainPin,
            hashedPin,
        } = await generateRoomData();

        const room = new Room({
            roomId,
            pin: hashedPin,
            type,
            createdBy: req.admin.id,
        });

        await room.save();

        res.status(201).json({
            message: "Room created successfully",
            roomId,
            pin: plainPin,
            type,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const joinRoom = async (req, res) => {
    try {
        const { error } =
            joinRoomValidator.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        const {
            pin,
            nickname,
            deviceId,
        } = req.body;

        const rooms = await Room.find();

        let foundRoom = null;

        for (const room of rooms) {
            const isMatch = await bcrypt.compare(
                pin,
                room.pin
            );

            if (isMatch) {
                foundRoom = room;
                break;
            }
        }

        if (!foundRoom) {
            return res.status(404).json({
                message: "Invalid PIN",
            });
        }

        const existingDevice =
            await UserSession.findOne({
                deviceId,
            });

        if (existingDevice) {
            return res.status(400).json({
                message:
                    "This device is already connected to a room",
            });
        }

        const nicknameExists =
            foundRoom.activeUsers.some(
                (user) =>
                    user.nickname.toLowerCase() ===
                    nickname.toLowerCase()
            );

        if (nicknameExists) {
            return res.status(400).json({
                message:
                    "Nickname already exists in this room",
            });
        }

        foundRoom.activeUsers.push({
            nickname,
            deviceId,
        });

        await foundRoom.save();

        const session = new UserSession({
            deviceId,
            roomId: foundRoom.roomId,
            nickname,
        });

        await session.save();

        res.status(200).json({
            message: "Joined room successfully",

            roomId: foundRoom.roomId,

            roomType: foundRoom.type,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

module.exports = {
    createRoom,
    joinRoom,
};