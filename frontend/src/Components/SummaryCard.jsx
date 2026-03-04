import React from 'react'

const SummaryCard = ({ label, value, amount, icon, bg }) => (
  <div className="bg-card-bg rounded-lg p-4 shadow-sm flex flex-col gap-1">
    <div className="flex items-center justify-between text-sm font-medium text-heading">
      <span>{label}</span>
      <span className={`text-lg text-${bg}` } >{icon}</span>
    </div>
    <h2 className="text-xl font-bold text-h">{value}</h2>
    {amount && <p className="text-sm text-p">{amount}</p>}
  </div>
);
export default SummaryCard