// client/src/components/projects/ProjectDetails.jsx
import React from 'react';

const ProjectDetails = ({ project }) => {
    if (!project) return null;
    return (
        <div className="space-y-3">
            <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-slate-700">{project.description || 'No description'}</p>
            </div>
            {project.startDate && (
                <div>
                    <p className="text-xs text-slate-400">Start: {new Date(project.startDate).toLocaleDateString()}</p>
                </div>
            )}
            {project.endDate && (
                <div>
                    <p className="text-xs text-slate-400">End: {new Date(project.endDate).toLocaleDateString()}</p>
                </div>
            )}
            <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Owner</p>
                <p className="text-sm text-slate-700">{project.owner?.name}</p>
            </div>
        </div>
    );
};

export default ProjectDetails;
