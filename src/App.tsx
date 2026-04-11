import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { InputSwitchChangeEvent } from 'primereact/inputswitch';

import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import AnalyticsView from './views/AnalyticsView';
import SettingsView from './views/SettingsView';
import RegisterView from './views/RegisterView';
import { PrivateRoute } from './components/PrivateRoute';

import { useAuthStore } from './store/authStore';
import { useExpenseStore } from './store/expenseStore';

const App: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const { isAuthenticated, getMe } = useAuthStore.getState();
    const { fetchExpenses } = useExpenseStore.getState();

    if (isAuthenticated) {
      getMe();
      fetchExpenses();
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    let themeLink = document.getElementById('theme-link') as HTMLLinkElement | null;

    if (!themeLink) {
      themeLink = document.createElement('link');
      themeLink.id = 'theme-link';
      themeLink.rel = 'stylesheet';
      document.head.appendChild(themeLink);
    }

    if (isDark) {
      html.classList.add('p-dark');
      themeLink.href = '/themes/lara-dark-blue/theme.css';
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('p-dark');
      themeLink.href = '/themes/lara-light-blue/theme.css';
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = (e?: InputSwitchChangeEvent) => {
    if (e !== undefined) {
      setIsDark(e.value ?? false);
    } else {
      setIsDark((prev) => !prev);
    }
  };

  return (
    <PrimeReactProvider value={{ ripple: true }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />

          <Route element={<PrivateRoute isDark={isDark} toggleTheme={toggleTheme} />}>
            <Route path="/" element={<HomeView />} />
            <Route path="/analytics" element={<AnalyticsView />} />
            <Route
              path="/settings"
              element={<SettingsView isDark={isDark} toggleTheme={toggleTheme} />}
            />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

export default App;