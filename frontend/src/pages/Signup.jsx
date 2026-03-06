import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import API from '../utils/axios';
import logo from '../assets/Logo.png'; 
import { InvoilaContext } from '../context/InvoilaContext';
import { useContext } from 'react';
import { FaRegEye,FaRegEyeSlash } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
    const { setCurrentUser } = useContext(InvoilaContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword,setShowPassword]=useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (password !== passwordConfirm) {
      return toast.error('Passwords do not match');
    }
    if (password.length < 8) {
      return toast.error('Password should be at least 8 characters');
    }
 setLoading(true);
    try {
      const res = await API.post('/api/auth/register', {
        username,
        email,
        password
      });

      // Save token in localStorage
      const token = res.data.data.token;
      localStorage.setItem('token', JSON.stringify(token));
      setCurrentUser(res.data.data);
      toast.success('Account created successfully');
      navigate('/'); // redirect to dashboard or home
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || 'Something went wrong';
      toast.error(message);
    }finally {
      setLoading(false); // ← stop spinner
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-card-bg py-4">
      <ToastContainer/>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-full max-w-[120px]" />
        </div>
        <h1 className="text-xl font-bold text-center text-heading mb-1">Invoila</h1>
        <p className="text-sm text-center text-p mb-6">Sign up to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-h mb-1">Name</label>
            <input
              required
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm text-h mb-1">Email</label>
            <input
              required
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm text-h mb-1">Password</label>
            <div className="relative w-full flex items-center border border-border rounded-md  focus-within:ring-2 focus-within:ring-accent overflow-hidden pr-4 ">
 
            <input
              required
              type={showPassword?'text':'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2  focus:outline-none"
            />
            {showPassword?(
              <FaRegEye onClick={()=>setShowPassword(!showPassword)} className='text-h cursor-pointer'  />
            ):(
              <FaRegEyeSlash onClick={()=>setShowPassword(!showPassword)} className='text-h cursor-pointer'  />
            )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-h mb-1">Confirm Password</label>
            <input
              required
              type="password"
              placeholder="Re-enter your password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

           <button
            type="submit"
            disabled={loading} // ← disable button while loading
            className={`w-full flex justify-center items-center gap-2 bg-accent text-white font-semibold py-2 rounded-md hover:opacity-90 transition ${
              loading ? 'cursor-not-allowed opacity-70' : ''
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              'Sign Up'
            )}
          </button>

          <p className="text-sm text-center text-p mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-medium hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;