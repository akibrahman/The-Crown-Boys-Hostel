"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";

const Registration = () => {
  const router = useRouter();
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords are not same !");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/users/signup", formData);
      console.log(res.data);
      if (res.data.success) {
        toast.success("Registration Successful");
        router.push("/login");
      } else {
        if (res.data.code === 1212) {
          toast.error("User exists with this E-mail !");
        }
        if (res.data.code === 1010) {
          toast.error("Username is already taken !");
        }
      }
    } catch (error) {
      toast.error("Error for Registration");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-stone-900 p-10 rounded shadow-md w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setRole("manager")}
              className={`border px-4 py-2 border-yellow-500 rounded-lg font-bold duration-300 ${
                role === "manager"
                  ? "bg-yellow-500 text-stone-900"
                  : "bg-transparent text-white"
              }`}
            >
              Manager
            </button>
            <button
              onClick={() => setRole("client")}
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
          <div className="flex justify-between items-center gap-4">
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
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  className="hidden"
                  required
                />
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
