import { lazy } from 'react';

import Loadable from 'components/Loadable/index';
import MainLayout from 'layout/MainLayout';

const Dashboard = Loadable(lazy(() => import('pages/dashboard')));

const Tasks = Loadable(lazy(() => import('pages/tasks')));
const AddTask = Loadable(lazy(() => import('pages/addTask')));
const ViewTask = Loadable(lazy(() => import('pages/viewTask')));

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Dashboard />
    },
    {
      path: 'dashboard',
      element: <Dashboard />
    },
    {
      path: 'tasks',
      element: <Tasks />
    },
    {
      path: 'add',
      element: <AddTask />
    },
    {
      path: 'edit',
      element: <AddTask />
    },
    {
      path: 'view',
      element: <ViewTask />
    }
  ]
};

export default MainRoutes;
