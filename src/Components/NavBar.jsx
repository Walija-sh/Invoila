import React, { useContext } from "react";
import { LuSquareMenu } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { InvoilaContext } from "../context/InvoilaContext";

const pageDetails = {
  "/": { title: "Dashboard", subtitle: "Welcome back, manage your invoices and payments" },
  "/invoices": { title: "Invoices", subtitle: "View and manage all your invoices" },
  "/clients": { title: "Clients", subtitle: "Manage your client information and contacts" },
  "/payments": { title: "Payments", subtitle: "Track and record all your payments" },
  "/settings": { title: "Settings", subtitle: "Customize your preferences and account settings" },
  "/invoices/createInvoice": { title: "Create Invoice", subtitle: "Create a new invoice for your client" },
  "/invoices/*": { title: "Invoice Overview", subtitle: "See the client, services, and payment status" },
};

const NavBar = ({ setToggleSidebar }) => {
const {currentUser}=useContext(InvoilaContext)
const location = useLocation();
let matchedPath = Object.keys(pageDetails).find(path =>
  path === location.pathname || (path.includes('*') && location.pathname.startsWith(path.replace('/*', '')))
);
const { title, subtitle } = pageDetails[matchedPath] || { title: "", subtitle: "" };


  return (
    <div className="grid grid-cols-2 grid-rows-[auto auto]  sm:flex  items-center justify-between gap-2 py-4 px-6 bg-white shadow-sm rounded-md mb-6">
      <button
          onClick={() => setToggleSidebar(true)}
          className="md:hidden p-2 rounded hover:bg-gray-100 grow-0 order-1 cursor-pointer"
        >
          <LuSquareMenu className="text-xl text-gray-600" />
        </button>

        {/* Page Titles */}
        <div className="grow order-3 sm:order-2 col-span-2 row-span-1">
          <h1 className="text-xl font-bold text-heading">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>

      {/* Right: User Info */}
      <div className="flex items-center justify-end gap-3 grow-0 order-2 sm:order-3 ">
        <FaUserCircle className="rounded hover:bg-gray-100 text-xl text-gray-600 cursor-pointer" />
        <div className="block text-left">
          <h2 className="text-sm font-semibold text-heading capitalize">{currentUser.username}</h2>
          <p className="text-xs text-gray-400">Freelancer</p>
        </div>
      </div>
      
    </div>
  );
};

export default NavBar;
