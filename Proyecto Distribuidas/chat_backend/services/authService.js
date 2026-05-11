const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const comparePassword = async(password, hashedPassword) =>{
    return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (adminId) => {
    return jwt.sign(
        {
            id: adminId,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );
};

module.exports = {
    comparePassword,
    generateToken,
};