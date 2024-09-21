"use client";
import axios from "axios";
import crypto from "crypto";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import QRCode from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
import { useReactToPrint } from "react-to-print";
import { motion } from "framer-motion";
import { CgSpinner } from "react-icons/cg";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Invoice from "@/Components/Invoice/Invoice";

const ManagerManualInvoiceComponent = () => {
  const componentRef = useRef();
  const router = useRouter();
  const searchParams = useSearchParams();
  const billId = searchParams.get("billId");

  const [invoiceData, setInvoiceData] = useState([]);
  const [invoiceName, setInvoiceName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [formName, setFormName] = useState("");
  const [formValue, setFormValue] = useState("");
  const [billLoading, setBillLoading] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Receipt_${invoiceName}_${new Date().toLocaleString()}`,
    onBeforePrint: () => toast.success("Generating Invoice"),
    onAfterPrint: async () => {
      const swalRes = await Swal.fire({
        title: "Did you received the cash?",
        text: "Should I save the transaction to the DataBase and reset this page?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#1493EA",
        cancelButtonColor: "#EF4444",
        confirmButtonText: "Proceed",
        cancelButtonText: "Cancel",
        background: "#141E30",
        color: "#fff",
      });
      if (swalRes.isConfirmed) {
        if (!transactionId) {
          toast.error(
            "Something went wrong, Transactions didn't save, Try again"
          );
        } else await saveTransaction();
      }
    },
  });

  const saveTransaction = async () => {
    try {
      toast.success("Saving Transaction, Don't turn off your system");
      const { data } = await axios.post("/api/transaction", {
        billId: billId || `${invoiceName}__${invoiceNumber}`,
        payments: invoiceData,
        note: "Cash Payment From Office",
        reason: "payment",
        transactionId,
        method: "cash",
        transactionDate,
      });
      if (data.success) {
        toast.success(data?.msg);
        setInvoiceData([]);
      } else {
        toast.error(data?.msg || "Transaction Error, Try Again");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.msg ||
          error?.message ||
          "Transaction Error, Try Again"
      );
    }
  };

  const addField = (e) => {
    e.preventDefault();
    if (!formName || !formValue || parseInt(formValue) == 0) return;
    setInvoiceData([...invoiceData, { name: formName, value: formValue }]);
    setFormName("");
    setFormValue("");
  };
  const deleteField = (indexToDelete) => {
    setInvoiceData((prevInvoiceData) =>
      prevInvoiceData.filter((_, index) => index != indexToDelete)
    );
  };
  const [transactionId, setTransactionId] = useState("");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toLocaleString()
  );

  const detectDeviceType = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (
      userAgent.includes("mobile") ||
      userAgent.includes("android") ||
      userAgent.includes("iphone") ||
      userAgent.includes("ipad")
    ) {
      setAllowedDevice(false);
    } else {
      setAllowedDevice(true);
    }
  };

  useEffect(() => {
    axios
      .put("/api/transaction")
      .then((res) =>
        setTransactionId(res?.data?.success ? res?.data?.transactionId : "")
      )
      .catch((err) => console.log(err));
    detectDeviceType();
    if (!billId) return;
    setBillLoading(true);
    axios
      .get(`/api/bills/getbill/${billId}`)
      .then((res) => {
        axios
          .get(`/api/transaction?id=${billId}`)
          .then((res2) => {
            if (!res.data.success) return;
            const billAmount = res?.data?.bill?.totalBillInBDT || 0;
            const paidAmount =
              res2?.data?.transactions?.reduce((total, transaction) => {
                const transactionSum = transaction.payments.reduce(
                  (sum, payment) => sum + payment.value,
                  0
                );
                return total + transactionSum;
              }, 0) || 0;
            if (
              billAmount == paidAmount &&
              billAmount != 0 &&
              paidAmount != 0
            ) {
              const url = new URL(window.location.href);
              const baseUrl =
                url.origin + url.pathname + "?displayData=managerManualInvouce";
              return router.replace(baseUrl);
            }
            const name = res?.data?.user?.username || "";
            const number = res?.data?.user?.contactNumber || "";
            setInvoiceName(name);
            setInvoiceNumber(number);
            const rawCharges = res?.data?.bill?.charges || [];
            const charges = rawCharges?.map((charge) => {
              return {
                name: charge?.note + " - " + res?.data?.bill?.month,
                value: parseInt(charge?.amount),
              };
            });
            let arrayOfInvoice = [];
            if (res?.data?.bill?.status == "calculated") {
              arrayOfInvoice.push({
                name: `Due Bill - ${res?.data?.bill?.month}`,
                value: parseInt(billAmount) - parseInt(paidAmount),
              });
            } else {
              arrayOfInvoice = [...invoiceData, ...charges];
              if (parseInt(billAmount) - parseInt(paidAmount) != 0) {
                arrayOfInvoice.push({
                  name: `Meal Bill - ${res?.data?.bill?.month}`,
                  value: parseInt(billAmount) - parseInt(paidAmount),
                });
              }
            }

            setInvoiceData(arrayOfInvoice);
          })
          .catch((err2) => console.log("Transaction Fetching Error:", err2));
      })
      .catch((err) => console.log("Bill Fetching Error:", err))
      .finally(() => setBillLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billId, router]);
  const [allowedDevice, setAllowedDevice] = useState(false);
  if (allowedDevice)
    return (
      <div className="min-h-full p-10 px-14 pt-5 bg-dashboard text-slate-100 relative">
        {/* Bill Loading Notify  */}
        {billLoading && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="absolute top-3 right-3 pr-10 pl-4 py-2 bg-white text-blue-500 font-medium flex items-center gap-2"
          >
            <CgSpinner className="animate-spin text-xl" />
            <p>Generating Auto Bill Based Invoice</p>
          </motion.div>
        )}
        <p className="text-center font-semibold text-xl dark:text-white relative">
          Create Invoice
        </p>
        <form className="flex items-center justify-center gap-10 text-black mt-5">
          <input
            placeholder="Receipent Name"
            className="px-4 py-1 rounded-md outline-none"
            type="text"
            value={invoiceName}
            onChange={(e) => setInvoiceName(e.target.value)}
          />
          <input
            placeholder="Receipent Number"
            className="px-4 py-1 rounded-md outline-none"
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </form>
        <form
          onSubmit={addField}
          className="flex items-center justify-center gap-10 text-black mt-5"
        >
          <input
            placeholder="Field name"
            className="px-4 py-1 rounded-md outline-none"
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <input
            placeholder="Amount in BDT"
            className="px-4 py-1 rounded-md outline-none"
            type="number"
            value={formValue}
            onChange={(e) => setFormValue(parseInt(e.target.value))}
          />
          <button
            type="submit"
            className="px-6 py-1 rounded-md text-white bg-blue-500 duration-300 active:scale-90 hover:scale-105 cursor-pointer font-semibold"
          >
            Add
          </button>
        </form>
        <div className="w-min mx-auto text-left mt-5 select-none">
          <div className="border rounded-md p-0.5">
            {invoiceData.map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-0.5">
                <p className="p-2 border rounded-md text-center min-w-[250px] w-max">
                  {item.name}
                </p>
                <p className="p-2 border rounded-md text-center min-w-[150px] w-max">
                  {item.value}/- BDT
                </p>
                <p
                  onClick={() => deleteField(i)}
                  className="p-2 border rounded-md text-center cursor-pointer duration-300 active:scale-90"
                >
                  <FaDeleteLeft className="text-red-600" />
                </p>
              </div>
            ))}
          </div>
        </div>
        {invoiceData.length > 0 && (
          <button
            onClick={handlePrint}
            disabled={!invoiceName || !invoiceNumber}
            className="px-10 py-1 rounded-md duration-300 active:scale-90 hover:scale-105 bg-blue-500 text-white font-semibold mx-auto mt-5 block"
          >
            Print Invoice
          </button>
        )}
        <div ref={componentRef} className="px-2 mt-5">
          <div className="flex items-center gap-2">
            {/* Owner Copy  */}
            <Invoice
              officeCopy={true}
              invoiceName={invoiceName}
              invoiceNumber={invoiceNumber}
              transactionDate={transactionDate}
              transactionId={transactionId}
              invoiceData={invoiceData}
              methode="cash"
            />
            {/* User Copy  */}
            <Invoice
              officeCopy={false}
              invoiceName={invoiceName}
              invoiceNumber={invoiceNumber}
              transactionDate={transactionDate}
              transactionId={transactionId}
              invoiceData={invoiceData}
              methode="cash"
            />
          </div>
        </div>
      </div>
    );
  else
    return (
      <div className="min-h-full bg-dashboard flex items-center justify-center text-red-500 font-semibold text-center">
        <p>
          Any kind of Smart Phones or Handsets or Tablets are not permitted to
          generate Invoice
        </p>
      </div>
    );
};

export default ManagerManualInvoiceComponent;
