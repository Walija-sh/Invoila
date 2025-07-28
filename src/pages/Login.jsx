import React, { useContext, useState } from 'react';
import { InvoilaContext } from '../context/InvoilaContext';
import logo from '../assets/Logo.png'; 
import {Link} from 'react-router-dom'
import { ToastContainer,toast } from 'react-toastify';

const Login = ({ setToken }) => {
  const { users,setCurrentUser } = useContext(InvoilaContext);
  const [username, setTokenname] = useState('');
  const [password, setPassword] = useState('');

  const authUser = () => {
    const user = users.find(
      (obj) => obj.username === username && obj.password === password
    );
    if (user) {
      setToken(true);
      setCurrentUser(user)
    } else {
      toast('Incorrect username or password');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authUser();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-card-bg">
       <ToastContainer/>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-full max-w-[120px]" />
        </div>
        <h1 className="text-xl font-bold text-center text-heading mb-1">Invoila</h1>
        <p className="text-sm text-center text-p mb-6">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-h mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              onChange={(e) => setTokenname(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-h mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent cursor-pointer text-white font-semibold py-2 rounded-md hover:opacity-90 transition"
          >
            Log In
          </button>
          <p className="text-sm text-center text-p mt-4">
  Don’t have an account?{' '}
  <Link to="/signup" className="text-accent font-medium hover:underline">
    Sign up
  </Link>
</p>

        </form>
      </div>
    </div>
  );
};

export default Login;
