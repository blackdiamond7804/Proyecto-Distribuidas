const Admin = require("../models/Admin");

const {
    comparePassword,
    generateToken,
} = require("../services/authService");

const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required",
            });
        }

        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const isMatch = await comparePassword(
            password,
            admin.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const token = generateToken(admin._id);

        res.status(200).json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

module.exports = {
  loginAdmin,
};