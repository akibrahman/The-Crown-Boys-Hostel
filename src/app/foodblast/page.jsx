"use client";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaTimes } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CgSpinner } from "react-icons/cg";

const FoodBlast = () => {
  const { data: foods, refetch } = useQuery({
    queryKey: ["shopItems"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/shopitem`);
      if (data.success) {
        const finalFoods = [...data.items];
        finalFoods.sort((a, b) => {
          const qtyA = Number(a.quantity) || 0;
          const qtyB = Number(b.quantity) || 0;
          if (qtyA === 0) return 1;
          if (qtyB === 0) return -1;
          return qtyA - qtyB;
        });
        return finalFoods;
      } else return [];
    },
  });

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    number: "",
    floor: "",
    room: "",
  });

  const addFood = async (_id) => {
    try {
      const food = foods.find((_f) => _f._id == _id);
      const isCartFood = cart.find((_f) => _f._id == _id);
      if (isCartFood) {
        if (isCartFood.qty + 1 <= food.quantity) {
          const updatedCart = cart.map((item) =>
            item._id === _id ? { ...item, qty: item.qty + 1 } : item
          );
          setCart(updatedCart);
          toast.success("Food Added");
        } else {
          toast.error("No Quantity Left");
          return;
        }
      } else {
        if (food.quantity > 0) {
          setCart([...cart, { ...food, qty: 1 }]);
          toast.success("Food Added");
        } else {
          toast.error("No Quantity Left");
          return;
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.msg ||
          error?.message ||
          "Something Went Error, Try Again!"
      );
      console.log(error);
    }
  };

  const confirmOrder = async () => {
    if (
      !customer.name ||
      !customer.number ||
      !customer.floor ||
      !customer.room
    ) {
      toast.error("Enter All Informations!");
      return;
    }
    if (cart.length <= 0) {
      toast.error("Cart is Empty!");
      return;
    }
    try {
      const { data } = await axios.post("/api/shopitem", {
        cart,
        customer,
        time: new Date().toString(),
      });
      if (data.success) {
        toast.success("Order Confirmed");
        await refetch();
        setCart([]);
        setShowCart(false);
      } else {
        toast.error(data?.msg || "Something Went Error, Try Again!");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.msg ||
          error?.message ||
          "Something Went Error, Try Again!"
      );
      console.log(error);
    }
  };

  // if (!foods) return <PreLoader />;

  return (
    <div className="min-h-screen relative">
      <p className="select-none mt-3 text-base md:text-2xl font-medium text-center bg-orange-500 px-8 py-2 rounded-full w-max mx-auto text-white">
        Welcome to{" "}
        <span className="text-orange-500 font-bold bg-white px-8 py-1.5 rounded-full">
          Food Blast
        </span>
      </p>
      <div
        onClick={() => setShowCart(true)}
        className="relative md:absolute top-1 md:top-4 left-1/2 -translate-x-1/2 md:left-10 h-11 w-11 cursor-pointer duration-300 active:scale-90 rounded-full bg-orange-500 flex items-center justify-center"
      >
        <p className="bg-white font-semibold text-sm text-orange-500 absolute top-0 right-0 aspect-square rounded-full p-0.5 border border-orange-500">
          {cart?.reduce((a, c) => a + c.qty, 0) || 0}
        </p>
        <FaCartShopping className="text-xl text-white" />
      </div>
      {showCart && (
        <div className="fixed z-50 top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.5)]">
          <motion.div
            initial={{ scale: 0.5, x: "-50%", y: "-50%", opacity: 0 }}
            whileInView={{ scale: 1, x: "-50%", y: "-50%", opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="absolute top-[45%] md:top-1/2 left-1/2 bg-white h-[80%] overflow-y-scroll md:overflow-y-auto md:h-[85%] w-[95%] md:w-[70%] rounded-xl flex flex-col items-center justify-start gap-2 font-medium p-10"
          >
            <FaTimes
              className="absolute top-5 right-5 text-3xl cursor-pointer text-white bg-orange-500 p-1.5 aspect-square rounded-full"
              onClick={() => setShowCart(false)}
            />
            {cart.length == 0 && (
              <p className="text-center text-xl text-slate-500 font-medium mt-10">
                No Item in Cart
              </p>
            )}
            {cart.length > 0 && (
              <div className="text-slate-500 flex flex-wrap gap-4 items-start">
                {cart.map((_f, _i) => (
                  <div
                    className="flex flex-col items-center justify-center gap-2 border border-orange-500 p-3 rounded-lg"
                    key={_i}
                  >
                    <Image
                      src={_f.image}
                      width="100"
                      height="100"
                      alt={_f.name}
                      className="rounded-lg"
                    />
                    <p>{_f.name}</p>
                    <div className="flex items-center justify-center gap-2">
                      <p
                        className="p-2 aspect-square rounded-full border cursor-pointer"
                        onClick={() => {
                          if (_f.qty + 1 <= _f.quantity) {
                            const updatedCart = cart.map((item) =>
                              item._id === _f._id
                                ? { ...item, qty: item.qty + 1 }
                                : item
                            );
                            setCart(updatedCart);
                            toast.success("Food Added");
                          } else {
                            toast.error("No Quantity Left");
                            return;
                          }
                        }}
                      >
                        +
                      </p>
                      <p className="p-2 aspect-square rounded-full">{_f.qty}</p>
                      <p
                        className="p-2 aspect-square rounded-full border cursor-pointer"
                        onClick={() => {
                          if (_f.qty - 1 > 0) {
                            const updatedCart = cart.map((item) =>
                              item._id === _f._id
                                ? { ...item, qty: item.qty - 1 }
                                : item
                            );
                            setCart(updatedCart);
                            toast.success("Item Increased");
                          } else {
                            const updatedCart = cart.filter(
                              (item) => item._id !== _f._id
                            );
                            setCart(updatedCart);
                            toast.success("Item Decreased");
                            return;
                          }
                        }}
                      >
                        -
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-4 font-semibold text-orange-500">
              Food Price:{" "}
              {cart.reduce((a, c) => a + c.discountedPrice * c.qty, 0)} BDT
            </p>
            <p className="font-semibold text-orange-500">
              Delivery Charge:0 BDT
            </p>
            <p className="font-bold text-orange-500">
              Grand Total:{" "}
              {cart.reduce((a, c) => a + c.discountedPrice * c.qty, 0)} BDT
            </p>
            {cart.length > 0 && (
              <div className="p-5 border rounded-lg flex flex-col gap-3">
                <input
                  name="name"
                  onChange={(e) =>
                    setCustomer((prevCustomer) => ({
                      ...prevCustomer,
                      name: e.target.value,
                    }))
                  }
                  type="text"
                  placeholder="Your Name"
                  className="px-6 py-2 bg-orange-100 rounded-lg text-orange-500 outline-none"
                  value={customer.name}
                />
                <input
                  name="number"
                  onChange={(e) =>
                    setCustomer((prevCustomer) => ({
                      ...prevCustomer,
                      number: e.target.value,
                    }))
                  }
                  type="text"
                  placeholder="Contact Number"
                  className="px-6 py-2 bg-orange-100 rounded-lg text-orange-500 outline-none"
                  value={customer.number}
                />
                <input
                  name="floor"
                  onChange={(e) =>
                    setCustomer((prevCustomer) => ({
                      ...prevCustomer,
                      floor: e.target.value,
                    }))
                  }
                  type="text"
                  placeholder="Floor Number"
                  className="px-6 py-2 bg-orange-100 rounded-lg text-orange-500 outline-none"
                  value={customer.floor}
                />
                <input
                  name="room"
                  onChange={(e) =>
                    setCustomer((prevCustomer) => ({
                      ...prevCustomer,
                      room: e.target.value,
                    }))
                  }
                  type="text"
                  placeholder="Room Number"
                  className="px-6 py-2 bg-orange-100 rounded-lg text-orange-500 outline-none"
                  value={customer.room}
                />
              </div>
            )}
            {cart.length > 0 && (
              <button
                onClick={confirmOrder}
                className="mb-10 px-8 py-2 border rounded-full border-orange-500 duration-300 active:scale-90 text-orange-500 font-semibold cursor-pointer"
              >
                Confirm
              </button>
            )}
          </motion.div>
        </div>
      )}
      {/* Main Items  */}
      <div className="p-3 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-5">
        {foods &&
          foods?.length > 0 &&
          foods?.map((_f, i) => (
            <div
              onClick={() => addFood(_f._id)}
              className="flex items-center gap-3 border rounded-lg p-2 border-orange-500 cursor-pointer hover:scale-105 active:scale-90 duration-300 pr-4"
              key={i}
            >
              <Image
                className="aspect-video rounded-lg w-36"
                src={_f.image}
                alt={_f.name}
                width="100"
                height="100"
              />
              <div className="flex flex-col justify-evenly h-full">
                <p className="font-semibold text-orange-500">{_f.name}</p>
                <p className="text-xs text-slate-800">{_f.description}</p>
                <p className="text-sm font-medium text-orange-500">
                  Available: {_f.quantity}
                </p>
              </div>
              <div className="text-sm flex-1 ml-3">
                <p className="w-max">
                  <del>{_f.regularPrice} BDT</del>
                </p>
                <p className="font-semibold text-orange-500 w-max">
                  {_f.discountedPrice} BDT
                </p>
              </div>
              <FaPlus className="text-xl text-orange-500 font-bold" />
              <div className="hidden flexx items-center justify-center gap-3">
                Ingredients:
                {_f.ingredients.map((_i) => (
                  <p key={_i}>{_i}, </p>
                ))}
              </div>
            </div>
          ))}
      </div>
      {foods && foods.length == 0 && (
        <p className="text-center text-xl font-semibold text-orange-500 mt-10">
          No Foods Found
        </p>
      )}
      {!foods && (
        <p className="text-center text-xl font-semibold text-orange-500 mt-10 flex items-center gap-2 justify-center">
          Loading Foods <CgSpinner className="animate-spin text-xl" />
        </p>
      )}
    </div>
  );
};

export default FoodBlast;
