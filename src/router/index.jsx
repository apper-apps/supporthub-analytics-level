import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/components/pages/Layout';

// Lazy load all page components for better performance
const Dashboard = lazy(() => import('@/components/pages/Dashboard'));
const DailyAnalysis = lazy(() => import('@/components/pages/DailyAnalysis'));
const UserDashboard = lazy(() => import('@/components/pages/UserDashboard'));
const AppsOverview = lazy(() => import('@/components/pages/AppsOverview'));
const AppDetail = lazy(() => import('@/components/pages/AppDetail'));
const Users = lazy(() => import('@/components/pages/Users'));
const AILogs = lazy(() => import('@/components/pages/AILogs'));
const NotFound = lazy(() => import('@/components/pages/NotFound'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Wrap components with Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

// Main routes configuration
const mainRoutes = [
  {
    path: "",
    index: true,
    element: withSuspense(Dashboard),
},
  {
    path: "daily-analysis",
    element: withSuspense(DailyAnalysis),
  },
  {
    path: "users",
    element: withSuspense(Users),
  },
  {
    path: "users/:userId",
    element: withSuspense(UserDashboard),
  },
  {
    path: "apps",
    element: withSuspense(AppsOverview),
  },
  {
    path: "apps/:appId",
    element: withSuspense(AppDetail),
  },
  {
    path: "logs",
    element: withSuspense(AILogs),
  },
  {
    path: "*",
    element: withSuspense(NotFound),
  },
];

// Router configuration
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes,
  },
];

export const router = createBrowserRouter(routes);