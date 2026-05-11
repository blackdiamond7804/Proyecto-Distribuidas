const bcrypt = require("bcryptjs");

const generatePin = require("../utils/generatePin");

const generateRoomData = async () => {
    const roomId = crypto.randomUUID();

    const plainPin = generatePin();

    const hashedPin = await bcrypt.hash(
        plainPin,
        10
    );

    return {
        roomId,
        plainPin,
        hashedPin,
    };
};

module.exports = {
    generateRoomData,
};