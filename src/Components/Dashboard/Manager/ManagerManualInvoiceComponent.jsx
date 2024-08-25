"use client";
import Image from "next/image";
import QRCode from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
import { useReactToPrint } from "react-to-print";

const ManagerManualInvoiceComponent = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "The Crwon Boys Hostel - Recipt",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
  });
  const [invoiceData, setInvoiceData] = useState([]);
  const [formName, setFormName] = useState("");
  const [formValue, setFormValue] = useState("");
  const addField = (e) => {
    e.preventDefault();
    if (!formName || !formValue || parseInt(formValue) <= 0) return;
    setInvoiceData([...invoiceData, { name: formName, value: formValue }]);
    setFormName("");
    setFormValue("");
  };
  const deleteField = (indexToDelete) => {
    setInvoiceData((prevInvoiceData) =>
      prevInvoiceData.filter((_, index) => index != indexToDelete)
    );
  };
  const transactionId = "DH8J95GJH";
  const [deviceType, setDeviceType] = useState("");
  useEffect(() => {
    const detectDeviceType = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (
        userAgent.includes("mobile") ||
        userAgent.includes("android") ||
        userAgent.includes("iphone") ||
        userAgent.includes("ipad")
      ) {
        setDeviceType("Mobile");
      } else {
        setDeviceType("Desktop");
      }
    };
    detectDeviceType();
  }, []);
  console.log(deviceType);
  return (
    <div className="min-h-full p-10 pt-5 bg-dashboard text-slate-100 relative">
      <p className="text-center font-semibold text-xl dark:text-white relative">
        Create Invoice - {deviceType}
      </p>
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
          className="px-10 py-1 rounded-md duration-300 active:scale-90 hover:scale-105 bg-blue-500 text-white font-semibold mx-auto mt-5 block"
        >
          Print Invoice
        </button>
      )}
      <div ref={componentRef} className="px-2 mt-5">
        <div className="flex items-center gap-2">
          {/* Owner Copy  */}
          <div className="bg-white shadow-md rounded-md p-4 text-gray-500">
            <div className="flex justify-center">
              <Image
                src="/images/logo.png"
                alt="Logo"
                className="h-16 w-20"
                height="54"
                width="54"
              />
            </div>
            <h2 className="text-xl font-bold text-center text-[#242424]">
              The Crown Boys Hostel
            </h2>
            <p className="text-center text-gray-500">M/S Mijan Enterprise</p>
            <p className="text-center text-gray-500 font-semibold underline">
              Office Copy
            </p>
            <div className="flex items-start justify-between my-4">
              <div className="">
                <p className="w-max">
                  Customer Name:
                  <span className="font-semibold ml-2">MD. Akib Rahman</span>
                </p>

                <p className="w-max">
                  Phone No:{" "}
                  <span className="font-semibold ml-2">01709-605097</span>
                </p>

                <p className="w-max">
                  Date:{" "}
                  <span className="font-semibold ml-2">
                    28th August 09:10:56 PM
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Cash</p>
                <p className="w-max">
                  Trnx ID:{" "}
                  <span className="font-semibold ml-2">{transactionId}</span>
                </p>
              </div>
            </div>
            <table className="w-full text-left">
              <tbody className="">
                {invoiceData.map((item, i) => (
                  <tr key={i} className={i % 2 == 0 ? "bg-gray-100" : ""}>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.value}/- BDT</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex items-center justify-between">
              <div className="">
                <p className="font-bold">
                  Tax 1%
                  <span className="ml-5">
                    {invoiceData.reduce((a, c) => a + c.value, 0) * 0.01}/- BDT
                  </span>
                </p>

                <p className="font-bold mt-">
                  Grand Total{" "}
                  <span className="ml-5 font-bold text-blue-500 text-lg">
                    {Math.ceil(
                      invoiceData.reduce((a, c) => a + c.value, 0) +
                        invoiceData.reduce((a, c) => a + c.value, 0) * 0.01
                    )}
                    /- BDT
                  </span>
                </p>
              </div>
              <Image
                src="/images/paid.png"
                alt="This is an unauthirized Paid Seal"
                width="100"
                height="50"
                className="mr-10 p-1"
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-justify leading-[20px]">
                1% GST application on total amount. Please note that this is non
                refundable amount. For any assistance please write an email on{" "}
                <span className="font-semibold text-blue-500">
                  admin@thecrownboyshostel.com
                </span>
              </p>
              <QRCode
                size={80}
                fgColor="#374151"
                bgColor="#ffffff"
                value={`https://thecrownboyshostel.com/qr/${transactionId}`}
              />
            </div>
            <p className="text-sm font-medium text-blue-500 text-center mt-6">
              Shaplar Mor, Kamarpara, Uttara-10, Dhaka, Bangladesh
            </p>
            <div className="text-[10px] font-medium flex items-center justify-evenly">
              <p>T/D No.: TRAD/DNCC/003483/2024</p>
              <p>TIN No.: 485681855868</p>
              <p>M/S MIJAN ENTERPRISE</p>
            </div>
          </div>
          {/* User Copy  */}
          <div className="bg-white shadow-md rounded-md p-4 text-gray-500">
            <div className="flex justify-center">
              <Image
                src="/images/logo.png"
                alt="Logo"
                className="h-16 w-20"
                height="54"
                width={54}
              />
            </div>
            <h2 className="text-xl font-bold text-center text-[#242424]">
              The Crown Boys Hostel
            </h2>
            <p className="text-center text-gray-500">M/S Mijan Enterprise</p>
            <p className="text-center text-gray-500 font-semibold underline">
              User Copy
            </p>
            <div className="flex items-start justify-between my-4">
              <div className="">
                <p className="w-max">
                  Customer Name:
                  <span className="font-semibold ml-2">MD. Akib Rahman</span>
                </p>

                <p className="w-max">
                  Phone No:{" "}
                  <span className="font-semibold ml-2">01709-605097</span>
                </p>

                <p className="w-max">
                  Date:{" "}
                  <span className="font-semibold ml-2">
                    28th August 09:10:56 PM
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Cash</p>
                <p className="w-max">
                  Trnx ID:{" "}
                  <span className="font-semibold ml-2">{transactionId}</span>
                </p>
              </div>
            </div>
            <table className="w-full text-left">
              <tbody className="">
                {invoiceData.map((item, i) => (
                  <tr key={i} className={i % 2 == 0 ? "bg-gray-100" : ""}>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.value}/- BDT</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex items-center justify-between">
              <div className="">
                <p className="font-bold">
                  Tax 1%
                  <span className="ml-5">
                    {invoiceData.reduce((a, c) => a + c.value, 0) * 0.01}/- BDT
                  </span>
                </p>

                <p className="font-bold mt-">
                  Grand Total{" "}
                  <span className="ml-5 font-bold text-blue-500 text-lg">
                    {Math.ceil(
                      invoiceData.reduce((a, c) => a + c.value, 0) +
                        invoiceData.reduce((a, c) => a + c.value, 0) * 0.01
                    )}
                    /- BDT
                  </span>
                </p>
              </div>
              <Image
                src="/images/paid.png"
                alt="This is an unauthirized Paid Seal"
                width="100"
                height="50"
                className="mr-10 p-1"
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-justify leading-[20px]">
                1% GST application on total amount. Please note that this is non
                refundable amount. For any assistance please write an email on{" "}
                <span className="font-semibold text-blue-500">
                  admin@thecrownboyshostel.com
                </span>
              </p>
              <QRCode
                size={80}
                fgColor="#374151"
                bgColor="#ffffff"
                value={`https://thecrownboyshostel.com/qr/${transactionId}`}
              />
            </div>
            <p className="text-sm font-medium text-blue-500 text-center mt-6">
              Shaplar Mor, Kamarpara, Uttara-10, Dhaka, Bangladesh
            </p>
            <div className="text-[10px] font-medium flex items-center justify-evenly">
              <p>T/D No.: TRAD/DNCC/003483/2024</p>
              <p>TIN No.: 485681855868</p>
              <p>M/S MIJAN ENTERPRiSE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerManualInvoiceComponent;
