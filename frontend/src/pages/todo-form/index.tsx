import { useParams } from 'react-router-dom';
import { useTodoList } from '../../entities/todo';
import { CreateTodoForm } from '../../features/create-todo';
import { EditTodoForm } from '../../features/edit-todo';
import { DeleteTodoButton } from '../../features/delete-todo';
import { useTranslation } from '../../shared/lib/i18n';

export default function TodoFormPage() {
  const { id } = useParams<{ id?: string }>();
  const { data: todos, isLoading } = useTodoList();
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
        {id ? t('todoForm', 'editTitle') : t('todoForm', 'createTitle')}
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
        {!id && <CreateTodoForm />}
        {id && isLoading && <p style={{ font: 'var(--font-body)' }}>{t('todoList', 'loading')}</p>}
        {id &&
          !isLoading &&
          (() => {
            const todo = todos?.find((item) => item.id === id);
            if (!todo) return <p style={{ font: 'var(--font-body)' }}>{t('todoForm', 'notFound')}</p>;
            return (
              <>
                <EditTodoForm todo={todo} />
                <DeleteTodoButton todoId={todo.id} />
              </>
            );
          })()}
      </div>
    </div>
  );
}
