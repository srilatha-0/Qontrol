import express from "express";
import path from "path";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authRoutes from "../auth.js";

const uri = "mongodb://localhost:27017/myDatabase";

mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Connection error:", err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "registration.html"));
});

app.use("/", authRoutes(User));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
