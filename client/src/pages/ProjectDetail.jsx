// client/src/pages/ProjectDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import { toast } from 'react-toastify';

const STATUSES = ['todo', 'in-progress', 'review', 'done'];
const statusLabels = { todo: 'To Do', 'in-progress': 'In Progress', review: 'Review', done: 'Done' };
const statusColors = {
  todo: 'bg-slate-100 text-slate-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  review: 'bg-purple-100 text-purple-700',
  done: 'bg-green-100 text-green-700',
};
const priorityColors = {
  urgent: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-green-100 text-green-700 border-green-200',
};

const TaskCard = ({ task, onStatusChange, onDelete }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-2">
      <h4 className="text-sm font-semibold text-slate-800 flex-1 mr-2">{task.title}</h4>
      <button
        onClick={() => onDelete(task._id)}
        className="text-slate-300 hover:text-red-400 transition-colors mt-0.5"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    {task.description && (
      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
    )}
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priorityColors[task.priority] || priorityColors.medium}`}>
        {task.priority}
      </span>
      {task.dueDate && (
        <span className="text-xs text-slate-400">
          Due {new Date(task.dueDate).toLocaleDateString()}
        </span>
      )}
    </div>
    {task.assignedTo && (
      <div className="mt-2 flex items-center gap-1.5">
        <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center">
          <span className="text-indigo-700 text-xs font-medium">
            {task.assignedTo.name?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <span className="text-xs text-slate-500">{task.assignedTo.name}</span>
      </div>
    )}
    <select
      value={task.status}
      onChange={(e) => onStatusChange(task._id, e.target.value)}
      className="mt-3 w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{statusLabels[s]}</option>
      ))}
    </select>
  </div>
);

const KanbanColumn = ({ status, tasks, onStatusChange, onDelete }) => (
  <div className="flex-1 min-w-72">
    <div className="flex items-center gap-2 mb-3">
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[status]}`}>
        {statusLabels[status]}
      </span>
      <span className="text-xs text-slate-400 font-medium">{tasks.length}</span>
    </div>
    <div className="space-y-3 min-h-24">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  </div>
);

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'medium', dueDate: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [projData, taskData] = await Promise.all([
          projectService.getById(id),
          taskService.getByProject(id),
        ]);
        setProject(projData.data.project);
        setTasks(taskData.data.tasks);
      } catch {
        toast.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const { data } = await taskService.create({ ...formData, project: id });
      setTasks((prev) => [data.task, ...prev]);
      toast.success('Task created!');
      setShowModal(false);
      setFormData({ title: '', description: '', priority: 'medium', dueDate: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const { data } = await taskService.update(taskId, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? data.task : t)));
    } catch {
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await taskService.delete(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const tasksByStatus = STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {});

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader size="lg" />
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-500">Project not found</p>
            <Link to="/projects" className="text-indigo-600 hover:underline mt-2 block">← Back to Projects</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
              <Link to="/projects" className="hover:text-indigo-600">Projects</Link>
              <span>/</span>
              <span className="text-slate-700 font-medium">{project.name}</span>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
                {project.description && (
                  <p className="text-slate-500 mt-1">{project.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {project.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    {project.members?.length || 1} member{(project.members?.length || 1) !== 1 ? 's' : ''}
                  </span>
                  <span className="text-xs text-slate-400">
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </button>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="flex gap-5 overflow-x-auto pb-6">
            {STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={tasksByStatus[status]}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Task Title *</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="Task title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              placeholder="Task description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm disabled:opacity-60"
            >
              {creating ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProjectDetail;