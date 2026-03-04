import React, { useContext, useState } from "react";
import { InvoilaContext } from "../context/InvoilaContext";
import { ToastContainer,toast } from 'react-toastify';
import { Link } from "react-router-dom";

const CreateClient = () => {
  const { addNewClient,clients } = useContext(InvoilaContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
e.preventDefault();
    const existingClient=clients.filter((obj)=>obj.email===email.trim() || obj.phone===phone.trim())
    if(existingClient.length>0){
      return toast('Client with this email or phone number already exists')
    }
    
    const client = {
      name,
      email,
      phone,
      company: company || '',
      address: address || '',
      notes: notes || '',
      invoicesSent: 0,
      totalPaid: 0,
      totalUnpaid: 0,
      status: 'Active',
      lastInvoiceDate: null,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    addNewClient(client);
    toast('Client created successfully');
    setName('')
    setAddress('')
    setCompany('')
    setEmail('')
    setNotes('')
    setPhone('')

  };




  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 max-w-4xl mx-auto shadow-md rounded-lg">
       <ToastContainer/>
      <h2 className="text-2xl font-semibold text-h mb-1">Client Details</h2>
      <p className="text-sm text-p mb-6">Fill in the details to create a new client</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          <div className="mb-4">
            <label className="block text-sm text-p mb-1">Client Name</label>
            <input
            onChange={(e)=>setName(e.target.value)}
            value={name}
            required
              type="text"
              placeholder="Enter client name"
              className="w-full p-2 border border-border rounded-md focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-p mb-1">Client Email</label>
            <input
            value={email}
             required
             onChange={(e)=>setEmail(e.target.value)}
              type="email"
              placeholder="Enter client email"
              className="w-full p-2 border border-border rounded-md focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-p mb-1">Phone</label>
            <input
            value={phone}
             required
             onChange={(e)=>setPhone(e.target.value)}
              type="tel"
              placeholder="Enter phone number"
              className="w-full p-2 border border-border rounded-md focus:outline-none"
            />
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="mb-4">
            <label className="block text-sm text-p mb-1">Company</label>
            <input
            value={company}
             onChange={(e)=>setCompany(e.target.value)}
              type="text"
              placeholder="Enter company name"
              className="w-full p-2 border border-border rounded-md focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-p mb-1">Address</label>
            <textarea
            value={address}
            onChange={(e)=>setAddress(e.target.value)}
              rows={3}
              placeholder="Enter address"
              className="w-full p-2 border border-border rounded-md focus:outline-none resize-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-p mb-1">Notes</label>
            <textarea
            value={notes}
             onChange={(e)=>setNotes(e.target.value)}
              rows={3}
              placeholder="Any internal notes..."
              className="w-full p-2 border border-border rounded-md focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4 flex-wrap">
        <Link to={'/clients'} className="px-4 py-2 bg-border text-h rounded-md hover:bg-gray-300 cursor-pointer">
          Cancel
        </Link>
        <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:opacity-90 cursor-pointer">
          Create Client
        </button>
      </div>
    </form>
  );
};

export default CreateClient;
