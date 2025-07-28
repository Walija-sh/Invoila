import React from "react";
import {
  FaRegChartBar,
  FaFileInvoice,
  FaUserFriends,
  FaCreditCard,
  FaCog,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import logo from '../assets/Logo.png'
import favicon from '../assets/favicon.png'
import { NavLink } from "react-router-dom";

const Sidebar = ({toggleSidebar,setToggleSidebar}) => {
  const navItems = [
    { name: "Dashboard", icon: <FaRegChartBar />, path: "/" },
    { name: "Invoices", icon: <FaFileInvoice />, path: "/invoices" },
    { name: "Clients", icon: <FaUserFriends />, path: "/clients" },
    { name: "Payments", icon: <FaCreditCard />, path: "/payments" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];
  

  return (
    <aside className={ ` absolute top-0 left-0 w-full sm:w-fit sm:static md:w-full max-w-64 h-screen bg-white border-r border-gray-200  flex flex-col p-5   ${toggleSidebar?'translate-x-0':'-translate-x-[200%]'} sm:translate-x-0 transition-all ease-in duration-150`}>
        <div onClick={() => setToggleSidebar(false)} className="flex items-center justify-end sm:hidden">
            <IoClose className="text-2xl  text-p hover:bg-gray-100 hover:text-heading cursor-pointer" />
        </div>
      {/* Logo */}
      <div className={`mb-10 sm:hidden  md:block ${toggleSidebar?'block':'hidden'}`}>
       <div className="flex  mb-4">
                 <img src={logo} alt="Logo" className="w-full max-w-[120px]" />
        </div>
        <p className="text-sm text-p">Freelancer Dashboard</p>
      </div>
      <div className={` hidden sm:flex sm:mb-4 md:hidden`}>
                 <img src={favicon} alt="Logo" className="w-full max-w-[50px]" />
        </div>



      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? "bg-accent text-white"
                  : "text-p hover:bg-gray-100 hover:text-heading"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <p className={`${toggleSidebar?"block":'hidden'} sm:hidden md:block`}>{item.name}</p>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
