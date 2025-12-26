const Queue = require('../models/Queue');
const QueueUser = require('../models/QueueUser');

// Get all queues
exports.getQueues = async (req, res) => {
  try {
    const queues = await Queue.find().populate('users');
    res.json(queues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new queue
exports.createQueue = async (req, res) => {
  try {
    const { organisationName, locationName, pinCode, avgTimePerPerson, purpose } = req.body;

    // Check for duplicate organisationName
    const exists = await Queue.findOne({ organisationName });
    if (exists) return res.status(400).json({ message: "Queue with this name already exists" });

    const newQueue = new Queue({
      organisationName,
      locationName,
      pinCode,
      avgTimePerPerson,
      purpose, 
    });

    await newQueue.save();
    res.status(201).json(newQueue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update average time
exports.updateAvgTime = async (req, res) => {
  try {
    const { queueId } = req.params;
    const { avgTimePerPerson } = req.body;

    const queue = await Queue.findById(queueId);
    if (!queue) return res.status(404).json({ message: 'Queue not found' });

    queue.avgTimePerPerson = avgTimePerPerson;
    await queue.save();
    res.json(queue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete queue
exports.deleteQueue = async (req, res) => {
  try {
    const { queueId } = req.params;
    const queue = await Queue.findByIdAndDelete(queueId);
    if (!queue) return res.status(404).json({ message: 'Queue not found' });

    await QueueUser.deleteMany({ queue: queueId });

    res.json({ message: 'Queue deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get users of a queue
exports.getQueueUsers = async (req, res) => {
  try {
    const { queueId } = req.params;
    const queue = await Queue.findById(queueId).populate('users');
    if (!queue) return res.status(404).json({ message: 'Queue not found' });

    res.json(queue.users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Join queue using queueCode
exports.joinQueue = async (req, res) => {
  try {
    const { queueCode, name, phone } = req.body;

    const queue = await Queue.findOne({ queueCode });
    if (!queue) return res.status(404).json({ message: "Queue not found" });

    const user = await QueueUser.create({
      name,
      phone,
      queue: queue._id,
    });

    queue.users.push(user._id);
    await queue.save();

    res.json({ message: "Joined queue successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
