import React, { useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InvoilaContext } from '../context/InvoilaContext';
import { FaCalendarAlt } from 'react-icons/fa';
import styles from './InvoiceDetail.module.css'
import html2pdf from 'html2pdf.js'

const InvoiceDetail = () => {
  const { id } = useParams();
  
  const navigate = useNavigate();
  const { invoices } = useContext(InvoilaContext);
  const pdfRef = useRef();

  const invoice = invoices.find((inv) => inv.id === id);
  if (!invoice) {
    return <div className="p-6 text-red-600 font-semibold">Invoice not found</div>;
  }

  const subtotal = invoice.services.reduce(
    (acc, s) => acc + s.quantity * s.rate,
    0
  );

const exportPDF=()=>{
  const options = {
  filename: 'Invoice.pdf',
  margin: 1,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2 },
  jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
};
  if(pdfRef.current){
    html2pdf().set(options).from(pdfRef.current).save();
  }

}
    return (
    <div className={styles.container}>
      <div ref={pdfRef} className={styles.invoiceBox}>
        <h2 className={styles.heading}>Invoice {invoice.id}</h2>
        <p className={styles.subheading}>Here are the details of this invoice</p>

        <div className={styles.grid}>
          <div>
            <h3 className={styles.sectionTitle}>Client Information</h3>
            <div className="mb-4">
              <label className={styles.label}>Client Name</label>
              <p className={styles.valueBox}>{invoice.client.name}</p>
            </div>
            <div>
              <label className={styles.label}>Client Email</label>
              <p className={styles.valueBox}>{invoice.client.email}</p>
            </div>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>Invoice Information</h3>
            <div className="mb-4">
              <label className={styles.label}>Due Date</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  value={invoice.invoice.dueDate}
                  disabled
                  className={styles.disabledInput}
                />
                <FaCalendarAlt
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '0.75rem',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                  }}
                />
              </div>
            </div>
            <div>
              <label className={styles.label}>Status</label>
              <p className={styles.valueBox}>{invoice.invoice.status}</p>
            </div>
          </div>
        </div>

        <div className={styles.servicesTitle}>Services</div>
        <div className={styles.serviceGridHeader}>
          <span>Service Name</span>
          <span>Quantity</span>
          <span>Rate ($)</span>
          <span>Total ($)</span>
        </div>
        <div>
          {invoice.services.map((service, index) => (
            <div key={index} className={styles.serviceItem}>
              <p className={styles.valueBox}>{service.name}</p>
              <p className={styles.valueBox}>{service.quantity}</p>
              <p className={styles.valueBox}>${service.rate}</p>
              <p className={styles.valueBox}>${service.quantity * service.rate}</p>
            </div>
          ))}
        </div>

        <div className={styles.totalSection}>
          <h3 className={styles.totalTitle}>Total Amount</h3>
          <p className={styles.totalAmount}>
            {invoice.totals.currency}
            {subtotal.toFixed(2)}
          </p>
          <p className={styles.totalSubtext}>Total due</p>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.btnBack} onClick={() => navigate('/invoices')}>
          Back
        </button>
        <button className={styles.btnDownload} onClick={exportPDF}>
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetail;
