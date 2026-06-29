const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  streak: { type: Number, default: 0 },
  history: [{ type: Date }] // Dates when the habit was completed
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);
