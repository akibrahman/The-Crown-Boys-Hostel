"use client";

import { useEffect, useState } from "react";
import PreLoader from "../PreLoader/PreLoader";

const IntPreLoader = ({ duration }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return isVisible ? (
    <div className="preloader">
      <PreLoader />
    </div>
  ) : null;
};

export default IntPreLoader;
