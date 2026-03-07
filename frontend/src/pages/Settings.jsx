import React, { useContext, useState } from 'react';
import { InvoilaContext } from '../context/InvoilaContext';
import {  toast } from 'react-toastify';
import API from '../utils/axios';
import { FaUserCircle, FaCamera, FaLock } from 'react-icons/fa';
import { FaRegEye,FaRegEyeSlash } from "react-icons/fa";
import { useEffect } from 'react';

const Settings = () => {
  const { currentUser, setCurrentUser,currency } = useContext(InvoilaContext);
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
const [updatingCurrency, setUpdatingCurrency] = useState(false);


  const [profilePhoto, setProfilePhoto] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [showNewPassword,setShowNewPassword]=useState(false)
  const [showOldPassword,setShowOldPassword]=useState(false)

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profilePhoto) return toast.error('Please select a photo');
    const formData = new FormData();
    formData.append('profilePhoto', profilePhoto);

    try {
      setUpdatingProfile(true);
      const token = JSON.parse(localStorage.getItem('token'));
      const res = await API.put('/api/auth/update-profile-photo', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setCurrentUser({
  ...currentUser,
  profilePhoto: { url: res.data.data.profilePhoto }
});
      toast.success('Profile photo updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return toast.error('Please fill all fields');
    try {
      setUpdatingPassword(true);
      const token = JSON.parse(localStorage.getItem('token'));
      await API.put('/api/auth/update-password', { oldPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Password updated successfully');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleCurrencyUpdate = async (e) => {
  e.preventDefault();

  try {
    setUpdatingCurrency(true);

    const token = JSON.parse(localStorage.getItem("token"));

    const res = await API.put(
      "/api/auth/update-currency",
      { currency: selectedCurrency },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCurrentUser({
      ...currentUser,
      currency: res.data.data.currency
    });

    toast.success("Currency updated successfully");

  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update currency");
  } finally {
    setUpdatingCurrency(false);
  }
};



  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
          <p className="text-gray-500">Manage your profile information and security preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
              <div className="relative group mb-4">
                {currentUser?.profilePhoto? (
                  <img
                    src={currentUser.profilePhoto}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <FaUserCircle className="text-gray-200 w-32 h-32" />
                )}
                <label className="absolute bottom-1 right-1 bg-purple-600 p-2 rounded-full text-white cursor-pointer hover:bg-purple-700 transition shadow-lg">
                  <FaCamera size={14} />
                  <input type="file" className="hidden" onChange={(e) => setProfilePhoto(e.target.files[0])} />
                </label>
              </div>
              <h2 className="text-xl font-bold text-gray-800 capitalize">{currentUser?.username || 'User'}</h2>
              <p className="text-sm text-gray-500 mb-4">{currentUser?.email}</p>
              
              {profilePhoto && (
                <button
                  onClick={handleProfileUpdate}
                  disabled={updatingProfile}
                  className="w-full text-sm bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition"
                >
                  {updatingProfile ? 'Uploading...' : 'Save New Photo'}
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Forms */}
          <div className="md:col-span-2 space-y-6">
            {/* Password Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
                <FaLock className="text-purple-600" />
                <h3 className="font-semibold text-gray-800">Security</h3>
              </div>
              
              <form onSubmit={handlePasswordUpdate} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                 
                  <div className="relative w-full flex items-center border border-border rounded-md  focus-within:ring-2 focus-within:ring-accent overflow-hidden pr-4 ">
                   
                              <input
                                
                                type={showOldPassword?'text':'password'}
                                placeholder="Enter your old password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full px-4 py-2  focus:outline-none"
                              />
                              {showOldPassword?(
                                <FaRegEye onClick={()=>setShowOldPassword(!showOldPassword)} className='text-h cursor-pointer'  />
                              ):(
                                <FaRegEyeSlash onClick={()=>setShowOldPassword(!showOldPassword)} className='text-h cursor-pointer'  />
                              )}
                              </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                  <div className="relative w-full flex items-center border border-border rounded-md  focus-within:ring-2 focus-within:ring-accent overflow-hidden pr-4 ">
                   
                              <input
                                
                                type={showNewPassword?'text':'password'}
                                placeholder="Enter your new password. Min 8 characters."
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2  focus:outline-none"
                              />
                              {showNewPassword?(
                                <FaRegEye onClick={()=>setShowNewPassword(!showNewPassword)} className='text-h cursor-pointer'  />
                              ):(
                                <FaRegEyeSlash onClick={()=>setShowNewPassword(!showNewPassword)} className='text-h cursor-pointer'  />
                              )}
                              </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition shadow-md shadow-purple-200 disabled:opacity-50"
                  >
                    {updatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
            {/* Currency Section */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-50">
    <h3 className="font-semibold text-gray-800">Invoice Currency</h3>
  </div>

  <form onSubmit={handleCurrencyUpdate} className="p-6 space-y-4">

    <label className="block text-sm font-medium text-gray-700">
      Default Currency
    </label>

    <select
      value={selectedCurrency}
onChange={(e) => setSelectedCurrency(e.target.value)}
      className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <option value="usd">USD ($)</option>
      <option value="eur">EUR (€)</option>
      <option value="gbp">GBP (£)</option>
      <option value="pkr">PKR (₨)</option>
    </select>

    <button
      type="submit"
      disabled={updatingCurrency}
      className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition shadow-md shadow-purple-200 disabled:opacity-50"
    >
      {updatingCurrency ? "Updating..." : "Update Currency"}
    </button>

  </form>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;