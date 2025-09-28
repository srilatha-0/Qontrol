import express from "express";
import path from "path";
import bodyParser from "body-parser";
import authRoutes from "./auth.js";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(process.cwd())));

// Serve registration.html
app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "registration.html"));
});

// Routes
app.use("/", authRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
