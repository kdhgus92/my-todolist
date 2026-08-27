import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, ApiError } from '../../../shared/api/client';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';
import { useCategoryList } from '../../../entities/category';
import { useTranslation } from '../../../shared/lib/i18n';
import type { Category } from '../../../shared/types/domain';

export function CategoryManageModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { data: categories } = useCategoryList();
  const queryClient = useQueryClient();
  const { t, tError } = useTranslation();

  const createMutation = useMutation({
    mutationFn: () => apiFetch<Category>('/categories', { method: 'POST', body: JSON.stringify({ name }) }),
    onSuccess: () => {
      if (import.meta.env.DEV) console.log('[manage-category] create success', name);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setName('');
    },
    onError: (err) => {
      if (import.meta.env.DEV) console.error('[manage-category] create failed', err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiFetch<void>(`/categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      if (import.meta.env.DEV) console.log('[manage-category] delete success', pendingDeleteId);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setPendingDeleteId(null);
    },
    onError: (err) => {
      if (import.meta.env.DEV) console.error('[manage-category] delete failed', err);
      setPendingDeleteId(null);
    },
  });

  if (!open) return null;

  const targetCategory = categories?.find((c) => c.id === pendingDeleteId);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(43,42,40,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', maxWidth: 480, width: '90%', padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ font: 'var(--font-h2)', margin: 0 }}>{t('category', 'title')}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('category', 'close')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'var(--font-body)' }}
          >
            ✕
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
          style={{ display: 'flex', gap: 'var(--space-2)', margin: 'var(--space-4) 0', alignItems: 'flex-start' }}
        >
          <div style={{ flex: 1 }}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('category', 'namePlaceholder')}
              error={
                createMutation.error instanceof ApiError && createMutation.error.code === 'CATEGORY_NAME_ALREADY_EXISTS'
                  ? tError(createMutation.error.code, createMutation.error.message)
                  : undefined
              }
            />
          </div>
          <Button type="submit" disabled={createMutation.isPending || !name}>
            {t('category', 'add')}
          </Button>
        </form>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {categories?.map((c) => (
            <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ font: 'var(--font-body)' }}>{c.name}</span>
              <Button variant="danger" disabled={c.isDefault} onClick={() => setPendingDeleteId(c.id)}>
                {t('category', 'delete')}
              </Button>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
          <Button variant="secondary" onClick={onClose}>
            {t('category', 'close')}
          </Button>
        </div>
      </div>
      <ConfirmDialog
        open={pendingDeleteId !== null}
        title={t('category', 'deleteConfirmTitle')}
        message={t('category', 'deleteConfirmMessage', targetCategory?.name ?? '')}
        onConfirm={() => pendingDeleteId && deleteMutation.mutate(pendingDeleteId)}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
