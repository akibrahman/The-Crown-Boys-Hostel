import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import { LuCalendarPlus } from "react-icons/lu";
import { TiTick } from "react-icons/ti";
import Modal from "react-modal";
import PreLoader from "../PreLoader/PreLoader";

const MealRequest = ({
  requestPopUp,
  setRequestPopUp,
  currentMonth,
  currentYear,
  user,
}) => {
  const [loading, setLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [date, setDate] = useState(null);
  const [order, setOrder] = useState(null);
  const [reason, setReason] = useState("");
  const [reqData, setReqData] = useState({});

  const { data: myMealRequests, refetch: myMealRequestsRefetch } = useQuery({
    queryKey: ["mealRequests", user?._id],
    queryFn: async ({ queryKey }) => {
      console.log(queryKey[1]);
      const { data } = await axios.get(
        `/api/mealrequests/mealrequests?id=${queryKey[1]}`
      );
      return data;
    },
    enabled: user && user._id ? true : false,
  });

  const dateSelected = async (selectedDate) => {
    if (
      new Date(selectedDate).toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      }) !== currentMonth ||
      parseInt(
        new Date(selectedDate).toLocaleDateString("en-BD", {
          year: "numeric",
          timeZone: "Asia/Dhaka",
        })
      ) !== currentYear
    ) {
      toast.error("Only current month can be selected!");
      setDate(null);
      return;
    }
    setLoading(true);
    setDate(selectedDate);
    try {
      const { data } = await axios.post("/api/orders/getorder", {
        date:
          new Date(selectedDate).toLocaleDateString("en-US", {
            timeZone: "Asia/Dhaka",
            month: "numeric",
          }) +
          "/" +
          new Date(selectedDate).toLocaleDateString("en-US", {
            timeZone: "Asia/Dhaka",
            day: "numeric",
          }) +
          "/" +
          new Date(selectedDate).toLocaleDateString("en-US", {
            timeZone: "Asia/Dhaka",
            year: "numeric",
          }),
        userId: user._id,
      });
      if (data.success) {
        if (data.order?.isRequested) {
          toast.error("Selected date is requested once!");
          setReqData({});
          setReason("");
          setDate(null);
          setOrder(null);
          setLoading(false);
          return;
        }
        console.log(data.order);
        setOrder(data.order);
      } else {
        throw new Error("Order not found");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong! Try again");
      setDate(null);
      setOrder(null);
    } finally {
      setReqData({});
      setReason("");
      setLoading(false);
    }
  };

  const makeRequest = async () => {
    setIsRequesting(true);
    try {
      const { data } = await axios.post("/api/mealrequests/mealrequests", {
        reqData,
        orderId: order._id,
        reason,
        userId: user._id,
      });
      if (data.success) {
        setReqData({});
        setReason("");
        setDate(null);
        setOrder(null);
        setLoading(false);
        toast.success("Request sent successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong! Try again");
    } finally {
      setIsRequesting(false);
      await myMealRequestsRefetch();
    }
  };
  const customStylesForModal = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "15px",
      backgroundColor: "#1C1917",
      color: "#fff",
      width: "90%",
      height: "90vh",
      // border: "1px solid #EAB308",
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.5)",
    },
  };
  const openModal = () => {
    setRequestPopUp(true);
  };

  const closeModal = () => {
    setRequestPopUp(false);
  };

  if (!myMealRequests) return <PreLoader />;
  return (
    <Modal
      isOpen={requestPopUp}
      onRequestClose={closeModal}
      style={customStylesForModal}
      // className={"w-[90%]"}
    >
      <div className="">
        <FaTimes
          style={{ top: "12px", right: "12px" }}
          className="absolute text-2xl cursor-pointer"
          onClick={() => {
            setRequestPopUp(false);
            setDate(null);
            setOrder(null);
          }}
        />
        <div
          style={{ marginBottom: "40px" }}
          className="mt-10 md:mt-20  flex flex-col md:flex-row justify-center items-center gap-10"
        >
          <p className="text-xl font-semibold tracking-widest">Select Date:</p>
          <DatePicker
            className={"meal_req_date_picker"}
            format="dd - MM - y"
            value={date}
            calendarIcon={<LuCalendarPlus className="text-2xl" />}
            clearIcon={null}
            dayPlaceholder="--"
            monthPlaceholder="--"
            yearPlaceholder="----"
            onChange={(e) => dateSelected(e)}
          />
        </div>
        {loading ? (
          <div className="flex items-center justify-center gap-1">
            Loading
            <CgSpinner className="text-xl animate-spin" />
          </div>
        ) : order ? (
          <div className="flex flex-col items-center gap-6">
            <div className="px-20 flex flex-col md:flex-row items-center justify-center gap-8">
              <p className="flex items-center gap-1">
                <label
                  onClick={() => {
                    if ("breakfast" in reqData) {
                      const temp = { ...reqData };
                      delete temp.breakfast;
                      setReqData(temp);
                    } else {
                      setReqData({ ...reqData, breakfast: true });
                    }
                  }}
                  class="checkbox path mr-1"
                >
                  <input type="checkbox" />
                  <svg viewBox="0 0 21 21">
                    <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                  </svg>
                </label>
                Breakfast:{" "}
                {order.breakfast ? (
                  <TiTick className="text-2xl text-green-500" />
                ) : (
                  <FaTimes className="text-xl text-red-500" />
                )}
              </p>
              <p className="flex items-center gap-1">
                <label
                  onClick={() => {
                    if ("lunch" in reqData) {
                      const temp = { ...reqData };
                      delete temp.lunch;
                      setReqData(temp);
                    } else {
                      setReqData({ ...reqData, lunch: true });
                    }
                  }}
                  class="checkbox path mr-1"
                >
                  <input type="checkbox" />
                  <svg viewBox="0 0 21 21">
                    <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                  </svg>
                </label>
                Lunch:{" "}
                {order.lunch ? (
                  <TiTick className="text-2xl text-green-500" />
                ) : (
                  <FaTimes className="text-xl text-red-500" />
                )}
              </p>
              <p className="flex items-center gap-1">
                <label
                  onClick={() => {
                    if ("dinner" in reqData) {
                      const temp = { ...reqData };
                      delete temp.dinner;
                      setReqData(temp);
                    } else {
                      setReqData({ ...reqData, dinner: true });
                    }
                  }}
                  class="checkbox path mr-1"
                >
                  <input type="checkbox" />
                  <svg viewBox="0 0 21 21">
                    <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"></path>
                  </svg>
                </label>
                Dinner:{" "}
                {order.dinner ? (
                  <TiTick className="text-2xl text-green-500" />
                ) : (
                  <FaTimes className="text-xl text-red-500" />
                )}
              </p>
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              name="reason"
              style={{
                padding: "12px",
                height: "150px",
                backgroundColor: "#57534E",
              }}
              className="outline-none rounded-sm w-[90%] md:w-[70%]"
              placeholder="Write your reason..."
            ></textarea>
            {(reqData?.breakfast == true ||
              reqData?.lunch == true ||
              reqData?.dinner == true) &&
              reason && (
                <button
                  onClick={makeRequest}
                  className="text-white bg-blue-500 px-3 py-1 rounded-sm duration-300 active:scale-90 flex items-center gap-2"
                >
                  Request
                  {isRequesting && (
                    <CgSpinner className="text-xl animate-spin" />
                  )}
                </button>
              )}
          </div>
        ) : (
          <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {myMealRequests.map((req) => (
              <div
                className={`bg-stone-800 rounded-md shadow-inner p-6 relative ${
                  !req.isResponded
                    ? "shadow-orange-500"
                    : req.isAccepted
                    ? "shadow-green-500"
                    : "shadow-red-500"
                }`}
                key={req._id}
              >
                {req.isResponded || (
                  <CgSpinner className="absolute top-4 right-4 animate-spin text-xl text-orange-500" />
                )}
                {req.isResponded && req.isAccepted && (
                  <TiTick className="absolute top-4 right-4 text-xl text-green-500" />
                )}
                {req.isResponded && req.isDeclined && (
                  <FaTimes className="absolute top-4 right-4 text-xl text-red-500" />
                )}
                <div className="flex gap-4 items-center mb-4">
                  <Image
                    src={req.user.profilePicture}
                    width={50}
                    height={50}
                    className="rounded-full"
                    alt="Profile p[ictur of the user"
                  />
                  <div className="">
                    <p>{req.user.username}</p>
                    <p>{req.user.studentId}</p>
                  </div>
                </div>
                <div className="">
                  <p>
                    Order Date: {req.order.date} - {req.order.month}
                  </p>
                  <p className="text-center mt-2">Request(s)</p>
                  {req?.breakfast && (
                    <div className="flex items-center gap-2">
                      <span>{req.breakfast && "Breakfast:"}</span>
                      <div className="flex items-center gap-1">
                        <span>{req.order.breakfast ? "On" : "Off"}</span>
                        <FaArrowRight />
                        <span>{!req.order.breakfast ? "On" : "Off"}</span>
                      </div>
                    </div>
                  )}
                  {req?.lunch && (
                    <div className="flex items-center gap-2">
                      <span>{req.lunch && "Lunch:"}</span>
                      <div className="flex items-center gap-1">
                        <span>{req.order.lunch ? "On" : "Off"}</span>
                        <FaArrowRight />
                        <span>{!req.order.lunch ? "On" : "Off"}</span>
                      </div>
                    </div>
                  )}
                  {req?.dinner && (
                    <div className="flex items-center gap-2">
                      <span>{req.dinner && "Dinner:"}</span>
                      <div className="flex items-center gap-1">
                        <span>{req.order.dinner ? "On" : "Off"}</span>
                        <FaArrowRight />
                        <span>{!req.order.dinner ? "On" : "Off"}</span>
                      </div>
                    </div>
                  )}
                  <p>
                    Status :{" "}
                    {req.isResponded === false
                      ? "Pending"
                      : req.isAccepted
                      ? "Accepted"
                      : "Declined"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default MealRequest;
