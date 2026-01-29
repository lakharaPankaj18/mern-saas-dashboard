import express from "express"
import { AddUser, deleteUser, getAllUsers, getUserById, toggleUserStatus, updateName, updatePassword } from "../controllers/userController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", protect, getAllUsers)
router.get("/:id", protect, getUserById)
router.delete("/:id", protect, deleteUser)
router.patch("/:id/status", protect, toggleUserStatus)
router.post("/", protect, AddUser)
router.patch("/update-name", protect, updateName)
router.patch("/update-password", protect, updatePassword)


export default router;