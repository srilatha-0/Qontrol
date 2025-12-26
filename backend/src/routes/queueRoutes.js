const express = require("express");
const router = express.Router();
const queueController = require("../controllers/queueController");

router.get("/", queueController.getQueues);
router.post("/", queueController.createQueue);
router.put("/:queueId/avgTime", queueController.updateAvgTime);
router.delete("/:queueId", queueController.deleteQueue);
router.get("/:queueId/users", queueController.getQueueUsers);
router.post("/join", queueController.joinQueue);

module.exports = router;
