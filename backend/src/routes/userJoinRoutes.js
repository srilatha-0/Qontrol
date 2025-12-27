const express = require("express");
const router = express.Router();
const { getQueues, joinQueue } = require("../controllers/userJoinController");

// GET all queues
router.get("/", getQueues);

// POST join a queue
router.post("/:queueId/join", joinQueue);

module.exports = router;
