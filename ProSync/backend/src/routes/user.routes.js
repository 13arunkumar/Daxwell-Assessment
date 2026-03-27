const express = require('express');
const router = express.Router();
const { getUsers, getUserById } = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Get all users (admins and PMs can see all users)
router.get('/', authorize('admin', 'project_manager'), getUsers);

// Get user by ID
router.get('/:id', getUserById);

module.exports = router;
