"use client";

import { AuthContext } from "@/providers/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { MdLocalGasStation } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";

const ManagerMarketDetailsComponent = () => {
  const { user } = useContext(AuthContext);

  const currentMonth = new Date().toLocaleDateString("en-BD", {
    month: "long",
    timeZone: "Asia/Dhaka",
  });
  const currentYear = new Date().toLocaleDateString("en-BD", {
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });

  const { data: managerCalanderData, refetch: managerCalanderDataRefetch } =
    useQuery({
      queryKey: ["managerCalanderData", "manager", user?._id],
      queryFn: async ({ queryKey }) => {
        try {
          const { data } = await axios.post("/api/markets/getmarkets", {
            managerId: queryKey[2],
            month: currentMonth,
            year: currentYear,
          });
          console.log("Manager Calander Loading");
          return data.market;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
      enabled: user?._id && user?.role == "manager" ? true : false,
    });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const openModal = (data) => {
    setIsModalOpen(true);
    setModalData(data);
  };
  const closeModal = async () => {
    setIsModalOpen(false);
    setModalData(null);
    await managerCalanderDataRefetch();
  };

  return (
    <div className="relative bg-dashboard">
      {modalData && (
        <ModalComponent
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          modalData={modalData}
          id1={managerCalanderData._id}
        />
      )}
      <div className="bg-dashboard text-slate-100 py-10 min-h-screen">
        <p className="text-center">{currentMonth}</p>

        <div className="mt-6 flex items-center justify-center flex-wrap gap-4">
          {managerCalanderData?.data?.map((mrkt) => (
            <div
              onClick={() => {
                if (isModalOpen) return;
                openModal(mrkt);
              }}
              key={mrkt._id}
              className="relative w-[150px] h-20 rounded-md text-sky-500 flex items-center justify-center border-sky-500 border flex-col cursor-pointer duration-300 active:scale-90 hover:scale-110"
            >
              <div className="absolute top-1 right-1 flex flex-col items-center justify-center">
                <TbMoneybag className="text-xl" />
                <p className="font-light">
                  {mrkt.details.reduce((a, c) => {
                    let value = Object.keys(c)[0];
                    if (value.trim().toLowerCase() == "rice") return a + 1;
                    else return a + 0;
                  }, 0)}
                </p>
              </div>
              <div className="absolute top-1 left-1 flex flex-col items-center justify-center">
                <MdLocalGasStation className="text-xl" />
                <p className="font-light">
                  {mrkt.details.reduce((a, c) => {
                    let value = Object.keys(c)[0];
                    if (value.trim().toLowerCase() == "gas") return a + 1;
                    else return a + 0;
                  }, 0)}
                </p>
              </div>
              <span className="font-semibold bg-white text-sky-500 px-2 py-1 rounded-md mb-2 select-none">
                {" "}
                {mrkt.date.split("/")[1] +
                  "-" +
                  mrkt.date.split("/")[0] +
                  "-" +
                  mrkt.date.split("/")[2]}
              </span>

              <span className="select-none text-white font-medium">
                {mrkt.details.reduce((total, market) => {
                  let value = Object.values(market)[0];
                  return total + value;
                }, 0)}{" "}
                /-
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerMarketDetailsComponent;

const ModalComponent = ({ isModalOpen, closeModal, modalData, id1 }) => {
  const [tempMarkets, setTempMarkets] = useState(modalData.details);

  const changingValue = (key, value) => {
    setTempMarkets((prevMarkets) =>
      prevMarkets.map((market) =>
        Object.keys(market)[0] === key ? { [key]: value } : market
      )
    );
  };

  const saveModal = async (e) => {
    e.preventDefault();
    const id2 = modalData._id;
    try {
      const { data } = await axios.put("/api/markets/updatemarket", {
        id1,
        id2,
        marketData: tempMarkets,
      });
      if (data.success) {
        toast.success("Updated");
        closeModal();
      } else {
        toast.error("Server Error");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  };

  const addNewField = (e) => {
    e.preventDefault();
    const newField = { [e.target.key.value]: parseInt(e.target.value.value) };
    setTempMarkets([...tempMarkets, newField]);
    e.target.key.value = "";
    e.target.value.value = "";
  };
  const removeField = (i) => {
    tempMarkets.splice(i, 1);
    setTempMarkets([...tempMarkets]);
  };
  return (
    <div
      className={`fixed z-40 bg-stone-100 rounded-md top-1/2 -translate-y-1/2 left-1/2 p-5 md:p-10 space-y-1 -translate-x-1/2 duration-300 transition-all overflow-y-scroll ${
        isModalOpen
          ? "h-96 w-[95%] md:w-[700px] opacity-100 pointer-events-auto"
          : "h-0 w-0 opacity-0 pointer-events-none"
      }`}
    >
      <FaTimes
        className="absolute top-6 right-6 cursor-pointer duration-300 active:scale-90 text-xl text-dashboard"
        onClick={closeModal}
      />
      <p>
        <span className="min-w-[50px] inline-block">ID:</span>{" "}
        <span className="font-medium text-dashboard">{modalData?._id}</span>
      </p>
      <p>
        <span className="min-w-[50px] inline-block">Date:</span>{" "}
        <span className="font-medium text-dashboard">{modalData?.date}</span>
      </p>
      <form
        onSubmit={addNewField}
        className="flex flex-col md:flex-row items-center gap-3 py-4"
      >
        <input
          name="key"
          className="bg-dashboard px-5 py-1 rounded-full text-white "
          type="text"
          placeholder="Enter Name"
        />
        <input
          name="value"
          className="bg-dashboard px-5 py-1 rounded-full text-white "
          type="number"
          placeholder="Enter Amount"
        />
        <button
          type="submit"
          className="border border-dashboard px-4 py-1 rounded-full duration-300 active:scale-90"
        >
          Add
        </button>
      </form>
      <p className="underline text-center font-semibold text-lg my-4">
        Markets
      </p>
      <form onSubmit={saveModal} className="flex flex-col items-center gap-3">
        {tempMarkets?.map((d, i) => (
          <p
            key={i}
            className="flex flex-col md:flex-row items-center md:gap-4 border-2 p-3 rounded"
          >
            <p className="w-[100px] text-center md:text-left">
              {Object.keys(d)[0]} :
            </p>
            <input
              type="number"
              // name={Object.keys(d)[0]}
              className="bg-dashboard px-5 py-2 rounded-full text-white"
              onChange={(e) =>
                changingValue(Object.keys(d)[0], parseInt(e.target.value))
              }
              value={d[Object.keys(d)[0]]}
            />
            <FaDeleteLeft
              onClick={() => removeField(i)}
              className="text-xl text-red-950 cursor-pointer"
            />
          </p>
        ))}

        <button
          type="submit"
          className="text-stone-100 bg-dashboard text-sm px-6 py-1.5 rounded-full w-max mx-auto duration-300 hover:scale-110 active:scale-90"
        >
          Save
        </button>
      </form>
    </div>
  );
};
