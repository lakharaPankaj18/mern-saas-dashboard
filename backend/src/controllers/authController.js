import bcrypt from "bcryptjs";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import sendEmail from '../utils/email.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 3️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4️⃣ Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5️⃣ Send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    // Read email and password
    const { email, password } = req.body;

    // validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password required",
      });
    }

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


// --- STEP 1: FORGOT PASSWORD ---
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: 'If an account exists, an email was sent.' });
    }

    // Generate raw token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Save hashed token to DB
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 Minutes

    await user.save({ validateBeforeSave: false });

    // Link points to your FRONTEND URL
    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
    const message = `Reset your password here: ${resetURL}\nThis link expires in 10 minutes.`;

    try {
      await sendEmail({ email: user.email, subject: 'Password Reset Request', message });
      res.status(200).json({ status: 'success', message: 'Token sent to email' });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- STEP 2: RESET PASSWORD ---
export const resetPassword = async (req, res) => {
  try {
    // 1. Hash the token from the URL to compare with DB
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // 2. Find user with valid token and unexpired time
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password'); // Explicitly select password for hashing check

    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    // 3. Update password and clear reset fields
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ status: 'success', message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};