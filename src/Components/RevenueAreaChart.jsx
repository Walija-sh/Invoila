import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueAreaChart = ({ data }) => {
    
  return (
    <div className="bg-cardbg p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-3">Revenue Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="revenue" stroke="#7b2cbf" fill="#7b2cbf" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueAreaChart;