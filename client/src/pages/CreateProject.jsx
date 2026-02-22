import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';
import { toast } from 'react-toastify';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectService.create(formData);
      toast.success('Project created!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Create Project</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Project Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="4"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export default CreateProject;