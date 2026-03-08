import React, {  useState,useEffect } from "react";
import { toast } from 'react-toastify';
import { Link, useNavigate,useParams } from "react-router-dom";
import API from "../utils/axios";
import { useContext } from "react";
import { InvoilaContext } from "../context/InvoilaContext";

const CreateClient = () => {
  const navigate=useNavigate()
  const {token}=useContext(InvoilaContext)
  const { id } = useParams();
const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit =async (e) => {
e.preventDefault();
 setLoading(true);
    
   const client = {
  name: name.trim(),
  email: email.trim(),
  phone: phone.trim(),
  company: company.trim(),
  address: address.trim(),
  notes: notes.trim(),
};
    try {
  let res;

  if (id) {
    // UPDATE CLIENT
    res = await API.put(`/api/client/${id}`, client,
      { headers: { Authorization: `Bearer ${token}` }});

    toast.success("Client updated successfully");

  } else {
    // CREATE CLIENT
    res = await API.post("/api/client/", client,
      { headers: { Authorization: `Bearer ${token}` }});

    toast.success("Client created successfully");
  }

  setTimeout(() => {
    navigate("/clients");
  }, 1000);

} catch (error) {
  toast.error(error.response?.data?.message || "Operation failed");
}finally{
      setLoading(false)
    }
    
    

  };


  const getClientData = async () => {
  if (!id) return;

  try {
    const res = await API.get(`/api/client/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = res.data.data;

    setName(data.name || "");
    setEmail(data.email || "");
    setPhone(data.phone || "");
    setCompany(data.company || "");
    setAddress(data.address || "");
    setNotes(data.notes || "");

  } catch (error) {
    toast.error("Failed to load client");
  }
};

useEffect(() => {
  getClientData();
}, [id]);



  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 max-w-4xl mx-auto shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-h mb-1">
  {id ? "Edit Client" : "Create Client"}
</h2>

<p className="text-sm text-p mb-6">
  {id ? "Update client information" : "Fill in the details to create a new client"}
</p>
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
        <button disabled={loading} type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:opacity-90 cursor-pointer">
        {loading ? "Saving..." : id ? "Update Client" : "Create Client"}
        </button>
      </div>
    </form>
  );
};

export default CreateClient;
