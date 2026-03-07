import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    rate: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    issuedDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" }, // only store Paid/Unpaid
    services: [serviceSchema],
    subtotal: { type: Number, default: 0 },
    currency: { type: String, default: "$" }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Automatically calculate subtotal on save
invoiceSchema.pre("save", function () {
  this.subtotal = this.services.reduce((sum, item) => sum + item.quantity * item.rate, 0);
});

invoiceSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.services) {
    const subtotal = update.services.reduce(
      (acc, service) => acc + service.quantity * service.rate,
      0
    );

    update.subtotal = subtotal;
  }

  next();
});

// Virtual for derived status
invoiceSchema.virtual("derivedStatus").get(function () {
  if (this.status === "Paid") return "Paid";
  if (new Date(this.dueDate) < new Date()) return "Overdue";
  return "Unpaid";
});

const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

export default Invoice;