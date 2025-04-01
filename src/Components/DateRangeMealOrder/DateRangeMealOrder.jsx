import axios from "axios";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import { LuCalendarPlus } from "react-icons/lu";
import Modal from "react-modal";
import { io } from "socket.io-client";

const DateRangeMealOrder = ({
  requestPopUp,
  setRequestPopUp,
  currentDate,
  currentMonth,
  nextMonth,
  currentMonthNumber,
  currentYear,
  user,
}) => {
  const [loading, setLoading] = useState(false);
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);
  const [breakfast, setBreakfast] = useState(0);
  const [lunch, setLunch] = useState(0);
  const [dinner, setDinner] = useState(0);

  // Socket Configuration
  const socket = useRef();
  useEffect(() => {
    socket.current = io("wss://the-crown-socket-server.glitch.me");
  }, []);

  const isLastDayOfCurrentMonthInBangladeshFn = () => {
    const today = new Date();
    today.setUTCHours(today.getUTCHours() + 6);
    const currentMonth = today.getUTCMonth();
    const currentYear = today.getUTCFullYear();
    const lastDayOfMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0));
    return {
      isLastDay:
        today.getUTCDate() === lastDayOfMonth.getUTCDate() &&
        today.getUTCMonth() === lastDayOfMonth.getUTCMonth() &&
        today.getUTCFullYear() === lastDayOfMonth.getUTCFullYear(),
    };
  };
  const isLastDayOfCurrentMonthInBangladesh =
    isLastDayOfCurrentMonthInBangladeshFn();

  const dateSelected1 = async (selectedDate) => {
    if (
      (new Date(selectedDate).toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      }) != currentMonth ||
        parseInt(
          new Date(selectedDate).toLocaleDateString("en-BD", {
            year: "numeric",
            timeZone: "Asia/Dhaka",
          })
        ) != currentYear) &&
      new Date(selectedDate).toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      }) != nextMonth
    ) {
      toast.error("Invalid Date Selection!");
      setDate1(null);
      return;
    } else if (
      !isLastDayOfCurrentMonthInBangladesh.isLastDay &&
      new Date(selectedDate).toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      }) == nextMonth
    ) {
      toast.error("Next month cann't be selected now!");
      setDate1(null);
      return;
    } else if (
      moment(new Date(selectedDate).toISOString()).isSameOrBefore(
        moment(new Date(currentYear, currentMonthNumber, currentDate)),
        "day"
      )
    ) {
      toast.error("Today or Past date cann't be selected!");
      setDate1(null);
      return;
    }
    setDate1(selectedDate);
    setDate2(null);
  };

  const dateSelected2 = async (selectedDate) => {
    if (!date1) {
      toast.error("Select 'From' date first!");
      setDate2(null);
      return;
    } else if (
      moment(new Date(selectedDate).toISOString()).isSameOrBefore(
        moment(new Date(date1)),
        "day"
      )
    ) {
      toast.error("'From' date should come first, then 'To' date");
      setDate2(null);
      return;
    } else if (
      (new Date(selectedDate).toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      }) !== currentMonth ||
        parseInt(
          new Date(selectedDate).toLocaleDateString("en-BD", {
            year: "numeric",
            timeZone: "Asia/Dhaka",
          })
        ) !== currentYear) &&
      new Date(selectedDate).toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      }) != nextMonth
    ) {
      toast.error("Invalid Date Selection!");
      setDate2(null);
      return;
    } else if (
      !isLastDayOfCurrentMonthInBangladesh.isLastDay &&
      new Date(selectedDate).toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      }) == nextMonth
    ) {
      toast.error("Next month cann't be selected now!");
      setDate2(null);
      return;
    }
    setDate2(selectedDate);
  };

  const saveOrder = async () => {
    if (breakfast === 0 && lunch === 0 && dinner === 0) {
      toast.error(
        "Give data about 'Breakfast' or 'Lunch' or 'Dinner' - Atleast one"
      );
      return;
    }
    setLoading(true);
    const data = {};
    if (breakfast !== 0) data.breakfast = breakfast === 1 ? true : false;
    if (lunch !== 0) data.lunch = lunch === 1 ? true : false;
    if (dinner !== 0) data.dinner = dinner === 1 ? true : false;
    const fromDate =
      new Date(date1).toLocaleDateString("en-US", {
        timeZone: "Asia/Dhaka",
        month: "numeric",
      }) +
      "/" +
      new Date(date1).toLocaleDateString("en-US", {
        timeZone: "Asia/Dhaka",
        day: "numeric",
      }) +
      "/" +
      new Date(date1).toLocaleDateString("en-US", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
      });

    const toDate =
      new Date(date2).toLocaleDateString("en-US", {
        timeZone: "Asia/Dhaka",
        month: "numeric",
      }) +
      "/" +
      new Date(date2).toLocaleDateString("en-US", {
        timeZone: "Asia/Dhaka",
        day: "numeric",
      }) +
      "/" +
      new Date(date2).toLocaleDateString("en-US", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
      });

    const fromDay = parseInt(fromDate.split("/")[1]);
    const toDay = parseInt(toDate.split("/")[1]);

    try {
      const { data: resData } = await axios.put("/api/orders/c", {
        data,
        userId: user._id,
        fromDate,
        toDate,
        fromDay,
        toDay,
      });
      if (resData.success) {
        setDate1(null);
        setDate2(null);
        setBreakfast(0);
        setLunch(0);
        setDinner(0);
        toast.success("Change successfull");
        socket.current.emit("meal-rate-refetch", {
          email: user.email,
          meal: "Many",
          msg: "Meal Rate should be Refetched",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.msg || error?.message || "Something went wrong"
      );
      setDate1(null);
      setDate2(null);
      setBreakfast(0);
      setLunch(0);
      setDinner(0);
    } finally {
      setLoading(false);
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
      zIndex: 500,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
  };
  const openModal = () => {
    setRequestPopUp(true);
  };

  const closeModal = () => {
    setRequestPopUp(false);
  };

  // if (!myMealRequests && requestPopUp) return <PreLoader />;
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
            setDate1(null);
            setDate2(null);
            setLoading(false);
            setBreakfast(0);
            setLunch(0);
            setDinner(0);
          }}
        />
        <div
          style={{ marginBottom: "40px" }}
          className="mt-10 md:mt-20  flex flex-col md:flex-row justify-center items-center gap-5 md:gap-10"
        >
          <p className="text-xl font-semibold tracking-widest">
            Select Date Range:
          </p>
          <DatePicker
            className={"meal_req_date_picker"}
            format="dd - MM - y"
            value={date1}
            calendarIcon={<LuCalendarPlus className="text-2xl" />}
            clearIcon={null}
            dayPlaceholder="--"
            monthPlaceholder="--"
            yearPlaceholder="----"
            onChange={(e) => dateSelected1(e)}
          />
          <p className="text-xl font-semibold tracking-widest">to</p>
          <DatePicker
            className={"meal_req_date_picker"}
            format="dd - MM - y"
            value={date2}
            calendarIcon={<LuCalendarPlus className="text-2xl" />}
            clearIcon={null}
            dayPlaceholder="--"
            monthPlaceholder="--"
            yearPlaceholder="----"
            onChange={(e) => dateSelected2(e)}
          />
        </div>
        {date1 && date2 && (
          <div className="flex flex-col items-center gap-6 md:mt-14 pb-10">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
                <p className="w-[100px] text-center">Breakfast:</p>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => {
                      // breakfast === 1 ? setBreakfast(0) : setBreakfast(1)
                      return toast.error("Breakfast is not Available");
                    }}
                    style={{ height: "50px" }}
                    className={`text-stone-300 font-medium w-[100px] rounded cursor-pointer duration-300 active:scale-90 ${
                      breakfast === 1 ? "bg-green-500" : "bg-stone-800"
                    }`}
                  >
                    On
                  </button>
                  <button
                    onClick={() =>
                      breakfast === -1 ? setBreakfast(0) : setBreakfast(-1)
                    }
                    style={{ height: "50px" }}
                    className={`text-stone-300 font-medium w-[100px] rounded cursor-pointer duration-300 active:scale-90 ${
                      breakfast === -1 ? "bg-red-500" : "bg-stone-800"
                    }`}
                  >
                    Off
                  </button>
                </div>
                <p>Click to turn &apos;On&apos; or &apos;Off&apos;</p>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
                <p className="w-[100px] text-center">Lunch:</p>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => (lunch === 1 ? setLunch(0) : setLunch(1))}
                    style={{ height: "50px" }}
                    className={`text-stone-300 font-medium w-[100px] rounded cursor-pointer duration-300 active:scale-90 ${
                      lunch === 1 ? "bg-green-500" : "bg-stone-800"
                    }`}
                  >
                    On
                  </button>
                  <button
                    onClick={() => (lunch === -1 ? setLunch(0) : setLunch(-1))}
                    style={{ height: "50px" }}
                    className={`text-stone-300 font-medium w-[100px] rounded cursor-pointer duration-300 active:scale-90 ${
                      lunch === -1 ? "bg-red-500" : "bg-stone-800"
                    }`}
                  >
                    Off
                  </button>
                </div>
                <p>Click to turn &apos;On&apos; or &apos;Off&apos;</p>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
                <p className="w-[100px] text-center">Dinner:</p>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => (dinner === 1 ? setDinner(0) : setDinner(1))}
                    style={{ height: "50px" }}
                    className={`text-stone-300 font-medium w-[100px] rounded cursor-pointer duration-300 active:scale-90 ${
                      dinner === 1 ? "bg-green-500" : "bg-stone-800"
                    }`}
                  >
                    On
                  </button>
                  <button
                    onClick={() =>
                      dinner === -1 ? setDinner(0) : setDinner(-1)
                    }
                    style={{ height: "50px" }}
                    className={`text-stone-300 font-medium w-[100px] rounded cursor-pointer duration-300 active:scale-90 ${
                      dinner === -1 ? "bg-red-500" : "bg-stone-800"
                    }`}
                  >
                    Off
                  </button>
                </div>
                <p>Click to turn &apos;On&apos; or &apos;Off&apos;</p>
              </div>
            </div>
            <button
              onClick={saveOrder}
              className="text-white bg-blue-500 px-3 py-1 rounded-sm duration-300 active:scale-90 flex items-center gap-2"
            >
              Save
              {loading && <CgSpinner className="text-xl animate-spin" />}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DateRangeMealOrder;
