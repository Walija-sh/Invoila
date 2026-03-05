import React, { useContext } from "react";
import { LuSquareMenu } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { InvoilaContext } from "../context/InvoilaContext";

const pageDetails = {
  "/": { title: "Dashboard", subtitle: "Welcome back, manage your invoices and payments" },
  "/invoices": { title: "Invoices", subtitle: "View and manage all your invoices" },
  "/clients": { title: "Clients", subtitle: "Manage your client information and contacts" },
  "/payments": { title: "Payments", subtitle: "Track and record all your payments" },
  "/settings": { title: "Settings", subtitle: "Customize your preferences and account settings" },
  "/invoices/createInvoice": { title: "Create Invoice", subtitle: "Create a new invoice for your client" },
  "/clients/createClient": { title: "Add Client", subtitle: "Add client details to start tracking their invoices." },
  "/invoices/*": { title: "Invoice Overview", subtitle: "See the client, services, and payment status" },
  "/clients/*": { title: "Client Overview", subtitle: "See the client details and payment status" },
};

const NavBar = ({ setToggleSidebar }) => {
  const { currentUser, setCurrentUser } = useContext(InvoilaContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Match page title/subtitle
  let matchedPath = Object.keys(pageDetails).find(
    (path) =>
      path === location.pathname ||
      (path.includes("*") && location.pathname.startsWith(path.replace("/*", "")))
  );
  const { title, subtitle } = pageDetails[matchedPath] || { title: "", subtitle: "" };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <div className="grid grid-cols-2 grid-rows-[auto auto] sm:flex items-center justify-between gap-2 py-4 px-6 bg-white shadow-sm rounded-md mb-6">
      {/* Sidebar toggle */}
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
      <div className="flex items-center justify-end gap-3 grow-0 order-2 sm:order-3">
        {/* Profile photo / icon */}
        {currentUser && (
          <img
            src={currentUser.profilePhoto || ""}
            alt="User"
            onClick={() => navigate("/settings")}
            className={`w-8 h-8 rounded-full cursor-pointer  "hidden sm:block" : ""
            }`}
          />
        )}
        {!currentUser?.profilePhoto && (
          <FaUserCircle
            onClick={() => navigate("/settings")}
            className="hidden sm:block rounded hover:bg-gray-100 text-2xl text-gray-600 cursor-pointer"
          />
        )}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="bg-accent text-white px-3 cursor-pointer py-2 rounded-md hover:opacity-90 transition text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavBar;