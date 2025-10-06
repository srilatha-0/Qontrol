import express from "express";
import axios from "axios";
import bcrypt from "bcryptjs";

const router = express.Router();

export default (User) => {
    router.post("/signup", async (req, res) => {
        const captchaResponse = req.body['g-recaptcha-response'];

        if (!captchaResponse) {
            return res.status(400).json({ message: "CAPTCHA is required" });
        }

        try {
            const response = await axios.post(
                `https://www.google.com/recaptcha/api/siteverify?secret=6LdeAdgrAAAAADMTRaAKPHzIffZBSaHJQfy0bSdw&response=${captchaResponse}`
            );

            if (!response.data.success) {
                return res.status(400).json({ message: "CAPTCHA verification failed" });
            }

            const { username, phone, email, password, confirmPassword } = req.body;
            if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ message: "Email already registered" });

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, phone, email, password: hashedPassword });

            await newUser.save();
            return res.status(200).json({ message: "Sign Up Successful!" });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error verifying CAPTCHA or saving user" });
        }
    });

    return router;
};
