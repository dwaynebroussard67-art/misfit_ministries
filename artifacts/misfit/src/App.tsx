import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import Layout from './components/Layout';
import Home from './pages/Home';
import Prayer from './pages/Prayer';
import Testimonies from './pages/Testimonies';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Constitution from './pages/Constitution';
import Shine from './pages/Shine';
import Wreckage from './pages/Wreckage';
import Armory from './pages/Armory';
import Store from './pages/Store';
import Teachings from './pages/Teachings';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
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
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/forge" element={<AdminDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}
