"use client";

import PreLoader from "@/Components/PreLoader/PreLoader";
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
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [isNid, setIsNid] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidEmailLoading, setIsValidEmailLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    bloodGroup: "",
    contactNumber: "",
    fathersNumber: "",
    mothersNumber: "",
    bkashNumber: "",
    institution: "",
    profilePicture: "",
    manager: "",
    birthCertificatePicture: "",
    nidFrontPicture: "",
    nidBackPicture: "",
    idPicture: "",
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

  const emailChecker = async (email) => {
    toast.success("Checking E-mail address...");
    try {
      setIsValidEmailLoading(true);
      setLoading(true);
      const { data } = await axios.post("/api/emailchecker", { email });
      console.log(data);
      if (data.success && data.valid) {
        setIsValidEmail(true);
        setIsValidEmailLoading(false);
        setLoading(false);
        toast.success("E-mail address verified");
        return true;
      } else {
        setIsValidEmail(false);
        setIsValidEmailLoading(false);
        setLoading(false);
        return false;
      }
    } catch (error) {
      setIsValidEmail(false);
      return false;
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword)
        throw new Error("Passwords are not same !");

      if (!formData.profilePicture)
        throw new Error("Please Upload Profile Picture!");
      if (!formData.idPicture)
        throw new Error("Please Upload ID Card (Student / Job)!");

      if (isNid) {
        if (!formData.nidFrontPicture || !formData.nidBackPicture)
          throw new Error("Please Upload NID!");
      } else if (!isNid && !formData.birthCertificatePicture)
        throw new Error("Please Upload Birth Certificate!");

      setLoading(true);
      // const checkResult = await emailChecker(formData.email);
      // if (!checkResult) throw new Error("Invalid E-mail Address!");

      const dataToSend = new FormData();
      dataToSend.append("username", formData.username);
      dataToSend.append("email", formData.email);
      dataToSend.append("password", formData.password);
      dataToSend.append("studentId", formData.studentId);
      dataToSend.append("bloodGroup", formData.bloodGroup);
      dataToSend.append("contactNumber", formData.contactNumber);
      dataToSend.append("fathersNumber", formData.fathersNumber);
      dataToSend.append("mothersNumber", formData.mothersNumber);
      dataToSend.append("bkashNumber", formData.bkashNumber);
      dataToSend.append("institution", formData.institution);
      dataToSend.append("profilePicture", formData.profilePicture);
      dataToSend.append("manager", formData.manager);
      dataToSend.append("role", role);
      dataToSend.append("isNid", isNid);
      dataToSend.append(
        "birthCertificatePicture",
        formData.birthCertificatePicture
      );
      dataToSend.append("nidFrontPicture", formData.nidFrontPicture);
      dataToSend.append("nidBackPicture", formData.nidBackPicture);
      dataToSend.append("idPicture", formData.idPicture);

      const { data } = await axios.post("/api/users/signup", dataToSend);
      if (!data.success) throw new Error(data.msg);
      toast.success("Registration Successful");
      router.push("/signin");
    } catch (error) {
      toast.error(error?.response?.data?.msg || error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!verifiedManagers) return <PreLoader />;

  return (
    <div className="relative z-10 flex items-center justify-center bg-dashboard text-slate-100">
      <div className={`p-10 rounded shadow-md w-full duration-300`}>
        {/* <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => {
                setRole("manager");
                setFormData({ ...formData, institution: "" });
              }}
              className={`border px-4 py-2 border-sky-500 rounded-lg font-bold duration-300 ${
                role === "manager"
                  ? "bg-sky-500 text-stone-900"
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
              className={`border px-4 py-2 border-sky-500 rounded-lg font-bold duration-300 ${
                role === "client"
                  ? "bg-sky-500 text-stone-900"
                  : "bg-transparent text-white"
              }`}
            >
              Client
            </button>
          </div>
        </div> */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row justify-between items-cente gap-4">
            {/* Left Side  */}
            <div className="w-full md:w-1/2">
              <div className="mb-4 mx-auto">
                <label
                  htmlFor="username"
                  className="block text-sm font-bold mb-2"
                >
                  Name
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
                <label htmlFor="email" className="block text-sm font-bold mb-2">
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={async (e) => {
                      handleChange(e);
                      setIsValidEmail(false);
                    }}
                    className="border border-gray-300 p-2 w-full rounded text-stone-900"
                    required
                  />
                  <div className="text-sky-500 border border-primary p-2 rounded-full">
                    {isValidEmailLoading && (
                      <CgSpinner className="text-2xl font-bold animate-spin" />
                    )}
                    {!isValidEmailLoading && isValidEmail && (
                      <p className="text-green-500 text-xs">Valid</p>
                    )}
                    {!isValidEmailLoading && !isValidEmail && (
                      <p className="text-red-500 text-xs">Invalid</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold mb-2"
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
                  className="block text-sm font-bold mb-2"
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
              <div className="mb-4">
                <label
                  htmlFor="studentId"
                  className="block text-sm font-bold mb-2"
                >
                  Student ID or Job ID
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded text-stone-900"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="bloodGroup"
                  className="block text-sm font-bold mb-2"
                >
                  Blood Group
                </label>
                <input
                  type="text"
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded text-stone-900"
                  required
                />
              </div>
              {role === "client" && (
                <div className="mb-4 mt-8 flex items-center gap-4">
                  <span
                    className={`${
                      !isNid ? "bg-sky-500" : "bg-stone-500"
                    } px-3 py-1 font-medium rounded-md duration-300 transition-all`}
                  >
                    Birth Certificate
                  </span>
                  {/* Toggle Switch  */}
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      onClick={() => {
                        setIsNid(!isNid);
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
                      !isNid ? "bg-stone-500" : "bg-sky-500"
                    } px-3 py-1 font-medium rounded-md duration-300 transition-all`}
                  >
                    NID Birth
                  </span>
                </div>
              )}
              {/* Area for NID Input  */}
              {isNid && (
                <div className="mb-8 mt-10 md:mt-4 flex flex-col md:flex-row items-center justify-center gap-8">
                  <div className="">
                    <label
                      htmlFor="nidFront"
                      className="block text-sm font-bold mb-2 cursor-pointer"
                    >
                      NID Front
                    </label>
                    {formData?.nidFrontPicture ? (
                      <div className="relative">
                        <Image
                          src={URL.createObjectURL(formData?.nidFrontPicture)}
                          width={"200"}
                          height={"100"}
                          alt="NID Front"
                          className="rounded-md"
                        />
                        <FaTimes
                          onClick={() =>
                            handleChange({
                              target: { name: "nidFrontPicture", value: "" },
                            })
                          }
                          className="absolute top-0 right-0 bg-sky-500 text-white p-1.5 text-3xl rounded-full cursor-pointer duration-300 active:scale-90"
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
                        const file = e.target.files[0];
                        if (file) {
                          handleChange({
                            target: { name: "nidFrontPicture", value: file },
                          });
                        }
                      }}
                      className="hidden"
                      type="file"
                      id="nidFront"
                    />
                  </div>
                  <div className="">
                    <label
                      htmlFor="nidBack"
                      className="block text-sm font-bold mb-2 cursor-pointer"
                    >
                      NID Back
                    </label>
                    {formData?.nidBackPicture ? (
                      <div className="relative">
                        <Image
                          src={URL.createObjectURL(formData?.nidBackPicture)}
                          width={"200"}
                          height={"100"}
                          className="rounded-md"
                          alt="NID Back"
                        />
                        <FaTimes
                          onClick={() =>
                            handleChange({
                              target: { name: "nidBackPicture", value: "" },
                            })
                          }
                          className="absolute top-0 right-0 bg-sky-500 text-white p-1.5 text-3xl rounded-full cursor-pointer duration-300 active:scale-90"
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
                        const file = e.target.files[0];
                        if (file) {
                          handleChange({
                            target: { name: "nidBackPicture", value: file },
                          });
                        }
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
                <div className="mb-8 mt-10 md:mt-4">
                  <label
                    htmlFor="birthCertificate"
                    className="block text-sm font-bold mb-2 cursor-pointer"
                  >
                    Birth Certificate
                  </label>
                  {formData?.birthCertificatePicture ? (
                    <div className="relative">
                      <Image
                        src={URL.createObjectURL(
                          formData?.birthCertificatePicture
                        )}
                        width={"300"}
                        height={"400"}
                        className="rounded-md mx-auto"
                        alt="Birth Certificate"
                      />
                      <FaTimes
                        onClick={() =>
                          handleChange({
                            target: {
                              name: "birthCertificatePicture",
                              value: "",
                            },
                          })
                        }
                        className="absolute top-0 right-0 bg-sky-500 text-white p-1.5 text-3xl rounded-full cursor-pointer duration-300 active:scale-90"
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
                      const file = e.target.files[0];
                      if (file) {
                        handleChange({
                          target: {
                            name: "birthCertificatePicture",
                            value: file,
                          },
                        });
                      }
                    }}
                    className="hidden"
                    type="file"
                    id="birthCertificate"
                  />
                </div>
              )}
            </div>
            {/* Right Side  */}
            <div className="w-full md:w-1/2">
              <div className="mb-4">
                <label
                  htmlFor="contactNumber"
                  className="block text-sm font-bold mb-2"
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
              {role === "client" && (
                <div className="mb-4">
                  <label
                    htmlFor="fathersNumber"
                    className="block text-sm font-bold mb-2"
                  >
                    Father&apos;s Number
                  </label>
                  <input
                    type="number"
                    id="fathersNumber"
                    name="fathersNumber"
                    value={formData.fathersNumber}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 w-full rounded text-stone-900"
                    required
                  />
                </div>
              )}
              {role === "client" && (
                <div className="mb-4">
                  <label
                    htmlFor="mothersNumber"
                    className="block text-sm font-bold mb-2"
                  >
                    Mother&apos;s Number
                  </label>
                  <input
                    type="number"
                    id="mothersNumber"
                    name="mothersNumber"
                    value={formData.mothersNumber}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 w-full rounded text-stone-900"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <label
                  htmlFor="bkashNumber"
                  className="block text-sm font-bold mb-2"
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
              {role === "client" && (
                <div className="mb-4">
                  <label
                    htmlFor="institution"
                    className="block text-sm font-bold mb-2"
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
                    className="block text-sm font-bold mb-2"
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

              <div className="flex items-center justify-evenly">
                <div className="">
                  <label
                    htmlFor="profilePicture"
                    className="block text-sm font-bold mb-2 cursor-pointer"
                  >
                    Profile Picture
                  </label>
                  {formData?.profilePicture ? (
                    <div className="relative w-max">
                      <Image
                        src={URL.createObjectURL(formData?.profilePicture)}
                        width={"150"}
                        height={"150"}
                        className="rounded-full aspect-square object-cover w-[150px] h-[150px]"
                        alt="NID Back"
                      />
                      <FaTimes
                        onClick={() =>
                          handleChange({
                            target: { name: "profilePicture", value: "" },
                          })
                        }
                        className="absolute top-0 right-0 bg-sky-500 text-white p-1.5 text-3xl rounded-full cursor-pointer duration-300 active:scale-90"
                      />
                    </div>
                  ) : (
                    <label
                      htmlFor="profilePicture"
                      className="w-[150px] h-[150px] bg-no-repeat bg-center bg-contain block bg-[url('/images/pp.jpg')] cursor-pointer rounded-full"
                    ></label>
                  )}

                  <input
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleChange({
                          target: { name: "profilePicture", value: file },
                        });
                      }
                    }}
                    className="hidden"
                    type="file"
                    id="profilePicture"
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="profilePicture"
                    className="block text-sm font-bold mb-2 cursor-pointer"
                  >
                    ID Card - Student or Job
                  </label>
                  {formData?.idPicture ? (
                    <div className="relative w-max">
                      <Image
                        src={URL.createObjectURL(formData?.idPicture)}
                        width={"100"}
                        height={"200"}
                        className="object-cover w-[100px] h-[200px]"
                        alt="NID Back"
                      />
                      <FaTimes
                        onClick={() =>
                          handleChange({
                            target: { name: "idPicture", value: "" },
                          })
                        }
                        className="absolute top-0 right-0 bg-sky-500 text-white p-1.5 text-3xl rounded-full cursor-pointer duration-300 active:scale-90"
                      />
                    </div>
                  ) : (
                    <label
                      htmlFor="idPicture"
                      className="w-[100px] h-[200px] bg-no-repeat bg-center bg-contain block bg-[url('/images/card.jpg')] cursor-pointer"
                    ></label>
                  )}

                  <input
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleChange({
                          target: { name: "idPicture", value: file },
                        });
                      }
                    }}
                    className="hidden"
                    type="file"
                    id="idPicture"
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-sky-500 text-white p-2 w-full rounded hover:bg-sky-600 transition duration-300 flex items-center justify-center gap-2"
          >
            Sign Up
            {loading && <CgSpinner className="animate-spin text-xl" />}
          </button>
          <div className="mt-4">
            <Link href={"/login"}>
              Or,{" "}
              <span className="text-sky-500 font-semibold underline">
                Login
              </span>
            </Link>
          </div>
        </form>
      </div>
      <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
        <svg
          width="450"
          height="556"
          viewBox="0 0 450 556"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="277" cy="63" r="225" fill="url(#paint0_linear_25:217)" />
          <circle
            cx="17.9997"
            cy="182"
            r="18"
            fill="url(#paint1_radial_25:217)"
          />
          <circle
            cx="76.9997"
            cy="288"
            r="34"
            fill="url(#paint2_radial_25:217)"
          />
          <circle
            cx="325.486"
            cy="302.87"
            r="180"
            transform="rotate(-37.6852 325.486 302.87)"
            fill="url(#paint3_linear_25:217)"
          />
          <circle
            opacity="0.8"
            cx="184.521"
            cy="315.521"
            r="132.862"
            transform="rotate(114.874 184.521 315.521)"
            stroke="url(#paint4_linear_25:217)"
          />
          <circle
            opacity="0.8"
            cx="356"
            cy="290"
            r="179.5"
            transform="rotate(-30 356 290)"
            stroke="url(#paint5_linear_25:217)"
          />
          <circle
            opacity="0.8"
            cx="191.659"
            cy="302.659"
            r="133.362"
            transform="rotate(133.319 191.659 302.659)"
            fill="url(#paint6_linear_25:217)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_25:217"
              x1="-54.5003"
              y1="-178"
              x2="222"
              y2="288"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <radialGradient
              id="paint1_radial_25:217"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(17.9997 182) rotate(90) scale(18)"
            >
              <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
            </radialGradient>
            <radialGradient
              id="paint2_radial_25:217"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(76.9997 288) rotate(90) scale(34)"
            >
              <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
            </radialGradient>
            <linearGradient
              id="paint3_linear_25:217"
              x1="226.775"
              y1="-66.1548"
              x2="292.157"
              y2="351.421"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint4_linear_25:217"
              x1="184.521"
              y1="182.159"
              x2="184.521"
              y2="448.882"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint5_linear_25:217"
              x1="356"
              y1="110"
              x2="356"
              y2="470"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint6_linear_25:217"
              x1="118.524"
              y1="29.2497"
              x2="166.965"
              y2="338.63"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
        <svg
          width="364"
          height="201"
          viewBox="0 0 364 201"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.88928 72.3303C33.6599 66.4798 101.397 64.9086 150.178 105.427C211.155 156.076 229.59 162.093 264.333 166.607C299.076 171.12 337.718 183.657 362.889 212.24"
            stroke="url(#paint0_linear_25:218)"
          />
          <path
            d="M-22.1107 72.3303C5.65989 66.4798 73.3965 64.9086 122.178 105.427C183.155 156.076 201.59 162.093 236.333 166.607C271.076 171.12 309.718 183.657 334.889 212.24"
            stroke="url(#paint1_linear_25:218)"
          />
          <path
            d="M-53.1107 72.3303C-25.3401 66.4798 42.3965 64.9086 91.1783 105.427C152.155 156.076 170.59 162.093 205.333 166.607C240.076 171.12 278.718 183.657 303.889 212.24"
            stroke="url(#paint2_linear_25:218)"
          />
          <path
            d="M-98.1618 65.0889C-68.1416 60.0601 4.73364 60.4882 56.0734 102.431C120.248 154.86 139.905 161.419 177.137 166.956C214.37 172.493 255.575 186.165 281.856 215.481"
            stroke="url(#paint3_linear_25:218)"
          />
          <circle
            opacity="0.8"
            cx="214.505"
            cy="60.5054"
            r="49.7205"
            transform="rotate(-13.421 214.505 60.5054)"
            stroke="url(#paint4_linear_25:218)"
          />
          <circle cx="220" cy="63" r="43" fill="url(#paint5_radial_25:218)" />
          <defs>
            <linearGradient
              id="paint0_linear_25:218"
              x1="184.389"
              y1="69.2405"
              x2="184.389"
              y2="212.24"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_25:218"
              x1="156.389"
              y1="69.2405"
              x2="156.389"
              y2="212.24"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_25:218"
              x1="125.389"
              y1="69.2405"
              x2="125.389"
              y2="212.24"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_25:218"
              x1="93.8507"
              y1="67.2674"
              x2="89.9278"
              y2="210.214"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" />
            </linearGradient>
            <linearGradient
              id="paint4_linear_25:218"
              x1="214.505"
              y1="10.2849"
              x2="212.684"
              y2="99.5816"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <radialGradient
              id="paint5_radial_25:218"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(220 63) rotate(90) scale(43)"
            >
              <stop offset="0.145833" stopColor="white" stopOpacity="0" />
              <stop offset="1" stopColor="white" stopOpacity="0.08" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default Registration;
