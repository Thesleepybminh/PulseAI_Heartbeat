import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Result from './pages/Result';
import NotFound from './pages/NotFound';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only auto-redirect from the landing page
    if (location.pathname === '/') {
      const t = setTimeout(() => {
        navigate('/home', { replace: true });
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<section className="home-gbc" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/result" element={<Result />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}