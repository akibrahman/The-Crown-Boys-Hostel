import axios from "axios";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { GiPayMoney } from "react-icons/gi";

const CalenderManager = ({
  user,
  setManagerAmount,
  managerAmount,
  currentMonth,
  managerCalanderData,
  isMoneyAdding,
  setIsMoneyAdding,
  managerCalanderDataRefetch,
}) => {
  return (
    user.role == "manager" &&
    user.isVerified &&
    user.isManagerVerified && (
      <div className="col-span-1 md:col-span-2 lg:col-span-3 md:pl-6 pb-8 mt-10">
        <p className="font-semibold border border-sky-500 rounded-sm px-4 py-2 relative flex items-center justify-around md:justify-around">
          <input
            placeholder="Enter Amount"
            onChange={(e) => setManagerAmount(parseInt(e.target.value))}
            value={managerAmount || managerAmount == 0 ? managerAmount : ""}
            className="w-[200px] px-5 py-1 outline-none rounded-full dark:bg-stone-800 bg-stone-300"
            type="number"
          />
          <span className="md:w-[300px]">{currentMonth}</span>
        </p>
        <div className="mt-6 flex items-center justify-center flex-wrap gap-4">
          {managerCalanderData?.data?.map((mrkt) => (
            <div
              key={mrkt._id}
              className="relative w-[110px] h-20 rounded-md bg-sky-500 flex items-center justify-center flex-col cursor-pointer after:h-0 after:w-full after:absolute after:bg-[rgba(0,0,0,0.5)] hover:after:h-full after:duration-300 transition-all group"
            >
              {!isMoneyAdding ? (
                <GiPayMoney
                  onClick={async () => {
                    if (managerAmount != null && managerAmount >= 0) {
                      setIsMoneyAdding(true);
                      await axios.put("/api/markets/updatemarket", {
                        id1: managerCalanderData._id,
                        id2: mrkt._id,
                        amount: managerAmount,
                      });
                      await managerCalanderDataRefetch();
                      setManagerAmount(null);
                      setIsMoneyAdding(false);
                      toast.success("Amount updated");
                    } else {
                      toast.error("Please enter amount");
                    }
                  }}
                  className="scale-0 group-hover:scale-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-500 bg-white z-10 text-[40px] p-1 rounded-md duration-300 transition-all active:scale-90"
                />
              ) : (
                <div className="bg-white z-10 hidden group-hover:block absolute rounded-md">
                  {" "}
                  <CgSpinner className="text-sky-500 text-[40px] p-1  duration-300 transition-all active:scale-90 group-hover:animate-spin" />
                </div>
              )}
              <span className="font-semibold bg-white text-sky-500 px-2 py-1 rounded-md mb-2 select-none">
                {" "}
                {mrkt.date.split("/")[1] +
                  "-" +
                  mrkt.date.split("/")[0] +
                  "-" +
                  mrkt.date.split("/")[2]}
              </span>

              <span className="select-none">{mrkt.amount} /-</span>
              {/* <span
                    className={`absolute w-2 h-2 rounded-full left-2 bottom-1.5 ${
                      order.breakfast ? "bg-green-600" : "bg-red-600"
                    }`}
                  ></span>
                  <span
                    className={`absolute w-2 h-2 rounded-full left-1/2 -translate-x-1/2 bottom-1.5 ${
                      order.lunch ? "bg-green-600" : "bg-red-600"
                    }`}
                  ></span>
                  <span
                    className={`absolute w-2 h-2 rounded-full right-2 bottom-1.5 ${
                      order.dinner ? "bg-green-600" : "bg-red-600"
                    }`}
                  ></span> */}
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default CalenderManager;
