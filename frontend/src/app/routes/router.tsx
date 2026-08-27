import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import SignupPage from '../../pages/signup';
import LoginPage from '../../pages/login';
import MyPagePage from '../../pages/my-page';
import TodoFormPage from '../../pages/todo-form';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/todos', element: <div>할일 목록 (준비 중)</div> },
      { path: '/todos/new', element: <TodoFormPage /> },
      { path: '/todos/:id/edit', element: <TodoFormPage /> },
      { path: '/my-page', element: <MyPagePage /> },
    ],
  },
]);
