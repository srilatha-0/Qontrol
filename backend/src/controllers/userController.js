const User = require("../models/User");

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
// Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password }).select("-password"); // exclude password
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // For now, return user data directly (no JWT yet)
    res.status(200).json({ 
      message: "Login successful!", 
      user // <-- send user info to frontend
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get logged-in user profile (temporary, for testing)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne().select("-password"); // fetch first user
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ name: user.username, phone: user.phone, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

