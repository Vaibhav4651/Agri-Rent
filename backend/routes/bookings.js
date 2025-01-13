const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const authenticateToken = require('../middleware/authenticateToken');

// 🛡️ Middleware to validate required fields
const validateBookingFields = (req, res, next) => {
  const { serviceId, adminId, date, timeSlot } = req.body;
  if (!serviceId || !adminId || !date || !timeSlot) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  next();
};

// 📌 Create a Booking
router.post('/book', authenticateToken, validateBookingFields, async (req, res) => {
  try {
    const { serviceId, adminId, date, timeSlot } = req.body;
    const userId = req.user.id; // Extracted from JWT token

    // Check if the service is already booked for the selected time slot
    const existingBooking = await Booking.findOne({ serviceId, date, timeSlot });
    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked.' });
    }

    const newBooking = new Booking({
      serviceId,
      adminId,
      userId,
      date,
      timeSlot,
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking successful!', booking: newBooking });
  } catch (error) {
    console.error('Booking Error:', error.message);
    res.status(500).json({ message: 'Failed to create booking.' });
  }
});

// 📌 Fetch Bookings for a User
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId })
      .populate('serviceId', 'category cost')
      .populate('adminId', 'name');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Fetch Bookings Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch bookings.' });
  }
});

// 📌 Fetch Services by Admin
router.get('/services/:adminId', async (req, res) => {
  try {
    const { adminId } = req.params;
    const services = await Booking.find({ adminId })
      .populate('serviceId', 'category cost');
    res.status(200).json(services);
  } catch (error) {
    console.error('Admin Services Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch services.' });
  }
});

module.exports = router;
