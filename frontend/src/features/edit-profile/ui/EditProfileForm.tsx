import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ApiError } from '../../../shared/api/client';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';
import { FormFieldError } from '../../../shared/ui/FormFieldError';
import { updateMe, useAuthStore } from '../../../entities/user';
import { useTranslation } from '../../../shared/lib/i18n';

export function EditProfileForm() {
  const [name, setName] = useState(() => useAuthStore.getState().user!.name);
  const [showSuccess, setShowSuccess] = useState(false);
  const { t, tError } = useTranslation();

  const mutation = useMutation({
    mutationFn: () => updateMe(name),
    onSuccess: (updatedUser) => {
      useAuthStore.getState().updateUser(updatedUser);
      if (import.meta.env.DEV) console.log('[edit-profile] success', updatedUser.name);
      setShowSuccess(true);
    },
    onError: (err) => {
      if (import.meta.env.DEV) console.error('[edit-profile] failed', err);
    },
  });

  const otherError =
    mutation.error instanceof ApiError ? tError(mutation.error.code, mutation.error.message) : undefined;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name) return;
    mutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Input
          label={t('myPage', 'name')}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setShowSuccess(false);
          }}
        />
        <FormFieldError message={otherError} />
        {showSuccess && (
          <p style={{ font: 'var(--font-caption)', color: 'var(--color-success)', margin: 0 }}>
            {t('myPage', 'saved')}
          </p>
        )}
        <Button type="submit" disabled={mutation.isPending}>
          {t('myPage', 'save')}
        </Button>
      </div>
    </form>
  );
}
