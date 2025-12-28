const mongoose = require('mongoose');

const queueUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  queue: { type: mongoose.Schema.Types.ObjectId, ref: 'Queue', required: true },
  joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.QueueUser || mongoose.model('QueueUser', queueUserSchema);
