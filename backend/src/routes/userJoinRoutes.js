const express = require("express"); 
const {
  joinQueue,
  getQueueUsers,
  removeFromQueue,
  getUserCurrentQueue, // <-- add this
} = require("../controllers/userJoinController");

const router = express.Router();

// User joins queue
router.post("/queue/:queueId/join", joinQueue);

// Admin views queue users
router.get("/admin/queue/:queueId/users", getQueueUsers);

router.get("/current-queue", getUserCurrentQueue);


// Admin removes user
router.delete("/admin/queue/:queueId/remove/:entryId", removeFromQueue);

module.exports = router;
