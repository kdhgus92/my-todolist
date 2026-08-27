import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../entities/user';
import { Button } from '../../../shared/ui/Button';

export function Header() {
  const navigate = useNavigate();

  function handleLogout() {
    useAuthStore.getState().logout();
    navigate('/login', { replace: true });
  }

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    font: 'var(--font-body)',
    fontWeight: isActive ? 700 : 400,
    color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
    textDecoration: 'none',
  });

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-4) var(--space-5)',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      <Link to="/todos" style={{ font: 'var(--font-h2)', color: 'var(--color-ink)', textDecoration: 'none' }}>
        my-todolist
      </Link>
      <nav style={{ display: 'flex', gap: 'var(--space-5)' }}>
        <NavLink to="/todos" style={navLinkStyle}>
          할일 목록
        </NavLink>
        <NavLink to="/my-page" style={navLinkStyle}>
          마이페이지
        </NavLink>
      </nav>
      <Button variant="secondary" onClick={handleLogout}>
        로그아웃
      </Button>
    </header>
  );
}
