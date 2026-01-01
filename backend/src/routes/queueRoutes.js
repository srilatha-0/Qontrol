const express = require("express");
const router = express.Router();
const queueController = require("../controllers/queueController");

router.get("/", queueController.getQueues);
router.post("/", queueController.createQueue);
router.put("/:queueId/avgTime", queueController.updateAvgTime);
router.delete("/:queueId", queueController.deleteQueue);
router.get("/:queueId/users", queueController.getQueueUsers);
router.post("/join", queueController.joinQueue);
router.get("/:queueId", async (req, res) => {
  try {
    const queue = await Queue.findById(req.params.queueId);
    if (!queue) return res.status(404).json({ message: "Queue not found" });
    res.json(queue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
