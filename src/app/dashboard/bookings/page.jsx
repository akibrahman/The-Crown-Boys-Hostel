"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import QRCode from "qrcode.react";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";
import { AuthContext } from "@/providers/ContextProvider";

const ManagerAllBookingsComponent = () => {
  const { user } = useContext(AuthContext);
  const route = useRouter();
  const pos = useRef();
  const { data: allBookings } = useQuery({
    queryKey: ["All Bookings", "Manager Only", user?._id],
    queryFn: async () => {
      const { data } = await axios.patch(`/api/booking`);
      if (data.success) {
        return data.bookings;
      } else {
        return [];
      }
    },
    enabled: user?._id ? true : false,
  });
  console.log(allBookings);
  //
  const sampleCartItems = [
    { name: "Burger", quantity: 2, price: 150 },
    { name: "Sandwich", quantity: 3, price: 120 },
    { name: "Ice Cream", quantity: 5, price: 100 },
    { name: "Tea", quantity: 10, price: 20 },
  ];

  const handlePrint = useReactToPrint({
    content: () => pos.current,
    documentTitle: `POS Receipt`,
    onBeforePrint: () => toast.success("Generating Invoice"),
    onAfterPrint: () => toast.success("Invoice Generated"),
  });

  //
  if (!user) return <PreLoader />;
  if (user?.success == false) return route.push("/signin");
  if (user.role != "manager") return route.push("/");
  return (
    <div className="min-h-full p-10 bg-dashboard text-slate-100">
      <p className="text-center font-semibold text-2xl dark:text-white">
        Bookings
      </p>
      <button
        onClick={handlePrint}
        className="px-10 py-1 rounded-md duration-300 active:scale-90 hover:scale-105 bg-blue-500 text-white font-semibold mx-auto my-5 block"
      >
        Print Invoice
      </button>
      <div className="flex items-center justify-center">
        <div
          ref={pos}
          className="bg-white shadow-md w-[220px] rounded-md p-4 text-black"
        >
          <div className="flex justify-center">
            <Image
              src="/images/fd.png"
              alt="Logo"
              className="h-20 w-20"
              height="80"
              width="80"
            />
          </div>
          <h2 className="font-bold text-center text-black">Food Blast</h2>
          <div className="flex flex-col items-center text-xs justify-center my-1">
            <p className="w-max font-semibold">
              Customer Name:
              <span className="ml-2">Akib Rahman</span>
            </p>

            <p className="w-max font-semibold">
              Phone No: <span className="ml-2">01709605097</span>
            </p>

            <p className="w-max font-semibold">
              Date: <span className="ml-2">{new Date().toLocaleString()}</span>
            </p>
            <p className="w-max font-semibold">Methode: Cash</p>
            <p className="w-max font-semibold">
              Trnx ID: <span className="ml-2">HU9K0P8</span>
            </p>
          </div>
          <table className="w-full text-left">
            <tbody className="text-xs">
              {sampleCartItems.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-1 font-semibold mt-2`}
                >
                  <p className="">
                    {item.name} x {item.quantity}
                  </p>
                  <p className="">{item.price * item.quantity}/- BDT</p>
                </div>
              ))}
            </tbody>
          </table>
          <p className="font-bold mt-3 text-sm text-center">
            Grand Total{" "}
            {Math.ceil(
              sampleCartItems.reduce((a, c) => a + c.quantity * c.price, 0)
            )}
            /- BDT
          </p>
          <p className="text-xs mt-2 text-center font-semibold">
            foodblast@gmail.com
          </p>

          <div className="flex items-center justify-center my-1">
            <QRCode
              size={80}
              fgColor="#000000"
              bgColor="#ffffff"
              value={`https://food-blast-akib.vercel.app`}
            />
          </div>
          <p className="text-xs font-semibold text-center mt-3">
            Rajlokkhi, Uttara-10, Dhaka, Bangladesh
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagerAllBookingsComponent;
