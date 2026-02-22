import api from './api';

export const userService = {
    getMe: () => api.get('/users/me'),
    updateProfile: (data) => api.put('/users/profile', data),
    changePassword: (data) => api.put('/users/change-password', data),
    searchUsers: (q) => api.get('/users/search', { params: { q } }),
};

export default userService;
