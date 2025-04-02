import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  defs,
  linearGradient,
  stop,
} from "recharts";

const data = [
  { date: "01/01", breakfast: 20, lunch: 40, dinner: 30 },
  { date: "02/01", breakfast: 35, lunch: 65, dinner: 50 },
  { date: "03/01", breakfast: 25, lunch: 15, dinner: 20 },
  { date: "04/01", breakfast: 50, lunch: 40, dinner: 45 },
  { date: "05/01", breakfast: 65, lunch: 35, dinner: 55 },
  { date: "06/01", breakfast: 45, lunch: 85, dinner: 60 },
  { date: "07/01", breakfast: 70, lunch: 30, dinner: 50 },
  { date: "08/01", breakfast: 85, lunch: 55, dinner: 70 },
  { date: "09/01", breakfast: 75, lunch: 25, dinner: 55 },
  { date: "10/01", breakfast: 90, lunch: 50, dinner: 60 },
  { date: "11/01", breakfast: 40, lunch: 60, dinner: 35 },
  { date: "12/01", breakfast: 30, lunch: 50, dinner: 45 },
  { date: "13/01", breakfast: 55, lunch: 45, dinner: 50 },
  { date: "14/01", breakfast: 70, lunch: 80, dinner: 65 },
  { date: "15/01", breakfast: 60, lunch: 55, dinner: 40 },
  { date: "16/01", breakfast: 45, lunch: 35, dinner: 50 },
  { date: "17/01", breakfast: 75, lunch: 50, dinner: 60 },
  { date: "18/01", breakfast: 80, lunch: 60, dinner: 65 },
  { date: "19/01", breakfast: 60, lunch: 45, dinner: 55 },
  { date: "20/01", breakfast: 50, lunch: 55, dinner: 70 },
  { date: "21/01", breakfast: 45, lunch: 60, dinner: 75 },
  { date: "22/01", breakfast: 80, lunch: 40, dinner: 50 },
  { date: "23/01", breakfast: 85, lunch: 30, dinner: 60 },
  { date: "24/01", breakfast: 60, lunch: 55, dinner: 55 },
  { date: "25/01", breakfast: 50, lunch: 45, dinner: 50 },
  { date: "26/01", breakfast: 35, lunch: 55, dinner: 65 },
  { date: "27/01", breakfast: 45, lunch: 60, dinner: 75 },
  { date: "28/01", breakfast: 60, lunch: 80, dinner: 55 },
  { date: "29/01", breakfast: 50, lunch: 45, dinner: 50 },
  { date: "30/01", breakfast: 80, lunch: 50, dinner: 60 },
  { date: "31/01", breakfast: 65, lunch: 55, dinner: 70 },
];

const WaveChart = () => {
  return (
    <div className="p-4" style={{ background: "#1E232E" }}>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          {/* ✅ Gradient Definition (For Smooth Fill) */}
          <defs>
            <linearGradient
              id="breakfastWaveGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="orange" stopOpacity={0.6} />
              <stop offset="100%" stopColor="orange" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lunchWaveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="green" stopOpacity={0.6} />
              <stop offset="100%" stopColor="green" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="dinnerWaveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="red" stopOpacity={0.6} />
              <stop offset="100%" stopColor="red" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* ✅ Optional Grid for Visibility */}
          {/* <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" vertical={false} /> */}

          {/* ✅ X & Y Axis Styling */}
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
          <YAxis stroke="rgba(255,255,255,0.7)" />
          <Tooltip
            contentStyle={{
              background: "#1E232E",
              color: "white",
              //   borderRadius: "6px",
            }}
          />

          {/* ✅ Area with Gradient Fill (This is the fix!) */}
          <Area
            type="monotone"
            dataKey="breakfast"
            stroke="orange"
            strokeWidth={2}
            fill="url(#breakfastWaveGradient)"
          />
          <Area
            type="monotone"
            dataKey="lunch"
            stroke="green"
            strokeWidth={2}
            fill="url(#lunchWaveGradient)"
          />
          <Area
            type="monotone"
            dataKey="dinner"
            stroke="red"
            strokeWidth={2}
            fill="url(#dinnerWaveGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WaveChart;
