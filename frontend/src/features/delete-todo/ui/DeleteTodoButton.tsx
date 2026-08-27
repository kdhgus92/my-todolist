import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, ApiError } from '../../../shared/api/client';
import { Button } from '../../../shared/ui/Button';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';
import { FormFieldError } from '../../../shared/ui/FormFieldError';

export function DeleteTodoButton({ todoId }: { todoId: string }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => apiFetch<void>(`/todos/${todoId}`, { method: 'DELETE' }),
    onSuccess: () => {
      if (import.meta.env.DEV) console.log('[delete-todo] success', todoId);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      navigate('/todos');
    },
    onError: (err) => {
      if (import.meta.env.DEV) console.error('[delete-todo] failed', err);
      setOpen(false);
    },
  });

  return (
    <div style={{ marginTop: 'var(--space-4)' }}>
      <Button type="button" variant="danger" onClick={() => setOpen(true)}>
        삭제
      </Button>
      <ConfirmDialog
        open={open}
        title="정말 삭제하시겠습니까?"
        message="이 작업은 되돌릴 수 없습니다."
        onConfirm={() => mutation.mutate()}
        onCancel={() => setOpen(false)}
      />
      <FormFieldError message={mutation.error instanceof ApiError ? mutation.error.message : undefined} />
    </div>
  );
}
