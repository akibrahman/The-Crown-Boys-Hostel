import { NextResponse } from "next/server";
import axios from "axios";
import { dbConfig } from "@/dbConfig/dbConfig";
import Transaction from "@/models/transactionModel";
import Bill from "@/models/billModel";

await dbConfig();

export const GET = async (req) => {
  const redirectUrl = `${process.env.CLIENT_SIDE}/dashboard/my_bills`;
  try {
    let queries = [];
    const { searchParams } = new URL(req.url);
    searchParams.forEach((value, key) => {
      queries.push({ [key]: value });
    });
    const status = queries?.find((obj) => obj?.status)?.status;
    const paymentID = queries?.find((obj) => obj?.paymentID)?.paymentID;
    if (status == "cancel") {
      return NextResponse.redirect(
        redirectUrl +
          `?success=false&status=${status}&paymentID=${paymentID}&message=${encodeURIComponent(
            "Payment Cancelled"
          )}`
      );
    }
    if (status === "failure") {
      return NextResponse.redirect(
        redirectUrl +
          `?success=false&status=${status}&paymentID=${paymentID}&message=${encodeURIComponent(
            "Payment Failed"
          )}`
      );
    }
    const invoiceData = queries
      .filter((obj) => {
        const key = Object.keys(obj)[0];
        return key.endsWith("_crowninvoice");
      })
      .map((objj) => {
        const key = Object.keys(objj)[0];
        const newKey = key.replace("_crowninvoice", "");
        return { [newKey]: objj[key] };
      })
      .map((objjj) => ({
        name: Object.keys(objjj)[0],
        value: Object.values(objjj)[0],
      }));

    if (!queries?.find((obj) => obj?.paymentID)?.paymentID)
      throw new Error("paymentID Missing");

    const { data: executeData } = await axios.post(
      process.env.BKASH_EXECUTE_PAYMENT_URL,
      { paymentID: queries.find((obj) => obj.paymentID).paymentID },
      {
        headers: {
          Accept: "application/json",
          Authorization: queries?.find((obj) => obj?.id_token)?.id_token,
          "X-App-Key": process.env.BKASH_APP_KEY,
        },
      }
    );
    if (
      executeData?.transactionStatus != "Completed" ||
      executeData?.statusCode != "0000" ||
      executeData?.statusMessage != "Successful"
    ) {
      return NextResponse.redirect(
        redirectUrl +
          `?success=false&status=${executeData?.transactionStatus}&paymentID=${
            executeData.paymentID
          }&message=${encodeURIComponent(executeData?.statusMessage)}`
      );
    }
    const bill = await Bill.findById(queries.find((obj) => obj.billId).billId);
    await new Transaction({
      userId: bill.userId,
      billId: bill._id,
      note: "Online Payment From Bkash",
      reason: "payment",
      reference: executeData?.payerReference,
      transactionId: executeData.merchantInvoiceNumber,
      bKashTransactionId: executeData.trxID,
      transactionDate: new Date().toLocaleString(),
      method: "bkash",
      tax: parseFloat(
        invoiceData.reduce((a, c) => a + parseInt(c.value), 0) * 0.01
      ).toFixed(2),
      payments: invoiceData,
    }).save();
    if (invoiceData.some((obj) => obj.name.startsWith("Rent-"))) {
      bill.isRentPaid = true;
      await bill.save();
    }
    return NextResponse.redirect(
      redirectUrl +
        `?success=true&status=success&transactionId=${
          executeData.merchantInvoiceNumber
        }&trxId=${executeData.trxID}&amount=${invoiceData.reduce(
          (a, c) => a + parseInt(c.value),
          0
        )}&paymentID=${executeData.paymentID}`
    );
  } catch (error) {
    console.log("===========================>", error.message);
    return NextResponse.redirect(redirectUrl + `?success=false`);
  }
};
