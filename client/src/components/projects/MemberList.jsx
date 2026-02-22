// client/src/components/projects/MemberList.jsx
import React from 'react';

const MemberList = ({ members = [] }) => {
    if (!members.length) return <p className="text-sm text-slate-400">No members</p>;
    return (
        <div className="space-y-2">
            {members.map((member, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-700 text-sm font-medium">
                            {(member.user?.name || '?').charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-800">{member.user?.name}</p>
                        <p className="text-xs text-slate-400">{member.user?.email}</p>
                    </div>
                    <span className="ml-auto text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full capitalize">
                        {member.role}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default MemberList;
