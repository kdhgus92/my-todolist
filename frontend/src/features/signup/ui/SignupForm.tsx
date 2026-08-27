import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { apiFetch, ApiError } from '../../../shared/api/client';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';
import { FormFieldError } from '../../../shared/ui/FormFieldError';
import { isValidEmail, isValidPassword } from '../../../shared/lib/validators';
import { useTranslation } from '../../../shared/lib/i18n';
import type { User } from '../../../shared/types/domain';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);
  const navigate = useNavigate();
  const { t, tError } = useTranslation();

  const mutation = useMutation({
    mutationFn: () =>
      apiFetch<User>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }),
    onSuccess: () => {
      if (import.meta.env.DEV) console.log('[signup] success', email);
      navigate('/login');
    },
    onError: (err) => {
      if (import.meta.env.DEV) console.error('[signup] failed', err);
    },
  });

  const emailError = touched && !isValidEmail(email) ? t('signup', 'invalidEmail') : undefined;
  const passwordError = touched && !isValidPassword(password) ? t('signup', 'invalidPassword') : undefined;
  const serverEmailError =
    mutation.error instanceof ApiError && mutation.error.code === 'CONFLICT'
      ? tError(mutation.error.code, mutation.error.message)
      : undefined;
  const otherError =
    mutation.error instanceof ApiError && mutation.error.code !== 'CONFLICT'
      ? tError(mutation.error.code, mutation.error.message)
      : undefined;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValidEmail(email) || !isValidPassword(password) || !name) return;
    mutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Input
          label={t('signup', 'email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError ?? serverEmailError}
        />
        <Input
          label={t('signup', 'password')}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
        />
        <Input label={t('signup', 'name')} value={name} onChange={(e) => setName(e.target.value)} />
        <FormFieldError message={otherError} />
        <Button type="submit" disabled={mutation.isPending} style={{ width: '100%' }}>
          {t('signup', 'submit')}
        </Button>
      </div>
    </form>
  );
}
