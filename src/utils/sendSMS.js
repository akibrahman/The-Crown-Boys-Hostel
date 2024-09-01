import fetch from "node-fetch";

export const sendSMS = async (number, message) => {
  try {
    const url = "http://bulksmsbd.net/api/smsapi";
    const smsData = {
      api_key: process.env.SMS_API_KEY,
      senderid: "8809617618230",
      number,
      message,
    };
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(smsData),
    });
  } catch (error) {
    console.log(error.message);
  }
};
