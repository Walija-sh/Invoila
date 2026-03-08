import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import API from '../utils/axios';
import {toast } from 'react-toastify';

const Clients = () => {

  const statusColor = {
  Active: "bg-spaid/10 text-spaid",
  Outstanding: "bg-sunpaid/10 text-sunpaid",
  Overdue: "bg-sdue/10 text-sdue",
};

  const [clients,setClients]=useState([]);
  const [loading, setLoading] = useState(true);


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
      client.name?.toLowerCase().includes(searchQuery) ||
  client.email?.toLowerCase().includes(searchQuery) ||
  client.company?.toLowerCase().includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  const getClientsData=async()=>{
    try {
      const res= await API.get('/api/client/');
      
      setClients(res.data.data)
      
    } catch (error) {
       toast.error(error.response?.data?.message || 'Failed to fetch clients');
    }finally {
    setLoading(false);
  }
  }
  useEffect(()=>{
getClientsData()
  },[])

  if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
  

  return (
    <div className="p-6 bg-white min-h-screen font-sans text-h">
       
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
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
            placeholder="Search by client name, email or company..."
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
          filteredClients.map((client) => {
            return (
                        <div 
              key={client._id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-cardbg px-4 py-6 rounded-md shadow-lg"
            >
              <div className="flex items-center gap-3">
                      <FaUserCircle className="text-p text-3xl" />
                      <div>
                        <p className="font-semibold capitalize">{client.name}</p>
                        <p className="text-sm text-p">{client.company}</p>
                      </div>
              </div>
               <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2 sm:mt-0">
     
        <p className={`px-3 py-1 text-sm rounded-full font-medium border-none outline-none cursor-pointer ${statusColor[client.status]}`}> {client.status}</p>
          <Link
            to={`/clients/${client._id}`}
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
