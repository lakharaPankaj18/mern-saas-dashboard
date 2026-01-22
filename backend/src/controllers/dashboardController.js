export const getDashboard = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(200).json({
        role: "admin",
        message: "Admin dashboard",
        data: {
          totalUsers: 120,
          activeUsers: 90,
        },
      });
    }

    // member
    return res.status(200).json({
      role: "member",
      message: "Member dashboard",
      data: {
        welcome: `Hello ${req.user.name}`,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
