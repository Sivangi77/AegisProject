const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  startTime: { type: String }, // Format: "HH:mm"
  endTime: { type: String },
  type: { type: String, enum: ['event', 'meeting', 'reminder'], default: 'event' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
