// client/src/components/projects/ProjectList.jsx
import React from 'react';
import ProjectCard from './ProjectCard';

const ProjectList = ({ projects = [], onDelete }) => {
    if (projects.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-slate-400 text-sm">No projects found</p>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
                <ProjectCard key={project._id} project={project} onDelete={onDelete} />
            ))}
        </div>
    );
};

export default ProjectList;
