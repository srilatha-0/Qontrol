const express = require("express");
const router = express.Router();
const queueController = require("../controllers/queueController");

// Create queue
router.post("/", queueController.createQueue);

// Get all queues
router.get("/", queueController.getQueues);

// Update avgTimePerPerson
router.put("/:id/avgTime", queueController.updateAvgTime);

// Delete a queue
router.delete("/:id", queueController.deleteQueue);

// Get users joined for a queue
router.get("/:id/users", queueController.getQueueUsers);

module.exports = router;
