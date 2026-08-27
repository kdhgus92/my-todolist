import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, ApiError } from '../../../shared/api/client';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';
import { FormFieldError } from '../../../shared/ui/FormFieldError';
import { isValidDateRange } from '../../../shared/lib/validators';
import { useCategoryList } from '../../../entities/category';
import type { Todo } from '../../../shared/types/domain';

export function CreateTodoForm() {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [dateError, setDateError] = useState<string | undefined>();
  const { data: categories } = useCategoryList();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      apiFetch<Todo>('/todos', {
        method: 'POST',
        body: JSON.stringify({ title, startDate, endDate, categoryId: categoryId || undefined }),
      }),
    onSuccess: () => {
      if (import.meta.env.DEV) console.log('[create-todo] success', title);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      navigate('/todos');
    },
    onError: (err) => {
      if (import.meta.env.DEV) console.error('[create-todo] failed', err);
    },
  });

  const otherError = mutation.error instanceof ApiError ? mutation.error.message : undefined;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValidDateRange(startDate, endDate)) {
      setDateError('종료일자는 시작일자보다 빠를 수 없습니다.');
      return;
    }
    setDateError(undefined);
    mutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Input label="제목" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input
          label="시작일자"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <Input
          label="종료일자"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          error={dateError}
          required
        />
        <div>
          <label
            htmlFor="create-todo-category"
            style={{ font: 'var(--font-label)', color: 'var(--color-text-muted)', display: 'block', marginBottom: 'var(--space-1)' }}
          >
            카테고리
          </label>
          <select
            id="create-todo-category"
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
            <option value="">선택 안 함</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.isDefault ? ' (기본)' : ''}
              </option>
            ))}
          </select>
          {categoryId === '' && (
            <p style={{ font: 'var(--font-caption)', color: 'var(--color-text-muted)', margin: 'var(--space-1) 0 0' }}>
              미선택 시 '기본' 카테고리가 자동 적용됩니다.
            </p>
          )}
        </div>
        <FormFieldError message={otherError} />
        <Button type="submit" disabled={mutation.isPending}>
          저장
        </Button>
      </div>
    </form>
  );
}
