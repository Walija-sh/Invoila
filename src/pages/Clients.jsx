import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { InvoilaContext } from '../context/InvoilaContext';
import { FaUserCircle } from "react-icons/fa";

const Clients = () => {

  const statusColor = {
  Active: "bg-spaid/10 text-spaid",
  Outstanding: "bg-sunpaid/10 text-sunpaid",
  Overdue: "bg-sdue/10 text-sdue",
};
  const { clients } = useContext(InvoilaContext);

   const [activeStatus, setActiveStatus] = useState('All');
   const [searchQuery, setSearchQuery] = useState('');
 
   const handleStatusChange = (status) => {
     setActiveStatus(status);
   };
 
   const handleSearchChange = (e) => {
     setSearchQuery(e.target.value.toLowerCase());
   };
     const filteredClients = clients.filter((client) => {
    const matchesStatus =
      activeStatus === 'All' || client.status.toLowerCase() === activeStatus.toLowerCase();

    const matchesSearch =
      client.id.toLowerCase().includes(searchQuery) ||
      client.name.toLowerCase().includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  

  return (
    <div className="p-6 bg-white min-h-screen font-sans text-h">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="flex gap-2 flex-wrap">
          {['All', 'Active', 'Outstanding', 'Overdue'].map((tab) => (
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
            to="/clients/createClient"
            className="bg-accent text-white px-4 py-2 rounded-md text-sm whitespace-nowrap"
          >
            + New Client
          </Link>
        </div>
      </div>
      {/* Clients */}
      <div className="space-y-4">
        {filteredClients.length > 0 ? (
          filteredClients.map((client, idx) => {
            return (
                        <div 
              key={idx}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-cardbg px-4 py-6 rounded-md shadow-lg"
            >
              <div className="flex items-center gap-3">
                      <FaUserCircle className="text-p text-3xl" />
                      <div>
                        <p className="font-semibold capitalize">{client.name}</p>
                        <p className="text-sm text-p">#{client.id}</p>
                      </div>
              </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2 sm:mt-0">
     
        <p className={`px-3 py-1 text-sm rounded-full font-medium border-none outline-none cursor-pointer ${statusColor[client.status]}`}> {client.status}</p>
          <Link
            to={`/clients/${client.id}`}
            className="bg-accent text-white px-4 py-2 rounded-md text-sm whitespace-nowrap"
          >
            View Details
          </Link>
        
      </div>
            </div>

            )
          })
        ) : (
          <p className="text-gray-500">No Clients found.</p>
        )}
      </div>
     
    </div>
  );
};

export default Clients;
