// client/src/components/tasks/TaskFilter.jsx
import React from 'react';

const TaskFilter = ({ filters, onChange, onClear }) => {
    return (
        <div className="flex flex-wrap gap-3">
            <input
                value={filters.search || ''}
                onChange={(e) => onChange({ ...filters, search: e.target.value })}
                placeholder="Search tasks..."
                className="flex-1 min-w-40 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
                value={filters.status || ''}
                onChange={(e) => onChange({ ...filters, status: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
                <option value="">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
            </select>
            <select
                value={filters.priority || ''}
                onChange={(e) => onChange({ ...filters, priority: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
                <option value="">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
            {(filters.search || filters.status || filters.priority) && (
                <button
                    onClick={onClear}
                    className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                    Clear
                </button>
            )}
        </div>
    );
};

export default TaskFilter;
