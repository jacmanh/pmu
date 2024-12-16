import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Race } from '../pages/Race';

export function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/race/:id',
      element: <Race />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
