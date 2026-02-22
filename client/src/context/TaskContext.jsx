// client/src/context/TaskContext.jsx
import React, { createContext, useState, useContext } from 'react';
import taskService from '../services/taskService';
import { toast } from 'react-toastify';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTasks = async (filters = {}) => {
        setLoading(true);
        try {
            const { data } = await taskService.getAll(filters);
            setTasks(data.tasks);
            return data;
        } catch (error) {
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectTasks = async (projectId) => {
        setLoading(true);
        try {
            const { data } = await taskService.getByProject(projectId);
            setTasks(data.tasks);
            return data.tasks;
        } catch (error) {
            toast.error('Failed to load tasks');
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (taskData) => {
        try {
            const { data } = await taskService.create(taskData);
            setTasks((prev) => [data.task, ...prev]);
            toast.success('Task created!');
            return { success: true, task: data.task };
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to create task';
            toast.error(msg);
            return { success: false, message: msg };
        }
    };

    const updateTask = async (id, taskData) => {
        try {
            const { data } = await taskService.update(id, taskData);
            setTasks((prev) => prev.map((t) => (t._id === id ? data.task : t)));
            return { success: true, task: data.task };
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to update task';
            toast.error(msg);
            return { success: false };
        }
    };

    const deleteTask = async (id) => {
        try {
            await taskService.delete(id);
            setTasks((prev) => prev.filter((t) => t._id !== id));
            toast.success('Task deleted!');
            return { success: true };
        } catch (error) {
            toast.error('Failed to delete task');
            return { success: false };
        }
    };

    return (
        <TaskContext.Provider
            value={{ tasks, loading, fetchTasks, fetchProjectTasks, createTask, updateTask, deleteTask }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => useContext(TaskContext);
export default TaskContext;
