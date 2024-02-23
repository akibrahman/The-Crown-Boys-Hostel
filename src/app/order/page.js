"use client";

import { useState } from "react";

const Order = () => {
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);
  return (
    <div>
      <p className="text-2xl text-white bg-yellow-500 px-8 py-3 rounded-xl font-bold text-center mb-5">
        Order your meal here
      </p>
      <div className="grid grid-cols-3 gap-4">
        {/* Breakfast  */}
        <div
          className={`duration-700 transition-all ease-in-out flex items-center gap-14 border border-red-500 py-8 px-20 rounded-xl ${
            breakfast ? "shadow-2xl shadow-red-500" : ""
          }`}
        >
          <p className="text-3xl font-semibold">Breakfast:</p>
          <label class="inline-flex items-center me-5 cursor-pointer">
            <input
              onClick={() => {
                console.log(!breakfast);
                setBreakfast(!breakfast);
              }}
              type="checkbox"
              value=""
              class={`sr-only ${breakfast ? "peer" : ""}`}
              checked
            />
            <div class="duration-700 transition-all ease-in-out relative w-24 h-11 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-[130%] rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-10 after:w-10 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
          </label>
        </div>
        {/* Lunch  */}
        <div
          className={`duration-700 transition-all ease-in-out flex items-center gap-14 border border-green-500 py-8 px-20 rounded-xl ${
            lunch ? "shadow-2xl shadow-green-500" : ""
          }`}
        >
          <p className="text-3xl font-semibold">Lunch:</p>
          <label class="inline-flex items-center me-5 cursor-pointer">
            <input
              onClick={() => {
                console.log(!lunch);
                setLunch(!lunch);
              }}
              type="checkbox"
              value=""
              class={`sr-only ${lunch ? "peer" : ""}`}
              checked
            />
            <div class="duration-700 transition-all ease-in-out relative w-24 h-11 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-[130%] rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-10 after:w-10 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
          </label>
        </div>
        {/* Dinner  */}
        <div
          className={`flex items-center gap-14 border duration-700 transition-all ease-in-out border-blue-500 py-8 px-20 rounded-xl ${
            dinner ? "shadow-2xl shadow-blue-500" : ""
          }`}
        >
          <p className="text-3xl font-semibold">Dinner:</p>
          <label class="inline-flex items-center me-5 cursor-pointer">
            <input
              onClick={() => {
                console.log(!dinner);
                setDinner(!dinner);
              }}
              type="checkbox"
              value=""
              class={`sr-only ${dinner ? "peer" : ""}`}
              checked
            />
            <div class="duration-700 transition-all ease-in-out relative w-24 h-11 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-[130%] rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-10 after:w-10 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Order;
