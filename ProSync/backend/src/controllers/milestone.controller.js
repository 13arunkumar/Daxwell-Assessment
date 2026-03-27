const Milestone = require('../models/Milestone');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

/**
 * @desc    Create milestone
 * @route   POST /api/milestones
 * @access  Private (Admin, PM)
 */
const createMilestone = async (req, res, next) => {
  try {
    const milestone = await Milestone.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Milestone created successfully',
      data: { milestone },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all milestones for a project
 * @route   GET /api/milestones/project/:projectId
 * @access  Private
 */
const getMilestonesByProject = async (req, res, next) => {
  try {
    const milestones = await Milestone.find({
      projectId: req.params.projectId,
    })
      .populate('deliverables.uploadedBy', 'name email')
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: { milestones },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update milestone
 * @route   PUT /api/milestones/:id
 * @access  Private (Admin, PM)
 */
const updateMilestone = async (req, res, next) => {
  try {
    const milestone = await Milestone.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Milestone updated successfully',
      data: { milestone },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Client approve milestone
 * @route   POST /api/milestones/:id/approve
 * @access  Private (Client)
 */
const approveMilestone = async (req, res, next) => {
  try {
    const milestone = await Milestone.findById(req.params.id).populate('projectId');

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found',
      });
    }

    // Verify client authorization
    if (milestone.projectId.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project client can approve milestones',
      });
    }

    milestone.status = 'client_approved';
    milestone.completedAt = new Date();
    milestone.approvalDetails = {
      approvedBy: req.user._id,
      approvedAt: new Date(),
      rejectionReason: null,
    };

    await milestone.save();

    // Create notification for PM
    await Notification.create({
      userId: milestone.projectId.projectManagerId,
      type: 'milestone_approved',
      title: 'Milestone Approved',
      message: `Milestone "${milestone.title}" has been approved by the client`,
      relatedId: milestone._id,
      relatedModel: 'Milestone',
    });

    res.status(200).json({
      success: true,
      message: 'Milestone approved successfully',
      data: { milestone },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Client reject milestone
 * @route   POST /api/milestones/:id/reject
 * @access  Private (Client)
 */
const rejectMilestone = async (req, res, next) => {
  try {
    const { reason } = req.body;

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required',
      });
    }

    const milestone = await Milestone.findById(req.params.id).populate('projectId');

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found',
      });
    }

    // Verify client authorization
    if (milestone.projectId.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the project client can reject milestones',
      });
    }

    milestone.status = 'in_progress';
    milestone.approvalDetails = {
      approvedBy: null,
      approvedAt: null,
      rejectionReason: reason,
    };

    await milestone.save();

    // Create notification for PM
    await Notification.create({
      userId: milestone.projectId.projectManagerId,
      type: 'milestone_rejected',
      title: 'Milestone Rejected',
      message: `Milestone "${milestone.title}" needs revision: ${reason}`,
      relatedId: milestone._id,
      relatedModel: 'Milestone',
    });

    res.status(200).json({
      success: true,
      message: 'Milestone rejected and moved back to in-progress',
      data: { milestone },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add deliverable to milestone
 * @route   POST /api/milestones/:id/deliverables
 * @access  Private (Admin, PM)
 */
const addDeliverable = async (req, res, next) => {
  try {
    const { name, url, type } = req.body;

    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found',
      });
    }

    milestone.deliverables.push({
      name,
      url,
      type,
      uploadedBy: req.user._id,
      uploadedAt: new Date(),
    });

    milestone.status = 'review';
    await milestone.save();

    res.status(200).json({
      success: true,
      message: 'Deliverable added successfully',
      data: { milestone },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMilestone,
  getMilestonesByProject,
  updateMilestone,
  approveMilestone,
  rejectMilestone,
  addDeliverable,
};
