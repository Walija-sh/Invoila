import React, { useState, useContext } from 'react';
import { FaCalendarAlt, FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { InvoilaContext } from '../context/InvoilaContext';
import { ToastContainer,toast } from 'react-toastify';

const CreateInvoice = () => {
    const { addInvoice, saveDraft, currentUser,clients,updateClientStatsOnInvoiceCreate } = useContext(InvoilaContext);
  const [services, setServices] = useState([
    { name: 'Web Development', quantity: 1, rate: 0 },
  ]);

  const [selectedClient,setSelectedClient]=useState(clients[0])
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Unpaid');


  const navigate = useNavigate();

  const handleServiceChange = (index, field, value) => {
    const updated = [...services];
    updated[index][field] = field === 'quantity' || field === 'rate' ? Number(value) : value;
    setServices(updated);
  };

  const addService = () => {
    setServices([...services, { name: '', quantity: 1, rate: 0 }]);
  };

  const removeService = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
  };

  const subtotal = services.reduce((acc, s) => acc + s.quantity * s.rate, 0);

  const handleSubmit = (isDraft = false) => {
    if (!selectedClient|| !dueDate || services.length === 0) {
      toast('Please fill in all required fields and add at least one service.');
      return;
    }

    const invoice = {
      client: {
        name: selectedClient.name,
        email: selectedClient.email,
        id:selectedClient.id,
      },
      invoice: {
        dueDate,
        status,
        issuedDate:new Date().toISOString().slice(0, 10)
      },
      services,
      totals: {
        subtotal,
        currency: '$',
      },
      userId: currentUser?.id || null,
    };

    if (isDraft) {
      saveDraft(invoice);
    } else {
      addInvoice(invoice);
    }
    updateClientStatsOnInvoiceCreate(invoice)

    navigate('/invoices');
  };



  return (
    <div className="bg-white p-6 max-w-4xl mx-auto shadow-md rounded-lg">
      <ToastContainer/>
      <h2 className="text-2xl font-semibold text-h mb-1">Invoice Details</h2>
      <p className="text-sm text-p mb-6">Fill in the details to create your invoice</p>

      {/* Client and Invoice Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Info */}
        <div>
          <h3 className="text-lg font-medium text-heading mb-3">Client Information</h3>
          <div className="mb-4">
            <label className="block text-sm text-p mb-1">Client Name</label>
            <select
              onChange={(e) => {
                 const selected = clients.find(client => client.name === e.target.value);
                setSelectedClient(selected);
              }}
              required
              className="w-full p-2 border border-border rounded-md focus:outline-none"
              placeholder="Select client name"
            >
              {clients.map((client,index)=>{
                return (
                  <option key={index} value={client.name}>{client.name}</option>
                )
              })}
            </select>

          </div>
          <div>
            <label className="block text-sm text-p mb-1">Client Email</label>
            <div
              className="w-full p-2 border border-border rounded-md focus:outline-none"
            >
              {selectedClient.email}
            </div>
          </div>
        </div>

        {/* Invoice Info */}
        <div>
          <h3 className="text-lg font-medium text-heading mb-3">Invoice Information</h3>
          <div className="mb-4">
            <label className="block text-sm text-p mb-1">Due Date</label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full p-2 border border-border rounded-md pr-10 focus:outline-none"
                placeholder="dd/mm/yyyy"
              />
              <FaCalendarAlt className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-p mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="w-full p-2 border border-border rounded-md focus:outline-none"
            >
              <option>Unpaid</option>
              <option>Paid</option>
              <option>Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-heading mb-3">Services</h3>

        <div className="hidden md:grid grid-cols-3 gap-3 px-1 mb-2 text-sm font-semibold text-p">
          <span>Service Name</span>
          <span>Quantity</span>
          <span>Rate ($)</span>
        </div>

        <div className="space-y-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center bg-cardbg p-3 rounded-md"
            >
              <input
                type="text"
                placeholder="Service Name"
                value={service.name}
                onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                className="p-2 border border-border rounded-md w-full"
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={service.quantity}
                onChange={(e) => handleServiceChange(index, 'quantity', e.target.value)}
                className="p-2 border border-border rounded-md w-full"
                required
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Rate"
                  value={service.rate}
                  onChange={(e) => handleServiceChange(index, 'rate', e.target.value)}
                  className="p-2 border border-border rounded-md w-full"
                  required
                />
                <FaTrash
                  onClick={() => removeService(index)}
                  className="text-sdue hover:text-red-600 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addService}
          className="flex items-center gap-2 mt-4 text-sm text-white bg-accent cursor-pointer px-3 py-2 rounded-md hover:opacity-90"
        >
          <FaPlus /> Add Service
        </button>
      </div>

      {/* Total */}
      <div className="mt-8 text-right">
        <h3 className="text-xl font-bold text-accent">Total Amount</h3>
        <p className="text-2xl font-semibold text-spaid">${subtotal.toFixed(2)}</p>
        <p className="text-sm text-p">Total due</p>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4 flex-wrap">
        <button
          onClick={() => navigate('/invoices')}
          className="px-4 py-2 bg-border text-h rounded-md hover:bg-gray-300 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={() => handleSubmit(true)}
          className="px-4 py-2 bg-heading text-white rounded-md cursor-pointer"
        >
          Save as Draft
        </button>
        <button
          onClick={() => handleSubmit(false)}
          className="px-4 py-2 bg-accent text-white rounded-md hover:opacity-90 cursor-pointer"
        >
          Create Invoice
        </button>
      </div>
    </div>
  );
};

export default CreateInvoice;
