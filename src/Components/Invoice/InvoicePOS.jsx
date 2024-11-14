"use client";
import Image from "next/image";
import QRCode from "qrcode.react";
import React from "react";

const InvoicePOS = ({
  officeCopy,
  invoiceName,
  invoiceNumber,
  transactionDate,
  transactionId,
  invoiceData,
  methode,
}) => {
  return (
    <div className="bg-white shadow-md rounded-md p-4 text-gray-500 w-[220px]">
      <div className="flex justify-center mb-1">
        <Image
          src="/images/logo-black.png"
          alt="The Crown Boys Hostel Logo"
          className="h-16 w-20"
          height="54"
          width="54"
        />
      </div>
      <h2 className="text-[16px] font-bold text-center text-black">
        The Crown Boys Hostel
      </h2>
      <p className="text-xs text-center text-black font-semibold">
        M/S Mijan Enterprise
      </p>
      <p className="text-xs text-center text-black font-semibold">
        T/D No.: TRAD/DNCC/003483/2024
      </p>
      <p className="text-xs text-center text-black font-semibold underline">
        {officeCopy ? "Office Copy" : "User Copy"}
      </p>
      <div className="flex flex-col items-center justify-center my-3 text-xs font-semibold text-black">
        <p className="w-max">
          Customer Name:
          <span className="ml-2">{invoiceName}</span>
        </p>

        <p className="w-max">
          Phone No: <span className="ml-2">{invoiceNumber}</span>
        </p>

        <p className="w-max">
          Date: <span className="ml-2">{transactionDate}</span>
        </p>
        <p className="font-semibold">Cash</p>
        <p className="w-max">
          Trnx ID: <span className="font-semibold ml-2">{transactionId}</span>
        </p>
      </div>
      <table className="w-full text-left text-xs font-semibold text-black">
        <tbody className="">
          {invoiceData.map((item, i) => (
            <div
              key={i}
              className={`${
                i % 2 == 0 ? "" : ""
              } flex items-center justify-between px-1 border border-black`}
            >
              <p className="p-2">{item.name} :</p>
              <p className="p-2">{item.value}/- BDT</p>
            </div>
          ))}
        </tbody>
      </table>
      <div className="text-xs text-black font-semibold mt-2">
        <p className="text-center">
          Tax 1%
          <span className="ml-2">
            {parseFloat(
              invoiceData.reduce((a, c) => a + c.value, 0) * 0.01
            ).toFixed(2)}
            /- BDT
          </span>
        </p>
        {methode == "cash" && (
          <p className="text-center">
            Discount
            <span className="ml-2">
              -{" "}
              {parseFloat(
                invoiceData.reduce((a, c) => a + c.value, 0) * 0.01
              ).toFixed(2)}
              /- BDT
            </span>
          </p>
        )}

        <p className="text-lg text-center font-bold mt-2">
          Total{" "}
          <span className="mt-2">
            {methode == "cash"
              ? Math.ceil(invoiceData.reduce((a, c) => a + c.value, 0))
              : Math.ceil(
                  invoiceData.reduce((a, c) => a + c.value, 0) +
                    invoiceData.reduce((a, c) => a + c.value, 0) * 0.01
                )}
            /- BDT
          </span>
        </p>
      </div>
      <div className="mt-3 flex flex-col items-center justify-between gap-3">
        <p className="text-xs font-semibold text-black">
          1% GST application on total amount. Please note that this is non
          refundable amount. For any assistance please write an email on
          admin@thecrownboyshostel.com
        </p>
        <QRCode
          size={80}
          fgColor="#000000"
          bgColor="#ffffff"
          value={`https://thecrownboyshostel.com/qr/${transactionId}`}
        />
      </div>
      <p className="text-xs font-semibold text-black text-center mt-2">
        Shaplar Mor, Kamarpara, Uttara-10, Dhaka, Bangladesh
      </p>
      <div className="text-[4.5px] font-bold flex items-center justify-evenly mt-1">
        <p className="w-max">T/D No.: TRAD/DNCC/003483/2024</p>
        <p className="w-max">TIN No.: 485681855868</p>
        <p className="w-max">M/S MIJAN ENTERPRISE</p>
      </div>
    </div>
  );
};

export default InvoicePOS;
