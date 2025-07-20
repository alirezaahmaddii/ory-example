import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, session }: any) => {
    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return children;
};