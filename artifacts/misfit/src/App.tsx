import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import Layout from './components/Layout';
import Home from './pages/Home';

// Lazy load pages for code splitting
const Prayer = lazy(() => import('./pages/Prayer'));
const Testimonies = lazy(() => import('./pages/Testimonies'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const About = lazy(() => import('./pages/About'));
const Constitution = lazy(() => import('./pages/Constitution'));
const Shine = lazy(() => import('./pages/Shine'));
const Wreckage = lazy(() => import('./pages/Wreckage'));
const Armory = lazy(() => import('./pages/Armory'));
const Store = lazy(() => import('./pages/Store'));
const Teachings = lazy(() => import('./pages/Teachings'));
const Login = lazy(() => import('./pages/Login'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const Nura = lazy(() => import('./pages/Nura'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <p className="text-amber-500 text-lg">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/prayer" element={<Prayer />} />
                <Route path="/testimonies" element={<Testimonies />} />
                <Route path="/about" element={<About />} />
                <Route path="/constitution" element={<Constitution />} />
                <Route path="/shine" element={<Shine />} />
                <Route path="/wreckage" element={<Wreckage />} />
                <Route path="/armory" element={<Armory />} />
                <Route path="/store" element={<Store />} />
                <Route path="/teachings" element={<Teachings />} />
                <Route path="/nura" element={<Nura />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/forge" element={<AdminDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
