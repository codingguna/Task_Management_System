import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Task from "../models/Task.js";
import auth from "../middleware/auth.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

/**
 * =========================
 * ADMIN USER MANAGEMENT
 * =========================
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Admin fetches all users
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", auth, isAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Admin creates a new user
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, member]
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/users", auth, isAdmin, async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "member",
  });

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Admin deletes a user
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete("/users/:id", auth, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

/**
 * @swagger
 * /api/admin/users/{id}/role:
 *   put:
 *     summary: Admin updates user role
 *     tags: [Admin Users]
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
 *               role:
 *                 type: string
 *                 enum: [admin, member]
 *     responses:
 *       200:
 *         description: Role updated
 */
router.put("/users/:id/role", auth, isAdmin, async (req, res) => {
  const { role } = req.body;

  if (!["admin", "member"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("-password");

  res.json(user);
});

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Admin dashboard statistics
 *     tags: [Admin Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
router.get("/stats", auth, isAdmin, async (req, res) => {
  const users = await User.countDocuments();
  const tasks = await Task.countDocuments();
  const completed = await Task.countDocuments({ status: "completed" });

  res.json({
    users,
    tasks,
    completed,
  });
});


export default router;
