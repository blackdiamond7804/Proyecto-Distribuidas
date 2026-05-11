const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        roomId: {
            type: String,
            required: true,
            unique: true,
        },

        pin: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            enum: ["text", "multimedia"],
            required: true,
        },

        activeUsers: [
            {
                nickname: String,
                deviceId: String,
            },
        ],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Room", roomSchema);