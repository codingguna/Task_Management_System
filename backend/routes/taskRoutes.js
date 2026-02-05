import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/auth.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { io, getSocketId } from "../server.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";


const router = express.Router();

/**
 * =========================
 * ADMIN ROUTES
 * =========================
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Admin creates and assigns a task
 *     tags: [Admin Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - assignedTo
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post("/", auth, isAdmin, async (req, res) => {
  try {
    const task = await Task.create(req.body);

    // Save notification
    await Notification.create({
      user: task.assignedTo,
      title: "New Task Assigned",
      message: `You have been assigned: ${task.title}`,
      type: "TASK_ASSIGNED",
      relatedId: task._id,
    });

     // 🔔 SOCKET: notify assigned member
    const socketId = getSocketId(task.assignedTo.toString());
    if (socketId) {
      io.to(socketId).emit("task_assigned", {
        taskId: task._id,
        title: task.title,
      });
    }
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Admin fetches all tasks
 *     tags: [Admin Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tasks
 */
router.get("/", auth, isAdmin, async (req, res) => {
  const tasks = await Task.find().populate("assignedTo", "name email");
  res.json(tasks);
});

/**
 * @swagger
 * /api/tasks/task/{id}:
 *   get:
 *     summary: Admin fetches a task by ID
 *     tags: [Admin Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Task found
 *       404:
 *         description: Task not found
 */
router.get("/task/:id", auth, isAdmin, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

/**
 * @swagger
 * /api/tasks/{id}/approve:
 *   put:
 *     summary: Admin approves a completed task
 *     tags: [Admin Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Task approved
 */
router.put("/:id/approve", auth, isAdmin, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  task.status = "completed";
  task.verifiedByAdmin = true;
  await task.save();

  await Notification.create({
  user: task.assignedTo,
  title: "Task Approved",
  message: `Your task "${task.title}" was approved`,
  type: "TASK_APPROVED",
  relatedId: task._id,
});

const socketId = getSocketId(task.assignedTo.toString());
if (socketId) {
  io.to(socketId).emit("task_approved", {
        taskId: task._id,
        title: task.title,
      });
}

  res.json(task);
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Admin deletes a task
 *     tags: [Admin Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.delete("/:id", auth, isAdmin, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

/**
 * =========================
 * MEMBER ROUTES
 * =========================
 */

/**
 * @swagger
 * /api/tasks/my:
 *   get:
 *     summary: Member fetches assigned tasks
 *     tags: [Member Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of member tasks
 */
router.get("/my", auth, async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user.id });
  res.json(tasks);
});

/**
 * @swagger
 * /api/tasks/{id}/status:
 *   put:
 *     summary: Member updates task status (request completion)
 *     tags: [Member Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed_request]
 *     responses:
 *       200:
 *         description: Task status updated
 *       403:
 *         description: Access denied
 */
router.put("/:id/status", auth, async (req, res) => {
  const { status } = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (!task.assignedTo.equals(req.user.id)) {
    return res.status(403).json({ message: "Access denied" });
  }

  const allowedStatuses = ["pending", "in_progress", "completed_request"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status update" });
  }

  task.status = status;
  await task.save();

  if (status === "completed_request") {
    const admins = await User.find({ role: "admin" });
      
    admins.forEach(async admin => {
      
      await Notification.create({
        user: admin._id,
        title: "Completion Requested",
        message: `Task completion requested: ${task.title}`,
        type: "TASK_COMPLETION",
        relatedId: task._id,
      });

      const socketId = getSocketId(admin._id.toString());
      if (socketId) {
        io.to(socketId).emit("task_completion_request", {
          taskId: task._id,
          title: task.title,
        });
      }
    });
  }

  res.json(task);
});

export default router;
