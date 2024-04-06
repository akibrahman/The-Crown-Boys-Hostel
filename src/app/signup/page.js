"use client";

import { base64 } from "@/utils/base64";
import { imageUpload } from "@/utils/imageUpload";
import { makeFile } from "@/utils/makeFile";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaPlusCircle, FaTimes } from "react-icons/fa";
import Select from "react-select";
const Registration = () => {
  const router = useRouter();
  const [preview, setPreview] = useState(null);
  const [nidFront, setNidFront] = useState(null);
  const [nidBack, setNidBack] = useState(null);
  const [birthCertificate, setBrithCertificate] = useState(null);
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [isNid, setIsNid] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //! Get Managers
  const { data: verifiedManagers } = useQuery({
    queryKey: ["managers", "signup"],
    queryFn: async () => {
      const { data } = await axios.get("api/managers/getmanagers");
      if (data.success) {
        const tempVerifiedManagers = data.managers.filter(
          (manager) =>
            manager.isManagerVerified === true && manager.isVerified === true
        );
        const verifiedManagers = tempVerifiedManagers.map((manager) => ({
          value: manager._id,
          label: manager.username,
        }));

        return verifiedManagers;
      }
      return null;
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const testHandler = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalData = { ...formData, role };
    if (finalData.password !== finalData.confirmPassword) {
      toast.error("Passwords are not same !");
      return;
    }
    setLoading(true);
    if (!preview) {
      toast.error("No profile picture!");
      setLoading(false);
      return;
    }
    if (isNid ? !nidFront || !nidBack : !birthCertificate) {
      toast.error("Set identity properly");
      setLoading(false);
      return;
    }

    const profilePicture = await imageUpload(
      await makeFile(preview, `Profile Picture of ${formData.username}`, "png")
    );
    if (isNid) {
      const nidFrontPicture = await imageUpload(
        await makeFile(nidFront, `NID Front of ${formData.username}`, "png")
      );
      const nidBackPicture = await imageUpload(
        await makeFile(nidBack, `NID Back of ${formData.username}`, "png")
      );
      const birthCertificatePicture = null;
      finalData = {
        ...finalData,
        profilePicture,
        nidFrontPicture,
        nidBackPicture,
        birthCertificatePicture,
      };
    } else {
      const nidFrontPicture = null;
      const nidBackPicture = null;
      const birthCertificatePicture = await imageUpload(
        await makeFile(
          birthCertificate,
          `Birth Certificate of ${formData.username}`,
          "png"
        )
      );
      finalData = {
        ...finalData,
        profilePicture,
        nidFrontPicture,
        nidBackPicture,
        birthCertificatePicture,
      };
    }
    // console.log(finalData);
    // return;
    try {
      const res = await axios.post("/api/users/signup", finalData);
      console.log(res.data);
      if (res.data.success) {
        toast.success("Registration Successful");
        router.push("/signin");
      } else {
        if (res.data.code === 1212) {
          toast.error("User exists with this E-mail !");
        }
        if (res.data.code === 1010) {
          toast.error(res.data.msg);
        }
      }
    } catch (error) {
      toast.error("Error for Registration");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!verifiedManagers) return <p>Loading.............</p>;

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${
          role === "manager" ? "bg-stone-950" : "bg-stone-900"
        } p-10 rounded shadow-md w-full duration-300`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => {
                setRole("manager");
                setFormData({ ...formData, institution: "" });
              }}
              className={`border px-4 py-2 border-yellow-500 rounded-lg font-bold duration-300 ${
                role === "manager"
                  ? "bg-yellow-500 text-stone-900"
                  : "bg-transparent text-white"
              }`}
            >
              Manager
            </button>
            <button
              onClick={() => {
                setRole("client");
                setFormData({ ...formData, bkashNumber: "" });
              }}
              className={`border px-4 py-2 border-yellow-500 rounded-lg font-bold duration-300 ${
                role === "client"
                  ? "bg-yellow-500 text-stone-900"
                  : "bg-transparent text-white"
              }`}
            >
              Client
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-cente gap-4">
            {/* Left Side  */}
            <div className="w-1/2">
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded text-stone-900"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded text-stone-900"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded text-stone-900"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded text-stone-900"
                  required
                />
              </div>
              <div className="mb-4 mt-8 flex items-center gap-4">
                <span
                  className={`${
                    !isNid ? "bg-yellow-500" : "bg-stone-500"
                  } px-3 py-1 font-medium rounded-md duration-300 transition-all`}
                >
                  Birth Certificate
                </span>
                {/* Toggle Switch  */}
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    onClick={() => {
                      setIsNid(!isNid);
                      setNidFront(null);
                      setNidBack(null);
                      setBrithCertificate(null);
                    }}
                    type="checkbox"
                    value=""
                    className={`sr-only ${isNid ? "peer" : ""}`}
                    checked
                  />
                  <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
                <span
                  className={`${
                    !isNid ? "bg-stone-500" : "bg-yellow-500"
                  } px-3 py-1 font-medium rounded-md duration-300 transition-all`}
                >
                  NID Birth
                </span>
              </div>
              {/* Area for NID Input  */}
              {isNid && (
                <div className="mb-8 mt-4 flex items-center justify-center gap-8">
                  <div className="">
                    <label
                      htmlFor="nidFront"
                      className="block text-white text-sm font-bold mb-2 cursor-pointer"
                    >
                      NID Front
                    </label>
                    {nidFront ? (
                      <div className="relative">
                        <Image
                          src={nidFront}
                          width={"200"}
                          height={"100"}
                          alt="NID Front"
                          className="rounded-md"
                        />
                        <FaTimes
                          onClick={() => setNidFront(null)}
                          className="absolute top-0 right-0 bg-yellow-500 text-white p-1.5 text-3xl rounded-full cursor-pointer duration-300 active:scale-90"
                        />
                      </div>
                    ) : (
                      <label
                        htmlFor="nidFront"
                        className={`w-[200px] h-[100px] bg-no-repeat bg-center bg-contain block bg-[url('/svg/nid-front-blank.svg')] cursor-pointer`}
                      ></label>
                    )}
                    <input
                      onChange={async (e) => {
                        const base = await base64(e.target.files[0]);
                        setNidFront(base);
                      }}
                      className="hidden"
                      type="file"
                      id="nidFront"
                    />
                  </div>
                  <div className="">
                    <label
                      htmlFor="nidBack"
                      className="block text-white text-sm font-bold mb-2 cursor-pointer"
                    >
                      NID Back
                    </label>
                    {nidBack ? (
                      <div className="relative">
                        <Image
                          src={nidBack}
                          width={"200"}
                          height={"100"}
                          className="rounded-md"
                          alt="NID Back"
                        />
                        <FaTimes
                          onClick={() => setNidBack(null)}
                          className="absolute top-0 right-0 bg-yellow-500 text-white p-1.5 text-3xl rounded-full cursor-pointer duration-300 active:scale-90"
                        />
                      </div>
                    ) : (
                      <label
                        htmlFor="nidBack"
                        className="w-[200px] h-[100px] bg-no-repeat bg-center bg-contain block bg-[url('/svg/nid-back-blank.svg')] cursor-pointer"
                      ></label>
                    )}

                    <input
                      onChange={async (e) => {
                        const base = await base64(e.target.files[0]);
                        setNidBack(base);
                      }}
                      className="hidden"
                      type="file"
                      id="nidBack"
                    />
                  </div>
                </div>
              )}
              {/* Area for Birth Certificate  */}
              {isNid || (
                <div className="mb-8 mt-4">
                  <label
                    htmlFor="birthCertificate"
                    className="block text-white text-sm font-bold mb-2 cursor-pointer"
                  >
                    Birth Certificate
                  </label>
                  {birthCertificate ? (
                    <div className="relative">
                      <Image
                        src={birthCertificate}
                        width={"300"}
                        height={"400"}
                        className="rounded-md mx-auto"
                        alt="Birth Certificate"
                      />
                      <FaTimes
                        onClick={() => setBrithCertificate(null)}
                        className="absolute top-0 right-0 bg-yellow-500 text-white p-1.5 text-3xl rounded-full cursor-pointer duration-300 active:scale-90"
                      />
                    </div>
                  ) : (
                    <label
                      htmlFor="birthCertificate"
                      className="w-[300px] mx-auto h-[400px] bg-no-repeat bg-center bg-cover flex items-center justify-center bg-[url('/images/birth-certificate-placeholder.png')] cursor-pointer"
                    >
                      <div className="flex items-center gap-3 bg-[#206BC4] px-3 py-1 rounded-md">
                        <FaPlusCircle className="text-[#fff] text-4xl" />{" "}
                        <span className="text-[#fff] font-semibold">
                          Click Here
                        </span>
                      </div>
                    </label>
                  )}
                  <input
                    onChange={async (e) => {
                      const base = await base64(e.target.files[0]);
                      setBrithCertificate(base);
                    }}
                    className="hidden"
                    type="file"
                    id="birthCertificate"
                  />
                </div>
              )}
            </div>
            {/* Right Side  */}
            <div className="w-1/2">
              <div className="mb-4">
                <label
                  htmlFor="messAddress"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Mess Address
                </label>
                <input
                  type="text"
                  id="messAddress"
                  name="messAddress"
                  value={formData.messAddress}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded text-stone-900"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="contactNumber"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded text-stone-900"
                  required
                />
              </div>
              {role === "manager" ? (
                <div className="mb-4">
                  <label
                    htmlFor="bkashNumber"
                    className="block text-white text-sm font-bold mb-2"
                  >
                    Bkash Number
                  </label>
                  <input
                    type="text"
                    id="bkashNumber"
                    name="bkashNumber"
                    value={formData.bkashNumber}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 w-full rounded text-stone-900"
                    required
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <label
                    htmlFor="institution"
                    className="block text-white text-sm font-bold mb-2"
                  >
                    Institution
                  </label>
                  <input
                    type="text"
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 w-full rounded text-stone-900"
                    required
                  />
                </div>
              )}
              {role === "client" && (
                <div className="mb-4">
                  <label
                    htmlFor="manager"
                    className="block text-white text-sm font-bold mb-2"
                  >
                    Manager
                  </label>
                  <Select
                    // className=" text-red-700 "
                    // classNames=" text-red-700 "
                    classNamePrefix=" text-black "
                    name="manager"
                    id="manager"
                    placeholder="Select Manager"
                    required
                    isClearable={true}
                    onChange={(e) => {
                      handleChange({
                        target: { name: "manager", value: e?.value },
                      });
                    }}
                    options={verifiedManagers}
                  />
                </div>
              )}
              {role === "client" && (
                <div className="mb-4">
                  <label
                    htmlFor="floor"
                    className="block text-white text-sm font-bold mb-2"
                  >
                    Floor
                  </label>
                  <select
                    id="floor"
                    name="floor"
                    // value={formData.floor}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 w-full rounded text-stone-900"
                    required
                  >
                    <option value="">Select Floor</option>
                    <option value="0">Ground Floor</option>
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
              )}
              {role === "client" && (
                <div className="mb-4">
                  <label
                    htmlFor="room"
                    className="block text-white text-sm font-bold mb-2"
                  >
                    Room Number
                  </label>
                  <select
                    id="room"
                    name="room"
                    // value={formData.floor}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 w-full rounded text-stone-900"
                    required
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
              )}
              <div className="flex items-center justify-between">
                <div className="mb-4 w-[80%]">
                  <label
                    htmlFor="profilePicture"
                    className="block text-white text-sm font-bold mb-2"
                  >
                    Profile Picture
                  </label>
                  <label
                    htmlFor="profilePicture"
                    className="border border-yellow-500 flex items-center justify-center font-bold text-white p-2 w-1/2 rounded bg-yellow-500 cursor-pointer select-none duration-300 active:scale-90"
                  >
                    + Add Photo
                  </label>
                  <input
                    onChange={async (e) => {
                      const base = await base64(e.target.files[0]);
                      setPreview(base);
                    }}
                    type="file"
                    accept="image/*"
                    id="profilePicture"
                    name="profilePicture"
                    className="hidden"
                  />
                </div>

                {preview && (
                  <Image
                    src={preview}
                    className="aspect-square rounded-full mr-10"
                    alt="Preview of profile picture"
                    width={60}
                    height={60}
                  />
                )}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-white p-2 w-full rounded hover:bg-yellow-600 transition duration-300"
          >
            {loading ? (
              <CgSpinner className="animate-spin text-2xl text-center mx-auto" />
            ) : (
              "Sign Up"
            )}
          </button>
          <div className="mt-4">
            <Link href={"/login"}>
              Or,{" "}
              <span className="text-yellow-500 font-semibold underline">
                Login
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
