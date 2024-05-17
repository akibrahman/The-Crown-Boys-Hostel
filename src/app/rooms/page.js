"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";

const Rooms = () => {
  const searchParams = useSearchParams();
  const floor = searchParams.get("floor");
  const allRooms = [
    //! 1st Floor
    {
      name: "a1",
      block: "a",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 1,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-a11",
          rent: 3000,
          bedNo: "a11",
          isBooked: false,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a12",
          rent: 3000,
          bedNo: "a12",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a2",
      block: "a",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 1,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 4,
      beds: [
        {
          user: "idOfUserOf-a21",
          rent: 3000,
          bedNo: "a21",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a22",
          rent: 3000,
          bedNo: "a22",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a23",
          rent: 3000,
          bedNo: "a23",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a24",
          rent: 3000,
          bedNo: "a24",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a3",
      block: "a",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 1,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 3,
      beds: [
        {
          user: "idOfUserOf-a31",
          rent: 3000,
          bedNo: "a31",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a32",
          rent: 3000,
          bedNo: "a32",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a32",
          rent: 3000,
          bedNo: "a32",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a4",
      block: "a",
      type: "wooden",
      sketch: "/images/test-room-sketch.png",
      floor: 1,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 3,
      beds: [
        {
          user: "idOfUserOf-a41",
          rent: 3000,
          bedNo: "a41",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a42",
          rent: 3000,
          bedNo: "a42",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a43",
          rent: 3000,
          bedNo: "a43",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a5",
      block: "a",
      type: "wooden",
      sketch: "/images/test-room-sketch.png",
      floor: 1,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 1,
      beds: [
        {
          user: "idOfUserOf-a51",
          rent: 3000,
          bedNo: "a51",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "b1",
      block: "b",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 1,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-b11",
          rent: 3000,
          bedNo: "b11",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-b12",
          rent: 3000,
          bedNo: "b12",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "b2",
      block: "b",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 1,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-b21",
          rent: 3000,
          bedNo: "b21",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-b22",
          rent: 3000,
          bedNo: "b22",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "b3",
      block: "b",
      type: "wooden",
      sketch: "/images/test-room-sketch.png",
      floor: 1,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-b31",
          rent: 3000,
          bedNo: "b31",
          isBooked: false,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-b32",
          rent: 3000,
          bedNo: "b32",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    //! 3rd Floor
    {
      name: "a1",
      block: "a",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 3,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-a11",
          rent: 3000,
          bedNo: "a11",
          isBooked: false,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a12",
          rent: 3000,
          bedNo: "a12",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a2",
      block: "a",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 3,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 4,
      beds: [
        {
          user: "idOfUserOf-a21",
          rent: 3000,
          bedNo: "a21",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a22",
          rent: 3000,
          bedNo: "a22",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a23",
          rent: 3000,
          bedNo: "a23",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a24",
          rent: 3000,
          bedNo: "a24",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a3",
      block: "a",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 3,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 3,
      beds: [
        {
          user: "idOfUserOf-a31",
          rent: 3000,
          bedNo: "a31",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a32",
          rent: 3000,
          bedNo: "a32",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a32",
          rent: 3000,
          bedNo: "a32",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a4",
      block: "a",
      type: "wooden",
      sketch: "/images/test-room-sketch.png",
      floor: 3,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 3,
      beds: [
        {
          user: "idOfUserOf-a41",
          rent: 3000,
          bedNo: "a41",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a42",
          rent: 3000,
          bedNo: "a42",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a43",
          rent: 3000,
          bedNo: "a43",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a5",
      block: "a",
      type: "wooden",
      sketch: "/images/test-room-sketch.png",
      floor: 3,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 1,
      beds: [
        {
          user: "idOfUserOf-a51",
          rent: 3000,
          bedNo: "a51",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "b1",
      block: "b",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 3,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-b11",
          rent: 3000,
          bedNo: "b11",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-b12",
          rent: 3000,
          bedNo: "b12",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a2",
      block: "b",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 3,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-b21",
          rent: 3000,
          bedNo: "b21",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-b22",
          rent: 3000,
          bedNo: "b22",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "b3",
      block: "b",
      type: "wooden",
      sketch: "/images/test-room-sketch.png",
      floor: 3,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-b31",
          rent: 3000,
          bedNo: "b31",
          isBooked: false,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-b32",
          rent: 3000,
          bedNo: "b32",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    //! 4th Floor
    {
      name: "a1",
      block: "a",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 4,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-a11",
          rent: 3000,
          bedNo: "a11",
          isBooked: false,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a12",
          rent: 3000,
          bedNo: "a12",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a2",
      block: "a",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 4,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 4,
      beds: [
        {
          user: "idOfUserOf-a21",
          rent: 3000,
          bedNo: "a21",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a22",
          rent: 3000,
          bedNo: "a22",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a23",
          rent: 3000,
          bedNo: "a23",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a24",
          rent: 3000,
          bedNo: "a24",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a3",
      block: "a",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 4,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 3,
      beds: [
        {
          user: "idOfUserOf-a31",
          rent: 3000,
          bedNo: "a31",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a32",
          rent: 3000,
          bedNo: "a32",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a32",
          rent: 3000,
          bedNo: "a32",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a4",
      block: "a",
      type: "wooden",
      sketch: "/images/test-room-sketch.png",
      floor: 4,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 3,
      beds: [
        {
          user: "idOfUserOf-a41",
          rent: 3000,
          bedNo: "a41",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a42",
          rent: 3000,
          bedNo: "a42",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a43",
          rent: 3000,
          bedNo: "a43",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a5",
      block: "a",
      type: "wooden",
      sketch: "/images/test-room-sketch.png",
      floor: 4,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 1,
      beds: [
        {
          user: "idOfUserOf-a51",
          rent: 3000,
          bedNo: "a51",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "b1",
      block: "b",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 4,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-b11",
          rent: 3000,
          bedNo: "b11",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-b12",
          rent: 3000,
          bedNo: "b12",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a2",
      block: "b",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 4,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-b21",
          rent: 3000,
          bedNo: "b21",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-b22",
          rent: 3000,
          bedNo: "b22",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "b3",
      block: "b",
      type: "wooden",
      sketch: "/images/test-room-sketch.png",
      floor: 4,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-b31",
          rent: 3000,
          bedNo: "b31",
          isBooked: false,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-b32",
          rent: 3000,
          bedNo: "b32",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    //! 6th Floor
    {
      name: "a1",
      block: "a",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 6,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-a11",
          rent: 3000,
          bedNo: "a11",
          isBooked: false,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a12",
          rent: 3000,
          bedNo: "a12",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a2",
      block: "a",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 6,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 4,
      beds: [
        {
          user: "idOfUserOf-a21",
          rent: 3000,
          bedNo: "a21",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a22",
          rent: 3000,
          bedNo: "a22",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a23",
          rent: 3000,
          bedNo: "a23",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a24",
          rent: 3000,
          bedNo: "a24",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a3",
      block: "a",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 6,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 3,
      beds: [
        {
          user: "idOfUserOf-a31",
          rent: 3000,
          bedNo: "a31",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a32",
          rent: 3000,
          bedNo: "a32",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a32",
          rent: 3000,
          bedNo: "a32",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a4",
      block: "a",
      type: "wooden",
      sketch: "/images/test-room-sketch.png",
      floor: 6,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 3,
      beds: [
        {
          user: "idOfUserOf-a41",
          rent: 3000,
          bedNo: "a41",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a42",
          rent: 3000,
          bedNo: "a42",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a43",
          rent: 3000,
          bedNo: "a43",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a5",
      block: "a",
      type: "wooden",
      sketch: "/images/test-room-sketch.png",
      floor: 6,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 1,
      beds: [
        {
          user: "idOfUserOf-a51",
          rent: 3000,
          bedNo: "a51",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "b1",
      block: "b",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 6,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-b11",
          rent: 3000,
          bedNo: "b11",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-b12",
          rent: 3000,
          bedNo: "b12",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a2",
      block: "b",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 6,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-b21",
          rent: 3000,
          bedNo: "b21",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-b22",
          rent: 3000,
          bedNo: "b22",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "b3",
      block: "b",
      type: "wooden",
      sketch: "/images/test-room-sketch.png",
      floor: 6,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-b31",
          rent: 3000,
          bedNo: "b31",
          isBooked: false,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-b32",
          rent: 3000,
          bedNo: "b32",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    //! 7th Floor
    {
      name: "a1",
      block: "a",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 7,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-a11",
          rent: 3000,
          bedNo: "a11",
          isBooked: false,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a12",
          rent: 3000,
          bedNo: "a12",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a2",
      block: "a",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 7,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 4,
      beds: [
        {
          user: "idOfUserOf-a21",
          rent: 3000,
          bedNo: "a21",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a22",
          rent: 3000,
          bedNo: "a22",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a23",
          rent: 3000,
          bedNo: "a23",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a24",
          rent: 3000,
          bedNo: "a24",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a3",
      block: "a",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 7,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 3,
      beds: [
        {
          user: "idOfUserOf-a31",
          rent: 3000,
          bedNo: "a31",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a32",
          rent: 3000,
          bedNo: "a32",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a32",
          rent: 3000,
          bedNo: "a32",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a4",
      block: "a",
      type: "wooden",
      sketch: "/images/test-room-sketch.png",
      floor: 7,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 3,
      beds: [
        {
          user: "idOfUserOf-a41",
          rent: 3000,
          bedNo: "a41",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a42",
          rent: 3000,
          bedNo: "a42",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-a43",
          rent: 3000,
          bedNo: "a43",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a5",
      block: "a",
      type: "wooden",
      sketch: "/images/test-room-sketch.png",
      floor: 7,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 1,
      beds: [
        {
          user: "idOfUserOf-a51",
          rent: 3000,
          bedNo: "a51",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "b1",
      block: "b",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 7,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-b11",
          rent: 3000,
          bedNo: "b11",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-b12",
          rent: 3000,
          bedNo: "b12",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "a2",
      block: "b",
      type: "concrete",
      sketch: "/images/test-room-sketch.png",
      floor: 7,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-b21",
          rent: 3000,
          bedNo: "b21",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-b22",
          rent: 3000,
          bedNo: "b22",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
    {
      name: "b3",
      block: "b",
      type: "wooden",
      sketch: "/images/test-room-sketch.png",
      floor: 7,
      image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
      seats: 2,
      beds: [
        {
          user: "idOfUserOf-b31",
          rent: 3000,
          bedNo: "b31",
          isBooked: false,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
        {
          user: "idOfUserOf-b32",
          rent: 3000,
          bedNo: "b32",
          isBooked: true,
          image: "https://i.ibb.co/Lgj3BHG/main-Image.jpg",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pb-20 dark:bg-gradient-to-r dark:from-primary dark:to-secondary bg-gradient-to-r from-primary to-secondary dark:text-stone-300 text-stone-300 relative">
      {floor &&
      (floor == "1" ||
        floor == "3" ||
        floor == "4" ||
        floor == "6" ||
        floor == "7") ? (
        <div>
          <TargetedRooms
            rooms={allRooms.filter((room) => room.floor == floor)}
            totalRooms={allRooms
              .filter((room) => room.floor == floor)
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue.seats,
                0
              )}
            availableRooms={allRooms
              .filter((room) => room.floor == floor)
              .reduce(
                (accumulator, currentValue) =>
                  accumulator +
                  currentValue.beds.reduce(
                    (accumulator2, currentValue2) =>
                      accumulator2 + currentValue2.isBooked == true ? 0 : 1,
                    0
                  ),
                0
              )}
            floor={floor}
          />
        </div>
      ) : (
        <div>
          <Floors allRooms={allRooms} />
          <div className="absolute top-0 left-0 w-[400px] h-[100%] flex items-center justify-center flex-col">
            <p className="w-[200px] flex items-center gap-2">
              Total Rooms:
              <span className="text-blue-500 text-3xl font-medium">
                {allRooms.reduce(
                  (accumulator, currentValue) =>
                    accumulator + currentValue.seats,
                  0
                )}
              </span>
            </p>
            <p className="w-[200px]  flex items-center gap-2">
              Available Rooms:
              <span className="text-blue-500 text-3xl font-medium">
                {allRooms.reduce(
                  (accumulator, currentValue) =>
                    accumulator +
                    currentValue.beds.reduce(
                      (accumulator2, currentValue2) =>
                        accumulator2 + currentValue2.isBooked == true ? 0 : 1,
                      0
                    ),
                  0
                )}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;

const Floors = ({ allRooms }) => {
  const floors = [1, 3, 4, 6, 7];
  return (
    <div className="max-w-[420px] w-[90%] mx-auto text-center pt-20">
      <p className="text-lg">Select Floor</p>
      <div className="flex flex-col gap-5 mt-8">
        {floors.map((floor) => (
          <Link
            key={floor}
            href={`/rooms?floor=${floor}`}
            className="text-lg md:text-base shadow shadow-sky-300 py-2 md:py-3 cursor-pointer duration-100 ease-linear select-none flex items-center justify-center gap-12 hover:shadow-blue-700 hover:shadow-md hover:scale-105 active:scale-95"
          >
            <span className="text-xs md:text-sm text-blue-600">
              Total Seat:{" "}
              {allRooms
                .filter((room) => room.floor == floor)
                .reduce(
                  (accumulator, currentValue) =>
                    accumulator + currentValue.seats,
                  0
                )}
            </span>
            <span>
              {" "}
              {floor}
              <sup>{floor == 1 ? "st" : floor == 3 ? "rd" : "th"}</sup> Floor
            </span>
            <span className="text-xs md:text-sm text-green-600">
              Available seat:{" "}
              {allRooms
                .filter((room) => room.floor == floor)
                .reduce(
                  (accumulator, currentValue) =>
                    accumulator +
                    currentValue.beds.reduce(
                      (accumulator2, currentValue2) =>
                        accumulator2 + currentValue2.isBooked == true ? 0 : 1,
                      0
                    ),
                  0
                )}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const TargetedRooms = ({ floor, totalRooms, availableRooms, rooms }) => {
  return (
    <div>
      <div className="flex items-center justify-center gap-4 py-6 px-20">
        <div className="text-lg flex-grow text-center space-x-6">
          <span>Total Rooms: {totalRooms}</span>
          <span className="underline font-semibold">
            Rooms of {floor}
            <sup>{floor == 1 ? "st" : floor == 3 ? "rd" : "th"}</sup> Floor
          </span>
          <span className="text-green-500">
            Available Rooms: {availableRooms}
          </span>
        </div>
        <Link
          href="/rooms"
          className="shadow shadow-red-50 px-2 py-1 text-sm cursor-pointer duration-200 ease-linear select-none hover:scale-110 active:scale-95"
        >
          Change Floor
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-20">
        {rooms
          .sort((roomA, roomB) => {
            const hasFalseA = roomA.beds.some((bed) => bed.isBooked === false);
            const hasFalseB = roomB.beds.some((bed) => bed.isBooked === false);

            if (hasFalseA && !hasFalseB) {
              return -1; // roomA comes before roomB
            } else if (!hasFalseA && hasFalseB) {
              return 1; // roomB comes before roomA
            } else {
              return 0; // maintain the same order
            }
          })
          .map((room, i) => (
            <div
              key={i}
              className="h-[200px] bg-stone-800 rounded-s-full flex gap-10 items-center relative"
            >
              <button className="absolute bottom-6 right-6 px-4 py-1 bg-blue-500 text-white flex items-center gap-3 duration-300 active:scale-90">
                Details
                <FaArrowRight />
              </button>
              {room.beds.find((bed) => bed.isBooked == false) && (
                <p className="absolute top-2 right-3 text-green-600 font-medium">
                  Available
                </p>
              )}
              <div className="h-full w-max flex items-center">
                <Image
                  height={100}
                  width={200}
                  src={room.image}
                  alt={`Image of  room number ${room.name} of 'The Crown Boys Hostel'`}
                  className="block rounded-e-full"
                />
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-3">
                <p className="text-blue-500 font-medium text-lg">
                  Rooma Name:{" "}
                  <span>
                    {room.name.split("")[0].toUpperCase() +
                      " " +
                      room.name.split("")[1]}
                  </span>
                </p>
                <p>
                  Seats:{" "}
                  <span className="text-blue-500 font-medium">
                    {room.seats}
                  </span>
                </p>
                <p>
                  Type:{" "}
                  <span className="text-blue-500 font-medium capitalize">
                    {room.type}
                  </span>
                </p>
                <p>
                  Block:{" "}
                  <span className="text-blue-500 font-medium">
                    {room.block.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
