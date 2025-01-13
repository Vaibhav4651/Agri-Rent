const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  category: { type: String, required: true },
  cost: { type: Number, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', ServiceSchema);
