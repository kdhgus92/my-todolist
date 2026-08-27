import { useSearchParams } from 'react-router-dom';
import { useCategoryList } from '../../../entities/category';
import { useTranslation } from '../../../shared/lib/i18n';
import type { TodoStatus } from '../../../shared/types/domain';

const STATUS_OPTIONS: TodoStatus[] = ['시작전', '진행중', '완료', '기한초과'];

export function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categories } = useCategoryList();
  const { t } = useTranslation();
  const categoryId = searchParams.get('categoryId') ?? '';
  const status = searchParams.get('status') ?? '';

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
    if (import.meta.env.DEV) console.log('[filter-todos]', key, value || '(전체)');
  }

  return (
    <div className="filter-bar">
      <select
        value={categoryId}
        onChange={(e) => updateParam('categoryId', e.target.value)}
        style={{ padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
      >
        <option value="">{t('todoList', 'allCategories')}</option>
        {categories?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <select
        value={status}
        onChange={(e) => updateParam('status', e.target.value)}
        style={{ padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
      >
        <option value="">{t('todoList', 'allStatuses')}</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {t('status', s)}
          </option>
        ))}
      </select>
    </div>
  );
}
