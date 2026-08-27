import { Link } from 'react-router-dom';
import { LoginForm } from '../../features/login';

export default function LoginPage() {
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
        <h2 style={{ font: 'var(--font-h2)', marginTop: 0, marginBottom: 'var(--space-5)' }}>로그인</h2>
        <LoginForm />
        <p style={{ font: 'var(--font-body)', color: 'var(--color-text-muted)', marginTop: 'var(--space-5)', marginBottom: 0 }}>
          계정이 없으신가요? <Link to="/signup" style={{ color: 'var(--color-accent)' }}>회원가입</Link>
        </p>
      </div>
    </div>
  );
}
