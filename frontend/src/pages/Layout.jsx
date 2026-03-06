import React, { useEffect, useState } from 'react'
import Sidebar from '../Components/Sidebar'
import { Outlet } from 'react-router-dom'
import NavBar from '../Components/NavBar'
import { ToastContainer } from 'react-toastify'

const Layout = () => {
  const [toggleSidebar,setToggleSidebar]=useState(false);

  return (
     <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar toggleSidebar={toggleSidebar} setToggleSidebar={setToggleSidebar} />

      {/* Main Content */}
      <main className=" flex-1 overflow-y-auto bg-gray-100">
        <ToastContainer position="top-right" autoClose={3000} />
        <NavBar setToggleSidebar={setToggleSidebar}/>
        <Outlet/>
      </main>
    </div>
  )
}

export default Layout;