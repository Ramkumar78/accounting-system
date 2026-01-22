import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../App';
import { Moon, Sun, LogOut, Menu, X, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (!isAuthenticated && location.pathname === '/login') return null;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Accounts', path: '/accounts' },
    { name: 'Journals', path: '/journals' },
    { name: 'Ledger', path: '/ledger' },
    { name: 'Reports', path: '/reports' },
    { name: 'Users', path: '/users' },
  ];

  return (
    <nav
      style={{
        backgroundColor: isScrolled ? 'var(--header-bg)' : 'transparent',
        transition: 'background-color 0.3s',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        padding: '1rem 2rem',
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
            <DollarSign color="var(--accent-color)" size={32} />
            <span style={{ color: 'var(--accent-color)', fontSize: '1.5rem', fontWeight: 'bold' }}>
            NETFIN
            </span>
        </Link>

        {/* Desktop Menu */}
        <div className="d-none d-md-flex align-items-center gap-4">
          {isAuthenticated && navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              style={{
                color: 'var(--text-color)',
                textDecoration: 'none',
                fontWeight: location.pathname === link.path ? 'bold' : 'normal',
                opacity: location.pathname === link.path ? 1 : 0.8,
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="d-flex align-items-center gap-3">
            <button
                onClick={toggleTheme}
                style={{ background: 'none', border: 'none', color: 'var(--text-color)', cursor: 'pointer' }}
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated && (
                <div className="d-none d-md-flex align-items-center gap-3">
                    <span style={{ color: 'var(--text-color)' }}>{username}</span>
                    <button
                        onClick={handleLogout}
                        className="netflix-btn"
                        style={{ padding: '0.3rem 0.8rem', fontSize: '0.9rem' }}
                    >
                        Sign Out
                    </button>
                </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
                className="d-md-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ background: 'none', border: 'none', color: 'var(--text-color)' }}
            >
                {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden', background: 'var(--header-bg)' }}
            >
                <div className="d-flex flex-column p-3 gap-3">
                    {isAuthenticated && navLinks.map((link) => (
                        <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{ color: 'var(--text-color)', textDecoration: 'none' }}
                        >
                        {link.name}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <button onClick={handleLogout} className="netflix-btn w-100">Sign Out</button>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
