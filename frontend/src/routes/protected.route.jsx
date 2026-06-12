import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';

export default function ProtectedRoute({children,}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "40px" }}>Đang kiểm tra đăng nhập...</div>;
  } 

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}