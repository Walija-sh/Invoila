import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaTrash, FaPlus } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import API from '../utils/axios';
import { ToastContainer, toast } from 'react-toastify';
import { InvoilaContext } from '../context/InvoilaContext';
import { useContext } from 'react';

const CreateInvoice = () => {
   const { currencySymbol,token} = useContext(InvoilaContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);

  const [availableServices, setAvailableServices] = useState([
    "Web Design",
    "SEO Optimization",
    "Mobile App Development",
    "UI/UX Design",
    "Hosting Setup"
  ]);

  const [invServices, setInvServices] = useState([
    { name: "Web Design", quantity: 1, rate: 0, customName: "" }
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
  { type: '', details: '' }
]);

  const [selectedClient, setSelectedClient] = useState(null);
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Unpaid');

  const [loading, setLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  // Fetch Clients
  const getClients = async () => {
    try {
      const res = await API.get('/api/client', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setClients(res.data.data);

      if (!selectedClient && res.data.data.length > 0) {
        setSelectedClient(res.data.data[0]);
      }

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch clients');
    }
  };

  // Fetch invoice if editing
  const getInvoice = async () => {
    if (!id) return;

    setInvoiceLoading(true);

    try {
      const token = JSON.parse(localStorage.getItem('token'));

      const res = await API.get(`/api/invoice/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const invoice = res.data.data;

      setSelectedClient(invoice.client);
      setDueDate(invoice.dueDate.split('T')[0]);
      setStatus(invoice.status);

      setInvServices(
        invoice.services.map(s => ({
          name: s.name,
          quantity: s.quantity,
          rate: s.rate,
          customName: ''
        }))
      );
      setPaymentMethods(
  invoice.paymentMethods?.length > 0
    ? invoice.paymentMethods
    : [{ type: '', details: '' }]
);

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch invoice');
    } finally {
      setInvoiceLoading(false);
    }
  };

  useEffect(() => {
    getClients();
    getInvoice();
  }, [id]);

  const handleServiceChange = (index, field, value) => {
    const updated = [...invServices];

    updated[index][field] =
      field === 'quantity' || field === 'rate'
        ? Number(value)
        : value;

    setInvServices(updated);
  };

  const addService = () => {
    setInvServices([
      ...invServices,
      { name: availableServices[0], quantity: 1, rate: 0, customName: '' }
    ]);
  };

  const removeService = (index) => {
    setInvServices(prev => prev.filter((_, i) => i !== index));
  };

  const subtotal = invServices.reduce(
    (acc, s) => acc + s.quantity * s.rate,
    0
  );

  const handlePaymentChange = (index, field, value) => {
  const updated = [...paymentMethods];
  updated[index][field] = value;
  setPaymentMethods(updated);
};

const addPaymentMethod = () => {
  setPaymentMethods([...paymentMethods, { type: '', details: '' }]);
};

const removePaymentMethod = (index) => {
  setPaymentMethods(prev => prev.filter((_, i) => i !== index));
};

  const handleSubmit = async () => {
    if (!selectedClient || !dueDate || invServices.length === 0) {
      toast.error('Please fill all required fields.');
      return;
    }

    const updatedServices = invServices.map(s => ({
      name: s.name === 'other' ? s.customName : s.name,
      quantity: s.quantity,
      rate: s.rate
    }));

    const invoiceData = {
      client: selectedClient._id,
      issuedDate: new Date().toISOString().slice(0, 10),
      dueDate,
      services: updatedServices,
      status,
       paymentMethods: paymentMethods.filter(pm => pm.type.trim() !== '') // only non-empty types
    };

    setLoading(true);

    try {

      if (id) {
        
        await API.put(`/api/invoice/${id}`, invoiceData,
      { headers: { Authorization: `Bearer ${token}` }});
       
        toast.success('Invoice updated successfully');

      } else {
        await API.post('/api/invoice', invoiceData,
      { headers: { Authorization: `Bearer ${token}` }});
        toast.success('Invoice created successfully');
      }

      setTimeout(() => navigate('/invoices'), 1000);

    } catch (err) {
      
      
      toast.error(err.response?.data?.message || 'Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  if (invoiceLoading) return <p className="p-6">Loading invoice...</p>;

  return (
    <div className="bg-white p-6 max-w-4xl mx-auto shadow-md rounded-lg">
      <ToastContainer />

      <h2 className="text-2xl font-semibold text-h mb-1">
        {id ? 'Edit Invoice' : 'Create Invoice'}
      </h2>

      {/* Client Info */}
      {clients.length > 0 ? (
        <div>
          <label className="block text-sm text-p mb-1">Client Name</label>

          <select
            onChange={(e) =>
              setSelectedClient(
                clients.find(c => c._id === e.target.value)
              )
            }
            value={selectedClient?._id || ''}
            className="w-full p-2 border border-border rounded-md focus:outline-none"
          >
            {clients.map(client => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>

          <label className="block text-sm text-p mb-1 mt-3">
            Client Email
          </label>

          <div className="w-full p-2 border border-border rounded-md">
            {selectedClient?.email}
          </div>
        </div>
      ) : (
        <p>
          No clients found.
          <Link
            to="/clients/createClient"
            className="text-accent"
          >
            Create one
          </Link>
        </p>
      )}

      {/* Invoice Info */}
      <div className="mt-4">
        <label className="block text-sm text-p mb-1">Due Date</label>

        <div className="relative">
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="w-full p-2 border border-border rounded-md pr-10 focus:outline-none"
          />

          <FaCalendarAlt className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
        </div>

        <label className="block text-sm text-p mb-1 mt-3">Status</label>

        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="w-full p-2 border border-border rounded-md focus:outline-none"
        >
          <option>Unpaid</option>
          <option>Paid</option>
        </select>
      </div>

      {/* Services */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-heading mb-3">
          Services
        </h3>

        {invServices.map((service, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-3 items-center bg-cardbg p-3 rounded-md mb-2"
          >
            <select
              value={service.name}
              onChange={(e) =>
                handleServiceChange(index, 'name', e.target.value)
              }
              className="w-full p-2 border border-border rounded-md"
            >
              {availableServices.map((serv, i) => (
                <option key={i} value={serv}>
                  {serv}
                </option>
              ))}

              <option value="other">Other</option>
            </select>

            {service.name === 'other' && (
              <input
                type="text"
                value={service.customName}
                onChange={e =>
                  handleServiceChange(index, 'customName', e.target.value)
                }
                placeholder="Custom Service"
                className="p-2 border border-border rounded-md"
              />
            )}

            <input
              type="number"
              value={service.quantity}
              onChange={e =>
                handleServiceChange(index, 'quantity', e.target.value)
              }
              className="p-2 border border-border rounded-md"
              placeholder="Qty"
            />

            <input
              type="number"
              value={service.rate}
              onChange={e =>
                handleServiceChange(index, 'rate', e.target.value)
              }
              className="p-2 border border-border rounded-md"
              placeholder="Rate"
            />

            <FaTrash
              className="text-red-500 cursor-pointer"
              onClick={() => removeService(index)}
            />
          </div>
        ))}

        <button
          onClick={addService}
          className="mt-2 px-3 py-2 bg-accent text-white rounded-md flex items-center gap-2"
        >
          <FaPlus /> Add Service
        </button>
      </div>
      {/* payment methods */}
      <div className="mt-6">
  <h3 className="text-lg font-medium text-heading mb-3">Payment Methods (Optional)</h3>

  {paymentMethods.map((pm, index) => (
    <div key={index} className="grid grid-cols-2 gap-3 items-center mb-2">
      <input
        type="text"
        value={pm.type}
        onChange={e => handlePaymentChange(index, 'type', e.target.value)}
        placeholder="Payment Type (e.g., PayPal, Bank)"
        className="p-2 border border-border rounded-md"
      />
      <input
        type="text"
        value={pm.details}
        
        onChange={e => handlePaymentChange(index, 'details', e.target.value)}
        placeholder="Details"
        className="p-2 border border-border rounded-md"
      />
      <FaTrash
        className="text-red-500 cursor-pointer"
        onClick={() => removePaymentMethod(index)}
      />
    </div>
  ))}

  <button
    onClick={addPaymentMethod}
    className="mt-2 px-3 py-2 bg-accent text-white rounded-md flex items-center gap-2"
  >
    <FaPlus /> Add Payment Method
  </button>
</div>

      {/* Total */}
      <div className="mt-6 text-right">
        <h3 className="text-xl font-bold text-accent">
          Total Amount
        </h3>

        <p className="text-2xl font-semibold text-spaid">
          {currencySymbol} {subtotal.toFixed(2)}
        </p>
      </div>

      {/* Submit */}
      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={() => navigate('/invoices')}
          className="px-4 py-2 bg-border rounded-md"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-accent text-white rounded-md"
        >
          {loading
            ? 'Saving...'
            : id
            ? 'Update Invoice'
            : 'Create Invoice'}
        </button>
      </div>
    </div>
  );
};

export default CreateInvoice;