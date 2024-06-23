"use client";

import React from "react";
import "./ColorButton.css";
import { useRouter } from "next/navigation";

const ColorButton = ({ lable, isLink, onClick, link }) => {
  const route = useRouter();
  return (
    <button className="color-button" onClick={isLink ? () => route.push(link) : onClick}>{lable}</button>
  );
};

export default ColorButton;
