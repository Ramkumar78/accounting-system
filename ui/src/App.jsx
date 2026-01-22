import React, { createContext, useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import UserList from './components/UserList';
import AccountList from './components/AccountList';
import JournalList from './components/JournalList';
import LedgerView from './components/LedgerView';
import Reports from './components/Reports';
import ProtectedRoute from './components/ProtectedRoute';

// Theme Context
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navigation />
          <div className="container-fluid p-0">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/accounts" element={<AccountList />} />
                <Route path="/journals" element={<JournalList />} />
                <Route path="/ledger" element={<LedgerView />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/users" element={<UserList />} />
              </Route>
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
