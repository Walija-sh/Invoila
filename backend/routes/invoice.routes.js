import express from "express";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getInvoiceStats,
  toggleInvoiceStatus
} from "../controllers/invoice.controller.js";

import protect from "../middlwares/protect.middleware.js";

const InvoiceRouter = express.Router();

InvoiceRouter.use(protect);
InvoiceRouter.get("/stats/dashboard", getInvoiceStats);
InvoiceRouter.put("/toggle-status/:id", toggleInvoiceStatus);

InvoiceRouter.post("/", createInvoice);

InvoiceRouter.get("/", getInvoices);

InvoiceRouter.get("/:id", getInvoiceById);

InvoiceRouter.put("/:id", updateInvoice);

InvoiceRouter.delete("/:id", deleteInvoice);

export default InvoiceRouter;