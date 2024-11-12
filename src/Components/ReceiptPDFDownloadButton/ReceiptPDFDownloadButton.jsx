"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";

const ReceiptPDFDownloadButton = ({ id }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    const invoiceElement = document.getElementById(id);
    if (invoiceElement) {
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdfPageWidth = 100;
      const imgWidth = 90;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF("p", "mm", [pdfPageWidth, imgHeight + 20]);
      const x = 5;
      const y = 5;

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
      pdf.save("invoice.pdf");
    }
    setIsDownloading(false);
  };

  return (
    <button
      onClick={handleDownloadPDF}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center gap-2"
    >
      Download PDF
      {isDownloading && <CgSpinner className="text-lg animate-spin" />}
    </button>
  );
};

export default ReceiptPDFDownloadButton;
