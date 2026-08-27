import { useParams } from 'react-router-dom';
import { useTodoList } from '../../entities/todo';
import { CreateTodoForm } from '../../features/create-todo';
import { EditTodoForm } from '../../features/edit-todo';
import { DeleteTodoButton } from '../../features/delete-todo';

export default function TodoFormPage() {
  const { id } = useParams<{ id?: string }>();
  const { data: todos, isLoading } = useTodoList();

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
        {id ? '할일 수정' : '할일 등록'}
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
        {id && isLoading && <p style={{ font: 'var(--font-body)' }}>불러오는 중...</p>}
        {id &&
          !isLoading &&
          (() => {
            const todo = todos?.find((t) => t.id === id);
            if (!todo) return <p style={{ font: 'var(--font-body)' }}>할일을 찾을 수 없습니다.</p>;
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
