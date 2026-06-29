const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, required: true, unique: true },
  displayName: { type: String },
  photoURL: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  productivityScore: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
