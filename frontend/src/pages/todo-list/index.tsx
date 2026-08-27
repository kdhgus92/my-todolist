import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FilterBar } from '../../features/filter-todos';
import { CategoryManageModal } from '../../features/manage-category';
import { TodoBoard } from '../../widgets/todo-board';
import { Button } from '../../shared/ui/Button';
import { useTranslation } from '../../shared/lib/i18n';

export default function TodoListPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--space-7) var(--space-5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <FilterBar />
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            {t('todoList', 'manageCategories')}
          </Button>
          <Link to="/todos/new">
            <Button>{t('todoList', 'addTodo')}</Button>
          </Link>
        </div>
      </div>
      <TodoBoard />
      <CategoryManageModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
