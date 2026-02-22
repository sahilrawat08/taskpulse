// client/src/components/dashboard/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, icon, color = 'bg-indigo-50' }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <span className="text-2xl">{icon}</span>
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

export default StatsCard;
