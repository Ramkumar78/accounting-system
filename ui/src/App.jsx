import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AccountList from './components/AccountList';
import InvoiceList from './components/InvoiceList';
import JournalList from './components/JournalList';
import LedgerView from './components/LedgerView';
import Reports from './components/Reports';
import BankList from './components/BankList';
import UserList from './components/UserList';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <Navigation />
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/accounts" element={<ProtectedRoute><AccountList /></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute><InvoiceList /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute><JournalList /></ProtectedRoute>} />
          <Route path="/ledger" element={<ProtectedRoute><LedgerView /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/bank" element={<ProtectedRoute><BankList /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
