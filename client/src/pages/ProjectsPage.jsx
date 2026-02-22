// client/src/pages/ProjectsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import projectService from '../services/projectService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const ProjectCard = ({ project, onDelete }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow group">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-indigo-700 font-bold">{project.name?.charAt(0)?.toUpperCase()}</span>
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {project.name}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${project.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                        {project.status}
                    </span>
                </div>
            </div>
            <button
                onClick={() => onDelete(project._id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Delete project"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>

        {project.description && (
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{project.description}</p>
        )}

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                    {project.members?.slice(0, 3).map((m, i) => (
                        <div
                            key={i}
                            className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center"
                        >
                            <span className="text-indigo-700 text-xs font-medium">
                                {(m.user?.name || '?').charAt(0).toUpperCase()}
                            </span>
                        </div>
                    ))}
                </div>
                <span className="text-xs text-slate-400">
                    {project.members?.length || 1} member{(project.members?.length || 1) !== 1 ? 's' : ''}
                </span>
            </div>
            <Link
                to={`/projects/${project._id}`}
                className="text-sm text-indigo-600 font-medium hover:underline"
            >
                Open →
            </Link>
        </div>
    </div>
);

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', startDate: '', endDate: '' });
    const [creating, setCreating] = useState(false);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const { data } = await projectService.getAll();
            setProjects(data.projects);
        } catch {
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadProjects(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const { data } = await projectService.create(formData);
            setProjects((prev) => [data.project, ...prev]);
            toast.success('Project created!');
            setShowModal(false);
            setFormData({ name: '', description: '', startDate: '', endDate: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create project');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await projectService.delete(id);
            setProjects((prev) => prev.filter((p) => p._id !== id));
            toast.success('Project deleted');
        } catch {
            toast.error('Failed to delete project');
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
                            <p className="text-slate-500 mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Project
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-16"><Loader size="lg" /></div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-1">No projects yet</h3>
                            <p className="text-slate-400 text-sm mb-4">Create your first project to get started</p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                            >
                                Create Project
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {projects.map((project) => (
                                <ProjectCard key={project._id} project={project} onDelete={handleDelete} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Project Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Project">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Project Name *</label>
                        <input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            placeholder="My Awesome Project"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                            placeholder="Brief description..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
                            {creating ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default ProjectsPage;
