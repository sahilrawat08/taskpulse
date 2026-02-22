// client/src/context/ProjectContext.jsx
import React, { createContext, useState, useContext } from 'react';
import projectService from '../services/projectService';
import { toast } from 'react-toastify';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const { data } = await projectService.getAll();
            setProjects(data.projects);
        } catch (error) {
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const createProject = async (projectData) => {
        try {
            const { data } = await projectService.create(projectData);
            setProjects((prev) => [data.project, ...prev]);
            toast.success('Project created!');
            return { success: true, project: data.project };
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to create project';
            toast.error(msg);
            return { success: false, message: msg };
        }
    };

    const updateProject = async (id, projectData) => {
        try {
            const { data } = await projectService.update(id, projectData);
            setProjects((prev) =>
                prev.map((p) => (p._id === id ? data.project : p))
            );
            toast.success('Project updated!');
            return { success: true, project: data.project };
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to update project';
            toast.error(msg);
            return { success: false };
        }
    };

    const deleteProject = async (id) => {
        try {
            await projectService.delete(id);
            setProjects((prev) => prev.filter((p) => p._id !== id));
            toast.success('Project deleted!');
            return { success: true };
        } catch (error) {
            toast.error('Failed to delete project');
            return { success: false };
        }
    };

    return (
        <ProjectContext.Provider
            value={{ projects, loading, fetchProjects, createProject, updateProject, deleteProject }}
        >
            {children}
        </ProjectContext.Provider>
    );
};

export const useProjects = () => useContext(ProjectContext);
export default ProjectContext;
