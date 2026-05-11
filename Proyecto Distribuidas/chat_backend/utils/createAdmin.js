require("dotenv").config();

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const hashedPassword = await bcrypt.hash(
            "admin123",
            10
        );

        const admin = new Admin({
            username: "admin",
            password: hashedPassword,
        });

        await admin.save();

        console.log("✅ Admin created");

        process.exit();
    } catch (error) {
        console.error(error);

        process.exit(1);
    }
};

createAdmin();