// client/src/components/common/Footer.jsx
import React from 'react';

const Footer = () => (
    <footer className="bg-white border-t border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-slate-400">
                © {new Date().getFullYear()} TaskPulse. All rights reserved.
            </p>
        </div>
    </footer>
);

export default Footer;
