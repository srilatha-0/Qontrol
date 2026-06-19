const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/", async (req, res) => {
    const { message, phone } = req.body;

    try {
        // Find the queue where this user is currently in
        const userQueue = await Queue.findOne({ "users.phone": phone });
        if (!userQueue) {
            return res.json({ reply: "You are not in any queue." });
        }

        // Calculate position and people ahead
        const position = userQueue.users.findIndex(u => u.phone === phone) + 1; // 1-based
        const peopleAhead = position - 1;
        const estimatedTime = peopleAhead * (userQueue.avgTimePerPerson || 5);

        // Check if the user asked about waiting time
        if (message.toLowerCase().includes("waiting time") || message.toLowerCase().includes("people ahead")) {
            return res.json({
                reply: `There are ${peopleAhead} people ahead of you in the queue. Estimated waiting time: ${estimatedTime} minutes.`
            });
        }

        // Other chatbot logic (FAQ, general questions) can go here
        // Example: 
        if (message.toLowerCase().includes("cancel")) {
            return res.json({ reply: "Cancellations are handled at the service desk. You can request an admin to remove you from the queue." });
        }

        // Default fallback reply
        return res.json({ reply: "Sorry, I didn't understand that. Can you rephrase?" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ reply: "Internal server error." });
    }
});

module.exports = router;