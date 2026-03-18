import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import MainLayout from './MainLayout'; 

export const PrivateRoute = ({ isDark, toggleTheme }) => {
    const isAuth = useAuthStore((state) => state.isAuthenticated);

    if (!isAuth) {
        return <Navigate to="/login" />;
    }

    return (
        <MainLayout isDark={isDark} toggleTheme={toggleTheme}>
            <Outlet />
        </MainLayout>
    );
};