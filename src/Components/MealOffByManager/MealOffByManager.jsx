import axios from "axios";
import { useState } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import { LuCalendarPlus } from "react-icons/lu";
import Modal from "react-modal";

const MealOffByManager = ({
  mealOffPopUp,
  setMealOffPopUp,
  currentMonth,
  currentYear,
  user,
}) => {
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
    setMealOffPopUp(true);
  };
  const closeModal = () => {
    setMealOffPopUp(false);
  };
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(null);
  const [reqData, setReqData] = useState({});
  const [isActing, setIsActing] = useState(false);
  const dateSelected = async (selectedDate) => {
    setReqData({});
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
    setDate(selectedDate);
  };
  const makeAction = async () => {
    setIsActing(true);
    const stringDate =
      new Date(date).toLocaleDateString("en-US", {
        timeZone: "Asia/Dhaka",
        month: "numeric",
      }) +
      "/" +
      new Date(date).toLocaleDateString("en-US", {
        timeZone: "Asia/Dhaka",
        day: "numeric",
      }) +
      "/" +
      new Date(date).toLocaleDateString("en-US", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
      });
    try {
      const { data } = await axios.put("/api/orders/mealOffbyDate", {
        reqData,
        date: stringDate,
        managerId: user._id,
      });
      if (data.success) toast.success("Meal state applied by date and data");
      else toast.error("Something went wrong 1");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong 2");
    } finally {
      setIsActing(false);
      setDate(null);
      setReqData({});
    }
  };
  return (
    <Modal
      isOpen={mealOffPopUp}
      onRequestClose={closeModal}
      style={customStylesForModal}
    >
      <div className="z-50">
        <FaTimes
          className="absolute top-3 right-3 text-2xl cursor-pointer"
          onClick={() => {
            setMealOffPopUp(false);
            setDate(null);
            setReqData({});
          }}
        />
        <div className="mt-10 md:mt-20 mb-10 md:mb-20 flex flex-col md:flex-row justify-center items-center gap-10">
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
        ) : (
          date && (
            <div className="flex flex-col items-center gap-6">
              <div className="px-20 flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="flex items-center gap-4">
                  <span>Breakfast:</span>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <p className="w-[30px]">On</p>
                      <input
                        onChange={() =>
                          setReqData({ ...reqData, breakfast: true })
                        }
                        type="radio"
                        name="bb"
                        id=""
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="w-[30px]">Off</p>
                      <input
                        onChange={() =>
                          setReqData({ ...reqData, breakfast: false })
                        }
                        type="radio"
                        name="bb"
                        id=""
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span>Lunch:</span>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <p className="w-[30px]">On</p>
                      <input
                        onChange={() => setReqData({ ...reqData, lunch: true })}
                        type="radio"
                        name="ll"
                        id=""
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="w-[30px]">Off</p>
                      <input
                        onChange={() =>
                          setReqData({ ...reqData, lunch: false })
                        }
                        type="radio"
                        name="ll"
                        id=""
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span>Dinner:</span>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <p className="w-[30px]">On</p>
                      <input
                        onChange={() =>
                          setReqData({ ...reqData, dinner: true })
                        }
                        type="radio"
                        name="dd"
                        id=""
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="w-[30px]">Off</p>
                      <input
                        onChange={() =>
                          setReqData({ ...reqData, dinner: false })
                        }
                        type="radio"
                        name="dd"
                        id=""
                      />
                    </div>
                  </div>
                </div>
              </div>
              {Object.keys(reqData).length != 0 && (
                <button
                  onClick={makeAction}
                  className="text-white bg-blue-500 px-3 py-1 rounded-sm duration-300 active:scale-90 flex items-center gap-2"
                >
                  Action
                  {isActing && <CgSpinner className="text-xl animate-spin" />}
                </button>
              )}
            </div>
          )
        )}
      </div>
    </Modal>
  );
};

export default MealOffByManager;
