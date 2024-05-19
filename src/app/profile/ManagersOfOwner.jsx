import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";

const ManagersOfOwner = ({
  user,
  managers,
  managersRefetch,
  givingAuthorization,
  setGivingAuthorization,
}) => {
  return (
    user.role === "owner" && (
      <div className="col-span-1 md:col-span-2 h-[380px] overflow-y-scroll px-3 flex flex-col items-center gap-4 mt-10 relative">
        <button
          onClick={async () => {
            const { data } = await axios.post(
              "/api/orders/testapi",
              { data: "OK" }
              // ,{
              //   headers: { Authorization: "Bearer 1234567890" },
              // }
            );
            if (data.success) {
              console.log(data.data);
              toast.success("Job Done");
            } else toast.error("Job Error");
          }}
          className="bg-sky-500 text-white px-4 py-2 rounded-full font-semibold duration-300 active:scale-90 "
        >
          Cron Job
        </button>
        <div className="sticky top-0">
          <input
            placeholder="Search by name"
            type="text"
            className="w-80 px-4 pl-12 py-3 rounded-full text-white bg-stone-900 focus:outline-none"
          />
          <IoSearchOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-lg" />
        </div>

        {managers.map((manager) => (
          <div
            key={manager._id}
            className="border px-6 py-5 rounded-lg flex items-center w-[430px] justify-between gap-4"
          >
            <Image
              alt={`Profile picture of ${manager.username} who is a manager`}
              src={manager.profilePicture}
              height={60}
              width={60}
              className="rounded-full aspect-square"
            />
            {/* <p>1</p> */}
            <div>
              <p>{manager.username}</p>
              <p className="text-sm">{manager.email}</p>
            </div>
            {manager.isVerified === true ? (
              <>
                {manager.isManagerVerified === true ? (
                  <p className="text-blue-500 font-semibold flex items-center gap-1">
                    <TiTick className="text-3xl font-normal" />
                    Approved
                  </p>
                ) : (
                  <>
                    <button
                      onClick={async () => {
                        const confirmation = confirm(
                          "Are you sure to Authorize?"
                        );
                        if (confirmation) {
                          setGivingAuthorization(true);
                          try {
                            const { data } = await axios.post(
                              "api/managers/approvemanager",
                              {
                                id: manager._id,

                                days: parseInt(
                                  currentDays[currentDays.length - 1]
                                ),
                                currentMonthName: new Date().toLocaleDateString(
                                  "en-BD",
                                  {
                                    month: "long",
                                    timeZone: "Asia/Dhaka",
                                  }
                                ),
                                currentMonth: new Date(
                                  new Date().toLocaleString("en-US", {
                                    timeZone: "Asia/Dhaka",
                                  })
                                ).getMonth(),
                                currentYear: new Date(
                                  new Date().toLocaleString("en-US", {
                                    timeZone: "Asia/Dhaka",
                                  })
                                ).getFullYear(),
                              }
                            );
                            if (data.success) {
                              await managersRefetch();
                              toast.success("Authorization Provided");
                            }
                          } catch (error) {
                            console.log(
                              "Frontend problem when authorizing as a manager"
                            );
                            console.log(error);
                            toast.error("Authorization Error!");
                          } finally {
                            setGivingAuthorization(false);
                          }
                        } else {
                          toast.success("Cancelled!");
                        }
                      }}
                      className="bg-green-500 text-white font-semibold px-4 py-1 rounded-full duration-300 flex items-center gap-1 active:scale-90"
                    >
                      Approve
                      {givingAuthorization && (
                        <CgSpinner className="animate-spin text-2xl" />
                      )}
                    </button>
                    {/* <button className="bg-red-500 text-white font-semibold px-4 py-1 rounded-full duration-300 active:scale-90">
                      Reject
                    </button> */}
                  </>
                )}
              </>
            ) : (
              <p className="text-red-500 font-semibold flex items-center gap-1">
                <FaTimes className="text-xl font-normal" />
                Unverified
              </p>
            )}
          </div>
        ))}
      </div>
    )
  );
};

export default ManagersOfOwner;
