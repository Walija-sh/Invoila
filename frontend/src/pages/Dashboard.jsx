import React, { useEffect, useState } from "react";
import MainMetrics from "../Components/MainMetrics";
import RevenueAreaChart from "../Components/RevenueAreaChart";
import API from "../utils/axios";
import { useContext } from "react";
import { InvoilaContext } from "../context/InvoilaContext";

const Dashboard = () => {
  const { currencySymbol } = useContext(InvoilaContext);
  const [stats, setStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await API.get("/api/invoice/stats/dashboard");

        const overview = res.data.data.overview;

        setStats({
          totalRevenue: overview.totalRevenue,
          totalInvoices: overview.totalInvoices,
          paidInvoices: overview.paidInvoices,
          unpaidInvoices: overview.unpaidInvoices,
          overdueInvoices: overview.overdueInvoices,
          upcomingDue: overview.outstandingRevenue,
        });

        setRevenueStats(res.data.data.revenueOverTime);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboardStats();
  }, []);

  const format = (num) => `${currencySymbol}` + (num || 0).toLocaleString();

  if (!stats) return null;

  return (
    <div className="bg-white text-text p-6 max-w-5xl mx-auto">
      <div className="bg-card-bg rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-h">Main Stats</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 items-center justify-center">
          <MainMetrics stats={stats} className="justify-self-center" />

          <ul className="grid gap-y-4 list-disc list-inside text-base leading-relaxed text-p md:text-xl">
            <li>
              <strong>Total Revenue:</strong> {format(stats.totalRevenue)}
            </li>
            <li>
              <strong>Total Invoices:</strong> {stats.totalInvoices}
            </li>
            <li>
              <strong>Upcoming Due Amount:</strong> {format(stats.upcomingDue)}
            </li>
          </ul>
        </div>
      </div>

      <RevenueAreaChart data={revenueStats} />
    </div>
  );
};

export default Dashboard;