const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get comments for a task
// @route   GET /api/tasks/:taskId/comments
// @access  Private
exports.getComments = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.taskId).populate('project');
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        const project = task.project;
        const hasAccess =
            project.owner.toString() === req.user._id.toString() ||
            project.members.some((m) => m.user.toString() === req.user._id.toString());

        if (!hasAccess) return res.status(403).json({ success: false, message: 'Not authorized' });

        const comments = await Comment.find({ task: req.params.taskId })
            .populate('user', 'name avatar')
            .sort('createdAt');

        res.status(200).json({ success: true, count: comments.length, comments });
    } catch (error) {
        next(error);
    }
};

// @desc    Add comment to a task
// @route   POST /api/tasks/:taskId/comments
// @access  Private
exports.addComment = async (req, res, next) => {
    try {
        const { content } = req.body;
        const task = await Task.findById(req.params.taskId).populate('project');

        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        const project = task.project;
        const hasAccess =
            project.owner.toString() === req.user._id.toString() ||
            project.members.some((m) => m.user.toString() === req.user._id.toString());

        if (!hasAccess) return res.status(403).json({ success: false, message: 'Not authorized' });

        const comment = await Comment.create({
            task: req.params.taskId,
            user: req.user._id,
            content,
        });

        await comment.populate('user', 'name avatar');

        res.status(201).json({ success: true, comment });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete comment
// @route   DELETE /api/tasks/:taskId/comments/:id
// @access  Private
exports.deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();
        res.status(200).json({ success: true, message: 'Comment deleted' });
    } catch (error) {
        next(error);
    }
};
