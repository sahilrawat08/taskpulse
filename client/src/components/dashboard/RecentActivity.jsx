// client/src/components/dashboard/RecentActivity.jsx
import React from 'react';

const RecentActivity = ({ tasks = [], projects = [] }) => {
    const activities = [
        ...tasks.slice(0, 3).map((t) => ({
            id: t._id,
            type: 'task',
            name: t.title,
            date: t.createdAt,
            status: t.status,
        })),
        ...projects.slice(0, 2).map((p) => ({
            id: p._id,
            type: 'project',
            name: p.name,
            date: p.createdAt,
        })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div>
            <h3 className="text-base font-semibold text-slate-800 mb-4">Recent Activity</h3>
            {activities.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">No recent activity</p>
            ) : (
                <div className="space-y-3">
                    {activities.map((item) => (
                        <div key={item.id + item.type} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${item.type === 'task' ? 'bg-blue-50' : 'bg-indigo-50'
                                }`}>
                                {item.type === 'task' ? '✅' : '📁'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700 truncate">{item.name}</p>
                                <p className="text-xs text-slate-400 capitalize">
                                    {item.type} · {new Date(item.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentActivity;
