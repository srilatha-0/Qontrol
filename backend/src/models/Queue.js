const mongoose = require('mongoose');

function generateQueueCode() {
  // Generates something like 'A1B2C3'
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const queueSchema = new mongoose.Schema({
  queueCode: { type: String, unique: true, default: generateQueueCode }, // ✅ moved to top
  organisationName: { type: String, required: true },
  locationName: { type: String, required: true },
  pinCode: { type: Number, required: true },
  avgTimePerPerson: { type: Number, default: 5 },
  purpose: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QueueUser' }],
});

module.exports = mongoose.model('Queue', queueSchema);
