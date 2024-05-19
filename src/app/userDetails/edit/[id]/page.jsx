"use client";

import PreLoader from "@/Components/PreLoader/PreLoader";
import { base64 } from "@/utils/base64";
import { imageUpload } from "@/utils/imageUpload";
import { makeFile } from "@/utils/makeFile";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { CiImageOn } from "react-icons/ci";

const Page = ({ params }) => {
  const { id } = params;
  console.log(id);

  const [newProfilePictureUploading, setNewProfilePictureUploading] =
    useState(false);

  const { data: client, refetch: clientRefetch } = useQuery({
    queryKey: ["userEdit", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/clients/getclient?id=${id}`);
      return data.client;
    },
  });

  console.log(client);

  const handleSave = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const contactNumber = e.target.contactNumber.value;
    const fathersNumber = e.target.fathersNumber.value;
    const mothersNumber = e.target.mothersNumber.value;
    const messAddress = e.target.messAddress.value;
    const floor = e.target.floor.value;
    const utilityCharge = e.target.utilityCharge.value;
    const bloodGroup = e.target.bloodGroup.value;
    const institution = e.target.institution.value;
    const roomNumber = e.target.roomNumber.value;
    const wifiCharge = e.target.wifiCharge.value;
    const studentId = e.target.studentId.value;
    if (
      username == client.username &&
      email == client.email &&
      contactNumber == client.contactNumber &&
      fathersNumber == client.fathersNumber &&
      mothersNumber == client.mothersNumber &&
      messAddress == client.messAddress &&
      floor == client.floor &&
      utilityCharge == client.utilityCharge &&
      bloodGroup == client.bloodGroup &&
      institution == client.institution &&
      roomNumber == client.roomNumber &&
      wifiCharge == client.wifiCharge &&
      studentId == client.studentId
    ) {
      toast.error("No Change");
      return;
    }
    const changedData = {};
    if (username != client.username) changedData.username = username;
    if (email != client.email) changedData.email = email;
    if (contactNumber != client.contactNumber)
      changedData.contactNumber = contactNumber;
    if (fathersNumber != client.fathersNumber)
      changedData.fathersNumber = fathersNumber;
    if (mothersNumber != client.mothersNumber)
      changedData.mothersNumber = mothersNumber;
    if (messAddress != client.messAddress)
      changedData.messAddress = messAddress;
    if (floor != client.floor) changedData.floor = floor;
    if (utilityCharge != client.utilityCharge)
      changedData.utilityCharge = utilityCharge;
    if (bloodGroup != client.bloodGroup) changedData.bloodGroup = bloodGroup;
    if (institution != client.institution)
      changedData.institution = institution;
    if (roomNumber != client.roomNumber) changedData.roomNumber = roomNumber;
    if (wifiCharge != client.wifiCharge) changedData.wifiCharge = wifiCharge;
    if (studentId != client.studentId) changedData.studentId = studentId;

    console.log(changedData);
    try {
      const { data } = await axios.put("/api/clients/editclient", {
        changedData,
        _id: client._id,
      });
      if (data.success) toast.success(data.msg);
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    }
  };

  const [newPhotos, setNewPhotos] = useState({
    profilePicture: "",
    nidFront: "",
    nidBack: "",
    birthCertificate: "",
  });

  const selectingNewProfilePicture = async (e, target) => {
    if (e.target.files[0]) {
      if (target == "profilePicture") {
        const base = await base64(e.target.files[0]);
        setNewPhotos({ ...newPhotos, profilePicture: base });
      } else if (target == "nidFront") {
        const base = await base64(e.target.files[0]);
        setNewPhotos({ ...newPhotos, nidFront: base });
      } else if (target == "nidBack") {
        const base = await base64(e.target.files[0]);
        setNewPhotos({ ...newPhotos, nidBack: base });
      }
    }
  };

  const newPictureUploader = async (target) => {
    setNewProfilePictureUploading(true);
    let newPictureFile;
    let newPictureUrl;
    let newData = {};
    if (target == "profilePicture") {
      newPictureFile = await makeFile(
        newPhotos.profilePicture,
        `New Profile Picture of ${client.username}`,
        "image/png"
      );
      newPictureUrl = await imageUpload(newPictureFile);
      newData = { profilePicture: newPictureUrl };
    } else if (target == "nidFront") {
      newPictureFile = await makeFile(
        newPhotos.nidFront,
        `New Nid Front Picture of ${client.username}`,
        "image/png"
      );
      newPictureUrl = await imageUpload(newPictureFile);
      newData = { nidFrontPicture: newPictureUrl };
    } else if (target == "nidBack") {
      newPictureFile = await makeFile(
        newPhotos.nidBack,
        `New Nid Back Picture of ${client.username}`,
        "image/png"
      );
      newPictureUrl = await imageUpload(newPictureFile);
      newData = { nidBackPicture: newPictureUrl };
    }
    try {
      const { data } = await axios.put("/api/clients/editclient", {
        changedData: newData,
        _id: client._id,
      });
      if (data.success) {
        await clientRefetch();
        toast.success(data.msg);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    } finally {
      setNewProfilePictureUploading(false);
      setNewPhotos({
        profilePicture: "",
        nidFront: "",
        nidBack: "",
        birthCertificate: "",
      });
    }
  };

  if (!client) return <PreLoader />;

  return (
    <div className="min-h-screen dark:bg-gradient-to-r dark:from-primary dark:to-secondary dark:text-white font-semibold">
      <div class="bg-gray-100 dark:bg-gradient-to-r dark:from-primary dark:to-secondary">
        <p className="text-center underline text-xl pt-6">Edit User</p>
        <div class="container mx-auto px-4 py-10">
          <form onSubmit={handleSave} class="flex flex-wrap -mx-3">
            <div class="lg:w-1/3 md:w-1/2 px-3 mb-6 md:mb-0">
              <div class="flex flex-col justify-center items-center">
                <div className="w-48 h-48 rounded-full mb-3 relative group">
                  <Image
                    alt="User Profile"
                    width={192}
                    height={192}
                    class="w-48 h-48 rounded-full"
                    src={
                      newPhotos.profilePicture
                        ? newPhotos.profilePicture
                        : client.profilePicture
                    }
                  />
                  <input
                    onChange={(e) =>
                      selectingNewProfilePicture(e, "profilePicture")
                    }
                    accept="image/*"
                    type="file"
                    name="newProfilePicture"
                    id="newProfilePicture"
                    className="hidden"
                  />
                  {newPhotos.profilePicture == "" && (
                    <label
                      htmlFor="newProfilePicture"
                      className={`h-full w-full top-0 bg-[rgba(0,0,0,0.7)] -z-10 group-hover:z-10 rounded-full duration-100 ease-linear cursor-pointer absolute overflow-hidden`}
                    >
                      <div className="w-full h-[2px] bg-white absolute top-[70%] left-1/2 -translate-x-1/2"></div>
                      <p className="absolute top-[60%] left-1/2 -translate-x-1/2 text-xs">
                        Click to change
                      </p>
                      <CiImageOn className="text-3xl absolute bottom-[10%] left-1/2 -translate-x-1/2" />
                    </label>
                  )}
                  {newPhotos.profilePicture != "" && (
                    <div
                      // htmlFor="newProfilePicture"
                      className={`h-full w-full top-0 bg-[rgba(0,0,0,0.7)] -z-10 group-hover:z-10 rounded-full duration-100 ease-linear cursor-pointer absolute overflow-hidden flex flex-col items-center justify-center gap-3`}
                    >
                      <p
                        onClick={() => newPictureUploader("profilePicture")}
                        className="px-2 py-1 bg-[rgba(0,0,0,0.5)] hover:scale-105 duration-300 text-stone-400 cursor-pointer select-none text-center active:scale-90"
                      >
                        {newProfilePictureUploading ? (
                          <CgSpinner className="animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </p>
                      <label htmlFor="newProfilePicture">
                        <p className="px-2 py-1 bg-[rgba(0,0,0,0.5)] hover:scale-105 duration-300 text-stone-400 cursor-pointer select-none active:scale-90">
                          Change
                        </p>
                      </label>
                      <p
                        onClick={() =>
                          setNewPhotos({ ...newPhotos, profilePicture: "" })
                        }
                        className="px-2 py-1 bg-[rgba(255,0,0,0.5)] hover:scale-105 duration-300 text-stone-400 cursor-pointer select-none active:scale-90"
                      >
                        Clear
                      </p>
                    </div>
                  )}
                </div>
                <div class="w-full md:w-[280px] px-3 mb-2">
                  <label
                    class="block tracking-wide text-white font-bold mb-1"
                    for="username"
                  >
                    Name
                  </label>
                  <input
                    class="select-none appearance-none block w-full md:w-[280px] bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    name="username"
                    id="username"
                    type="text"
                    defaultValue={client.username}
                  />
                </div>
                <div class="w-full md:w-[280px] px-3 mb-2">
                  <label
                    class="block tracking-wide text-white font-bold mb-1"
                    for="email"
                  >
                    E-mail
                  </label>
                  <input
                    class="select-none appearance-none block w-full md:w-[280px] bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    name="email"
                    id="email"
                    type="text"
                    defaultValue={client.email}
                  />
                </div>
                <div class="w-full md:w-[280px] px-3 mb-2">
                  <label
                    class="block tracking-wide text-white font-bold mb-1"
                    for="contactNumber"
                  >
                    Contact Number
                  </label>
                  <input
                    class="select-none appearance-none block w-full md:w-[280px] bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    name="contactNumber"
                    id="contactNumber"
                    type="text"
                    defaultValue={client.contactNumber}
                  />
                </div>
                <div class="w-full md:w-[280px] px-3 mb-2">
                  <label
                    class="block tracking-wide text-white font-bold mb-1"
                    for="fathersNumber"
                  >
                    Father&apos;s Number
                  </label>
                  <input
                    class="select-none appearance-none block w-full md:w-[280px] bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    name="fathersNumber"
                    id="fathersNumber"
                    type="text"
                    defaultValue={client.fathersNumber}
                  />
                </div>
                <div class="w-full md:w-[280px] px-3 mb-2">
                  <label
                    class="block tracking-wide text-white font-bold mb-1"
                    for="mothersNumber"
                  >
                    Mother&apos;s Number:
                  </label>
                  <input
                    class="select-none appearance-none block w-full md:w-[280px] bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    name="mothersNumber"
                    id="mothersNumber"
                    type="text"
                    defaultValue={client.mothersNumber}
                  />
                </div>
                <p class="text-black dark:text-gray-100 mt-4">
                  Authentication: {client.nidAuth ? "NID" : "Birth Certificate"}
                </p>
                <button
                  type="submit"
                  className="duration-300 transition-all px-4 py-1 rounded-md font-medium bg-green-500 active:scale-90 mt-5"
                >
                  Save
                </button>
              </div>
            </div>
            <div class="lg:w-2/3 md:w-1/2 px-3">
              <div class="flex flex-wrap">
                <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-white font-bold mb-2"
                    for="messAddress"
                  >
                    Mess Address
                  </label>
                  <input
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    name="messAddress"
                    id="messAddress"
                    type="text"
                    defaultValue={client.messAddress}
                  />
                </div>
                <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-white font-bold mb-2"
                    for="institution"
                  >
                    Institution
                  </label>
                  <input
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    name="institution"
                    id="institution"
                    type="text"
                    defaultValue={client.institution}
                  />
                </div>
                <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-white font-bold mb-2"
                    for="floor"
                  >
                    Floor Number
                  </label>
                  <select
                    id="floor"
                    name="floor"
                    defaultValue={client.floor}
                    className="border border-gray-300 p-2 w-full rounded text-stone-900"
                  >
                    <option value="1">First Floor</option>
                    <option value="2">Second Floor</option>
                    <option value="3">Third Floor</option>
                    <option value="4">Fourth Floor</option>
                    <option value="5">Fifth Floor</option>
                    <option value="6">Sixth Floor</option>
                    <option value="7">Seventh Floor</option>
                    <option value="8">Eighth Floor</option>
                    <option value="9">Nineth Floor</option>
                    <option value="10">Tenth Floor</option>
                    <option value="11">Eleventh Floor</option>
                    <option value="12">Twelveth Floor</option>
                  </select>
                </div>
                <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-white font-bold mb-2"
                    for="roomNumber"
                  >
                    Room Number
                  </label>
                  <select
                    id="roomNumber"
                    name="roomNumber"
                    defaultValue={client.roomNumber}
                    className="border border-gray-300 p-2 w-full rounded text-stone-900"
                  >
                    <option value="">Select Room</option>
                    <option value="a1">A 1</option>
                    <option value="a2">A 2</option>
                    <option value="a3">A 3</option>
                    <option value="a4">A 4</option>
                    <option value="a5">A 5</option>
                    <option value="a6">A 6</option>
                    <option value="b1">B 1</option>
                    <option value="b2">B 2</option>
                    <option value="b3">B 3</option>
                    <option value="b4">B 4</option>
                  </select>
                </div>
                <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-white font-bold mb-2"
                    for="utilityCharge"
                  >
                    Utility Charge
                  </label>
                  <input
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="utilityCharge"
                    name="utilityCharge"
                    type="text"
                    defaultValue={client.utilityCharge}
                  />
                </div>
                <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-white font-bold mb-2"
                    for="wifiCharge"
                  >
                    Wifi Charge
                  </label>
                  <input
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="wifiCharge"
                    name="wifiCharge"
                    type="text"
                    defaultValue={client.wifiCharge}
                  />
                </div>
                <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-white font-bold mb-2"
                    for="bloodGroup"
                  >
                    Blood Group
                  </label>
                  <input
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="bloodGroup"
                    name="bloodGroup"
                    type="text"
                    defaultValue={client.bloodGroup}
                  />
                </div>
                <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-white font-bold mb-2"
                    for="studentId"
                  >
                    Student or Job ID
                  </label>
                  <input
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="studentId"
                    name="studentId"
                    type="text"
                    defaultValue={client.studentId}
                  />
                </div>
              </div>
              {client.nidAuth ? (
                <div className="flex flex-col md:flex-row justify-around items-start">
                  <div className="">
                    <p className="mb-2">NID Front</p>
                    <div className="rounded-md relative group">
                      <Image
                        src={
                          newPhotos.nidFront
                            ? newPhotos.nidFront
                            : client.nidFrontPicture
                        }
                        width={350}
                        height={60}
                        className="rounded-md"
                        alt={`NID front of ${client.username}`}
                      />
                      <input
                        onChange={(e) =>
                          selectingNewProfilePicture(e, "nidFront")
                        }
                        accept="image/*"
                        type="file"
                        name="newNidFront"
                        id="newNidFront"
                        className="hidden"
                      />
                      {newPhotos.nidFront == "" && (
                        <label
                          htmlFor="newNidFront"
                          className={`h-full w-full top-0 bg-[rgba(0,0,0,0.7)] -z-10 group-hover:z-10 rounded-md duration-100 ease-linear cursor-pointer absolute overflow-hidden block`}
                        >
                          <div className="w-full h-[2px] bg-white absolute top-[70%] left-1/2 -translate-x-1/2"></div>
                          <p className="absolute top-[60%] left-1/2 -translate-x-1/2 text-xs">
                            Click to change
                          </p>
                          <CiImageOn className="text-3xl absolute bottom-[10%] left-1/2 -translate-x-1/2" />
                        </label>
                      )}

                      {newPhotos.nidFront != "" && (
                        <div
                          // htmlFor="newProfilePicture"
                          className={`h-full w-full top-0 bg-[rgba(0,0,0,0.7)] -z-10 group-hover:z-10 rounded-md duration-100 ease-linear cursor-pointer absolute overflow-hidden flex flex-col items-center justify-center gap-3`}
                        >
                          <p
                            onClick={() => newPictureUploader("nidFront")}
                            className="px-2 py-1 bg-[rgba(0,0,0,0.5)] hover:scale-105 duration-300 text-stone-400 cursor-pointer select-none text-center active:scale-90"
                          >
                            {newProfilePictureUploading ? (
                              <CgSpinner className="animate-spin" />
                            ) : (
                              "Save"
                            )}
                          </p>
                          <label htmlFor="newNidFront">
                            <p className="px-2 py-1 bg-[rgba(0,0,0,0.5)] hover:scale-105 duration-300 text-stone-400 cursor-pointer select-none active:scale-90">
                              Change
                            </p>
                          </label>
                          <p
                            onClick={() =>
                              setNewPhotos({ ...newPhotos, nidFront: "" })
                            }
                            className="px-2 py-1 bg-[rgba(255,0,0,0.5)] hover:scale-105 duration-300 text-stone-400 cursor-pointer select-none active:scale-90"
                          >
                            Clear
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2">NID Back</p>
                    <div className="rounded-md relative group">
                      <Image
                        src={
                          newPhotos.nidBack
                            ? newPhotos.nidBack
                            : client.nidBackPicture
                        }
                        width={350}
                        height={60}
                        className="rounded-md"
                        alt={`NID back of ${client.username}`}
                      />
                      <input
                        onChange={(e) =>
                          selectingNewProfilePicture(e, "nidBack")
                        }
                        accept="image/*"
                        type="file"
                        name="newNidBack"
                        id="newNidBack"
                        className="hidden"
                      />
                      {newPhotos.nidBack == "" && (
                        <label
                          htmlFor="newNidBack"
                          className={`h-full w-full top-0 bg-[rgba(0,0,0,0.7)] -z-10 group-hover:z-10 rounded-md duration-100 ease-linear cursor-pointer absolute overflow-hidden block`}
                        >
                          <div className="w-full h-[2px] bg-white absolute top-[70%] left-1/2 -translate-x-1/2"></div>
                          <p className="absolute top-[60%] left-1/2 -translate-x-1/2 text-xs">
                            Click to change
                          </p>
                          <CiImageOn className="text-3xl absolute bottom-[10%] left-1/2 -translate-x-1/2" />
                        </label>
                      )}

                      {newPhotos.nidBack != "" && (
                        <div
                          // htmlFor="newProfilePicture"
                          className={`h-full w-full top-0 bg-[rgba(0,0,0,0.7)] -z-10 group-hover:z-10 rounded-md duration-100 ease-linear cursor-pointer absolute overflow-hidden flex flex-col items-center justify-center gap-3`}
                        >
                          <p
                            onClick={() => newPictureUploader("nidBack")}
                            className="px-2 py-1 bg-[rgba(0,0,0,0.5)] hover:scale-105 duration-300 text-stone-400 cursor-pointer select-none text-center active:scale-90"
                          >
                            {newProfilePictureUploading ? (
                              <CgSpinner className="animate-spin" />
                            ) : (
                              "Save"
                            )}
                          </p>
                          <label htmlFor="newNidBack">
                            <p className="px-2 py-1 bg-[rgba(0,0,0,0.5)] hover:scale-105 duration-300 text-stone-400 cursor-pointer select-none active:scale-90">
                              Change
                            </p>
                          </label>
                          <p
                            onClick={() =>
                              setNewPhotos({ ...newPhotos, nidBack: "" })
                            }
                            className="px-2 py-1 bg-[rgba(255,0,0,0.5)] hover:scale-105 duration-300 text-stone-400 cursor-pointer select-none active:scale-90"
                          >
                            Clear
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <p className="mb-2">Birth Certificate</p>
                  <Image
                    src={client.birthCertificatePicture}
                    width={400}
                    height={40}
                    className="rounded-md"
                    alt={`Birth Certificate of ${client.username}`}
                  />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
