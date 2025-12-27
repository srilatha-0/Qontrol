const Queue = require("../models/Queue"); // queue schema
const QueueUser = require("../models/userjoinModel"); // lowercase j

// GET all queues
const getQueues = async (req, res) => {
  try {
    const queues = await Queue.find(); // fetch all admin-created queues
    res.json(queues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST join a queue
const joinQueue = async (req, res) => {
  try {
    const { queueId } = req.params;
    const { name, phone } = req.body;

    const newUser = new QueueUser({ name, phone, queue: queueId });
    await newUser.save();

    const position = await QueueUser.countDocuments({ queue: queueId });

    res.json({ position });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getQueues, joinQueue };
