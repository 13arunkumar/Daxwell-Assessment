const express = require('express');
const router = express.Router();
const {
  createMilestone,
  getMilestonesByProject,
  updateMilestone,
  approveMilestone,
  rejectMilestone,
  addDeliverable,
} = require('../controllers/milestone.controller');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router
  .route('/')
  .post(authorize('admin', 'project_manager'), createMilestone);

router.route('/project/:projectId').get(getMilestonesByProject);

router
  .route('/:id')
  .put(authorize('admin', 'project_manager'), updateMilestone);

router
  .route('/:id/approve')
  .post(authorize('client'), approveMilestone);

router
  .route('/:id/reject')
  .post(authorize('client'), rejectMilestone);

router
  .route('/:id/deliverables')
  .post(authorize('admin', 'project_manager'), addDeliverable);

module.exports = router;
