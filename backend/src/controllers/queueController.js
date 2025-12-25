const Queue = require("../models/Queue");

// Create a new queue
exports.createQueue = async (req, res) => {
  try {
    const { organisationName, locationName, pinCode, avgTimePerPerson } = req.body;

    // Check if organisationName exists
    const existingQueue = await Queue.findOne({ organisationName });
    if (existingQueue) {
      return res.status(400).json({ message: "Queue with this organisation name already exists" });
    }

    const queue = new Queue({
      organisationName,
      locationName,
      pinCode,
      avgTimePerPerson
    });

    await queue.save();
    res.status(201).json(queue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all queues
exports.getQueues = async (req, res) => {
  try {
    const queues = await Queue.find();
    res.status(200).json(queues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update avgTimePerPerson
exports.updateAvgTime = async (req, res) => {
  try {
    const { id } = req.params;
    const { avgTimePerPerson } = req.body;

    const queue = await Queue.findByIdAndUpdate(
      id,
      { avgTimePerPerson },
      { new: true }
    );

    if (!queue) return res.status(404).json({ message: "Queue not found" });

    res.status(200).json(queue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a queue
exports.deleteQueue = async (req, res) => {
  try {
    const { id } = req.params;
    const queue = await Queue.findByIdAndDelete(id);

    if (!queue) return res.status(404).json({ message: "Queue not found" });

    res.status(200).json({ message: "Queue deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get users joined for a queue
exports.getQueueUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const queue = await Queue.findById(id);

    if (!queue) return res.status(404).json({ message: "Queue not found" });

    res.status(200).json(queue.usersJoined);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
