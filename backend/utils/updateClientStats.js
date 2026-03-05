import Client from "../models/Client.model.js";
import Invoice from "../models/Invoice.model.js";
import catchAsync from "./catchAsync.js";

const updateClientStats = catchAsync(async (userId) => {

  const aggregation = await Invoice.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: "$client",
        invoicesSent: { $sum: 1 },
        totalPaid: {
          $sum: {
            $cond: [{ $eq: ["$status", "Paid"] }, "$subtotal", 0]
          }
        },
        totalUnpaid: {
          $sum: {
            $cond: [{ $ne: ["$status", "Paid"] }, "$subtotal", 0]
          }
        },
        lastInvoiceDate: { $max: "$issuedDate" }
      }
    }
  ]);

  // update each client
  for (const item of aggregation) {
    let status = item.totalUnpaid > 0 ? "Outstanding" : "Active";

    await Client.findByIdAndUpdate(item._id, {
      invoicesSent: item.invoicesSent,
      totalPaid: item.totalPaid,
      totalUnpaid: item.totalUnpaid,
      lastInvoiceDate: item.lastInvoiceDate,
      status
    });
  }
});

export default updateClientStats;