import express from "express";
import axios from "axios";

const router = express.Router();

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

        // ✅ CAPTCHA passed, proceed with signup logic
        // Example: save user to DB here
        return res.status(200).json({ message: "Sign Up Successful!" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error verifying CAPTCHA" });
    }
});

export default router;
