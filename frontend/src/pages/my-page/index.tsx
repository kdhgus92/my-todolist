import { useAuthStore } from '../../entities/user';
import { Input } from '../../shared/ui/Input';
import { EditProfileForm } from '../../features/edit-profile';
import { useTranslation } from '../../shared/lib/i18n';

export default function MyPagePage() {
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation();
  if (!user) return null;

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
        {t('myPage', 'title')}
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
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <div>
          <Input label={t('myPage', 'email')} value={user.email} disabled />
          <p style={{ font: 'var(--font-caption)', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
            {t('myPage', 'emailReadonly')}
          </p>
        </div>
        <EditProfileForm />
      </div>
    </div>
  );
}
