const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Task = require('../models/Task');

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (Admin, PM)
 */
const createProject = async (req, res, next) => {
  try {
    const projectData = {
      ...req.body,
      projectManagerId: req.body.projectManagerId || req.user._id,
    };

    const project = await Project.create(projectData);

    await project.populate([
      { path: 'clientId', select: 'name email' },
      { path: 'projectManagerId', select: 'name email' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Private
 */
const getAllProjects = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    // Build query based on user role
    let query = { isArchived: false };

    if (req.user.role === 'client') {
      query.clientId = req.user._id;
    } else if (req.user.role === 'project_manager') {
      query.projectManagerId = req.user._id;
    }

    // Add filters
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('clientId', 'name email avatar')
        .populate('projectManagerId', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Project.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        projects,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'name email avatar phone')
      .populate('projectManagerId', 'name email avatar phone');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check authorization
    if (
      req.user.role === 'client' &&
      project.clientId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    if (
      req.user.role === 'project_manager' &&
      project.projectManagerId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Get milestones and tasks
    const [milestones, tasks] = await Promise.all([
      Milestone.find({ projectId: project._id }).sort({ order: 1 }),
      Task.find({ projectId: project._id })
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        project,
        milestones,
        tasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private (Admin, PM)
 */
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check authorization
    if (
      req.user.role === 'project_manager' &&
      project.projectManagerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate(['clientId', 'projectManagerId']);

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: { project: updatedProject },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin)
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Soft delete by archiving
    project.isArchived = true;
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project archived successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Calculate and update project progress
 * @route   PUT /api/projects/:id/progress
 * @access  Private (PM, Admin)
 */
const updateProjectProgress = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Calculate progress based on tasks
    const tasks = await Task.find({ projectId: project._id });

    if (tasks.length === 0) {
      project.totalProgress = 0;
    } else {
      const completedTasks = tasks.filter((task) => task.status === 'done').length;
      project.totalProgress = Math.round((completedTasks / tasks.length) * 100);
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project progress updated',
      data: { progress: project.totalProgress },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateProjectProgress,
};
