const Queue = require("../Queue"); // Queue model
const QueueUser = require("../userJoinModel"); // QueueUser model

// ========================
// User joins a queue
// ========================
const joinQueue = async (req, res) => {
  try {
    const { queueId } = req.params;
    let { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Missing user details" });
    }

    phone = phone.toString();

    // Check if queue exists
    const queue = await Queue.findById(queueId);
    if (!queue) return res.status(404).json({ message: "Queue not found" });

    // Check if user is already in any queue
    const existingQueue = await QueueUser.findOne({ phone });
    if (existingQueue) {
      if (existingQueue.queue.toString() === queueId) {
        // Already in this queue
        const usersInQueue = await QueueUser.find({ queue: queueId }).sort({ joinedAt: 1 });
        const position = usersInQueue.findIndex((u) => u.phone === phone) + 1;
        const estimatedTime = queue.avgTimePerPerson ? (position - 1) * queue.avgTimePerPerson : 0;

        return res.status(200).json({
          alreadyInQueue: true,
          message: "Already in queue",
          position,
          estimatedTime,
        });
      } else {
        // Already in another queue
        return res.status(400).json({
          alreadyInOtherQueue: true,
          message: `You are already in another queue. Please wait until admin removes you.`,
        });
      }
    }

    // Add user to queue
    const entry = await QueueUser.create({ name, phone, queue: queueId });

    // Calculate position
    const usersInQueue = await QueueUser.find({ queue: queueId }).sort({ joinedAt: 1 });
    const position = usersInQueue.findIndex((u) => u.phone === phone) + 1;
    const estimatedTime = queue.avgTimePerPerson ? (position - 1) * queue.avgTimePerPerson : 0;

    res.status(200).json({
      message: "Joined queue successfully",
      position,
      estimatedTime,
      entry,
    });

  } catch (error) {
    console.error("joinQueue error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "You already joined this queue" });
    }
    res.status(500).json({ message: error.message });
  }
};

// ========================
// Admin views queue users
// ========================
const getQueueUsers = async (req, res) => {
  try {
    const { queueId } = req.params;
    const users = await QueueUser.find({ queue: queueId }).sort({ joinedAt: 1 });
    const usersWithPosition = users.map((user, index) => ({
      position: index + 1,
      user
    }));
    res.status(200).json(usersWithPosition);
  } catch (error) {
    console.error("getQueueUsers error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ========================
// Admin removes user
// ========================
const removeFromQueue = async (req, res) => {
  try {
    const { entryId } = req.params;
    await QueueUser.findByIdAndDelete(entryId);
    res.status(200).json({ message: "User removed successfully" });
  } catch (error) {
    console.error("removeFromQueue error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ========================
// Get user's current queue (without JWT middleware)
// ========================
const getUserCurrentQueue = async (req, res) => {
  try {
    // Get phone from query param
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    const entry = await QueueUser.findOne({ phone }).populate("queue"); // get queue details

    if (!entry) {
      return res.status(200).json({ inQueue: false });
    }

    // Calculate position
    const position = await QueueUser.countDocuments({
      queue: entry.queue._id,
      joinedAt: { $lte: entry.joinedAt },
    });

    res.status(200).json({
      inQueue: true,
      queueId: entry.queue._id,
      queueName: entry.queue.organisationName,
      position,
    });
  } catch (error) {
    console.error("getUserCurrentQueue error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { joinQueue, getQueueUsers, removeFromQueue, getUserCurrentQueue };
