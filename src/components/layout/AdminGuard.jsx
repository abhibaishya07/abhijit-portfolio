import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

export default function AdminGuard({ children }) {
  const { isAdmin } = useAdmin();
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}
