const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        roomId: {
            type: String,
            required: true,
        },

        nickname: {
            type: String,
            required: true,
        },

        content: {
            type: String,
            default: "",
        },

        type: {
            type: String,
            enum: ["text", "file"],
            default: "text",
        },

        fileUrl: {
            type: String,
            default: "",
        },

        isTemporary: {
            type: Boolean,
            default: false,
        },

        destroyAfter: {
            type: Number,
            default: null,
        },

        isRead: {
            type: Boolean,
            default: false,
        },

        readAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Message", messageSchema);