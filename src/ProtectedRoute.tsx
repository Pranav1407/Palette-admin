import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export function ProtectedRoute() {
  const { userId, isAdmin } = useAuthStore();

  if (!userId || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}