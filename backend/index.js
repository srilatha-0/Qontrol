const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const queueRoutes = require("./src/routes/queueRoutes");
const userJoinRoutes = require("./src/routes/userJoinRoutes");
const chatRoutes = require("./src/routes/chatRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Route prefixes
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/queue", queueRoutes);
app.use("/user-join", userJoinRoutes);
app.use("/chat", chatRoutes);


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.log(err));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));
