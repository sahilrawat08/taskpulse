// client/src/components/tasks/CommentSection.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const CommentSection = ({ taskId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (taskId) loadComments();
    }, [taskId]);

    const loadComments = async () => {
        try {
            const { data } = await api.get(`/tasks/${taskId}/comments`);
            setComments(data.comments);
        } catch { /* silent */ }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setLoading(true);
        try {
            const { data } = await api.post(`/tasks/${taskId}/comments`, { content: newComment });
            setComments((prev) => [...prev, data.comment]);
            setNewComment('');
        } catch {
            toast.error('Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await api.delete(`/tasks/${taskId}/comments/${commentId}`);
            setComments((prev) => prev.filter((c) => c._id !== commentId));
        } catch {
            toast.error('Failed to delete comment');
        }
    };

    return (
        <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Comments ({comments.length})</h4>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {comments.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No comments yet. Be the first!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex gap-2.5 group">
                            <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-indigo-700 text-xs font-medium">
                                    {comment.user?.name?.charAt(0)?.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-slate-700">{comment.user?.name}</p>
                                    <button
                                        onClick={() => handleDelete(comment._id)}
                                        className="opacity-0 group-hover:opacity-100 text-xs text-slate-300 hover:text-red-400 transition-all"
                                    >
                                        ×
                                    </button>
                                </div>
                                <p className="text-sm text-slate-600">{comment.content}</p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
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
    );
};

export default CommentSection;
