"use server";
import Invoice from "@/Components/Invoice/Invoice";
import Invoice_Download from "@/Components/Invoice/Invoice_Download";
import { dbConfig } from "@/dbConfig/dbConfig";
import Transaction from "@/models/transactionModel";
import User from "@/models/userModel";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import mongoose from "mongoose";
import Image from "next/image";

await dbConfig();

const qr = async ({ params }) => {
  const { transactionId } = params;
  const transaction = await Transaction.findOne({
    $or: [
      { transactionId: transactionId },
      { bKashTransactionId: transactionId },
    ],
  });
  if (!transaction)
    return (
      <div className="min-h-[90vh] bg-dashboard text-stone-300 flex items-center justify-center py-4">
        <p>No Transaction Found</p>
      </div>
    );
  let user;
  if (
    transaction?.userId &&
    mongoose.Types.ObjectId.isValid(transaction?.userId)
  )
    user = await User.findById(transaction?.userId);
  return (
    <div className="min-h-[90vh] text-sm md:text-base bg-dashboard text-stone-300 flex md:items-center items-start justify-center pt-8 md:pt-4 py-4">
      <div
        id="invoice__thecrownboyshostel"
        className="bg-white w-[95%] md:w-[40%] shadow-md rounded-md md:p-4 p-2 text-gray-500"
      >
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
          User Copy
        </p>
        <div className="flex items-start justify-between my-4">
          <div className="">
            <p className="w-max">
              Customer Name:
              <span className="font-semibold ml-2">
                {user?.username || transaction.userId}
              </span>
            </p>

            <p className="w-max">
              Phone No:{" "}
              <span className="font-semibold ml-2">
                {user?.contactNumber || transaction.billId}
              </span>
            </p>

            <p className="w-max">
              Date:{" "}
              <span className="font-semibold ml-2">
                {transaction?.transactionDate}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">
              {convertCamelCaseToCapitalized(transaction?.method || "Cash")}
            </p>
            <p className="w-max">
              Trnx ID:{" "}
              <span className="font-semibold ml-2">{transactionId}</span>
            </p>
          </div>
        </div>
        <div className="w-full text-left">
          <div className="">
            {transaction?.payments?.map((item, i) => (
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
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="">
            <p className="font-bold">
              Charge 1%
              <span className="ml-5">
                {parseFloat(
                  transaction?.payments?.reduce((a, c) => a + c.value, 0) * 0.01
                ).toFixed(2)}
                /- BDT
              </span>
            </p>
            {transaction?.method == "bkash" || (
              <p className="font-bold">
                Discount
                <span className="ml-5">
                  -{" "}
                  {parseFloat(
                    transaction?.payments?.reduce((a, c) => a + c.value, 0) *
                      0.01
                  ).toFixed(2)}
                  /- BDT
                </span>
              </p>
            )}

            <p className="font-bold">
              Grand Total{" "}
              <span className="ml-5 font-bold text-blue-500 text-base md:text-lg">
                {transaction?.method == "bkash"
                  ? transaction?.payments?.reduce((a, c) => a + c.value, 0) +
                    transaction?.payments?.reduce((a, c) => a + c.value, 0) *
                      0.01
                  : transaction?.payments?.reduce((a, c) => a + c.value, 0)}
                /- BDT
              </span>
            </p>
          </div>
          <Image
            src="/images/paid.png"
            alt="This is an unauthirized Paid Seal"
            width="100"
            height="50"
            className="md:mr-10 p-1"
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
        </div>
        <p className="text-sm font-medium text-blue-500 text-center mt-6">
          Shaplar Mor, Kamarpara, Uttara-10, Dhaka, Bangladesh
        </p>
        <div className="text-[8px] md:text-[9px] font-medium flex items-center justify-evenly">
          <p className="w-max">T/D No.: TRAD/DNCC/003483/2024</p>
          <p className="w-max">TIN No.: 485681855868</p>
          <p className="w-max">M/S MIJAN ENTERPRISE</p>
        </div>
      </div>
      {/* <Invoice_Download /> */}
    </div>
  );
};

export default qr;
