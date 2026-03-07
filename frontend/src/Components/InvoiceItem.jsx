import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const statusColor = {
  Paid: "bg-spaid/10 text-spaid",
  Unpaid: "bg-sunpaid/10 text-sunpaid",
  Overdue: "bg-sdue/10 text-sdue",
};

const Invoice = ({ inv,onToggleStatus   }) => {
  const [loading, setLoading] = useState(false);
  const status = inv.status;

  const handleToggle = async () => {
  if (loading) return;

  setLoading(true);
  await onToggleStatus();
  setLoading(false);
};
  

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-cardbg px-4 py-3 rounded-md shadow-lg ">
      <Link to={`/invoices/${inv._id}`} className="flex items-center gap-3">
        <FaUserCircle className="text-p text-3xl" />
        <div>
          <p className="font-semibold">{inv.client.name}</p>
          <p className="text-sm text-p">#{inv.invoiceNumber}</p>
        </div>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2 sm:mt-0">
        <p className="font-semibold text-lg">{inv.subtotal} $</p>
        <p className="text-sm text-p">Due: {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "N/A"}</p>
    <span
  onClick={handleToggle}
  className={`px-3 py-1 text-sm rounded-full font-medium select-none 
  ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
  ${statusColor[status]}`}
  title="Click to toggle status"
>
  {loading ? "..." : status}
</span>
      </div>
    </div>
  );
};

export default Invoice;
