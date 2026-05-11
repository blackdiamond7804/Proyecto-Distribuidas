require("dotenv").config();

const express = require("express");
const http = require("http");

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { Server } = require("socket.io");

const connectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");

const socketHandler = require("./sockets/socketHandler");

const errorMiddleware = require("./middleware/errorMiddleware");

const rateLimitMiddleware = require(
    "./middleware/rateLimitMiddleware"
);

const uploadRoutes = require(
  "./routes/uploadRoutes"
);

const sanitizeInputs = require(
  "./middleware/sanitizeMiddleware"
);

const roomRoutes = require("./routes/roomRoutes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

connectDB();

app.use(cors());

app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

app.use(morgan("dev"));

app.use(express.json());

app.use(sanitizeInputs);

app.use(rateLimitMiddleware);

app.use("/uploads", express.static("uploads"));

app.use("/api/upload", uploadRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/rooms", roomRoutes);

socketHandler(io);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

module.exports = app;