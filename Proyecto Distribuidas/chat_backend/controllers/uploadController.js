const Room = require("../models/Room");

const Message = require("../models/Message");

const {
    processUploadWorker,
} = require("../services/socketService");

const uploadFile = async (req, res) => {
    try {
        const {
            roomId,
            nickname,
        } = req.body;

        const room = await Room.findOne({
            roomId,
        });

        if (!room) {
            return res.status(404).json({
                message: "Room not found",
            });
        }

        if (room.type !== "multimedia") {
            return res.status(403).json({
                message:
                "This room does not support file uploads",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }

        const workerResult =await processUploadWorker({
            filename: req.file.filename,
        });

        if (!workerResult.success) {
            throw new Error(workerResult.error);
        }

        const fileUrl = `/uploads/${req.file.filename}`;

        const fileData = {
            roomId,
            nickname,
            content: req.file.originalname,
            fileUrl,
            type: "file",
            isTemporary: req.body.isTemporary === "true",
            destroyAfter: Number(req.body.destroyAfter) || null,
        };

        res.status(200).json({
            message: "File uploaded successfully",
            data: fileData,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

module.exports = {
    uploadFile,
};