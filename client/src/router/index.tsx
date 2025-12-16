import { createBrowserRouter, Navigate } from 'react-router-dom';
import Apply from '../pages/Apply';
import Approval from '../pages/Approval';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/approval" replace />,
  },
  {
    path: '/apply',
    element: <Apply />,
  },
  {
    path: '/approval',
    element: <Approval />,
  },
]);

export default router;