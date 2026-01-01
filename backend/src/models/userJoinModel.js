const mongoose = require("mongoose");

const queueUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  queue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Queue",
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String, // optional
  }
});

// ❗ Prevent SAME USER joining SAME QUEUE multiple times
queueUserSchema.index({ phone: 1, queue: 1 }, { unique: true });

// ✅ remove any other unique indexes like `email: 1`

module.exports =
  mongoose.models.QueueUser ||
  mongoose.model("QueueUser", queueUserSchema);
