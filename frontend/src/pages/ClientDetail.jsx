import React, { useEffect, useState } from 'react';
import { useParams, Link,useNavigate } from 'react-router-dom';
import API from '../utils/axios';
import { toast} from 'react-toastify';
import { InvoilaContext } from '../context/InvoilaContext';
import { useContext } from 'react';

const ClientDetail = () => {
    const { currencySymbol} = useContext(InvoilaContext);
  const [client,setClient]=useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
   const getClientsDetails=async()=>{
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const res= await API.get(`/api/client/${id}`,{headers:{Authorization:`Bearer ${token}`}});
      setClient(res.data.data)
      
    } catch (error) {
       toast.error(error.response?.data?.message || 'Failed to fetch client details');
    }finally {
    setLoading(false);
  }
  }
  useEffect(()=>{
getClientsDetails()
  },[id])

  const handleDeleteClient = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this client?"
  );

  if (!confirmDelete) return;

  try {
    const token = JSON.parse(localStorage.getItem("token"));

    await API.delete(`/api/client/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Client deleted successfully");

    setTimeout(() => {
      navigate("/clients");
    }, 1000);

  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete client");
  }
};

  if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
  <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
</div>
  );
}
  if (!client) {
    return <div className="p-6 text-red-600 font-semibold">Client not found</div>;
  }

  return (
    <div className="bg-white p-6 max-w-4xl mx-auto shadow-md rounded-lg">
       
      <h2 className="text-2xl font-semibold text-h mb-1 capitalize">{client.name}</h2>
      <p className="text-sm text-p mb-6 capitalize">{client.company || 'No company provided'}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          <div className="mb-4">
            <label className="block text-sm text-p mb-1">Email</label>
            <p className="text-h border-border rounded-md border p-2">{client.email}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-p mb-1">Phone</label>
            <p className="text-h border-border rounded-md border p-2">{client.phone}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-p mb-1">Address</label>
            <p className="text-h border-border rounded-md border p-2">{client.address}</p>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="mb-4">
            <label className="block text-sm text-p mb-1">Status</label>
            <p className="text-h border-border rounded-md border p-2">{client.status}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-p mb-1">Invoices Sent</label>
            <p className="text-h border-border rounded-md border p-2">{client.invoicesSent}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-p mb-1">Total Paid</label>
            <p className="text-h border-border rounded-md border p-2">{currencySymbol} {client.totalPaid}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-p mb-1">Total Unpaid</label>
            <p className="text-h border-border rounded-md border p-2">{currencySymbol} {client.totalUnpaid}</p>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="mb-6 mt-4">
        <label className="block text-sm text-p mb-1">Last Invoice Date</label>
        <p className="text-h border-border rounded-md border p-2">
           {client.lastInvoiceDate ? new Date(client.lastInvoiceDate).toLocaleDateString() : "N/A"}
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-p mb-1">Notes</label>
        <p className="text-h border-border rounded-md border p-2">{client.notes || 'No notes added'}</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-p mb-1">Created At</label>
        <p className="text-h border-border rounded-md border p-2">
           {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "N/A"}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 flex-wrap">

  <Link
    to="/clients"
    className="px-4 py-2 bg-border text-h rounded-md hover:bg-gray-300 cursor-pointer"
  >
    Back
  </Link>

  <Link
    to={`/clients/edit/${client._id}`}
    className="px-4 py-2 bg-accent text-white rounded-md cursor-pointer"
  >
    Edit Client
  </Link>

  <button
    onClick={handleDeleteClient}
    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
  >
    Delete Client
  </button>

</div>
      
    </div>
  );
};

export default ClientDetail;
