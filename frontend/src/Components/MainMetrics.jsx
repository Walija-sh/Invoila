import React from 'react'
import { Pie, PieChart, Tooltip, ResponsiveContainer } from 'recharts';

const MainMetrics = ({ stats }) => {
  const { totalInvoices, paid, unpaid, overdue } = stats;
  const data = [
    { name: 'Paid Invoices', qty: paid },
    { name: 'Unpaid Invoices', qty: unpaid },
    { name: 'Overdue Invoices', qty: overdue },
  ];

  return (
    <div className="w-full h-[300px] sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeShape={{
                fill: '#7b2cbf',
            }}
            data={data}
            dataKey="qty"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            fill="#B080D9"
            
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MainMetrics;
