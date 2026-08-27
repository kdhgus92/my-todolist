import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../entities/user';
import { Header } from '../../widgets/header';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
