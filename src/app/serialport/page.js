"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const SerialPort = () => {
  const [data, setData] = useState("Loading...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/arduino");
        setData(data.distance);
      } catch (error) {
        console.error("Error fetching Arduino data:", error);
        setData("Error fetching data");
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 1000); // Fetch data every second
    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  return (
    <div className="min-h-screen">
      <p>Arduino Data</p>
      <p>Data is: {data}</p>
    </div>
  );
};

export default SerialPort;
