const mongoose = require('mongoose');

function generateQueueCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const queueSchema = new mongoose.Schema({
  queueCode: { type: String, unique: true, default: generateQueueCode },
  organisationName: { type: String, required: true },
  locationName: { type: String, required: true },
  pinCode: { type: Number, required: true },
  avgTimePerPerson: { type: Number, default: 5 },
  purpose: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QueueUser' }],
});

module.exports = mongoose.model('Queue', queueSchema);
