import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { router } from './routes/router';
import { bootstrapAuth } from '../entities/user';

export function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    bootstrapAuth().finally(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}
