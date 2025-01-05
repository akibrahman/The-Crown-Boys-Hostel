"use client";

import React, { useContext, useState } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import { LuCalendarPlus } from "react-icons/lu";
import OrderStatusComponent from "./OrderStatusComponent";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/providers/ContextProvider";
import axios from "axios";

const OrderStatusCustomDateComponent = ({
  openModal,
  floorAnalyzer,
  setPosPrintData,
  setShowPosPrint,
}) => {
  const { user } = useContext(AuthContext);

  const [date, setDate] = useState("");
  const [ordersFetching, setOrdersFetching] = useState(false);

  const { data: orders } = useQuery({
    queryKey: ["orderStatusCustom", user?._id, date],
    queryFn: async ({ queryKey }) => {
      try {
        const { data } = await axios.post("/api/managersOrder/getOrderStatus", {
          custom: new Date(queryKey[2]).toLocaleDateString("en-BD", {
            timeZone: "Asia/Dhaka",
          }),
        });
        if (data.success) {
          console.log(data.orders);
          return data.orders;
        } else {
          return null;
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    enabled: user?._id && date ? true : false,
  });

  return (
    <div className="my-3 md:my-6 flex flex-col items-center justify-center gap-3 w-full">
      <DatePicker
        className={""}
        format="dd - MM - y"
        value={date}
        calendarIcon={<LuCalendarPlus className="text-2xl" />}
        clearIcon={null}
        dayPlaceholder="--"
        monthPlaceholder="--"
        yearPlaceholder="----"
        onChange={(e) => setDate(e)}
      />
      {!ordersFetching && orders && orders.length > 0 && (
        <OrderStatusComponent
          date={new Date(date).toLocaleDateString("en-BD", {
            timeZone: "Asia/Dhaka",
          })}
          orders={orders}
          openModal={openModal}
          floorAnalyzer={floorAnalyzer}
          setPosPrintData={setPosPrintData}
          setShowPosPrint={setShowPosPrint}
        />
      )}
    </div>
  );
};

export default OrderStatusCustomDateComponent;
