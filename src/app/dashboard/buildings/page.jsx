"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { FaExchangeAlt, FaPlus, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { useRouter, useSearchParams } from "next/navigation";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { AuthContext } from "@/providers/ContextProvider";

const ManagerBooksComponent = () => {
  const route = useRouter();
  const { user } = useContext(AuthContext);
  const {
    data: buildings,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["buildings", "manager", user?._id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/buildings`);
      if (data.success) {
        return data.buildings.reverse();
      } else {
        return [];
      }
    },
    enabled: user?._id && user?.role == "manager" ? true : false,
  });

  if (!user) return <PreLoader />;
  if (user?.success == false) return route.push("/signin");
  if (user.role != "manager") return route.push("/");

  const createBook = async (e) => {
    try {
      console.log(createBookData);
      setCreateBookData((prevData) => ({
        ...prevData,
        isCreating: true,
      }));
      const { data } = await axios.post("/api/book", createBookData);
      if (!data.success) throw new Error(data.msg);
      await refetch();
      toast.success(data.msg);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.msg || error?.message || "Something Went Wrong!"
      );
    } finally {
      setCreateBookData(initialState);
    }
  };

  const deletePage = async (id) => {
    const swalData = await Swal.fire({
      title: "Do you want to Delete this Page?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1493EA",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      background: "#141E30",
      color: "#fff",
    });
    if (!swalData.isConfirmed) return;
    try {
      const { data } = await axios.delete(`/api/page?pageId=${id}`);
      if (!data.success) throw new Error(data.msg);
      setReloadBook(!reloadBook);
      toast.success("Page Deleted");
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.msg || error?.message || "Something Went Wrong!"
      );
    } finally {
      setSelectedPage(null);
    }
  };

  return (
    <div className="relative min-h-full p-5 bg-dashboard text-slate-100">
      <button className="flex items-center absolute top-5 right-5 gap-2 font-semibold text-white bg-blue-500 px-4 py-1 rounded-md active:scale-90 duration-300">
        Add <FaPlus className="text-l" />
      </button>
      <p className="text-center font-semibold text-xl dark:text-white">
        Buildings
      </p>
      {buildings?.length == 0 && (
        <p className="text-center text-lg font-semibold mt-10">
          No Buildings Found, Try Creating One
        </p>
      )}
      {isLoading && (
        <p className="text-center text-lg font-semibold mt-10 flex items-center justify-center gap-2">
          Loading Buildings <CgSpinner className="animate-spin text-lg" />
        </p>
      )}
      {buildings?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 mt-6">
          {buildings.map((building) => (
            <div
              className="px-6 py-2 rounded-md border duration-300 hover:scale-105 cursor-pointer active:scale-90 select-none"
              style={{
                boxShadow: `5px 10px 10px ${building.color}`,
              }}
              key={building._id}
            >
              <p className="text-xl text-white font-semibold mb1">
                {building.title}
              </p>
              <p className="text-sm text-slate-400">
                {building.subTitle}
                <span className="ml-2 font-bold">৳ {building.totalAmount}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerBooksComponent;
