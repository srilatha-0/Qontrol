const axios = require("axios");
const QueueUser = require("../models/QueueUser");

exports.chat = async (req, res) => {
  try {

    const message = req.body.message;
    const phone = req.body.phone;

    let positionInfo = "Queue information not available.";

    if (phone) {

      const queueUser = await QueueUser.findOne({ phone });

      if (queueUser) {

        // calculate position
        const position =
          await QueueUser.countDocuments({
            queue: queueUser.queue,
            joinedAt: { $lt: queueUser.joinedAt }
          }) + 1;

        const peopleAhead = position - 1;

        const waitTime = peopleAhead * 3;

        positionInfo = `
User queue position is ${position}.
People ahead in queue: ${peopleAhead}.
Estimated waiting time: ${waitTime} minutes.
`;
      }
    }

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "meta-llama/Llama-3.1-8B-Instruct",
        max_tokens: 80,
        messages: [
          {
            role: "system",
            content: `
You are a chatbot for the Qontrol Queue Management System.

Queue Information:
${positionInfo}

Rules:
- Answer briefly
- Only talk about queue system
- If user asks position or waiting time, use the queue data above
`
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;

    res.json({ reply });

  } catch (error) {

    console.error(error.response?.data || error.message);

    res.json({
      reply: "Chatbot service unavailable"
    });

  }
};