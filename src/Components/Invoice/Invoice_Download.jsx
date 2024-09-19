"use client";
import html2pdf from "html2pdf.js";

const Invoice_Download = () => {
  const handleDownloadPDF = () => {
    const invoiceElement = document.getElementById(
      "invoice__thecrownboyshostel"
    );
    const opt = {
      margin: 1,
      filename: "invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: "in", format: "a5", orientation: "portrait" },
    };

    html2pdf().from(invoiceElement).set(opt).save();
  };

  return (
    <div className="mt-4 flex justify-center">
      <button
        onClick={handleDownloadPDF}
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
      >
        Download as PDF
      </button>
    </div>
  );
};

export default Invoice_Download;
