import express from "express";
import {
  getTasks,
  createTask,
  toggleTaskStatus,
  deleteTask,
} from "../controllers/taskController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply protection to ALL routes in this file
router.use(protect);

router
  .route("/")
  .get(getTasks) // GET /api/tasks
  .post(createTask); // POST /api/tasks

router
  .route("/:id")
  .patch(toggleTaskStatus) // PATCH /api/tasks/:id
  .delete(deleteTask); // DELETE /api/tasks/:id

export default router;
