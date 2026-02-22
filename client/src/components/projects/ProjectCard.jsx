// client/src/components/projects/ProjectCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, onDelete }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow group">
        <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
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
            {onDelete && (
                <button
                    onClick={() => onDelete(project._id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            )}
        </div>
        {project.description && (
            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{project.description}</p>
        )}
        <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
                {project.members?.length || 1} member{(project.members?.length || 1) !== 1 ? 's' : ''}
            </span>
            <Link
                to={`/projects/${project._id}`}
                className="text-sm text-indigo-600 font-medium hover:underline"
            >
                Open →
            </Link>
        </div>
    </div>
);

export default ProjectCard;
