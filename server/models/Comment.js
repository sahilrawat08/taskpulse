const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: [true, 'Comment content is required'],
            maxlength: [1000, 'Comment cannot be more than 1000 characters'],
        },
    },
    { timestamps: true }
);

commentSchema.index({ task: 1 });

module.exports = mongoose.model('Comment', commentSchema);
