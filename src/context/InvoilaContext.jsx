import { createContext, useEffect, useState } from "react";
import defaultUsers from "../data/users.json";
import defaultInvoices from "../data/invoices.json";
import defaultClients from '../data/clients.json'

export const InvoilaContext = createContext({
  users: [],
  addNewUser: () => {},
  currentUser: null,
  setCurrentUser: () => {},
  invoices: [],
  addInvoice: () => {},
  updateInvoiceStatus: () => {},
  drafts: [],
  saveDraft: () => {},
  clients:[],
  addNewClient:()=>{},
  
});

const InvoilaContextProvider = (props) => {
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem("users");
    try {
      return stored && stored !== "undefined" ? JSON.parse(stored) : defaultUsers;
    } catch {
      return defaultUsers;
    }
  });

  const addNewUser=(user)=>{
    setUsers((prev)=>[...prev,user])
  }

  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    try {
      return stored && stored !== "undefined" ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [invoices, setInvoices] = useState(() => {
    const stored = localStorage.getItem("invoices");
    try {
      return stored && stored !== "undefined" ? JSON.parse(stored) : defaultInvoices;
    } catch {
      return defaultInvoices;
    }
  });

  const [drafts, setDrafts] = useState(() => {
    const stored = localStorage.getItem("drafts");
    try {
      return stored && stored !== "undefined" ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });


  const addInvoice = (invoice) => {
    const id = `INV-2025-${(invoices.length + 1).toString().padStart(3, "0")}`;
    const newInvoice = { ...invoice, id };
    setInvoices((prev) => [...prev, newInvoice]);

    updateClientStats(invoice,[...invoices,newInvoice])
  };

const updateInvoiceStatus = (id, newStatus) => {
  setInvoices((prev) => {
    const updated = prev.map((inv) =>
      inv.id === id
        ? {
            ...inv,
            invoice: {
              ...inv.invoice,
              status: newStatus,
            },
          }
        : inv
    );

    const updatedInvoice = updated.find((invoice) => invoice.id === id);
    if (updatedInvoice) {
     updateClientStats(updatedInvoice,[...invoices,updatedInvoice])
    }

    return updated;
  });
};



  const saveDraft = (invoice) => {
    setDrafts((prev) => [...prev, invoice]);
  };

  const [clients, setClients] = useState(() => {
    const stored = localStorage.getItem("clients");
    try {
      return stored && stored !== "undefined" ? JSON.parse(stored) : defaultClients;
    } catch {
      return defaultClients;
    }
  });

  const addNewClient=(client)=>{
    const id = `client-${(clients.length + 1).toString().padStart(3, "0")}`;
    const newClient={...client,id};
    setClients((prev)=>[...prev,newClient])
  }



const updateClientStats = (invoice,updatedInvoices) => {
  const clientId = invoice.client.id;
  let totalPaid=0
  let totalUnpaid=0
  const clientInvoices=updatedInvoices.filter((inv)=>inv.client.id===clientId);
  // console.log(clientInvoices);
  
  clientInvoices.map((inv)=>{
    if(inv.invoice.status==="Paid"){
      totalPaid+=inv.totals.subtotal;
    }else{
      totalUnpaid+=inv.totals.subtotal;
    }
  })

  let hasOverdue = false;
  let hasUnpaid = false;

  clientInvoices.forEach(invoice => {
    const status = invoice.invoice.status;
    if (status === "Overdue") {
      hasOverdue = true;
    } else if (status === "Unpaid") {
      hasUnpaid = true;
    }
  });

  let newStatus = "Active"; 
  if (hasOverdue) {
    newStatus = "Overdue";
  } else if (hasUnpaid) {
    newStatus = "Outstanding";
  }

  
  // console.log(totalPaid,'Paid',totalUnpaid,'Unpaid',clientInvoices.length,'total invoices');

  const updatedClients = clients.map((client) => {
    if (client.id === clientId) {
      return {
        ...client,
        invoicesSent: clientInvoices.length,
        totalPaid,
        totalUnpaid,
        lastInvoiceDate: invoice.invoice.issuedDate,
        status:newStatus
      };
    }
    return client;
  });

  setClients(updatedClients);
};



  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem("drafts", JSON.stringify(drafts));
  }, [drafts]);
  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  return (
    <InvoilaContext.Provider
      value={{
        users,
        addNewUser,
        currentUser,
        setCurrentUser,
        invoices,
        addInvoice,
        updateInvoiceStatus,
        drafts,
        saveDraft,
        clients,
        addNewClient,
      }}
    >
      {props.children}
    </InvoilaContext.Provider>
  );
};

export default InvoilaContextProvider;
