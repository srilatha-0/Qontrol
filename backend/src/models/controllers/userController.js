const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Signup
exports.signup = async (req, res) => {
  const { username, phone, email, password } = req.body;

  try {
    const newUser = new User({ username, phone, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Profile
exports.getProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.username,   // ✅ matches frontend
      phone: user.phone,
      email: user.email,
    });

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
