import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { InvoilaContext } from '../context/InvoilaContext';
import Invoice from '../Components/InvoiceItem';

const Invoices = () => {
  const { invoices } = useContext(InvoilaContext);

 

  const [activeStatus, setActiveStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStatusChange = (status) => {
    setActiveStatus(status);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter invoices based on activeStatus and searchQuery
  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus =
      activeStatus === 'All' || inv.invoice.status.toLowerCase() === activeStatus.toLowerCase();

    const matchesSearch =
      inv.id.toLowerCase().includes(searchQuery) ||
      inv.client.name.toLowerCase().includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 bg-white min-h-screen font-sans text-h">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="flex gap-2 flex-wrap">
          {['All', 'Paid', 'Unpaid', 'Overdue'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleStatusChange(tab)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-all cursor-pointer
                ${
                  activeStatus === tab
                    ? 'bg-accent text-white'
                    : 'text-heading bg-card-bg hover:bg-accent hover:text-white'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-fit">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by ID or Client..."
            className="px-4 py-2 border border-border rounded-md text-sm w-full md:w-64 focus:outline-none"
          />
          <Link
            to="/invoices/createInvoice"
            className="bg-accent text-white px-4 py-2 rounded-md text-sm whitespace-nowrap"
          >
            + New Invoice
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((inv, idx) => <Invoice inv={inv} key={idx} />)
        ) : (
          <p className="text-gray-500">No invoices found.</p>
        )}
      </div>
    </div>
  );
};

export default Invoices;
