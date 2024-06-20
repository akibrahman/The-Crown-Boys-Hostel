"use client";
import Receipt from "@/Components/Receipt/Receipt";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const ManagerManualInvoiceComponent = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "The Crwon Boys Hostel",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
  });
  return (
    <div className="min-h-full p-10 pt-5 bg-dashboard text-slate-100">
      <p className="text-center font-semibold text-xl dark:text-white relative">
        Create manual Invoice
      </p>
      <div ref={componentRef} className="w-1/2 mx-auto mt-5">
        <Receipt />
      </div>
      <button onClick={handlePrint}>Print this out!</button>
    </div>
  );
};

export default ManagerManualInvoiceComponent;
