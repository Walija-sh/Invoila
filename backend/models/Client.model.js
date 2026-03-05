// Clients do not login to your platform.
// They are just stored contacts used for:
// sending invoices
// tracking payments
// keeping client history

import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Client email is required"],
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    company: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    invoicesSent: {
      type: Number,
      default: 0,
    },

    totalPaid: {
      type: Number,
      default: 0,
    },

    totalUnpaid: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Outstanding", "Inactive"],
      default: "Active",
    },

    lastInvoiceDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// uniqueness of email per user
clientSchema.index({ user: 1, email: 1 }, { unique: true });

 const Client= mongoose.models.Client || mongoose.model("Client", clientSchema);
 
 export default Client;

//  later use aggregation to update derived dependant fields
// invoicesSent
// totalPaid
// totalUnpaid
// lastInvoiceDate and status