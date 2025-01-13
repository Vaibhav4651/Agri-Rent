const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const authMiddleware = require('../middleware/auth'); // Authentication middleware

/**
 * @route   GET /api/services/admin/:adminId
 * @desc    Get all services added by a specific admin
 * @access  Private (Admin Only)
 */
router.get('/admin/:adminId', authMiddleware, async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!adminId) {
      return res.status(400).json({ message: 'Admin ID is required.' });
    }

    const services = await Service.find({ adminId });

    if (!services || services.length === 0) {
      return res.status(404).json({ message: 'No services found for this admin.' });
    }

    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching admin services:', error.message);
    res.status(500).json({ message: 'Failed to fetch services.' });
  }
});

/**
 * @route   GET /api/services/categories
 * @desc    Get predefined service categories
 * @access  Public
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      'Tractor 855-HP',
      'Plough',
      'Rotavator',
      'Thresher',
      'Cultivator',
      'Wheat Planter',
      'Soyabean Cutting Machine',
      'Stone Picker'
    ];

    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ message: 'Failed to fetch categories.' });
  }
});

/**
 * @route   POST /api/services/add
 * @desc    Add a new service
 * @access  Private (Admin Only)
 */
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { category, cost, adminId } = req.body;

    if (!category || !cost || !adminId) {
      return res.status(400).json({ message: 'Category, cost, and adminId are required.' });
    }

    const newService = new Service({
      category,
      cost,
      adminId,
    });

    await newService.save();

    res.status(201).json({ message: 'Service added successfully.', service: newService });
  } catch (error) {
    console.error('Error adding service:', error.message);
    res.status(500).json({ message: 'Failed to add service.' });
  }
});

/**
 * @route   PUT /api/services/update/:id
 * @desc    Update an existing service
 * @access  Private (Admin Only)
 */
router.put('/update/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, cost, adminId } = req.body;

    if (!id || !category || !cost || !adminId) {
      return res.status(400).json({ message: 'Service ID, category, cost, and adminId are required.' });
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { category, cost, adminId },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.status(200).json({ message: 'Service updated successfully.', service: updatedService });
  } catch (error) {
    console.error('Error updating service:', error.message);
    res.status(500).json({ message: 'Failed to update service.' });
  }
});

/**
 * @route   DELETE /api/services/delete/:id
 * @desc    Delete a service
 * @access  Private (Admin Only)
 */
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Service ID is required.' });
    }

    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.status(200).json({ message: 'Service deleted successfully.' });
  } catch (error) {
    console.error('Error deleting service:', error.message);
    res.status(500).json({ message: 'Failed to delete service.' });
  }
});

/**
 * @route   GET /api/services
 * @desc    Get all services
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();

    if (!services || services.length === 0) {
      return res.status(404).json({ message: 'No services available.' });
    }

    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error.message);
    res.status(500).json({ message: 'Failed to fetch services.' });
  }
});

module.exports = router;
