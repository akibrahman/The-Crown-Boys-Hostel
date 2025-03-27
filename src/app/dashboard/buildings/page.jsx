"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useContext, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { AuthContext } from "@/providers/ContextProvider";
import AddBuinding from "./AddBuinding";
import Image from "next/image";
import { RiEdit2Fill } from "react-icons/ri";
import EditBuilding from "./EditBuilding";

const ManagerBuildingsComponent = () => {
  const route = useRouter();
  const { user } = useContext(AuthContext);
  const [deleting, setDeleting] = useState([false, ""]);
  const {
    data: buildings,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["buildings", "manager", user?._id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/buildings`);
      if (data.success) {
        return data.buildings;
      } else {
        return [];
      }
    },
    enabled: user?._id && user?.role == "manager" ? true : false,
  });

  if (!user) return <PreLoader />;
  if (user?.success == false) return route.push("/signin");
  if (user.role != "manager") return route.push("/");

  const deleteBuilding = async (id) => {
    const swalData = await Swal.fire({
      title: "Do you want to Delete this Building?",
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
      if (!id) return;
      setDeleting([true, id]);
      const { data } = await axios.delete(`/api/building?buildingId=${id}`);
      if (!data.success) throw new Error(data.msg);
      await refetch();
      toast.success(data.msg);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || error?.message);
    } finally {
      setDeleting[(false, "")];
    }
  };

  return (
    <div className="relative min-h-full p-5 bg-dashboard text-slate-100">
      <AddBuinding refetch={refetch} />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {buildings.map((building) => (
            <div
              key={building._id}
              className="bg-secondary text-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Building Image */}
              {building.buildingImage && (
                <Image
                  src={building.buildingImage}
                  alt={building.name}
                  width="500"
                  height="500"
                  className="w-52 h-60 object-cover aspect-square mx-auto rounded-xl"
                />
              )}

              <div className="p-4">
                {/* Building Name */}
                <h2 className="text-xl font-semibold">{building.name}</h2>

                {/* Building Location */}
                <p className="">
                  {building.location || "No location provided"}
                </p>

                {/* Building Info */}
                <div className="mt-4 flex items-end justify-between">
                  <div className="">
                    <p className="">
                      <strong>Floors: </strong>
                      {building.floorsCount}
                    </p>
                    <p className="">
                      <strong>Area: </strong>
                      {building.sqFt} Sq. Ft.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    {deleting[0] && deleting[1] == building._id ? (
                      <CgSpinner className="text-3xl text-red-500 bg-red-200 animate-spin p-1.5 rounded-full cursor-wait" />
                    ) : (
                      <MdDelete
                        onClick={() => deleteBuilding(building._id)}
                        className="text-3xl text-red-500 bg-red-200 p-1.5 rounded-full duration-300 active:scale-90 cursor-pointer"
                      />
                    )}
                    <EditBuilding
                      building={building}
                      user={user}
                      refetch={refetch}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerBuildingsComponent;
