import type { Todo, TodoStatus } from '../../../shared/types/domain';

export function computeTodoStatus(
  todo: Pick<Todo, 'startDate' | 'endDate' | 'isDone'>,
  today: Date = new Date(),
): TodoStatus {
  const todayStr = today.toISOString().slice(0, 10);
  if (todo.isDone) return '완료';
  if (todayStr < todo.startDate) return '시작전';
  if (todayStr <= todo.endDate) return '진행중';
  return '기한초과';
}

// 수동 검증 예시 (테스트 프레임워크 미도입 — docs/5-project-principle.md 5절):
// computeTodoStatus({startDate:'2026-08-01',endDate:'2026-08-30',isDone:false}, new Date('2026-08-27')) === '진행중'
// computeTodoStatus({startDate:'2026-09-01',endDate:'2026-09-05',isDone:false}, new Date('2026-08-27')) === '시작전'
// computeTodoStatus({startDate:'2026-08-01',endDate:'2026-08-10',isDone:false}, new Date('2026-08-27')) === '기한초과'
// computeTodoStatus({startDate:'2026-08-01',endDate:'2026-08-30',isDone:true}, new Date('2026-08-27')) === '완료'
