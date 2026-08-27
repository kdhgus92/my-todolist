export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  isDefault: boolean;
  createdAt: string;
}

export type TodoStatus = '시작전' | '진행중' | '완료' | '기한초과';

export interface Todo {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  startDate: string;
  endDate: string;
  isDone: boolean;
  status: TodoStatus;
  createdAt: string;
}
