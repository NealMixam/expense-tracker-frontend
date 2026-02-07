import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const PrivateRoute = ({ children }) => {
    const isAuth = useAuthStore((state) => state.isAuthenticated);
    return isAuth ? children : <Navigate to="/login" />;
};