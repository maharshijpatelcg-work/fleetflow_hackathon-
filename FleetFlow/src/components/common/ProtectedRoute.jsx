import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their respective homepage if they don't have access to this route
        const homePaths = {
            DISPATCHER: '/dispatch',
            FINANCIAL_ANALYST: '/analytics',
            FLEET_MANAGER: '/drivers'
        };
        return <Navigate to={homePaths[user.role] || '/login'} replace />;
    }

    return children;
};

export default ProtectedRoute;
