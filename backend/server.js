import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { setupSwagger } from "./swagger.js";

import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminuserRoutes from "./routes/adminuserRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();

/* -------------------- Swagger -------------------- */
setupSwagger(app);

/* -------------------- Middleware -------------------- */
app.use(cors());
app.use(express.json());

/* -------------------- Test Route -------------------- */
app.get("/", (req, res) => {
  res.send("Backend is running");
});

/* -------------------- DB -------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

/* -------------------- Routes -------------------- */
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminuserRoutes);
app.use("/api/notifications", notificationRoutes);

/* -------------------- HTTP + SOCKET -------------------- */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* -------------------- SOCKET USER MAP -------------------- */
const onlineUsers = new Map();
/*
  onlineUsers = {
    userId: socketId
  }
*/

io.on("connection", socket => {
  console.log("Socket connected:", socket.id);

  // 🔐 Register user
  socket.on("register", userId => {
    onlineUsers.set(userId, socket.id);
    console.log("User registered:", userId);
  });

  // 🔌 Disconnect
  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    console.log("Socket disconnected:", socket.id);
  });
});

/* -------------------- EXPORT SOCKET HELPERS -------------------- */
export const getSocketId = userId => onlineUsers.get(userId);
export { io };

/* -------------------- START SERVER -------------------- */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
