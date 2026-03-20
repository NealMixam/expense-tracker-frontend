import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  getMe: async () => {
    try {
      const res = await api.get('/auth/me');
      const userData = res.data;
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData, isAuthenticated: true });
    } catch (err) {
      console.error('Ошибка проверки сессии:', err);
      get().logout();
    }
  },

  register: async (username, password, email) => {
    const res = await api.post('/auth/register', { username, password, email });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  login: async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  updateProfile: async (userData) => {
    try {
      const res = await api.put('/auth/update', userData);
      const updatedUser = res.data;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
      return updatedUser;
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, isAuthenticated: false, user: null });
  },
}));
