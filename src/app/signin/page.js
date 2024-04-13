"use client";

import { AuthContext } from "@/providers/ContextProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";

const Signin = () => {
  const { userRefetch } = useContext(AuthContext);
  const route = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setLoading(true);
    try {
      const res = await axios.post("/api/users/login", formData);
      console.log(res);
      if (res.data.success && res.data.code === 2121) {
        await userRefetch();
        route.push("/profile");
        toast.success(res.data.msg);
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.code === 2002) {
        toast.error(error.response.data.msg);
      }
      if (error.response.data.code === 2003) {
        toast.error(error.response.data.msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-stone-900">
      <div className="dark:bg-stone-900 p-8 rounded shadow-2xl shadow-sky-500 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 dark:text-white">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block dark:text-white text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block dark:text-white text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-sky-500 text-white p-2 w-full rounded hover:bg-sky-600 transition duration-300"
          >
            {loading ? (
              <CgSpinner className="animate-spin text-2xl text-center mx-auto" />
            ) : (
              "Login"
            )}
          </button>
          <div className="mt-4">
            <Link href={"/signup"}>
              <span className="dark:text-white">Or,</span>{" "}
              <span className="text-sky-500 font-semibold underline">
                SignUp
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
