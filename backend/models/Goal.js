const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  deadline: { type: Date, required: true },
  type: { type: String, enum: ['short', 'medium', 'long'], required: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
