import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../entities/user';
import { Button } from '../../../shared/ui/Button';

export function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    setMenuOpen(false);
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
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--space-4) var(--space-5)',
        }}
      >
        <Link to="/todos" style={{ font: 'var(--font-h2)', color: 'var(--color-ink)', textDecoration: 'none' }}>
          my-todolist
        </Link>
        <nav className="header-nav">
          <NavLink to="/todos" style={navLinkStyle}>
            할일 목록
          </NavLink>
          <NavLink to="/my-page" style={navLinkStyle}>
            마이페이지
          </NavLink>
        </nav>
        <Button className="header-logout-btn" variant="secondary" onClick={handleLogout}>
          로그아웃
        </Button>
        <button className="header-hamburger-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="메뉴">
          ☰
        </button>
      </div>
      {menuOpen && (
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
            padding: 'var(--space-4) var(--space-5)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <NavLink to="/todos" style={navLinkStyle} onClick={() => setMenuOpen(false)}>
            할일 목록
          </NavLink>
          <NavLink to="/my-page" style={navLinkStyle} onClick={() => setMenuOpen(false)}>
            마이페이지
          </NavLink>
          <Button variant="secondary" onClick={handleLogout}>
            로그아웃
          </Button>
        </nav>
      )}
    </header>
  );
}
