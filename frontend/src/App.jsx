import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InvoilaContext } from './context/InvoilaContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Layout from './pages/Layout';
import Invoices from './pages/Invoices';
import InvoiceDetail from './pages/InvoiceDetail';
import CreateInvoice from './pages/CreateInvoice';
import Clients from './pages/Clients';
import CreateClient from './pages/CreateClient';
import ClientDetail from './pages/ClientDetail';
import Payment from './pages/Payment';
import Settings from './pages/Settings';
import API from './utils/axios';

const App = () => {
  const { currentUser, setCurrentUser } = useContext(InvoilaContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) {
      setLoading(false);
      return;
    }

    // Validate token with backend
    API.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setCurrentUser(res.data.data); // set backend user in context
      })
      .catch(() => {
        localStorage.removeItem('token'); // remove invalid token
      })
      .finally(() => setLoading(false));
  }, [setCurrentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {!currentUser ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="invoices/createInvoice" element={<CreateInvoice />} />
            <Route path="invoices/:id" element={<InvoiceDetail />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/createClient" element={<CreateClient />} />
            <Route path="clients/:id" element={<ClientDetail />} />
            <Route path="payments" element={<Payment />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;