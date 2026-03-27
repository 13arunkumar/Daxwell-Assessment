const User = require('../models/User');

/**
 * @desc    Get all users (filtered by role)
 * @route   GET /api/users
 * @access  Private (Admin, PM)
 */
const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;

    const query = { isActive: true };
    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select('name email role avatar');

    res.status(200).json({
      success: true,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
};
