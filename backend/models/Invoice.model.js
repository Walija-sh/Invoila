import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    rate: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const paymentMethodSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },   // user-defined payment type
    details: { type: String }                 // optional details, e.g., account info
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    issuedDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" }, // only store Paid/Unpaid
    services: [serviceSchema],
    subtotal: { type: Number, default: 0 },
      // Flexible, optional payment methods
    paymentMethods: [paymentMethodSchema],

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

invoiceSchema.index(
  { user: 1, invoiceNumber: 1 },
  { unique: true }
);

// Automatically calculate subtotal on save
invoiceSchema.pre("save", function () {
  this.subtotal = this.services.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
});
invoiceSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  const services = update.services || update?.$set?.services;

  if (services) {
    const subtotal = services.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );

    if (update.$set) {
      update.$set.subtotal = subtotal;
    } else {
      update.subtotal = subtotal;
    }
  }

});
// Virtual for derived status
invoiceSchema.virtual("derivedStatus").get(function () {
  if (this.status === "Paid") return "Paid";
  if (new Date(this.dueDate) < new Date()) return "Overdue";
  return "Unpaid";
});

const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

export default Invoice;