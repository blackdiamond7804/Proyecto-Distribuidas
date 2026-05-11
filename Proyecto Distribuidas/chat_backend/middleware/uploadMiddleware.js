const multer = require("multer");

const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;

        cb(null, uniqueName);
    },
});

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only jpg, png, pdf and docx files are allowed"
            )
        );
    }
};

const upload = multer({
    storage,

    limits: {
        fileSize:
            process.env.MAX_FILE_SIZE || 10485760,
    },

    fileFilter,
});

module.exports = upload;