"use client";
import { IoFastFoodOutline } from "react-icons/io5";
import "./MetalOutlineButton.css";

const MetalOutlineButton = ({ lable, link }) => {
  return (
    <button onClick={() => window.location.replace(link)} class="button">
      <div class="dots_border"></div>
      <IoFastFoodOutline className="font-semibold text-white z-50 text-xl animate-bounce" />
      <span class="text_button">{lable}</span>
    </button>
  );
};

export default MetalOutlineButton;
