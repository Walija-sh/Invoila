import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup'; 
import Invoices from './pages/Invoices';
import Clients from './pages/Clients'
import Payment from './pages/Payment'
import Settings from './pages/Settings'
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import CreateInvoice from './pages/CreateInvoice'
import InvoiceDetail from './pages/InvoiceDetail';

const App = () => {
  const [token, setToken] = useState(()=>{
        const stored = localStorage.getItem('token');
  try {
    return stored && stored !== "undefined" ? JSON.parse(stored) : null;
  } catch (err) {
    console.error("Failed to parse token ", err);
    return null;
  }
    });

  useEffect(()=>{
    localStorage.setItem('token',JSON.stringify(token))
  },[token])

  return (
    <BrowserRouter>
      <Routes>
        {!token ? (
          <>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/signup" element={<Signup setToken={setToken} />} />
            <Route path="/" element={<Login setToken={setToken} />} /> 
          </>
        ) : (
          <>
           <Route path="/" element={<Layout />}>
           <Route path='/' element={<Dashboard/>}/>
             <Route path="invoices/:id" element={< InvoiceDetail />} />
            <Route path="invoices/createInvoice" element={<CreateInvoice />} />
            <Route path="invoices" element={<Invoices />} ></Route>
            <Route path="clients" element={<Clients />} />
            <Route path="payments" element={<Payment />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
