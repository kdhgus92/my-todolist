import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, ApiError } from '../../../shared/api/client';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';
import { FormFieldError } from '../../../shared/ui/FormFieldError';
import { isValidDateRange } from '../../../shared/lib/validators';
import { useCategoryList } from '../../../entities/category';
import { useTranslation } from '../../../shared/lib/i18n';
import type { Todo } from '../../../shared/types/domain';

export function EditTodoForm({ todo }: { todo: Todo }) {
  const [title, setTitle] = useState(todo.title);
  const [startDate, setStartDate] = useState(todo.startDate);
  const [endDate, setEndDate] = useState(todo.endDate);
  const [categoryId, setCategoryId] = useState(todo.categoryId);
  const [isDone, setIsDone] = useState(todo.isDone);
  const [dateError, setDateError] = useState<string | undefined>();
  const { data: categories } = useCategoryList();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, tError } = useTranslation();

  const mutation = useMutation({
    mutationFn: () =>
      apiFetch<Todo>(`/todos/${todo.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title, startDate, endDate, categoryId: categoryId || undefined, isDone }),
      }),
    onSuccess: () => {
      if (import.meta.env.DEV) console.log('[edit-todo] success', todo.id);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      navigate('/todos');
    },
    onError: (err) => {
      if (import.meta.env.DEV) console.error('[edit-todo] failed', err);
    },
  });

  const otherError =
    mutation.error instanceof ApiError ? tError(mutation.error.code, mutation.error.message) : undefined;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidDateRange(startDate, endDate)) {
      setDateError(t('todoForm', 'dateRangeError'));
      return;
    }
    setDateError(undefined);
    mutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <FormFieldError message={otherError} />
        <Input label={t('todoForm', 'fieldTitle')} value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input
          label={t('todoForm', 'startDate')}
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <Input
          label={t('todoForm', 'endDate')}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          error={dateError}
          required
        />
        <div>
          <label
            htmlFor="edit-todo-category"
            style={{ font: 'var(--font-label)', color: 'var(--color-text-muted)', display: 'block', marginBottom: 'var(--space-1)' }}
          >
            {t('todoForm', 'category')}
          </label>
          <select
            id="edit-todo-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              font: 'var(--font-body)',
            }}
          >
            <option value="">{t('todoForm', 'categoryNone')}</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.isDefault ? ` ${t('todoForm', 'categoryDefaultSuffix')}` : ''}
              </option>
            ))}
          </select>
          {categoryId === '' && (
            <p style={{ font: 'var(--font-caption)', color: 'var(--color-text-muted)', margin: 'var(--space-1) 0 0' }}>
              {t('todoForm', 'categoryHint')}
            </p>
          )}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', font: 'var(--font-body)' }}>
          <input type="checkbox" checked={isDone} onChange={(e) => setIsDone(e.target.checked)} />
          {t('todoForm', 'markDone')}
        </label>
        <Button type="submit" disabled={mutation.isPending}>
          {t('todoForm', 'save')}
        </Button>
      </div>
    </form>
  );
}
