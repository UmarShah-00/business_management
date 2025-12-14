const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const router = express.Router();
const authorizeRoles = require("../middlewares/roleMiddleware");
router.post("/forgot-password", async (req, res) => {
  console.log("Forgot password route hit", req.body.email);
  try {
    const user = await Admin.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `Reset your password: ${resetURL}`;
    // sendEmail debug
    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message,
    });

    res.json({ message: "Password reset link sent" });
  } catch (err) {
    console.log("SendEmail ERROR:", err); // ye exact error console me show hoga
    return res.status(500).json({ message: "Error sending email" });
  }
});

// ✅ TOKEN VERIFY
const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "your_jwt_secret");
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// ✅ LOGIN ROUTE (BCRYPT WORKING 100%)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Admin.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ⭐ ADD THIS ROUTE BELOW LOGIN ROUTE
router.post("/reset-password/:token", async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Update password
    const bcrypt = require("bcrypt");
    const newHashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = newHashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET USER DATA
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await Admin.findById(req.userId).select("name email");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.log("ME ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 👇 Admin only route
router.post(
  "/add-user",
  verifyToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      console.log("REQ BODY:", req.body);

      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Password hash
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await Admin.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      console.log("NEW USER:", newUser);

      res.status(201).json({
        message: "User added successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.log("ADD USER ERROR:", error); // 🔹 Check exact error here
      res.status(500).json({ message: error.message });
    }
  }
);

//All users get
router.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await Admin.find().select("name email role"); // select only needed fields
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//Edit page user get
router.get("/users/:id", verifyToken, async (req, res) => {
  try {
    const user = await Admin.findById(req.params.id).select("name email role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user
router.put("/users/:id", verifyToken, async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    const user = await Admin.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 update fields
    user.name = name;
    user.email = email;
    user.role = role;

    // 🔹 password update only if provided
    if (password) {
      const bcrypt = require("bcrypt");
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/users/:id", verifyToken, async (req, res) => {
  try {
    // 🔹 Ensure only admin can delete
    const adminUser = await Admin.findById(req.userId);
    if (!adminUser) {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const userToDelete = await Admin.findById(req.params.id);
    if (!userToDelete)
      return res.status(404).json({ message: "User not found" });

    await userToDelete.deleteOne(); // 🔹 better than remove()
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("DELETE USER ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.get(
  "/admin-dashboard",
  verifyToken,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin Dashboard" });
  }
);

router.get(
  "/staff-dashboard",
  verifyToken,
  authorizeRoles("admin", "staff"),
  (req, res) => {
    res.json({ message: "Welcome Staff Dashboard" });
  }
);
module.exports = router;
