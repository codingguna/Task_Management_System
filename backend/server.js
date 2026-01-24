import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// routes
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

// create HTTP server
const server = http.createServer(app);

// socket.io setup
const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", socket => {
  console.log("Client connected:", socket.id);

  socket.on("taskUpdated", data => {
    socket.broadcast.emit("refreshTasks");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
