const Joi = require("joi");

const createRoomValidator = Joi.object({
    type: Joi.string()
        .valid("text", "multimedia")
        .required(),
});

const joinRoomValidator = Joi.object({
    pin: Joi.string()
        .pattern(/^\d{4}$/)
        .required(),

    nickname: Joi.string()
        .min(3)
        .max(20)
        .required(),

    deviceId: Joi.string().required(),
});

module.exports = {
    createRoomValidator,
    joinRoomValidator,
};