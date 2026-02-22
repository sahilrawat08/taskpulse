// client/src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
            <div className="text-8xl font-bold text-indigo-100 mb-2">404</div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Page not found</h1>
            <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
            <Link
                to="/dashboard"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors inline-block"
            >
                Go to Dashboard
            </Link>
        </div>
    </div>
);

export default NotFound;
