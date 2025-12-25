const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema({
  organisationName: { type: String, required: true, unique: true },
  locationName: { type: String, required: true },
  pinCode: { type: String, required: true },
  avgTimePerPerson: { type: Number, required: true, default: 5 },
  usersJoined: [
    {
      name: String,
      phone: String,
      joinedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Queue", queueSchema);
