// client/src/components/common/Loader.jsx
import React from 'react';

const Loader = ({ size = 'md', text = '' }) => {
    const sizes = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`${sizes[size]} rounded-full border-indigo-200 border-t-indigo-600 animate-spin`}
            />
            {text && <p className="text-sm text-slate-500">{text}</p>}
        </div>
    );
};

export const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader size="lg" text="Loading..." />
    </div>
);

export default Loader;
