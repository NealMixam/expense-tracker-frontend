import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import MainLayout from './MainLayout';
import { InputSwitchChangeEvent } from 'primereact/inputswitch';

interface PrivateRouteProps {
    isDark: boolean;
    toggleTheme: (e?: InputSwitchChangeEvent) => void;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ isDark, toggleTheme }) => {
    const isAuth = useAuthStore((state) => state.isAuthenticated);

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return (
        <MainLayout isDark={isDark} toggleTheme={toggleTheme}>
            <Outlet />
        </MainLayout>
    );
};