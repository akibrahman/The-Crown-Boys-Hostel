import Image from "next/image";
import Link from "next/link";
import { CgSpinner } from "react-icons/cg";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";

const ClientsOfManager = ({
  user,
  setClientName,
  clientName,
  clients,
  getDetailsOfClientForApproval,
  clientDetailsIsLoading,
}) => {
  return user.role === "manager" &&
    user.isVerified &&
    user.isManagerVerified ? (
    <div className="col-span-1 md:col-span-2 h-[380px] overflow-x-hidden overflow-y-scroll px-3 flex flex-col items-center gap-4 mt-10 relative">
      <div className=" pb-2 bg-transparent w-[110%] flex justify-center sticky top-0">
        <div className="relative">
          <input
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Search by name"
            type="text"
            className="w-80 px-4 pl-12 py-3 rounded-full dark:text-white font-semibold dark:bg-stone-800 bg-stone-300 focus:outline-none"
          />
          <IoSearchOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-lg" />
        </div>
      </div>

      {clientName && !clients ? (
        <p className="mt-4 flex items-center gap-1 font-semibold">
          <CgSpinner className="animate-spin text-lg" />
          Loading...
        </p>
      ) : (
        clients?.map((client, i) => (
          <div
            key={client._id}
            className="border px-6 py-5 rounded-lg flex flex-col md:flex-row items-center w-[95%] justify-between gap-4"
          >
            <p>{i + 1}</p>
            <Image
              alt={`Profile picture of ${client.username} who is a manager`}
              src={client.profilePicture}
              height={60}
              width={60}
              className="rounded-full aspect-square"
            />
            <div className="md:w-[900px] md:overflow-x-hidden text-center md:text-left">
              <p>{client.username}</p>
              <p className="text-sm">{client.email}</p>
            </div>
            {client.isVerified === true ? (
              <>
                {client.isClientVerified === true ? (
                  <>
                    <p className="text-blue-500 font-semibold flex items-center gap-1">
                      <TiTick className="text-3xl font-normal" />
                      Approved
                    </p>
                    <Link href={`/userDetails/${client._id}`}>
                      <button className="font-semibold flex items-center gap-2 bg-blue-500 px-3 py-1 duration-300 active:scale-90">
                        Details <FaArrowRight />
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => getDetailsOfClientForApproval(client._id)}
                      className="bg-green-500 text-white font-semibold px-4 py-1 rounded-full duration-300 flex items-center gap-1 active:scale-90"
                    >
                      Details{" "}
                      {clientDetailsIsLoading && (
                        <CgSpinner className="animate-spin text-2xl" />
                      )}
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <p className="text-red-500 font-semibold flex items-center gap-1">
                  <FaTimes className="text-xl font-normal" />
                  Unverified
                </p>
                <Link href={`/userDetails/${client._id}`}>
                  <button className="font-semibold flex items-center gap-2 bg-blue-500 px-3 py-1 duration-300 active:scale-90">
                    Details <FaArrowRight />
                  </button>
                </Link>
              </>
            )}
          </div>
        ))
      )}
    </div>
  ) : user.role === "manager" && !user.isVerified ? (
    <div className="col-span-2 h-[380px] border-l-4 border-blue-500 overflow-y-scroll px-3 flex items-center justify-center gap-4 mt-10 relative">
      <p>Verify Email</p>
    </div>
  ) : (
    user.role === "manager" &&
    !user.isManagerVerified && (
      <div className="col-span-2 h-[380px] border-l-4 border-blue-500 overflow-y-scroll px-3 flex items-center justify-center gap-4 mt-10 relative">
        <p>Verify as a manager</p>
      </div>
    )
  );
};

export default ClientsOfManager;
