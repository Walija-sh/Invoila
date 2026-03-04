import React, { useContext, useState } from 'react';
import { InvoilaContext } from '../context/InvoilaContext';
import logo from '../assets/Logo.png'; 
import {Link,useNavigate} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

const Signup = ({setToken}) => {
    const {users, addNewUser,setCurrentUser } = useContext(InvoilaContext);
    const navigate = useNavigate();
      const [username, setTokenname] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [passwordConfirm, setPasswordConfirm] = useState('');


      const handleSubmit = (e) => {
    e.preventDefault();
     const user = users.find(
      (obj) => obj.email === email
    );
    if(user){
        toast('User already exists')
    }
    else if(password.trim()!==passwordConfirm.trim()){
        toast('Password dont match');
    } 
    else if(password.length<8){
        toast('Password should be atleast 8 characters');
        
    } else{
       const user={username,password,email,id:new Date(),role:'user'}
        addNewUser(user);
        toast('Account created successfully');
        setToken(true);
        setCurrentUser(user)
        navigate('/');

        
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
            <p className="text-sm text-center text-p mb-6">Sign in to your account</p>
    
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
            <label className="block text-sm text-h mb-1">Name</label>
            <input
            required
              type="text"
              placeholder="Enter your name"
              onChange={(e) => setTokenname(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
              <div>
                <label className="block text-sm text-h mb-1">Email</label>
                <input
                required
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm text-h mb-1">Password</label>
                <input
                required
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm text-h mb-1">Confirm Password</label>
                <input
                required
                  type="password"
                  placeholder="Re-enter your password"
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent cursor-pointer text-white font-semibold py-2 rounded-md hover:opacity-90 transition"
              >
                Sign Up
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
  )
}

export default Signup