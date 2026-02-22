// client/src/components/dashboard/DashBoard.jsx
// Dashboard overview widget component
import React from 'react';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';

const DashBoard = ({ stats, tasks = [], projects = [] }) => {
    return (
        <div>
            {/* Stats Grid */}
            {stats && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <StatsCard title="Total Tasks" value={stats.total || 0} icon="📋" color="bg-indigo-50" />
                    <StatsCard title="In Progress" value={stats.inProgress || 0} icon="🔄" color="bg-blue-50" />
                    <StatsCard title="Completed" value={stats.done || 0} icon="✅" color="bg-green-50" />
                    <StatsCard title="Projects" value={projects.length || 0} icon="📁" color="bg-purple-50" />
                </div>
            )}
            {/* Recent Activity */}
            <RecentActivity tasks={tasks} projects={projects} />
        </div>
    );
};

export default DashBoard;
