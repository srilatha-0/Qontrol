const Admin = require("../models/admin");
const bcrypt = require("bcrypt");

// Admin signup
exports.signup = async (req, res) => {
  const { username, phone, email, password, adminCode } = req.body;

  if (adminCode !== process.env.ADMIN_CODE) {
    return res.status(403).json({ message: "Invalid admin code" });
  }

  try {
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      username,
      phone,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Admin signup error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Admin login
exports.login = async (req, res) => {
  const { username, password, adminCode } = req.body;

  if (adminCode !== process.env.ADMIN_CODE) {
    return res.status(403).json({ message: "Invalid admin code" });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: err.message });
  }
};
