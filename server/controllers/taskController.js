// server/controllers/taskController.js
const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// @desc    Get all tasks with filters
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const {
      project,
      status,
      priority,
      assignedTo,
      search,
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query;

    // Build query
    const query = {};

    // Get user's projects first
    const userProjects = await Project.find({
      $or: [
        { owner: req.user._id },
        { 'members.user': req.user._id },
      ],
    }).select('_id');

    const projectIds = userProjects.map((p) => p._id);
    query.project = { $in: projectIds };

    // Apply filters
    if (project) query.project = project;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name owner members')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name avatar',
        },
      });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check if user has access to this task
    const project = task.project;
    const hasAccess =
      project.owner.toString() === req.user._id.toString() ||
      project.members.some(
        (m) => m.user.toString() === req.user._id.toString()
      );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task',
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate, tags } =
      req.body;

    // Verify project exists and user has access
    const projectDoc = await Project.findById(project);

    if (!projectDoc) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check if user is project member
    const isMember =
      projectDoc.owner.toString() === req.user._id.toString() ||
      projectDoc.members.some(
        (m) => m.user.toString() === req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create tasks in this project',
      });
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      createdBy: req.user._id,
      priority,
      dueDate,
      tags,
    });

    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');
    await task.populate('project', 'name');

    // Create notification if task is assigned
    if (assignedTo && assignedTo !== req.user._id.toString()) {
      await Notification.create({
        user: assignedTo,
        type: 'task_assigned',
        title: 'New Task Assigned',
        message: `You have been assigned to task: ${title}`,
        relatedTask: task._id,
        relatedProject: project,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check authorization
    const project = task.project;
    const isAuthorized =
      project.owner.toString() === req.user._id.toString() ||
      project.members.some(
        (m) => m.user.toString() === req.user._id.toString()
      );

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    const oldAssignee = task.assignedTo?.toString();
    const newAssignee = req.body.assignedTo;

    // Update task
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name');

    // Create notification if assignee changed
    if (
      newAssignee &&
      oldAssignee !== newAssignee &&
      newAssignee !== req.user._id.toString()
    ) {
      await Notification.create({
        user: newAssignee,
        type: 'task_assigned',
        title: 'Task Assigned to You',
        message: `You have been assigned to task: ${task.title}`,
        relatedTask: task._id,
        relatedProject: task.project._id,
      });
    }

    // Notify about status change
    if (req.body.status && task.assignedTo && task.assignedTo._id.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: task.assignedTo._id,
        type: 'task_updated',
        title: 'Task Status Updated',
        message: `Task "${task.title}" status changed to ${req.body.status}`,
        relatedTask: task._id,
        relatedProject: task.project._id,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Only project owner or task creator can delete
    const isAuthorized =
      task.project.owner.toString() === req.user._id.toString() ||
      task.createdBy.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks by project
// @route   GET /api/tasks/project/:projectId
// @access  Private
exports.getTasksByProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check access
    const hasAccess =
      project.owner.toString() === req.user._id.toString() ||
      project.members.some(
        (m) => m.user.toString() === req.user._id.toString()
      );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project',
      });
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign task to user
// @route   POST /api/tasks/:id/assign
// @access  Private
exports.assignTask = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Update task
    task.assignedTo = userId;
    await task.save();

    await task.populate('assignedTo', 'name email avatar');

    // Create notification
    if (userId && userId !== req.user._id.toString()) {
      await Notification.create({
        user: userId,
        type: 'task_assigned',
        title: 'Task Assigned',
        message: `You have been assigned to: ${task.title}`,
        relatedTask: task._id,
        relatedProject: task.project._id,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task assigned successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};