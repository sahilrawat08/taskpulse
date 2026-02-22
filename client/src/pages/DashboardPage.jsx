// client/src/pages/DashboardPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Loader from '../components/common/Loader';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

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

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <span className="text-2xl">{icon}</span>
    </div>
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [projData, taskData] = await Promise.all([
          projectService.getAll(),
          taskService.getAll({ limit: 5, sort: '-createdAt' }),
        ]);
        setProjects(projData.data.projects);
        setTasks(taskData.data.tasks);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader size="lg" text="Loading dashboard..." />
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
              {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 mt-1">Here's what's happening with your projects today.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Total Tasks" value={stats.total} icon="📋" color="bg-indigo-50" />
            <StatCard title="To Do" value={stats.todo} icon="⏳" color="bg-slate-100" />
            <StatCard title="In Progress" value={stats.inProgress} icon="🔄" color="bg-blue-50" />
            <StatCard title="Completed" value={stats.done} icon="✅" color="bg-green-50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Projects */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-slate-800">Recent Projects</h2>
                <Link to="/projects" className="text-sm text-indigo-600 hover:underline">
                  View all
                </Link>
              </div>
              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">No projects yet.</p>
                  <Link
                    to="/projects"
                    className="mt-3 inline-block text-sm text-indigo-600 hover:underline"
                  >
                    Create your first project →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 4).map((project) => (
                    <Link
                      key={project._id}
                      to={`/projects/${project._id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-700 text-sm font-bold">
                            {project.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {project.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {project.members?.length || 1} member{(project.members?.length || 1) !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                        {project.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Tasks */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-slate-800">Recent Tasks</h2>
                <Link to="/tasks" className="text-sm text-indigo-600 hover:underline">
                  View all
                </Link>
              </div>
              {tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">No tasks yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => {
                    const priority = priorityConfig[task.priority] || priorityConfig.medium;
                    const status = statusConfig[task.status] || statusConfig.todo;
                    return (
                      <div key={task._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{task.title}</p>
                          <p className="text-xs text-slate-400">
                            {task.project?.name || 'Unknown project'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priority.color}`}>
                            {priority.label}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;