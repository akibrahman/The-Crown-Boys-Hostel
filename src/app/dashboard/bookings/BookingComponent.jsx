"use client";
import InvoicePOS from "@/Components/Invoice/InvoicePOS";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import Modal from "react-modal";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";

const BookingComponent = ({ data = {}, show = false, refetch = () => {} }) => {
  const router = useRouter();
  const posPrintManagerRef = useRef();
  const posPrintClientRef = useRef();

  const closeModal = () => {
    router.push("/dashboard/bookings");
  };

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    checkinMonth: "",
    isPaid: false,
    isLoading: false,
    advanceAmount: 0,
    transactionId: axios
      .put("/api/transaction")
      .then((res) => (res?.data?.success ? res?.data?.transactionId : ""))
      .catch(() => closeModal("Transaction Error!")),
  });

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#1F2937",
      padding: "0",
      width: "90%",
      maxWidth: "500px",
      maxHeight: "95vh",
      overflowY: "auto",
      borderRadius: "10px",
    },
    overlay: {
      zIndex: 500,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const {
      name,
      number,
      email,
      checkinMonth,
      isPaid,
      transactionId,
      advanceAmount,
    } = formData;
    const { roomId, bedNo, roomName, roomFloor, roomBuilding } = data;
    if (
      !roomId ||
      !bedNo ||
      !roomName ||
      !roomFloor ||
      !roomBuilding ||
      !name ||
      !number ||
      !email ||
      !checkinMonth
    ) {
      toast.error("All fields are required!");
      return;
    }
    if (isPaid && advanceAmount <= 0) {
      toast.error("Invalid Advance Amount!");
      return;
    }
    setFormData({ ...formData, isLoading: true });
    try {
      const { data } = await axios.post("/api/prebooking", {
        source: "office",
        roomId,
        bedNo,
        roomName,
        roomFloor,
        roomBuilding,
        name,
        number,
        email,
        checkinMonth,
        isPaid,
        advanceAmount,
        transactionId: isPaid ? transactionId : "",
      });
      if (!data.success) throw new Error(data.msg);
      refetch();
      toast.success(data.msg);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || error?.message);
    } finally {
      closeModal();
      setFormData({ ...formData, isLoading: false });
    }
  };

  const printPosInvoiceForClient = useReactToPrint({
    content: () => posPrintClientRef.current,
    documentTitle: `Receipt_${formData.name}_${new Date("en-US", {
      timeZone: "Asia/Dhaka",
    }).toLocaleString()}`,
    onBeforePrint: () => toast.success("Generating Invoice"),
    onAfterPrint: () => toast.success("Invoice Printed"),
  });

  const printPosInvoiceForManager = useReactToPrint({
    content: () => posPrintManagerRef.current,
    documentTitle: `Receipt_${formData.name}_${new Date("en-US", {
      timeZone: "Asia/Dhaka",
    }).toLocaleString()}`,
    onBeforePrint: () => toast.success("Generating Invoice"),
    onAfterPrint: () => toast.success("Invoice Printed"),
  });

  return (
    <Modal
      isOpen={show}
      onRequestClose={closeModal}
      style={customStyles}
      className=""
    >
      {/* Close Button */}
      <FaTimes
        onClick={closeModal}
        className="absolute top-4 right-4 text-2xl cursor-pointer bg-white text-gray-600 rounded-full p-1 duration-300 active:scale-90"
      />

      {/* Header */}
      <p className="text-center font-semibold text-slate-100 underline py-3">
        Room Pre-Booking
      </p>

      {/* Room Details */}
      <div className="flex items-center justify-between">
        <div className="text-white flex-1 text-sm p-4 bg-gray-800 rounded-md mx-4">
          <p>
            <strong>Room Name:</strong>{" "}
            {convertCamelCaseToCapitalized(data.roomName)}
          </p>
          <p>
            <strong>Floor:</strong> {data.roomFloor}
          </p>
          <p>
            <strong>Building:</strong> {data.roomBuilding}
          </p>
          <p>
            <strong>Bed No:</strong> {convertCamelCaseToCapitalized(data.bedNo)}
          </p>
        </div>
        <div className="flex-1 text-white flex items-center justify-center gap-2 cursor-pointer">
          <label className="cursor-pointer" htmlFor="apcb">
            Advance Paid:
          </label>
          <input
            checked={formData.isPaid}
            className="cursor-pointer scale-150"
            type="checkbox"
            name="isPaid"
            id="apcb"
            onChange={(e) =>
              setFormData({ ...formData, isPaid: e.target.checked })
            }
          />
        </div>
      </div>

      {/* POS  */}
      {formData.isPaid && (
        <div className="ml-2 mt-4 flex items-center justify-center gap-4">
          <div className="flex flex-col items-center justify-center gap-3">
            <button
              onClick={printPosInvoiceForClient}
              // disabled={!invoiceName || !invoiceNumber || billLoading}
              className="px-10 py-1 rounded-md duration-300 active:scale-90 hover:scale-105 bg-blue-500 text-white font-semibold mx-auto mt-5 block"
            >
              Print POS Invoice for Client
            </button>

            <div className="w-[220px]" ref={posPrintClientRef}>
              <InvoicePOS
                officeCopy={false}
                invoiceName={formData.name}
                invoiceNumber={formData.number}
                transactionDate={new Date("en-US", {
                  timeZone: "Asia/Dhaka",
                }).toLocaleString()}
                transactionId={formData.transactionId}
                invoiceData={[
                  {
                    name: `Advance Rent - ${formData.checkinMonth}`,
                    value: formData.advanceAmount,
                  },
                ]}
                methode="cash"
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3">
            <button
              onClick={printPosInvoiceForManager}
              // disabled={!invoiceName || !invoiceNumber || billLoading}
              className="px-10 py-1 rounded-md duration-300 active:scale-90 hover:scale-105 bg-blue-500 text-white font-semibold mx-auto mt-5 block"
            >
              Print POS Invoice for Manager
            </button>

            <div className="w-[220px]" ref={posPrintManagerRef}>
              <InvoicePOS
                officeCopy={true}
                invoiceName={formData.name}
                invoiceNumber={formData.number}
                transactionDate={new Date("en-US", {
                  timeZone: "Asia/Dhaka",
                }).toLocaleString()}
                transactionId={formData.transactionId}
                invoiceData={[
                  {
                    name: `Advance Rent - ${formData.checkinMonth}`,
                    value: formData.advanceAmount,
                  },
                ]}
                methode="cash"
              />
            </div>
          </div>
        </div>
      )}

      {/* Booking Form */}
      <div className="p-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Client Name"
          className="w-full p-2 my-2 rounded-md bg-gray-700 text-white outline-none"
        />

        <input
          type="text"
          name="number"
          value={formData.number}
          onChange={handleChange}
          placeholder="Client Number"
          className="w-full p-2 my-2 rounded-md bg-gray-700 text-white outline-none"
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Client Email"
          className="w-full p-2 my-2 rounded-md bg-gray-700 text-white outline-none"
        />

        <select
          name="checkinMonth"
          value={formData.checkinMonth}
          onChange={handleChange}
          className="w-full p-2 my-2 rounded-md bg-gray-700 text-white outline-none"
        >
          <option value="">Select Check-in Month</option>
          {months.map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="advanceAmount"
          value={formData.advanceAmount}
          onChange={handleChange}
          placeholder="Advance Amount"
          className="w-full p-2 my-2 rounded-md bg-gray-700 text-white outline-none"
        />

        {/* Submit Button */}
        {(!formData.isPaid || (formData.transactionId && formData.isPaid)) && (
          <button
            onClick={handleSubmit}
            disabled={formData.isLoading}
            className="w-full p-2 my-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-1"
          >
            Submit Booking
            {formData.isLoading && (
              <CgSpinner className="animate-spin text-xl" />
            )}
          </button>
        )}
      </div>
    </Modal>
  );
};

export default BookingComponent;
