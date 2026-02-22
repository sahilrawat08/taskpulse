// client/src/pages/ProfilePage.jsx
import React, { useState, useContext } from 'react';
import Navbar from '../components/common/Navbar';
import AuthContext from '../context/AuthContext';
import userService from '../services/userService';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [tab, setTab] = useState('profile');
    const [profileData, setProfileData] = useState({ name: user?.name || '', avatar: user?.avatar || '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            const { data } = await userService.updateProfile(profileData);
            updateUser(data.user);
            toast.success('Profile updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setSavingPassword(true);
        try {
            await userService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success('Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-6">Profile Settings</h1>

                    {/* User Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 flex items-center gap-5">
                        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                            <span className="text-indigo-700 text-2xl font-bold">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">{user?.name}</h2>
                            <p className="text-slate-500 text-sm">{user?.email}</p>
                            <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-medium capitalize">
                                {user?.role}
                            </span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
                        <button
                            onClick={() => setTab('profile')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'profile' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Profile Info
                        </button>
                        <button
                            onClick={() => setTab('password')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === 'password' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Change Password
                        </button>
                    </div>

                    {tab === 'profile' ? (
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <form onSubmit={handleProfileSave} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                                    <input
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                                    <input
                                        value={user?.email}
                                        disabled
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-400 bg-slate-50 text-sm cursor-not-allowed"
                                    />
                                    <p className="mt-1 text-xs text-slate-400">Email cannot be changed</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Avatar URL</label>
                                    <input
                                        value={profileData.avatar}
                                        onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={savingProfile}
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm"
                                    >
                                        {savingProfile ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <form onSubmit={handlePasswordChange} className="space-y-5">
                                {[
                                    { name: 'currentPassword', label: 'Current Password' },
                                    { name: 'newPassword', label: 'New Password' },
                                    { name: 'confirmPassword', label: 'Confirm New Password' },
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">{field.label}</label>
                                        <input
                                            type="password"
                                            value={passwordData[field.name]}
                                            onChange={(e) => setPasswordData({ ...passwordData, [field.name]: e.target.value })}
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                ))}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={savingPassword}
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors text-sm"
                                    >
                                        {savingPassword ? 'Changing...' : 'Change Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
