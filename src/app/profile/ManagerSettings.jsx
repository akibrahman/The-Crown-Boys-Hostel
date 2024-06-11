import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const ManagerSettings = ({ user }) => {
  return user.role === "manager" &&
    user.isVerified &&
    user.isManagerVerified ? (
    <div className="px-3 mt-10 pt-60 relative flex items-center justify-center h-[380px] overflow-x-hidden overflow-y-scroll">
      {/* <p>Accessibilities</p> */}
      <div className="flex flex-col items-center justify-center flex-wrap gap-5">
        <Link href="/orderStatus" className="group">
          <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[250px] flex items-center gap-5">
            <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
            Order Status
          </button>
        </Link>
        <Link href="/sms" className="group">
          <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[250px] flex items-center gap-5">
            <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
            Send SMS
          </button>
        </Link>
        <Link href={"/billQuery"}>
          <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[250px] flex items-center gap-5">
            <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
            Bill Query
          </button>
        </Link>
        <Link href="/userQuery">
          <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[250px] flex items-center gap-5">
            <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
            User Query
          </button>
        </Link>
        <Link href="/marketQuery">
          <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[250px] flex items-center gap-5">
            <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
            Market Query
          </button>
        </Link>
        <Link href="/managerOrder">
          <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[250px] flex items-center gap-5">
            <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
            Meal Updator
          </button>
        </Link>
        <Link href="/RFIDIssue">
          <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[250px] flex items-center gap-5">
            <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
            RFID Section
          </button>
        </Link>
        <Link href="/bookings">
          <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[250px] flex items-center gap-5">
            <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
            All Bookings
          </button>
        </Link>
        <Link
          href="https://business.facebook.com/latest/home?nav_ref=bm_home_redirect&business_id=263483153525937&mio=0&asset_id=263473766860209"
          target="_blank"
        >
          <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[250px] flex items-center gap-5">
            <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
            <p className="text-xs w-max">Facebook Business Profile</p>
          </button>
        </Link>
        <Link
          href="https://mail.zoho.com/zm/#mail/folder/inbox"
          target="_blank"
        >
          <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[250px] flex items-center gap-5">
            <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
            Mails
          </button>
        </Link>
        <Link href="/manualInvoice">
          <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[250px] flex items-center gap-5">
            <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
            Manual Invoice
          </button>
        </Link>
      </div>
    </div>
  ) : user.role === "manager" && !user.isVerified ? (
    <div className="h-[380px] border-l-4 border-blue-500 overflow-y-scroll px-3 flex items-center justify-center gap-4 mt-10 relative">
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

export default ManagerSettings;
