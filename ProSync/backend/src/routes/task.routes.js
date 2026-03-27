const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
} = require('../controllers/task.controller');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router
  .route('/')
  .post(authorize('admin', 'project_manager'), createTask);

router.route('/project/:projectId').get(getTasksByProject);

router
  .route('/:id')
  .get(getTaskById)
  .put(authorize('admin', 'project_manager'), updateTask)
  .delete(authorize('admin', 'project_manager'), deleteTask);

router.route('/:id/comments').post(addComment);

module.exports = router;
