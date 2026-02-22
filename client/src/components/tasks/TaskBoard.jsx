// client/src/components/tasks/TaskBoard.jsx
import React from 'react';
import TaskCard from './TaskCard';

const STATUSES = ['todo', 'in-progress', 'review', 'done'];
const statusLabels = { todo: 'To Do', 'in-progress': 'In Progress', review: 'Review', done: 'Done' };
const statusColors = {
    todo: 'bg-slate-100 text-slate-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    review: 'bg-purple-100 text-purple-700',
    done: 'bg-green-100 text-green-700',
};

const TaskBoard = ({ tasks = [], onStatusChange, onDelete }) => {
    const tasksByStatus = STATUSES.reduce((acc, status) => {
        acc[status] = tasks.filter((t) => t.status === status);
        return acc;
    }, {});

    return (
        <div className="flex gap-5 overflow-x-auto pb-6">
            {STATUSES.map((status) => (
                <div key={status} className="flex-1 min-w-72">
                    <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[status]}`}>
                            {statusLabels[status]}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{tasksByStatus[status].length}</span>
                    </div>
                    <div className="space-y-3 min-h-24">
                        {tasksByStatus[status].map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onStatusChange={onStatusChange}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskBoard;
