import express from "express";
import Notification from "../models/Notification.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * Get unread notifications
 */
router.get("/", auth, async (req, res) => {
  const notifications = await Notification.find({
    user: req.user.id,
    read: false,
  }).sort({ createdAt: -1 });

  res.json(notifications);
});

/**
 * Mark notification as read
 */
router.put("/:id/read", auth, async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { read: true }
  );
  res.json({ message: "Notification marked as read" });
});

export default router;
