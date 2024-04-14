import axios from "axios";
import { useState } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import { LuCalendarPlus } from "react-icons/lu";
import { TiTick } from "react-icons/ti";

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
        date: new Date(selectedDate).toLocaleDateString(),
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
    }
  };
  return (
    <div
      className={`w-full h-full fixed top-0 z-50 duration-300 transition-all ease-in-out ${
        requestPopUp
          ? "scale-100 bg-[rgba(0,0,0,0.7)]"
          : "scale-0 bg-transparent"
      }`}
    >
      <div className="w-[85%] md:w-[60%] h-[90%] md:h-[75%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-800 rounded-sm">
        <FaTimes
          className="absolute top-3 right-3 text-2xl cursor-pointer"
          onClick={() => {
            setRequestPopUp(false);
            setDate(null);
            setOrder(null);
          }}
        />
        <div className="my-20 flex flex-col md:flex-row justify-center items-center gap-10">
          <p className="text-xl font-semibold tracking-widest">Select Date:</p>
          <DatePicker
            className={""}
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
        ) : (
          order && (
            <div className="flex flex-col items-center gap-6">
              <div className="px-20 flex items-center justify-center gap-8">
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
                className="bg-stone-600 p-3 outline-none resize-none rounded-sm w-[90%] md:w-[70%] h-[150px]"
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
          )
        )}
      </div>
    </div>
  );
};

export default MealRequest;
