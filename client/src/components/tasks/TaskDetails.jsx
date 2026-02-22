// client/src/components/tasks/TaskDetails.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const TaskDetails = ({ task, onClose, onUpdate }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task?._id) loadComments();
    }, [task?._id]);

    const loadComments = async () => {
        try {
            const { data } = await api.get(`/tasks/${task._id}/comments`);
            setComments(data.comments);
        } catch {
            // silent fail
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setLoading(true);
        try {
            const { data } = await api.post(`/tasks/${task._id}/comments`, { content: newComment });
            setComments((prev) => [...prev, data.comment]);
            setNewComment('');
        } catch {
            toast.error('Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    if (!task) return null;

    const priorityColors = {
        urgent: 'bg-red-100 text-red-700',
        high: 'bg-orange-100 text-orange-700',
        medium: 'bg-yellow-100 text-yellow-700',
        low: 'bg-green-100 text-green-700',
    };

    return (
        <div>
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
                        {task.priority}
                    </span>
                </div>
                {task.description && (
                    <p className="text-sm text-slate-600 mt-2">{task.description}</p>
                )}
                {task.dueDate && (
                    <p className="text-xs text-slate-400 mt-2">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                )}
                {task.assignedTo && (
                    <p className="text-xs text-slate-500 mt-1">
                        Assigned to: <span className="font-medium">{task.assignedTo.name}</span>
                    </p>
                )}
            </div>

            {/* Comments */}
            <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Comments ({comments.length})</h4>
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {comments.map((comment) => (
                        <div key={comment._id} className="flex gap-2.5">
                            <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-indigo-700 text-xs font-medium">
                                    {comment.user?.name?.charAt(0)?.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-medium text-slate-700">{comment.user?.name}</p>
                                <p className="text-sm text-slate-600">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        disabled={loading || !newComment.trim()}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-indigo-700"
                    >
                        Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskDetails;
