"use client";

import { useEffect, useState } from "react";
import PreLoader from "../PreLoader/PreLoader";

const IntPreLoader = ({ duration, child }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return isVisible ? (
    <div className="">
      <PreLoader />
    </div>
  ) : (
    <div className="">{child}</div>
  );
};

export default IntPreLoader;
