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
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    res.status(200).json({ message: "Login successful!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
