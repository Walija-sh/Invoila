import React, { useContext } from 'react';
import SummaryCard from '../Components/SummaryCard';
import { InvoilaContext } from '../context/InvoilaContext';

const Dashboard = () => {
  const { invoices } = useContext(InvoilaContext);

  const totalInvoices = invoices.length;

  const paid = invoices.filter(inv => inv.invoice.status === 'Paid');
  const unpaid = invoices.filter(inv => inv.invoice.status === 'Unpaid');
  const overdue = invoices.filter(inv => inv.invoice.status === 'Overdue');

  const sumAmounts = (list) => 
    list.reduce((sum, inv) => sum + (inv.totals?.subtotal || 0), 0);

  const format = (num) => '$' + num.toLocaleString();

  return (
    <div className='bg-white p-6  mx-auto  text-text'>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard 
          label="Total Invoices" 
          value={totalInvoices} 
          icon="📄" 
        />
        <SummaryCard 
          label="Paid" 
          value={paid.length} 
          amount={format(sumAmounts(paid))} 
          icon="✅" 
          bg="spaid" 
        />
        <SummaryCard 
          label="Unpaid" 
          value={unpaid.length} 
          amount={format(sumAmounts(unpaid))} 
          icon="⚠️" 
          bg="sunpaid" 
        />
        <SummaryCard 
          label="Overdue" 
          value={overdue.length} 
          amount={format(sumAmounts(overdue))} 
          icon="⛔" 
          bg="sdue" 
        />
      </div>
    </div>
  );
};

export default Dashboard;
