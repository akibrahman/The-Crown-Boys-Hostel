"use client";
import Image from "next/image";
import QRCode from "qrcode.react";
import React from "react";

const Invoice = ({
  officeCopy,
  invoiceName,
  invoiceNumber,
  transactionDate,
  transactionId,
  invoiceData,
  methode,
}) => {
  return (
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
        {officeCopy ? "Office Copy" : "User Copy"}
      </p>
      <div className="flex items-start justify-between my-4">
        <div className="">
          <p className="w-max">
            Customer Name:
            <span className="font-semibold ml-2">{invoiceName}</span>
          </p>

          <p className="w-max">
            Phone No:{" "}
            <span className="font-semibold ml-2">{invoiceNumber}</span>
          </p>

          <p className="w-max">
            Date: <span className="font-semibold ml-2">{transactionDate}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Cash</p>
          <p className="w-max">
            Trnx ID: <span className="font-semibold ml-2">{transactionId}</span>
          </p>
        </div>
      </div>
      <table className="w-full text-left">
        <tbody className="">
          {invoiceData.map((item, i) => (
            <div
              key={i}
              className={`${
                i % 2 == 0 ? "bg-gray-100" : ""
              } flex items-center justify-between px-4`}
            >
              <p className="p-2">{item.name}</p>
              <p className="p-2">{item.value}/- BDT</p>
            </div>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-between">
        <div className="">
          <p className="font-bold">
            Tax 1%
            <span className="ml-5">
              {parseFloat(
                invoiceData.reduce((a, c) => a + c.value, 0) * 0.01
              ).toFixed(2)}
              /- BDT
            </span>
          </p>
          {methode == "cash" && (
            <p className="font-bold">
              Discount
              <span className="ml-5">
                -{" "}
                {parseFloat(
                  invoiceData.reduce((a, c) => a + c.value, 0) * 0.01
                ).toFixed(2)}
                /- BDT
              </span>
            </p>
          )}

          <p className="font-bold mt-">
            Grand Total{" "}
            <span className="ml-5 font-bold text-blue-500 text-lg">
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
      <div className="text-[9px] font-medium flex items-center justify-evenly">
        <p className="w-max">T/D No.: TRAD/DNCC/003483/2024</p>
        <p className="w-max">TIN No.: 485681855868</p>
        <p className="w-max">M/S MIJAN ENTERPRISE</p>
      </div>
    </div>
  );
};

export default Invoice;
