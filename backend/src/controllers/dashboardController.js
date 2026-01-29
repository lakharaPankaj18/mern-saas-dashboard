import User from "../models/user.js";

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Common data for everyone
    let dashboardData = {
      name: user.name,
      email: user.email,
      role: user.role,
      joinedAt: user.createdAt,
    };

    if (user.role === "member") {
      return res.status(200).json({
        role: "member",
        message: "Member dashboard",
        data: dashboardData,
      });
    }

    // Admin: Run all counts and fetch recent users in parallel
    const [
      totalUsers,
      totalMembers,
      totalAdmins,
      totalSuspended,
      totalActive,
      recentUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "member" }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ isActive: false }),
      User.countDocuments({ isActive: { $ne: false } }), 
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email role createdAt isActive")
    ]);

    return res.status(200).json({
      role: "admin",
      message: "Admin dashboard",
      data: {
        ...dashboardData,
        totalUsers,
        totalMembers,
        totalAdmins,
        totalSuspended,
        totalActive,
        recentUsers
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};