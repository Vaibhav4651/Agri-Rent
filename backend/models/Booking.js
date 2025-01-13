const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Changed from vendorId to adminId
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
});

module.exports = mongoose.model('Booking', BookingSchema);
