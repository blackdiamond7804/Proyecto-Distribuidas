const mongoose = require("mongoose");

const userSessionSchema = new mongoose.Schema(
    {
        deviceId: {
            type: String,
            required: true,
            unique: true,
        },

        roomId: {
            type: String,
            required: true,
        },

        nickname: {
            type: String,
            required: true,
        },

        socketId: {
            type: String,
            default: "",
        },

        lastSeen: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
  "UserSession",
  userSessionSchema
);