import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import styles from "./InvoiceDetail.module.css";
import html2pdf from "html2pdf.js";
import API from "../utils/axios";
import { toast } from "react-toastify";

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  const pdfRef = useRef();

  const getInvoiceDetail = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const res = await API.get(`/api/invoice/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInvoice(res.data.data);
      console.log(res.data.data);
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch invoice");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInvoiceDetail();
  }, [id]);

  const handleDeleteInvoice = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmDelete) return;

    try {
      const token = JSON.parse(localStorage.getItem("token"));

      await API.delete(`/api/invoice/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Invoice deleted successfully");

      setTimeout(() => {
        navigate("/invoices");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete invoice");
    }
  };

  const exportPDF = () => {
    const options = {
      filename: "Invoice.pdf",
      margin: 1,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    if (pdfRef.current) {
      html2pdf().set(options).from(pdfRef.current).save();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!invoice) {
    return <div className="p-6 text-red-600 font-semibold">Invoice not found</div>;
  }

  const subtotal = invoice.services.reduce(
    (acc, s) => acc + s.quantity * s.rate,
    0
  );

  return (
    <div className={styles.container}>
      <div ref={pdfRef} className={styles.invoiceBox}>
        <h2 className={styles.heading}>Invoice {invoice.invoiceNumber}</h2>
        <p className={styles.subheading}>Here are the details of this invoice</p>

        <div className={styles.grid}>
          <div>
            <h3 className={styles.sectionTitle}>Client Information</h3>

            <div className="mb-4">
              <label className={styles.label}>Client Name</label>
              <p className={styles.valueBox}>{invoice.client?.name}</p>
            </div>

            <div>
              <label className={styles.label}>Client Email</label>
              <p className={styles.valueBox}>{invoice.client?.email}</p>
            </div>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>Invoice Information</h3>

            <div className="mb-4">
              <label className={styles.label}>Issued Date</label>
              <p className={styles.valueBox}>
                {new Date(invoice.issuedDate).toLocaleDateString()}
              </p>
            </div>

            <div className="mb-4">
              <label className={styles.label}>Due Date</label>

              <div style={{ position: "relative" }}>
                <input
                  type="date"
                  value={invoice.dueDate?.split("T")[0]}
                  disabled
                  className={styles.disabledInput}
                />

                <FaCalendarAlt
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "0.75rem",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                  }}
                />
              </div>
            </div>

            <div>
              <label className={styles.label}>Status</label>
              <p className={styles.valueBox}>{invoice.status}</p>
            </div>
          </div>
        </div>

        <div className={styles.servicesTitle}>Services</div>

        <div className={styles.serviceGridHeader}>
          <span>Service Name</span>
          <span>Quantity</span>
          <span>Rate</span>
          <span>Total</span>
        </div>

        <div>
          {invoice.services.map((service, index) => (
            <div key={index} className={styles.serviceItem}>
              <p className={styles.valueBox}>{service.name}</p>
              <p className={styles.valueBox}>{service.quantity}</p>
              <p className={styles.valueBox}>
                {invoice.currency}
                {service.rate}
              </p>
              <p className={styles.valueBox}>
                {invoice.currency}
                {service.quantity * service.rate}
              </p>
            </div>
          ))}
        </div>

        <div className={styles.totalSection}>
          <h3 className={styles.totalTitle}>Total Amount</h3>

          <p className={styles.totalAmount}>
            {invoice.currency}
            {subtotal.toFixed(2)}
          </p>

          <p className={styles.totalSubtext}>Total due</p>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button
          className={styles.btnBack}
          onClick={() => navigate("/invoices")}
        >
          Back
        </button>

        <button
          className={styles.btnDownload}
          onClick={exportPDF}
        >
          Download as PDF
        </button>

        <button
          className="px-4 py-2 bg-heading text-white rounded-md"
          onClick={() => navigate(`/invoices/edit/${invoice._id}`)}
        >
          Edit Invoice
        </button>

        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md"
          onClick={handleDeleteInvoice}
        >
          Delete Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetail;