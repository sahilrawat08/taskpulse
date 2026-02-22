// client/src/components/tasks/TaskCard.jsx
import React from 'react';

const priorityColors = {
    urgent: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200',
};

const statusColors = {
    todo: 'bg-slate-100 text-slate-600',
    'in-progress': 'bg-blue-100 text-blue-700',
    review: 'bg-purple-100 text-purple-700',
    done: 'bg-green-100 text-green-700',
};

const statusLabels = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    review: 'Review',
    done: 'Done',
};

const TaskCard = ({ task, onStatusChange, onDelete, showProject = false }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-slate-800 flex-1 mr-2">{task.title}</h4>
                {onDelete && (
                    <button
                        onClick={() => onDelete(task._id)}
                        className="text-slate-300 hover:text-red-400 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            {task.description && (
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
            )}
            <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priorityColors[task.priority] || priorityColors.medium}`}>
                    {task.priority}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status] || statusColors.todo}`}>
                    {statusLabels[task.status] || task.status}
                </span>
            </div>
            {showProject && task.project && (
                <p className="text-xs text-slate-400 mb-2">📁 {task.project.name}</p>
            )}
            {task.dueDate && (
                <p className="text-xs text-slate-400 mb-2">
                    📅 Due {new Date(task.dueDate).toLocaleDateString()}
                </p>
            )}
            {task.assignedTo && (
                <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-700 text-xs font-medium">
                            {task.assignedTo.name?.charAt(0)?.toUpperCase()}
                        </span>
                    </div>
                    <span className="text-xs text-slate-500">{task.assignedTo.name}</span>
                </div>
            )}
            {onStatusChange && (
                <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task._id, e.target.value)}
                    className="mt-3 w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
                >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                </select>
            )}
        </div>
    );
};

export default TaskCard;
