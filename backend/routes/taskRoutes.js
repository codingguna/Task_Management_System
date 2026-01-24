import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/auth.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * =========================
 * ADMIN ROUTES
 * =========================
 */

// Admin: Create & assign task
router.post("/", auth, isAdmin, async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Get ALL tasks
router.get("/", auth, isAdmin, async (req, res) => {
  const tasks = await Task.find().populate("assignedTo", "name email");
  res.json(tasks);
});

router.get("/:id", auth, isAdmin, async (req, res) => {
  const tasks = await Task.findById(req.params.id);
  res.json(tasks);
});


// Admin: Approve completed task
router.put("/:id/approve", auth, isAdmin, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  task.status = "completed";
  task.verifiedByAdmin = true;
  await task.save();

  res.json(task);
});

// Admin: Delete task
router.delete("/:id", auth, isAdmin, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

/**
 * =========================
 * MEMBER ROUTES
 * =========================
 */

// Member: Get only assigned tasks
router.get("/my", auth, async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user.id });
  res.json(tasks);
});

// Member: Update task status (NOT final completion)
router.put("/:id/status", auth, async (req, res) => {
  const { status } = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (!task.assignedTo.equals(req.user.id)) {
    return res.status(403).json({ message: "Access denied" });
  }

  // allowed statuses for member
  if (!["pending", "in_progress", "completed_request"].includes(status)) {
    return res.status(400).json({ message: "Invalid status update" });
  }

  task.status = status;
  await task.save();

  res.json(task);
});

export default router;
