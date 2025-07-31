import { FaUserCircle } from "react-icons/fa";
import { useContext } from "react";
import { InvoilaContext } from "../context/InvoilaContext";
import { Link } from "react-router-dom";

const statusColor = {
  Paid: "bg-spaid/10 text-spaid",
  Unpaid: "bg-sunpaid/10 text-sunpaid",
  Overdue: "bg-sdue/10 text-sdue",
};

const Invoice = ({ inv }) => {
  const { updateInvoiceStatus } = useContext(InvoilaContext);
  const status = inv.invoice.status;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-cardbg px-4 py-3 rounded-md shadow-lg ">
      <Link to={`/invoices/${inv.id}`} className="flex items-center gap-3">
        <FaUserCircle className="text-p text-3xl" />
        <div>
          <p className="font-semibold">{inv.client.name}</p>
          <p className="text-sm text-p">#{inv.id}</p>
        </div>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2 sm:mt-0">
        <p className="font-semibold text-lg">{inv.totals.subtotal} $</p>
        <p className="text-sm text-p">Due: {inv.invoice.dueDate}</p>
        <select
          value={status}
           
          onChange={(e) => {
          
            updateInvoiceStatus(inv.id, e.target.value)
          }}
          className={`px-3 py-1 text-sm rounded-full font-medium border-none outline-none  cursor-pointer ${statusColor[status]}`}
        >
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>
    </div>
  );
};

export default Invoice;
