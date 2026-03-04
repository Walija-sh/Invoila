import React, { useContext, useEffect, useState } from 'react';
import { InvoilaContext } from '../context/InvoilaContext';
import MainMetrics from '../Components/MainMetrics';
import RevenueAreaChart from '../Components/RevenueAreaChart'

const Dashboard = () => {
  const { getDashboardStats,invoices,clients,getRevenueByMonth } = useContext(InvoilaContext);
  const [stats, setStats] = useState(null);
  const [revenueStats,setRevenueStats]=useState(null)

  useEffect(() => {
    const data = getDashboardStats();
    setRevenueStats(getRevenueByMonth(invoices))
    setStats(data);
    
  }, [invoices,clients]);

  const format = (num) => '$' + (num || 0).toLocaleString();

  if (!stats) return null;

  return (
    <div className="bg-white text-text p-6 max-w-5xl mx-auto">
      <div className="bg-card-bg rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-h"> Main Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 items-center justify-center">
           <MainMetrics stats={stats} className='justify-self-center'/>
        <ul className="grid gap-y-4 list-disc list-inside text-base leading-relaxed text-p md:text-xl">
          
          <li><strong>Total Revenue:</strong> {format(stats.totalRevenue)}</li>
          <li><strong>Total Clients:</strong> {stats.totalClients}</li>
          <li><strong>Upcoming Due Amount:</strong> {format(stats.upcomingDue)}</li>
        </ul>
        </div>
      </div>
      {/*  */}
      <RevenueAreaChart data={revenueStats}/>
     
    </div>
  );
};

export default Dashboard;
