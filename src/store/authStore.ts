import { create } from 'zustand';
import api from '../api/axios';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  getMe: () => Promise<void>;
  register: (username: string, password: string, email: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  updateProfile: (userData: Partial<User> & { newPassword?: string }) => Promise<User>;
  logout: () => void;
}

const getStoredUser = (): User | null => {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getStoredUser(),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  getMe: async () => {
    try {
      const res = await api.get('/auth/me');
      const userData: User = res.data;
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData, isAuthenticated: true });
    } catch (err) {
      console.error('Ошибка проверки сессии:', err);
      get().logout();
    }
  },

  register: async (username, password, email) => {
    const res = await api.post('/auth/register', { username, password, email });
    const { token, user }: { token: string; user: User } = res.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  login: async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const { token, user }: { token: string; user: User } = res.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  updateProfile: async (userData) => {
    try {
      const res = await api.put('/auth/update', userData);
      const updatedUser: User = res.data;

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