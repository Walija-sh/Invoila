import React, { useContext } from 'react';
import { InvoilaContext } from '../context/InvoilaContext';
import { useParams, Link } from 'react-router-dom';

const ClientDetail = () => {
  const { clients } = useContext(InvoilaContext);
  const { id } = useParams();
  const client = clients.find((inv) => inv.id === id);

  if (!client) {
    return <div className="p-6 text-red-600 font-semibold">Client not found</div>;
  }

  return (
    <div className="bg-white p-6 max-w-4xl mx-auto shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-h mb-1 capitalize">{client.name}</h2>
      <p className="text-sm text-p mb-6">{client.company || 'No company provided'}</p>

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
            <p className="text-h border-border rounded-md border p-2">${client.totalPaid}</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-p mb-1">Total Unpaid</label>
            <p className="text-h border-border rounded-md border p-2">${client.totalUnpaid}</p>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="mb-6 mt-4">
        <label className="block text-sm text-p mb-1">Last Invoice Date</label>
        <p className="text-h border-border rounded-md border p-2">{client.lastInvoiceDate || 'N/A'}</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-p mb-1">Notes</label>
        <p className="text-h border-border rounded-md border p-2">{client.notes || 'No notes added'}</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-p mb-1">Created At</label>
        <p className="text-h border-border rounded-md border p-2">{client.createdAt}</p>
      </div>

      {/* Back Button */}
      <div className="flex justify-end">
        <Link to="/clients" className="px-4 py-2 bg-border text-h rounded-md hover:bg-gray-300 cursor-pointer">
          Back to Clients
        </Link>
      </div>
    </div>
  );
};

export default ClientDetail;
