"use client";

import BlockMsg from "@/Components/BlockMsg/BlockMsg";
import DateRangeMealOrder from "@/Components/DateRangeMealOrder/DateRangeMealOrder";
import MealRequest from "@/Components/MealRequest/MealRequest";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { AuthContext } from "@/providers/ContextProvider";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaArrowRight } from "react-icons/fa";
import { LuCalendarPlus } from "react-icons/lu";
import { io } from "socket.io-client";
import "../globals.css";

const Order = () => {
  const route = useRouter();
  const { user } = useContext(AuthContext);
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);
  const [isGuestMeal, setIsGuestMeal] = useState(false);
  const [guestMealBreakfastCount, setGuestMealBreakfastCount] = useState(0);
  const [guestMealLunchCount, setGuestMealLunchCount] = useState(0);
  const [guestMealDinnerCount, setGuestMealDinnerCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [order, setOrder] = useState(null);

  const [requestPopUp, setRequestPopUp] = useState(false);
  const [requestPopUp2, setRequestPopUp2] = useState(false);

  const currentMonthNumber =
    parseInt(
      new Date().toLocaleDateString("en-BD", {
        month: "numeric",
        timeZone: "Asia/Dhaka",
      })
    ) - 1;
  const currentMonth = new Date().toLocaleDateString("en-BD", {
    month: "long",
    timeZone: "Asia/Dhaka",
  });

  const nextMonth = new Date(
    new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      })
    ).getFullYear(),
    new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      })
    ).getMonth() + 1,
    1
  ).toLocaleDateString("en-BD", {
    month: "long",
    timeZone: "Asia/Dhaka",
  });

  const currentDate = parseInt(
    new Date().toLocaleDateString("en-BD", {
      day: "numeric",
      timeZone: "Asia/Dhaka",
    })
  );
  const currentYear = parseInt(
    new Date().toLocaleDateString("en-BD", {
      year: "numeric",
      timeZone: "Asia/Dhaka",
    })
  );
  const lastDateOfCurrentMonth = parseInt(
    new Date(
      new Date(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Dhaka",
        })
      ).getFullYear(),
      new Date(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Dhaka",
        })
      ).getMonth() + 1,
      0
    ).getDate()
  );

  const dateSelected = async (selectedDate) => {
    if (
      moment(new Date(selectedDate).toISOString()).isSame(
        moment(new Date(currentYear, currentMonthNumber, currentDate)),
        "day"
      ) &&
      new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
      ).getHours() < 15
      // new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Dhaka"})).getMinutes()
    ) {
      setLoading(true);
      try {
        setDate(selectedDate);
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
          setOrder(null);
          setOrder(data.order);
          setBreakfast(data.order.breakfast);
          setLunch(data.order.lunch);
          setDinner(data.order.dinner);
          setIsGuestMeal(data.order.isGuestMeal);
          setGuestMealBreakfastCount(data.order.guestBreakfastCount);
          setGuestMealLunchCount(data.order.guestLunchCount);
          setGuestMealDinnerCount(data.order.guestDinnerCount);
          toast.success("Day selected");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
        setDate(null);
        setOrder(null);
      } finally {
        setLoading(false);
      }
      return;
    } else if (
      moment(new Date(selectedDate).toISOString()).isSameOrBefore(
        moment(new Date(currentYear, currentMonthNumber, currentDate)),
        "day"
      )
    ) {
      setDate(null);
      setOrder(null);
      toast.error("Today or Past Date cann't be selected");
      return;
    } else if (
      new Date(selectedDate).toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      }) === nextMonth &&
      currentDate !== lastDateOfCurrentMonth
    ) {
      setDate(null);
      setOrder(null);
      toast.error("Wait till last day of this month!");
      return;
    } else if (
      //!-------------------------------------------------
      new Date(selectedDate).toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      }) === currentMonth ||
      (new Date(selectedDate).toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      }) === nextMonth &&
        currentDate == lastDateOfCurrentMonth)
    ) {
      setLoading(true);
      try {
        setDate(selectedDate);
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
          setOrder(null);
          setOrder(data.order);
          setBreakfast(data.order.breakfast);
          setLunch(data.order.lunch);
          setDinner(data.order.dinner);
          setIsGuestMeal(data.order.isGuestMeal);
          setGuestMealBreakfastCount(data.order.guestBreakfastCount);
          setGuestMealLunchCount(data.order.guestLunchCount);
          setGuestMealDinnerCount(data.order.guestDinnerCount);
          toast.success("Day selected");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
        setDate(null);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    } else {
      setDate(null);
      toast.error("Can't go so far!");
    }
  };
  // Socket Configuration
  const socket = useRef();
  useEffect(() => {
    socket.current = io("wss://the-crown-socket-server.glitch.me");
  }, []);

  if (!user) return <PreLoader />;
  if (user?.success == false) return route.push("/signin");
  if (user.blockDate && moment(user.blockDate).isBefore(moment.now()))
    return <BlockMsg />;

  return (
    <div className="relative bg-dashboard text-white min-h-screen">
      {/*//! Request Pop Up Starts */}
      <MealRequest
        requestPopUp={requestPopUp}
        setRequestPopUp={setRequestPopUp}
        currentMonth={currentMonth}
        currentYear={currentYear}
        user={user}
      />
      <DateRangeMealOrder
        requestPopUp={requestPopUp2}
        setRequestPopUp={setRequestPopUp2}
        currentDate={currentDate}
        currentMonth={currentMonth}
        currentMonthNumber={currentMonthNumber}
        currentYear={currentYear}
        user={user}
        socket={socket}
      />
      {/*//! Request Pop Up Ends */}
      {loading && (
        <div className="absolute h-full w-full top-0 bg-[rgba(0,0,0,0.6)] z-50"></div>
      )}
      <p className="text-2xl text-white bg-sky-500 px-8 py-3 font-bold text-center mb-5 relative">
        Order your meal here
        {loading && (
          <CgSpinner className="animate-spin absolute top-[10px] right-2 text-4xl" />
        )}
      </p>
      {user.role === "client" && user.isVerified && user.isClientVerified && (
        <>
          {/* Date Picker  */}
          <div className="my-20 flex flex-col md:flex-row justify-center items-center gap-10">
            <p className="text-xl font-semibold tracking-widest">
              Select Date:
            </p>
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
            <div className="space-y-4 text-lg">
              <p
                onClick={() => setRequestPopUp2(true)}
                className="font-semibold text-green-500 underline flex items-center gap-1 group cursor-pointer"
              >
                Date Range Order
                <FaArrowRight className="text-xl duration-300 group-hover:translate-x-2" />
              </p>
              <p
                onClick={() => setRequestPopUp(true)}
                className="font-semibold text-blue-500 underline flex items-center gap-1 group cursor-pointer"
              >
                Request Meal Change
                <FaArrowRight className="text-xl duration-300 group-hover:translate-x-2" />
              </p>
            </div>
          </div>
          {/* Meal Switch  */}
          <div className="grid grid-cols-1 md:grid-cols-3 align-middle gap-10 md:gap-4 px-10 md:px-20">
            {order && (
              <>
                {/* Breakfast   */}
                <div
                  className={`duration-700 transition-all ease-in-out flex items-center justify-between gap-8 border border-red-500 py-5 px-12 md:px-20 rounded-xl ${
                    breakfast ? "shadow-2xl shadow-red-500" : ""
                  }`}
                >
                  <p className="text-2xl font-semibold w-[150px]">Breakfast:</p>
                  <label class="inline-flex items-center me-5 cursor-pointer">
                    <input
                      onClick={async () => {
                        if (moment(date).isSame(moment(new Date()), "day")) {
                          toast.error("Today's Brakefast cann't be edited");
                          return;
                        }
                        setLoading(true);
                        const { data } = await axios.patch(
                          "/api/orders/updateorder",
                          {
                            meal: "breakfast",
                            state: !breakfast,
                            id: order._id,
                          }
                        );
                        if (data.success) {
                          setLoading(false);
                          console.log(!breakfast);
                          setBreakfast(!breakfast);
                          toast.success("Order placed");
                          // Socket Action
                          socket.current.emit("meal-rate-refetch", {
                            email: user.email,
                            meal: "Breakfast",
                            msg: "Meal Rate should be Refetched",
                          });
                        } else {
                          toast.error("Something went wrong!");
                        }
                      }}
                      type="checkbox"
                      value=""
                      class={`sr-only ${breakfast ? "peer" : ""}`}
                      checked
                    />
                    <div class="duration-700 transition-all ease-in-out relative w-20 h-8 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-[170%] rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                  </label>
                </div>
                {/* Lunch   */}
                <div
                  className={`duration-700 transition-all ease-in-out flex items-center justify-between gap-8 border border-green-500 py-5 px-12 md:px-20 rounded-xl ${
                    lunch ? "shadow-2xl shadow-green-500" : ""
                  }`}
                >
                  <p className="text-2xl font-semibold w-[150px]">Lunch:</p>
                  <label class="inline-flex items-center me-5 cursor-pointer">
                    <input
                      onClick={async () => {
                        if (moment(date).isSame(moment(new Date()), "day")) {
                          toast.error("Today's Lunch cann't be edited");
                          return;
                        }
                        setLoading(true);
                        const { data } = await axios.patch(
                          "/api/orders/updateorder",
                          { meal: "lunch", state: !lunch, id: order._id }
                        );
                        if (data.success) {
                          setLoading(false);
                          console.log(!lunch);
                          setLunch(!lunch);
                          toast.success("Order placed");
                          // Socket Action
                          socket.current.emit("meal-rate-refetch", {
                            email: user.email,
                            meal: "Lunch",
                            msg: "Meal Rate should be Refetched",
                          });
                        } else {
                          toast.error("Something went wrong!");
                        }
                      }}
                      type="checkbox"
                      value=""
                      class={`sr-only ${lunch ? "peer" : ""}`}
                      checked
                    />
                    <div class="duration-700 transition-all ease-in-out relative w-20 h-8 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-[170%] rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                  </label>
                </div>
                {/* Dinner   */}
                <div
                  className={`duration-700 transition-all ease-in-out flex items-center justify-between gap-8 border border-blue-500 py-5 px-12 md:px-20 rounded-xl ${
                    dinner ? "shadow-2xl shadow-blue-500" : ""
                  }`}
                >
                  <p className="text-2xl font-semibold w-[150px]">Dinner:</p>
                  <label class="inline-flex items-center me-5 cursor-pointer">
                    <input
                      onClick={async () => {
                        setLoading(true);
                        const { data } = await axios.patch(
                          "/api/orders/updateorder",
                          { meal: "dinner", state: !dinner, id: order._id }
                        );
                        if (data.success) {
                          setLoading(false);
                          console.log(!dinner);
                          setDinner(!dinner);
                          toast.success("Order placed");
                          // Socket Action
                          socket.current.emit("meal-rate-refetch", {
                            email: user.email,
                            meal: "Dinner",
                            msg: "Meal Rate should be Refetched",
                          });
                        } else {
                          toast.error("Something went wrong!");
                        }
                      }}
                      type="checkbox"
                      value=""
                      class={`sr-only ${dinner ? "peer" : ""}`}
                      checked
                    />
                    <div class="duration-700 transition-all ease-in-out relative w-20 h-8 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-[170%] rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                  </label>
                </div>
                <div className="my-20">
                  <div className="flex items-center gap-3">
                    <p>Guest Meal</p>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        onClick={async () => {
                          if (moment(date).isSame(moment(new Date()), "day")) {
                            toast.error("Today's Guest meal cann't be edited");
                            return;
                          }
                          if (isGuestMeal) {
                            setLoading(true);
                            const { data } = await axios.patch(
                              "/api/orders/updateorder",
                              {
                                meal: "guest",
                                state: false,
                                id: order._id,
                              }
                            );
                            if (data.success) {
                              setGuestMealBreakfastCount(0);
                              setGuestMealLunchCount(0);
                              setGuestMealDinnerCount(0);
                              setIsGuestMeal(false);
                              setLoading(false);
                              toast.success("Guest Meal turned off");
                            } else {
                              toast.error("Something went wrong!");
                              setLoading(false);
                            }
                          }
                          setIsGuestMeal(!isGuestMeal);
                        }}
                        type="checkbox"
                        value=""
                        className={`sr-only ${isGuestMeal ? "peer" : ""}`}
                        checked
                      />
                      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  {isGuestMeal && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const guestMealBreakfastCount =
                          e.target.guestMealBreakfastCount.value;
                        const guestMealLunchCount =
                          e.target.guestMealLunchCount.value;
                        const guestMealDinnerCount =
                          e.target.guestMealDinnerCount.value;

                        if (
                          guestMealBreakfastCount == 0 &&
                          guestMealLunchCount == 0 &&
                          guestMealDinnerCount == 0
                        ) {
                          return;
                        }
                        setLoading(true);
                        const { data } = await axios.patch(
                          "/api/orders/updateorder",
                          {
                            meal: "guest",
                            state: isGuestMeal,
                            id: order._id,
                            guestBreakfastCount: guestMealBreakfastCount,
                            guestLunchCount: guestMealLunchCount,
                            guestDinnerCount: guestMealDinnerCount,
                          }
                        );
                        if (data.success) {
                          setLoading(false);
                          toast.success("Guest Meal Updated");
                        } else {
                          toast.error("Something went wrong!");
                          setLoading(false);
                        }
                      }}
                      className="my-10 flex flex-col md:flex-row items-center justify-around gap-6"
                    >
                      <div className="flex items-center gap-3">
                        <p className="min-w-[100px]">Breakfast:</p>
                        <input
                          min={0}
                          className="dark:bg-stone-800 dark:text-white bg-stone-300 w-[100px] px-3 py-2 rounded-md outline-none"
                          type="number"
                          onChange={(e) => {
                            if (
                              moment(date).isSame(moment(new Date()), "day")
                            ) {
                              toast.error(
                                "Today's Guest-Breakfast cann't be edited"
                              );
                              return;
                            }

                            setGuestMealBreakfastCount(e.target.value);
                          }}
                          value={guestMealBreakfastCount}
                          name="guestMealBreakfastCount"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="min-w-[100px]">Lunch:</p>
                        <input
                          min={0}
                          className="dark:bg-stone-800 dark:text-white bg-stone-300 w-[100px] px-3 py-2 rounded-md outline-none"
                          type="number"
                          onChange={(e) => {
                            if (
                              moment(date).isSame(moment(new Date()), "day")
                            ) {
                              toast.error(
                                "Today's Guest-Lunch cann't be edited"
                              );
                              return;
                            }
                            setGuestMealLunchCount(e.target.value);
                          }}
                          value={guestMealLunchCount}
                          name="guestMealLunchCount"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="min-w-[100px]">Dinner:</p>
                        <input
                          min={0}
                          className="dark:bg-stone-800 dark:text-white bg-stone-300 w-[100px] px-3 py-2 rounded-md outline-none"
                          type="number"
                          onChange={(e) =>
                            setGuestMealDinnerCount(e.target.value)
                          }
                          value={guestMealDinnerCount}
                          name="guestMealDinnerCount"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-sky-500 px-3 py-1 rounded-md duration-300 active:scale-90"
                      >
                        {order.isGuestMeal ? "Update" : "Save"}
                      </button>
                    </form>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Order;
