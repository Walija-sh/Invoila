import Invoice from "../models/Invoice.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import updateClientStats from "../utils/updateClientStats.js";

export const createInvoice = catchAsync(async (req, res, next) => {
  const { client, issuedDate, dueDate, services } = req.body;

  if (!client || !services || services.length === 0) {
    return next(new AppError("Client and services are required", 400));
  }

  const invoiceCount = await Invoice.countDocuments({ user: req.user._id });
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(3, "0")}`;

  const invoice = await Invoice.create({
    invoiceNumber,
    user: req.user._id,
    client,
    issuedDate,
    dueDate,
    services
  });

  // update client derived stats
  await updateClientStats(req.user._id);

  // return virtual status in response
  res.status(201).json({
    status: "success",
    data: { ...invoice.toObject(), status: invoice.derivedStatus }
  });
});



export const getInvoices = catchAsync(async (req, res, next) => {
  const invoices = await Invoice.find({ user: req.user._id })
    .populate("client", "name email")
    .sort({ createdAt: -1 });

  const invoicesWithStatus = invoices.map(inv => ({
    ...inv.toObject(),
    status: inv.derivedStatus
  }));

  res.status(200).json({
    status: "success",
    results: invoicesWithStatus.length,
    data: invoicesWithStatus
  });
});



export const getInvoiceById = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user._id })
    .populate("client", "name email");

  if (!invoice) return next(new AppError("Invoice not found", 404));

  res.status(200).json({
    status: "success",
    data: { ...invoice.toObject(), status: invoice.derivedStatus }
  });
});


export const updateInvoice = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { returnDocument: 'after', runValidators: true }
  ).populate("client", "name email");

  if (!invoice) return next(new AppError("Invoice not found", 404));

  // update client derived stats
  await updateClientStats(req.user._id);

  res.status(200).json({
    status: "success",
    data: { ...invoice.toObject(), status: invoice.derivedStatus }
  });
});



export const deleteInvoice = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!invoice) return next(new AppError("Invoice not found", 404));

  // update client derived stats
  await updateClientStats(req.user._id);

  res.status(200).json({
    status: "success",
    message: "Invoice deleted successfully"
  });
});

export const toggleInvoiceStatus = catchAsync(async (req, res, next) => {
  const invoice = await Invoice.findOne({
    _id: req.params.id,
    user: req.user._id
  }).populate("client", "name email");

  if (!invoice) return next(new AppError("Invoice not found", 404));

  // Toggle between Paid and Unpaid
  invoice.status = invoice.status === "Paid" ? "Unpaid" : "Paid";
  await invoice.save();

  // Update client stats
  await updateClientStats(req.user._id);

  res.status(200).json({
    status: "success",
    data: { ...invoice.toObject(), status: invoice.derivedStatus }
  });
});

export const getInvoiceStats = catchAsync(async (req, res, next) => {

  const userId = req.user._id;

const stats = await Invoice.aggregate([
  {
    $match: { user: userId }
  },
  {
    $addFields: {
      derivedStatus: {
        $cond: [
          { $eq: ["$status", "Paid"] },
          "Paid",
          {
            $cond: [
              { $lt: ["$dueDate", new Date()] },
              "Overdue",
              "Unpaid"
            ]
          }
        ]
      }
    }
  },
  {
    $group: {
      _id: null,

      totalRevenue: {
        $sum: {
          $cond: [{ $eq: ["$derivedStatus", "Paid"] }, "$subtotal", 0]
        }
      },

      outstandingRevenue: {
        $sum: {
          $cond: [{ $ne: ["$derivedStatus", "Paid"] }, "$subtotal", 0]
        }
      },

      totalInvoices: { $sum: 1 },

      paidInvoices: {
        $sum: {
          $cond: [{ $eq: ["$derivedStatus", "Paid"] }, 1, 0]
        }
      },

      unpaidInvoices: {
        $sum: {
          $cond: [{ $eq: ["$derivedStatus", "Unpaid"] }, 1, 0]
        }
      },

      overdueInvoices: {
        $sum: {
          $cond: [{ $eq: ["$derivedStatus", "Overdue"] }, 1, 0]
        }
      }
    }
  }
]);



 const revenueOverTime = await Invoice.aggregate([
  {
    $match: {
      user: userId,
      status: "Paid"
    }
  },
  {
    $group: {
      _id: {
        year: { $year: "$issuedDate" },
        month: { $month: "$issuedDate" }
      },
      revenue: { $sum: "$subtotal" }
    }
  },
  {
    $sort: { "_id.year": 1, "_id.month": 1 }
  },
  {
    $project: {
      _id: 0,
      label: {
        $concat: [
          { $toString: "$_id.year" },
          "-",
          { $toString: "$_id.month" }
        ]
      },
      revenue: 1
    }
  }
]);


  res.status(200).json({
    status: "success",
    data: {
      overview: stats[0] || {
        totalRevenue: 0,
        outstandingRevenue: 0,
        totalInvoices: 0,
        paidInvoices: 0,
        unpaidInvoices: 0,
        overdueInvoices: 0
      },
      revenueOverTime
    }
  });

});