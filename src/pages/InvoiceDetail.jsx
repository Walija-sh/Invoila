import React, { useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InvoilaContext } from '../context/InvoilaContext';
import { FaCalendarAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

const exportPDF = () => {
  // Create a separate printable HTML version with hex-safe styles
  const printContainer = document.createElement('div');
  printContainer.style.padding = '24px';
  printContainer.style.backgroundColor = '#fff';
  printContainer.style.color = '#000';
  printContainer.style.fontFamily = 'sans-serif';
  printContainer.style.maxWidth = '900px';
  printContainer.style.margin = '0 auto';
  printContainer.style.lineHeight = '1.5';
  printContainer.innerHTML = `
    <h2 style="font-size: 22px; font-weight: bold; margin-bottom: 8px;">
      Invoice #${invoice.id}
    </h2>
    <p style="font-size: 14px; margin-bottom: 20px;">
      Here are the details of this invoice
    </p>

    <h3 style="margin-top: 16px; font-size: 18px; font-weight: 600;">Client Information</h3>
    <p><strong>Client Name:</strong> ${invoice.client.name}</p>
    <p><strong>Client Email:</strong> ${invoice.client.email}</p>

    <h3 style="margin-top: 24px; font-size: 18px; font-weight: 600;">Invoice Information</h3>
    <p><strong>Due Date:</strong> ${invoice.invoice.dueDate}</p>
    <p><strong>Status:</strong> ${invoice.invoice.status}</p>

    <h3 style="margin-top: 24px; font-size: 18px; font-weight: 600;">Services</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <thead>
        <tr style="background-color: #f0f0f0;">
          <th style="border: 1px solid #ccc; padding: 8px;">Service Name</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Quantity</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Rate ($)</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Total ($)</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.services
          .map(
            (s) => `
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px;">${s.name}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${s.quantity}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">$${s.rate}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">$${s.quantity * s.rate}</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>

    <div style="text-align: right; margin-top: 24px;">
      <h4 style="font-size: 18px; font-weight: bold; color: #000;">Total Amount</h4>
      <p style="font-size: 16px; font-weight: bold;">${invoice.totals.currency}${subtotal.toFixed(2)}</p>
      <p style="font-size: 12px;">Total due</p>
    </div>
  `;

  // Append to DOM (invisible)
  document.body.appendChild(printContainer);

  // Render as canvas
  html2canvas(printContainer, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${invoice.id}.pdf`);

    document.body.removeChild(printContainer); // Clean up
  });
};


  return (
    <div className="p-4 md:p-6">

      {/* PDF content starts here */}
      <div
        ref={pdfRef}
        className="bg-white p-6 max-w-4xl mx-auto shadow-md rounded-lg text-text"
      >
        <h2 className="text-2xl font-semibold text-h mb-1">Invoice {invoice.id}</h2>
        <p className="text-sm text-p mb-6">Here are the details of this invoice</p>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Info */}
          <div>
            <h3 className="text-lg font-medium text-heading mb-3">Client Information</h3>
            <div className="mb-4">
              <label className="block text-sm text-p mb-1">Client Name</label>
              <p className="p-2 border border-border rounded-md">{invoice.client.name}</p>
            </div>
            <div>
              <label className="block text-sm text-p mb-1">Client Email</label>
              <p className="p-2 border border-border rounded-md">{invoice.client.email}</p>
            </div>
          </div>

          {/* Invoice Info */}
          <div>
            <h3 className="text-lg font-medium text-heading mb-3">Invoice Information</h3>
            <div className="mb-4">
              <label className="block text-sm text-p mb-1">Due Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={invoice.invoice.dueDate}
                  disabled
                  className="w-full p-2 border border-border rounded-md pr-10 bg-gray-100 text-gray-600"
                />
                <FaCalendarAlt className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-p mb-1">Status</label>
              <p className="p-2 border border-border rounded-md capitalize bg-gray-100 text-gray-600">
                {invoice.invoice.status}
              </p>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-heading mb-3">Services</h3>
          <div className="hidden md:grid grid-cols-4 gap-3 px-1 mb-2 text-sm font-semibold text-p">
            <span>Service Name</span>
            <span>Quantity</span>
            <span>Rate ($)</span>
            <span>Total ($)</span>
          </div>
          <div className="space-y-4">
            {invoice.services.map((service, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center bg-cardbg p-3 rounded-md"
              >
                <p className="p-2 border border-border rounded-md">{service.name}</p>
                <p className="p-2 border border-border rounded-md">{service.quantity}</p>
                <p className="p-2 border border-border rounded-md">${service.rate}</p>
                <p className="p-2 border border-border rounded-md">
                  ${service.quantity * service.rate}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="mt-8 text-right">
          <h3 className="text-xl font-bold text-accent">Total Amount</h3>
          <p className="text-2xl font-semibold text-spaid">
            {invoice.totals.currency}
            {subtotal.toFixed(2)}
          </p>
          <p className="text-sm text-p">Total due</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4 flex-wrap">
        <button
          onClick={() => navigate('/invoices')}
          className="px-4 py-2 bg-border text-h rounded-md hover:bg-gray-300 cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={exportPDF}
          className="px-4 py-2 bg-accent text-white rounded-md hover:opacity-90"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default InvoiceDetail;
