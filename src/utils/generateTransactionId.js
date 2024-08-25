import crypto from "crypto";

export const generateTransactionId = async () => {
  try {
    let unique = false;
    let systemTransactionId = "";
    while (!unique) {
      systemTransactionId = transactionId();
      const existingTransaction = false;
      if (!existingTransaction) {
        unique = true;
      }
    }
    return systemTransactionId;
  } catch (error) {
    console.log(error);
    return "";
  }
};

const transactionId = () => {
  const randomChars = crypto.randomBytes(4).toString("hex");
  return randomChars.toUpperCase().toString();
};
