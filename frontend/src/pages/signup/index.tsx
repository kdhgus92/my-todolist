import { Link } from 'react-router-dom';
import { SignupForm } from '../../features/signup';
import { useTranslation } from '../../shared/lib/i18n';

export default function SignupPage() {
  const { t } = useTranslation();
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 'var(--space-7)',
      }}
    >
      <h1 style={{ font: 'var(--font-h1)', color: 'var(--color-ink)', marginBottom: 'var(--space-6)' }}>
        my-todolist
      </h1>
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          padding: 'var(--space-5)',
        }}
      >
        <h2 style={{ font: 'var(--font-h2)', marginTop: 0, marginBottom: 'var(--space-5)' }}>{t('signup', 'title')}</h2>
        <SignupForm />
        <p style={{ font: 'var(--font-body)', color: 'var(--color-text-muted)', marginTop: 'var(--space-5)', marginBottom: 0 }}>
          {t('signup', 'hasAccount')} <Link to="/login" style={{ color: 'var(--color-accent)' }}>{t('signup', 'loginLink')}</Link>
        </p>
      </div>
    </div>
  );
}
