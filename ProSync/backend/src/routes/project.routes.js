const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateProjectProgress,
} = require('../controllers/project.controller');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createProjectSchema,
  updateProjectSchema,
} = require('../validators/project.validator');

// All routes require authentication
router.use(authenticate);

router
  .route('/')
  .get(getAllProjects)
  .post(
    authorize('admin', 'project_manager'),
    validate(createProjectSchema),
    createProject
  );

router
  .route('/:id')
  .get(getProjectById)
  .put(
    authorize('admin', 'project_manager'),
    validate(updateProjectSchema),
    updateProject
  )
  .delete(authorize('admin'), deleteProject);

router
  .route('/:id/progress')
  .put(authorize('admin', 'project_manager'), updateProjectProgress);

module.exports = router;
