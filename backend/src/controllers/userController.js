import bcrypt from "bcryptjs";
import User from "../models/user.js";

// get all users
export const getAllUsers = async (req, res) => {
  try {
    // 1. Security Check: Ensure only admins can access this
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // 2. Fetch users but EXCLUDE passwords for security
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};
// delete a user
export const deleteUser = async (req, res) => {
  try {
    // Ensure only admin can delete
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own admin account" });
    }

    await User.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// get user by id
export const getUserById = async (req, res) => {
  try {
    // Find user by ID but exclude the password field for security
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserById:", error.message);

    // If the ID format is wrong (e.g. not a 24-char hex string), Mongoose throws an error
    res
      .status(500)
      .json({ message: "Server error: Check if the User ID is valid" });
  }
};

// user status (Active / Suspend)

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Protection: Admins cannot suspend themselves
    if (req.user._id.toString() === user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot suspend your own account." });
    }

    // Protection: Admins cannot suspend other Admins (per your peer-protection rule)
    if (req.user.role === "admin" && user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Admins cannot suspend other administrators." });
    }

    // Toggle the boolean
    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `User has been ${user.isActive ? "activated" : "suspended"}`,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during status toggle" });
  }
};

// Add user

export const AddUser = async (req, res) => {
  const { name, email, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const user = await User.create({
      name,
      email,
      role: role || "member",
      password: "tempopass134",
      isActive: true,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });
    }
  } catch (error) {
    console.error("Add Member Error:", error);
    res.status(500).json({ message: "Server error while creating member" });
  }
};



// @desc    Update user name
export const updateName = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating name" });
  }
};

// @desc    Update password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // 1. Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // 2. Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password" });
  }
};