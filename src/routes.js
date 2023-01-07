import { lazy, Suspense } from 'react';
import AuthGuard from './components/AuthGuard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import GuestGuard from './components/GuestGuard';
import LoadingScreen from './components/LoadingScreen';

const Loadable = (Component) => (props) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

// Authentication pages
const Login = Loadable(lazy(() => import('./pages/authentication/Login')));

// Dashboard pages
const Overview = Loadable(lazy(() => import('./pages/dashboard/Overview')));

// Items
const TaskList = Loadable(lazy(() => import('./pages/dashboard/TaskList')));
const TaskDetails = Loadable(lazy(() => import('./pages/dashboard/TaskDetails')));
const TaskCreate = Loadable(lazy(() => import('./pages/dashboard/TaskCreate')));
const TaskEdit = Loadable(lazy(() => import('./pages/dashboard/TaskEdit')));

// HomePage
const HomePage = Loadable(lazy(() => import('./pages/HomePage')));

const routes = [
  {
    path: 'authentication',
    children: [
      {
        path: 'login',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        )
      },
      {
        path: 'login-unguarded',
        element: <Login />
      }
    ]
  },
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '/',
        element: <Overview />
      },
      {
        path: 'tasks',
        children: [
          {
            path: '/',
            element: <TaskList currentTab='tasks' />
          },
          {
            path: ':id',
            element: <TaskDetails />
          },
          {
            path: 'new',
            element: <TaskCreate />
          },
          {
            path: ':id/edit',
            element: <TaskEdit />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <HomePage />
  }
];

export default routes;
