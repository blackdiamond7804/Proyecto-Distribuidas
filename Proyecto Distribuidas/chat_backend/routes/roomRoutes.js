const express = require("express");

const router = express.Router();

const authMiddleware = require(
    "../middleware/authMiddleware"
);

const {
    createRoom,
    joinRoom,
} = require("../controllers/roomController");

router.post(
    "/create",
    authMiddleware,
    createRoom
);

router.post("/join", joinRoom);

module.exports = router;