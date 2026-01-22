import User from "../models/user.js";

export const getDashboard = async (req, res) => {
  try {
    if (req.user.role === "member") {
      return res.status(200).json({
        role: "member",
        message: "Member dashboard",
        data: {
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          joinedAt: req.user.createdAt,
        },
      });
    }

    // Admin
    const totalUsers = await User.countDocuments();
    const totalMembers = await User.countDocuments({ role: "member" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    return res.status(200).json({
      role: "admin",
      message: "Admin dashboard",
      data: {
        totalUsers,
        totalMembers,
        totalAdmins,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
