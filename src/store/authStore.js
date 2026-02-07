import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),

    login: async (username, password) => {
        const res = await api.post('/auth/login', { username, password });
        const { token } = res.data;
        localStorage.setItem('token', token);
        set({ token, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ token: null, isAuthenticated: false, user: null });
    }
}));