// client/src/pages/TasksPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Loader from '../components/common/Loader';
import taskService from '../services/taskService';
import { toast } from 'react-toastify';

const priorityConfig = {
    urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200' },
    high: { label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    low: { label: 'Low', color: 'bg-green-100 text-green-700 border-green-200' },
};

const statusConfig = {
    todo: { label: 'To Do', color: 'bg-slate-100 text-slate-600' },
    'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
    review: { label: 'Review', color: 'bg-purple-100 text-purple-700' },
    done: { label: 'Done', color: 'bg-green-100 text-green-700' },
};

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', priority: '', search: '' });

    const loadTasks = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.status) params.status = filters.status;
            if (filters.priority) params.priority = filters.priority;
            if (filters.search) params.search = filters.search;
            const { data } = await taskService.getAll(params);
            setTasks(data.tasks);
        } catch {
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadTasks(); }, [filters.status, filters.priority]);

    const handleSearch = (e) => {
        if (e.key === 'Enter') loadTasks();
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const { data } = await taskService.update(taskId, { status: newStatus });
            setTasks((prev) => prev.map((t) => (t._id === taskId ? data.task : t)));
            toast.success('Status updated');
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (taskId) => {
        if (!confirm('Delete this task?')) return;
        try {
            await taskService.delete(taskId);
            setTasks((prev) => prev.filter((t) => t._id !== taskId));
            toast.success('Task deleted');
        } catch {
            toast.error('Failed to delete task');
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
                            <p className="text-slate-500 mt-1">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap gap-3">
                        <input
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            onKeyDown={handleSearch}
                            placeholder="Search tasks... (Enter to search)"
                            className="flex-1 min-w-48 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        >
                            <option value="">All Statuses</option>
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                        </select>
                        <select
                            value={filters.priority}
                            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        >
                            <option value="">All Priorities</option>
                            <option value="urgent">Urgent</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                        {(filters.status || filters.priority || filters.search) && (
                            <button
                                onClick={() => setFilters({ status: '', priority: '', search: '' })}
                                className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-16"><Loader size="lg" /></div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-1">No tasks found</h3>
                            <p className="text-slate-400 text-sm mb-4">
                                {filters.status || filters.priority || filters.search
                                    ? 'Try adjusting your filters'
                                    : 'Go to a project to create tasks'}
                            </p>
                            <Link to="/projects" className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm inline-block">
                                View Projects
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Task</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Project</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Due</th>
                                        <th className="px-5 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {tasks.map((task) => {
                                        const priority = priorityConfig[task.priority] || priorityConfig.medium;
                                        const status = statusConfig[task.status] || statusConfig.todo;
                                        return (
                                            <tr key={task._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <p className="text-sm font-medium text-slate-800">{task.title}</p>
                                                    {task.description && (
                                                        <p className="text-xs text-slate-400 truncate max-w-xs">{task.description}</p>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5 hidden sm:table-cell">
                                                    {task.project ? (
                                                        <Link
                                                            to={`/projects/${task.project._id}`}
                                                            className="text-xs text-indigo-600 hover:underline"
                                                        >
                                                            {task.project.name}
                                                        </Link>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">—</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priority.color}`}>
                                                        {priority.label}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <select
                                                        value={task.status}
                                                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                                        className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                                                    >
                                                        <option value="todo">To Do</option>
                                                        <option value="in-progress">In Progress</option>
                                                        <option value="review">Review</option>
                                                        <option value="done">Done</option>
                                                    </select>
                                                </td>
                                                <td className="px-5 py-3.5 hidden md:table-cell">
                                                    <span className="text-xs text-slate-500">
                                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <button
                                                        onClick={() => handleDelete(task._id)}
                                                        className="text-slate-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TasksPage;
