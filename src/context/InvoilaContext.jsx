import { createContext, useEffect, useState } from "react";
import defaultUsers from "../data/users.json";
import defaultInvoices from "../data/invoices.json";

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
  };

const updateInvoiceStatus = (id, newStatus) => {
  setInvoices((prev) =>
    prev.map((inv) =>
      inv.id === id
        ? {
            ...inv,
            invoice: {
              ...inv.invoice,
              status: newStatus,
            },
          }
        : inv
    )
  );
};


  const saveDraft = (invoice) => {
    setDrafts((prev) => [...prev, invoice]);
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
      }}
    >
      {props.children}
    </InvoilaContext.Provider>
  );
};

export default InvoilaContextProvider;
