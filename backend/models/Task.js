const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  difficulty: { type: Number, min: 1, max: 5, default: 3 },
  energyLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  tags: [{ type: String }],
  estimatedTimeMinutes: { type: Number, default: 30 },
  actualTimeMinutes: { type: Number, default: 0 },
  deadline: { type: Date },
  subtasks: [{
    title: { type: String },
    isCompleted: { type: Boolean, default: false }
  }],
  aiSummary: { type: String },
  priorityScore: { type: Number, default: 0 }, // Calculated dynamically by AI
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
