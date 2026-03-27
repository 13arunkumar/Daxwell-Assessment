const Task = require('../models/Task');
const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * @desc    Create task
 * @route   POST /api/tasks
 * @access  Private (Admin, PM)
 */
const createTask = async (req, res, next) => {
  try {
    // Validate that assigned user is not an admin
    if (req.body.assignedTo) {
      const assignedUser = await User.findById(req.body.assignedTo);
      if (assignedUser && assignedUser.role === 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Tasks cannot be assigned to admin users. Admins manage projects, they do not execute tasks.',
        });
      }
    }

    const task = await Task.create(req.body);

    // If task is assigned, create notification
    if (task.assignedTo) {
      await Notification.create({
        userId: task.assignedTo,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You have been assigned task: "${task.title}"`,
        relatedId: task._id,
        relatedModel: 'Task',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tasks for a project
 * @route   GET /api/tasks/project/:projectId
 * @access  Private
 */
const getTasksByProject = async (req, res, next) => {
  try {
    const { status, priority } = req.query;

    const query = { projectId: req.params.projectId };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('milestoneId', 'title')
      .populate('comments.userId', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('milestoneId', 'title')
      .populate('comments.userId', 'name avatar');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private (Admin, PM)
 */
const updateTask = async (req, res, next) => {
  try {
    // Validate that assigned user is not an admin (if assignedTo is being updated)
    if (req.body.assignedTo) {
      const assignedUser = await User.findById(req.body.assignedTo);
      if (assignedUser && assignedUser.role === 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Tasks cannot be assigned to admin users. Admins manage projects, they do not execute tasks.',
        });
      }
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // If status changed to done, create notification
    if (req.body.status === 'done' && task.assignedTo) {
      await Notification.create({
        userId: task.assignedTo._id,
        type: 'task_completed',
        title: 'Task Completed',
        message: `Task "${task.title}" has been marked as completed`,
        relatedId: task._id,
        relatedModel: 'Task',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private (Admin, PM)
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add comment to task
 * @route   POST /api/tasks/:id/comments
 * @access  Private
 */
const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required',
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    task.comments.push({
      userId: req.user._id,
      content: content.trim(),
      createdAt: new Date(),
    });

    await task.save();

    await task.populate('comments.userId', 'name avatar');

    // Create notification if task is assigned to someone else
    if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
      await Notification.create({
        userId: task.assignedTo,
        type: 'comment_added',
        title: 'New Comment',
        message: `${req.user.name} commented on task: "${task.title}"`,
        relatedId: task._id,
        relatedModel: 'Task',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
};
