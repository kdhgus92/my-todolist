import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../entities/user';
import { Button } from '../../../shared/ui/Button';
import { useThemeStore } from '../../../shared/lib/theme';
import { useI18nStore, useTranslation, type Locale } from '../../../shared/lib/i18n';

const LOCALES: Locale[] = ['ko', 'en', 'ja'];
const LOCALE_LABEL: Record<Locale, string> = { ko: 'KO', en: 'EN', ja: 'JA' };

export function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const { t, locale } = useTranslation();
  const setLocale = useI18nStore((s) => s.setLocale);

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
            {t('header', 'todos')}
          </NavLink>
          <NavLink to="/my-page" style={navLinkStyle}>
            {t('header', 'myPage')}
          </NavLink>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            aria-label="Language"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-strong)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: 13,
              color: 'var(--color-text)',
            }}
          >
            {LOCALES.map((l) => (
              <option key={l} value={l}>{LOCALE_LABEL[l]}</option>
            ))}
          </select>
          <button
            onClick={toggleTheme}
            aria-label={t('header', 'toggleTheme')}
            style={{
              background: 'none',
              border: '1px solid var(--color-border-strong)',
              borderRadius: 'var(--radius-full)',
              width: 36,
              height: 36,
              cursor: 'pointer',
              fontSize: 16,
              color: 'var(--color-text)',
            }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Button className="header-logout-btn" variant="secondary" onClick={handleLogout}>
            {t('header', 'logout')}
          </Button>
          <button className="header-hamburger-btn" onClick={() => setMenuOpen((o) => !o)} aria-label={t('header', 'menu')}>
            ☰
          </button>
        </div>
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
            {t('header', 'todos')}
          </NavLink>
          <NavLink to="/my-page" style={navLinkStyle} onClick={() => setMenuOpen(false)}>
            {t('header', 'myPage')}
          </NavLink>
          <Button variant="secondary" onClick={handleLogout}>
            {t('header', 'logout')}
          </Button>
        </nav>
      )}
    </header>
  );
}
