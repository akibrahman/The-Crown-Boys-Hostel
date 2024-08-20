"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import queryString from "query-string";

const Cameraa = () => {
  const route = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [bkashUrl, setBkashUrl] = useState("");
  const [sslUrl, setSslUrl] = useState("");
  const [modalUrl, setModalUrl] = useState("");
  const [message, setMessage] = useState("");

  function Message({ content }) {
    return <p className="text-green-500 font-semibold">{content}</p>;
  }

  useEffect(() => {
    if (bkashUrl) return route.push(bkashUrl);
    if (sslUrl) return route.push(sslUrl);
  }, [bkashUrl, sslUrl, route]);

  const handlePaymentBkash = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8888/pay/bkash",
        {
          amount: 1000,
          accountId: "66bafc30d23223a74e513ae1",
          currencyId: "66af6bf2a7b6c65c4417ac87",
          coupon: "coupon",
          reference: "reference",
        },
        {
          headers: {
            "user-id": "66b584e6c6d03eebbadb9ca6",
            "receiver-id": "66b77946f0e21ac0ff76c2d2",
            "pay-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZW5kZXJJZCI6IjY2YjU4NGU2YzZkMDNlZWJiYWRiOWNhNiIsInJlY2VpdmVyaWQiOiI2NmI3Nzk0NmYwZTIxYWMwZmY3NmMyZDIiLCJpYXQiOjE3MjM1MzU1MjUsImV4cCI6MTcyMzUzNTgyNX0.QAeK_VJhFuvMXpZ1OG_tX5fIbhfqqLQCtmWrLb9CCDU",
          },
        }
      );

      if (data.success) {
        setBkashUrl(data.bkashURL);
      } else {
        console.log(data);
        toast.error(data.msg || "Payment initiation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "An error occurred");
    }
  };

  const handlePaymentSSL = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8888/pay/ssl",
        {
          amount: 1000,
          accountId: "66bc0bf790f671e3407e4016",
          currencyId: "66af6bf2a7b6c65c4417ac87",
          coupon: "coupon",
          reference: "reference",
        },
        {
          headers: {
            "user-id": "66b584e6c6d03eebbadb9ca6",
            "receiver-id": "66b77946f0e21ac0ff76c2d2",
            "pay-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZW5kZXJJZCI6IjY2YjU4NGU2YzZkMDNlZWJiYWRiOWNhNiIsInJlY2VpdmVyaWQiOiI2NmI3Nzk0NmYwZTIxYWMwZmY3NmMyZDIiLCJpYXQiOjE3MjM2MDAyNjcsImV4cCI6MTcyMzYwMDU2N30.GfvhH3ulTXfLasbZ7ygItgVWciOYrmOAimBKSFHzE-A",
          },
        }
      );

      if (data.success) {
        setSslUrl(data.url);
      } else {
        console.log(data);
        toast.error(data.msg || "Payment initiation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "An error occurred");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSslUrl("");
    setBkashUrl("");
    setModalUrl("");
  };

  const [stripePayable, setStripePayable] = useState([false, ""]);
  const publicKey =
    "pk_test_51JNWijH1dNBPX31WHyMkGREzuI7a5wIDalHjqvWYvTSdBfk7EzNSQNAmttGKLbNSIQBDD9MX0TpTx2X2yZ3WvNKD00w1c5T0ry";
  const stripePromise = loadStripe(publicKey);

  const stripeOptions = {
    clientSecret: stripePayable[1],
    theme: "night",
    labels: "floating",
  };
  const stripePaymentData = {
    amount: 1000,
    accountId: "66c0c2372a7c4e5978cb1854",
    currencyId: "66c162529030e685220ff217",
    coupon: "coupon",
    reference: "reference",
    "user-id": "66b584e6c6d03eebbadb9ca6",
    "receiver-id": "66b77946f0e21ac0ff76c2d2",
    "pay-token":
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZW5kZXJJZCI6IjY2YjU4NGU2YzZkMDNlZWJiYWRiOWNhNiIsInJlY2VpdmVyaWQiOiI2NmI3Nzk0NmYwZTIxYWMwZmY3NmMyZDIiLCJpYXQiOjE3MjM1MzU1MjUsImV4cCI6MTcyMzUzNTgyNX0.QAeK_VJhFuvMXpZ1OG_tX5fIbhfqqLQCtmWrLb9CCDU",
  };

  const handlePaymentStripeInt = async () => {
    try {
      setIsStripeModalOpen(true);
      const { data } = await axios.post(
        "http://localhost:8888/pay/stripe",
        stripePaymentData,
        {
          headers: {
            "user-id": stripePaymentData["user-id"],
            "receiver-id": stripePaymentData["receiver-id"],
            "pay-token": stripePaymentData["pay-token"],
          },
        }
      );
      if (data.success) {
        const testUrl = "https://api.stripe.com/v1/elements/sessions";
        const testPublicKey = publicKey;
        const params = {
          key: testPublicKey,
          type: "payment_intent",
          locale: "en-US",
          client_secret: data.clientSecret,
        };
        try {
          const response = await axios.get(testUrl, { params });
          if (response.status === 401) {
            throw new Error("Invalid Stripe public key.");
          } else if (!response.status === 200) {
            throw new Error(`Error: ${response.statusText}`);
          }
        } catch (error) {
          throw new Error("Invalid Stripe public key.");
        }
        setStripePayable([true, data.clientSecret]);
      } else {
        setStripePayable([false, ""]);
        setIsStripeModalOpen(false);
        toast.error(data.msg || "Server Error");
      }
    } catch (error) {
      console.log(error);
      setIsStripeModalOpen(false);
      setStripePayable([false, ""]);
      toast.error(
        error?.response?.data?.msg || error?.message || "Server Error"
      );
    }
  };

  const payPalOptions = {
    "client-id":
      "AR_kFBnIhwv3ru5s5TvWV1r4FZ-ko3n9lqzcAi1lW52TwYDOzjTe1phArVQ7NMw6JSjGJZm5QrLRKuH6", // You will get it from Backend Response accounts
    currency: "USD", // By Default USD, If others, Uncomment and enter the currency
    "enable-funding": "paylater,venmo",
    "data-sdk-integration-source": "integrationbuilder_sc",
  };

  const handlePaymentPaypal1 = async () => {
    try {
      const { data: orderData } = await axios.post(
        "http://localhost:8888/pay/paypal",
        {
          amount: 0.99,
          accountId: "66c0c1b92a7c4e5978cb184a",
          currencyId: "66c162529030e685220ff217",
          coupon: "coupon",
          reference: "reference",
        },
        {
          headers: {
            "user-id": "66b584e6c6d03eebbadb9ca6",
            "receiver-id": "66b77946f0e21ac0ff76c2d2",
            "pay-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZW5kZXJJZCI6IjY2YjU4NGU2YzZkMDNlZWJiYWRiOWNhNiIsInJlY2VpdmVyaWQiOiI2NmI3Nzk0NmYwZTIxYWMwZmY3NmMyZDIiLCJpYXQiOjE3MjM5OTEyNjQsImV4cCI6MTcyMzk5MTU2NH0.yiTFykRpPLhydcGi2kxDoefJzU6qbGFKlYDp0xqphTs",
          },
        }
      );
      if (orderData.id) {
        return orderData.id;
      } else {
        if (orderData.success == false) throw new Error(orderData.msg);
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMsg =
        error?.response?.data?.msg || error?.msg || error?.message;
      toast.error(errorMsg);
      console.error(error);
      setMessage(`Could not initiate PayPal Checkout---${errorMsg}`);
    }
  };

  const handlePaymentPaypal2 = async (data, actions) => {
    try {
      const { data: orderData } = await axios.post(
        `http://localhost:8888/pay/paypal/exe?state=approve`,
        { orderId: data.orderID, accountId: "66c0c1b92a7c4e5978cb184a" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Three cases to handle:
      //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
      //   (2) Other non-recoverable errors -> Show a failure message
      //   (3) Successful transaction -> Show confirmation or thank you message

      const errorDetail = orderData?.details?.[0];

      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
        // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
        return actions.restart();
      } else if (errorDetail) {
        // (2) Other non-recoverable errors -> Show a failure message
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else {
        // (3) Successful transaction -> Show confirmation or thank you message
        // Or go to another URL:  actions.redirect('thank_you.html');
        const transaction = orderData.purchase_units[0].payments.captures[0];
        setMessage(
          `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
        );
        console.log(
          "Capture result",
          orderData,
          JSON.stringify(orderData, null, 2)
        );
      }
    } catch (error) {
      console.error(error);
      setMessage(`Sorry, your transaction could not be processed...${error}`);
    }
  };

  const handlePaymentPaypal3 = async (data, actions) => {
    try {
      await axios.post(
        `http://localhost:8888/pay/paypal/exe?state=cancel`,
        { orderId: data.orderID, accountId: "66c0c1b92a7c4e5978cb184a" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error(error);
      setMessage(`Sorry, your transaction could not be processed...${error}`);
    }
  };

  return (
    <>
      <IFrameModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        modalUrl={modalUrl}
      />
      <StripeModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
        stripePayable={stripePayable}
        stripePromise={stripePromise}
        stripeOptions={stripeOptions}
        stripePaymentData={stripePaymentData}
      />
      <div className="flex items-center justify-center gap-3 py-20">
        <div className="min-w-[200px] h-min p-0 m-0">
          <button
            onClick={handlePaymentBkash}
            className="bg-[url('https://i.ibb.co/qMW6rWw/bkash.png')] hover:scale-105 active:scale-90 duration-300 bg-no-repeat bg-center bg-[length:40%_65%] w-full h-[34px] border-pink-600 border rounded-full"
          ></button>
          <button
            onClick={handlePaymentSSL}
            className="bg-[url('https://i.ibb.co/nRLTmmZ/sss.png')] hover:scale-105 active:scale-90 duration-300 bg-no-repeat bg-center bg-contain w-full h-[34px] border-blue-600 border rounded-full"
          ></button>
          <button
            onClick={handlePaymentStripeInt}
            className="bg-[url('https://i.ibb.co/N9pWTGw/stripe.png')] hover:scale-105 active:scale-90 duration-300 bg-no-repeat bg-center bg-[length:40%_65%] w-full h-[34px] border-blue-600 border rounded-full"
          ></button>
          <PayPalScriptProvider options={payPalOptions}>
            <PayPalButtons
              className="hover:scale-105 active:scale-90 duration-300"
              style={{
                shape: "pill",
                layout: "vertical",
              }}
              fundingSource="paypal"
              createOrder={handlePaymentPaypal1}
              onApprove={handlePaymentPaypal2}
              onCancel={handlePaymentPaypal3}
            />
          </PayPalScriptProvider>
        </div>
      </div>

      <Message content={message} />
    </>
  );
};

export default Cameraa;

const StripeCheckout = ({ stripePaymentData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const handlePaymentStripe = async (e) => {
    e.preventDefault();
    try {
      if (!stripe || !elements) {
        return;
      }
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
        // redirect: "",
      });

      if (error) {
        console.error(error);
        toast.error(error.message);
      } else if (paymentIntent.status === "succeeded") {
        const query = queryString.stringify(stripePaymentData);
        const returnUrl = `http://localhost:8888/pay/stripe/exe?${query}`;
        toast.success("Payment succeeded!");
        console.log("PaymentIntent:", paymentIntent);
      } else {
        console.log("PaymentIntent status:", paymentIntent.status);
      }
    } catch (error) {
      console.log(error);
      toast.error("Wrong Credentials");
    }
  };
  return (
    <form onSubmit={handlePaymentStripe}>
      <PaymentElement />
      <button
        type="submit"
        className="bg-sky-500 text-white px-12 block py-1 rounded-full duration-300 active:scale-90 hover:scale-105 font-medium mt-5 mx-auto"
      >
        Pay
      </button>
    </form>
  );
};

const StripeModal = ({
  isOpen,
  onClose,
  stripePayable,
  stripeOptions,
  stripePromise,
  stripePaymentData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[500] bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Live Payment</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          {stripePayable[0] && (
            <div className="p-10">
              <Elements stripe={stripePromise} options={stripeOptions}>
                <StripeCheckout stripePaymentData={stripePaymentData} />
              </Elements>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const IFrameModal = ({ isOpen, onClose, modalUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Live Payment</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <iframe
            src={modalUrl}
            title="bKash Payment"
            className="w-full h-96"
          ></iframe>
        </div>
      </div>
    </div>
  );
};
