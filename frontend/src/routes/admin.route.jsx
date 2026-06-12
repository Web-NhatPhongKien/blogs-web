import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

   if (loading) {
    return <div style={{ padding: "40px" }}>Đang kiểm tra quyền admin...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;