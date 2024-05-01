import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { BsChatSquareQuote } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import Modal from "react-modal";

const ProfileDetails = ({
  user,
  mealRequestCount,
  setIsSettingsOpen,
  isSettingsOpen,
  canVerify,
  setCanVerify,
}) => {
  const [changePassModalIsOpen, setChangePassModalIsOpen] = useState(false);
  const customStylesForChangePassModal = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "0",
      // backgroundColor: "#000",
      // border: "1px solid #EAB308",
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.5)",
    },
  };
  const openModalForChangePassModal = () => {
    setChangePassModalIsOpen(true);
  };

  const closeModalForChangePassModal = () => {
    setChangePassModalIsOpen(false);
  };
  const [oldPassShown, setOldPassShown] = useState(false);
  const [newPassShown, setNewPassShown] = useState(false);
  const [confirmNewPassShown, setConfirmNewPassShown] = useState(false);

  const [newPassChecking, setNewPassChecking] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newPassData, setNewPassData] = useState({
    digits: false,
    numbers: false,
    letters: false,
    special: false,
  });
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const newPassCgange = async (pass) => {
    setNewPassChecking(true);
    await delay(1000);
    if (pass.length >= 8)
      setNewPassData((prevState) => ({
        ...prevState,
        digits: true, // Toggle the value of digits
      }));
    else
      setNewPassData((prevState) => ({
        ...prevState,
        digits: false, // Toggle the value of digits
      }));
    const numberRegex = /\d/g;
    const matches = pass.match(numberRegex);
    if (matches !== null && matches.length >= 2)
      setNewPassData((prevState) => ({
        ...prevState,
        numbers: true, // Toggle the value of numbers
      }));
    else
      setNewPassData((prevState) => ({
        ...prevState,
        numbers: false, // Toggle the value of numbers
      }));
    const lettersCount = pass.replace(/[^a-zA-Z]/g, "").length;
    if (lettersCount >= 5)
      setNewPassData((prevState) => ({
        ...prevState,
        letters: true, // Toggle the value of letters
      }));
    else
      setNewPassData((prevState) => ({
        ...prevState,
        letters: false, // Toggle the value of letters
      }));
    const specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (specialCharacterRegex.test(pass))
      setNewPassData((prevState) => ({
        ...prevState,
        special: true, // Toggle the value of special
      }));
    else
      setNewPassData((prevState) => ({
        ...prevState,
        special: false, // Toggle the value of special
      }));
    setNewPassChecking(false);
  };

  const handleChangePass = async (e) => {
    setLoading(true);
    try {
      e.preventDefault();
      const oldPass = e.target.oldPassword.value;
      const newPass = e.target.newPassword.value;
      const confirmNewPass = e.target.confirmNewPassword.value;
      if (!oldPass) {
        toast.error("Enter current Password");
        return;
      }
      if (!newPass) {
        toast.error("Enter new Password");
        return;
      }
      if (!confirmNewPass) {
        toast.error("Confirm new Password");
        return;
      }
      if (newPass != confirmNewPass) {
        toast.error("New Passworn and Confirm Password are not same!");
        return;
      }
      await axios.post("/api/password/changepassword", {
        oldPass,
        newPass,
        email: user.email,
      });
      toast.success("Password changed successfully");
      e.target.reset();
      closeModalForChangePassModal();
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
      if (error.response.data.code == 2003) {
        e.target.oldPassword.value = "";
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Modal
        // appElement={el}
        isOpen={changePassModalIsOpen}
        onRequestClose={closeModalForChangePassModal}
        style={customStylesForChangePassModal}
      >
        <div className="flex items-center justify-center bg-secondary py-10 px-20 md:px-32 relative overflow-y-scroll">
          <FaTimes
            onClick={closeModalForChangePassModal}
            className="absolute top-4 md:top-7 right-2 md:right-5 text-2xl font-thin text-white cursor-pointer"
          />
          <div className="w-full">
            <p className="font-semibold text-xl md:text-2xl text-stone-300 underline tracking-widest text-center mb-10">
              Change Password
            </p>
            <form
              onSubmit={handleChangePass}
              className="bg-transparent shadow-md rounded select-none"
            >
              <div className="mb-4">
                <label
                  className="block text-slate-300 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Current password
                </label>
                <div className="relative">
                  <input
                    className="shadow appearance-none border rounded w-[200px] md:w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="oldPassword"
                    type={oldPassShown ? "text" : "password"}
                    placeholder="Enter password"
                    //   value={password}
                    //   onChange={handlePasswordChange}
                  />
                  {!oldPassShown ? (
                    <FaEye
                      onClick={() => setOldPassShown(!oldPassShown)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer duration-300 active:scale-90"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={() => setOldPassShown(!oldPassShown)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer duration-300 active:scale-90"
                    />
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="block text-slate-300 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  New password
                </label>
                <div className="relative">
                  <input
                    onChange={(e) => newPassCgange(e.target.value)}
                    className="shadow appearance-none border rounded w-[200px] md:w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="newPassword"
                    type={newPassShown ? "text" : "password"}
                    placeholder="Enter password"
                    //   value={password}
                    //   onChange={handlePasswordChange}
                  />

                  {!newPassShown ? (
                    <FaEye
                      onClick={() => setNewPassShown(!newPassShown)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer duration-300 active:scale-90"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={() => setNewPassShown(!newPassShown)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer duration-300 active:scale-90"
                    />
                  )}
                </div>
              </div>
              <div className="space-y-1 pb-3">
                <p
                  className={`${
                    newPassData.digits ? "text-green-500" : "text-red-500"
                  } flex items-center gap-1`}
                >
                  {newPassChecking ? (
                    <CgSpinner className="text-blue-500 text-xl animate-spin" />
                  ) : newPassData.digits ? (
                    <TiTick className="text-xl" />
                  ) : (
                    <FaTimes />
                  )}
                  Atleast 8 digits
                </p>
                <p
                  className={`${
                    newPassData.numbers ? "text-green-500" : "text-red-500"
                  } flex items-center gap-1`}
                >
                  {newPassChecking ? (
                    <CgSpinner className="text-blue-500 text-xl animate-spin" />
                  ) : newPassData.numbers ? (
                    <TiTick className="text-xl" />
                  ) : (
                    <FaTimes />
                  )}
                  Atleast 2 Numbers
                </p>
                <p
                  className={`${
                    newPassData.letters ? "text-green-500" : "text-red-500"
                  } flex items-center gap-1`}
                >
                  {newPassChecking ? (
                    <CgSpinner className="text-blue-500 text-xl animate-spin" />
                  ) : newPassData.letters ? (
                    <TiTick className="text-xl" />
                  ) : (
                    <FaTimes />
                  )}{" "}
                  Atleast 5 Letters
                </p>
                <p
                  className={`${
                    newPassData.special ? "text-green-500" : "text-red-500"
                  } flex items-center gap-1`}
                >
                  {newPassChecking ? (
                    <CgSpinner className="text-blue-500 text-xl animate-spin" />
                  ) : newPassData.special ? (
                    <TiTick className="text-xl" />
                  ) : (
                    <FaTimes />
                  )}
                  Atleast 1 Special Charecter
                </p>
              </div>
              <div className="mb-6">
                <label
                  className="block text-slate-300 text-sm font-bold mb-2"
                  htmlFor="confirm-password"
                >
                  Confirm new password
                </label>
                <div className="relative mb-3">
                  <input
                    className="shadow appearance-none border rounded w-[200px] md:w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="confirmNewPassword"
                    type={confirmNewPassShown ? "text" : "password"}
                    placeholder="Confirm password"
                    //   value={confirmPassword}
                    //   onChange={handleConfirmPasswordChange}
                  />{" "}
                  {!confirmNewPassShown ? (
                    <FaEye
                      onClick={() =>
                        setConfirmNewPassShown(!confirmNewPassShown)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer duration-300 active:scale-90"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={() =>
                        setConfirmNewPassShown(!confirmNewPassShown)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xl cursor-pointer duration-300 active:scale-90"
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-blue-500 disabled:bg-stone-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center gap-2"
                  type="submit"
                  disabled={
                    newPassChecking ||
                    Object.values(newPassData).some((value) => value === false)
                  }
                >
                  Save
                  {loading && (
                    <CgSpinner className="text-white text-xl animate-spin" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
      <div className={`mt-10 py-8 flex flex-col items-center relative`}>
        {user && user.role == "manager" && (
          <div className="absolute top-0 right-4 dark:bg-stone-700 bg-stone-300 flex items-center justify-center h-12 w-12 rounded-full cursor-pointer duration-300 active:scale-90 select-none">
            <BsChatSquareQuote className="text-xl" />
            {parseInt(mealRequestCount) > 0 && (
              <span className="absolute top-0 right-0 text-sm bg-red-500 rounded-full h-[18px] w-[18px] flex items-center justify-center">
                {parseInt(mealRequestCount)}
              </span>
            )}
          </div>
        )}
        <Image
          alt={`Profile picture of ${user.username}`}
          src={user.profilePicture}
          width={200}
          height={200}
          className="mb-10 rounded-full aspect-square"
        />
        <p className="mb-1 text-blue-500 font-medium text-xl">
          {user.username}
        </p>
        <p>{user.email}</p>
        <p>Role: {convertCamelCaseToCapitalized(user.role)}</p>

        {user.isVerified ? (
          <div className="flex flex-col md:flex-row items-center gap-3 mt-2">
            {" "}
            <p
              className={`flex items-center gap-1 w-max px-4 py-1 rounded-full font-semibold ${
                user.role === "owner" ? "bg-blue-500" : "bg-green-500"
              }`}
            >
              <TiTick className="text-xl" />
              Verified
            </p>
            <div className="relative">
              <IoSettingsOutline
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="font-semibold text-2xl cursor-pointer hover:rotate-180 duration-500 group"
              />
              <ul
                className={`absolute ${
                  isSettingsOpen
                    ? "opacity-1 z-40 top-[180%]"
                    : "opacity-0 -z-40 top-[500%]"
                } left-[50%] -translate-x-1/2 duration-300 ease-linear bg-secondary text-white font-semibold py-6 px-16 space-y-3 shadow-lg shadow-white`}
              >
                <li className="w-[250px] text-center border rounded-full border-white px-10 py-1.5 cursor-pointer duration-300 active:scale-90 hidden">
                  Profile Update
                </li>
                <li
                  onClick={() => {
                    openModalForChangePassModal();
                    setIsSettingsOpen(!isSettingsOpen);
                  }}
                  className="w-[250px] text-center border rounded-full border-white px-10 py-1.5 cursor-pointer duration-300 active:scale-90"
                >
                  Change Password
                </li>
              </ul>
            </div>
          </div>
        ) : canVerify ? (
          <button
            onClick={async () => {
              setCanVerify(false);
              axios.post("/api/sendverificationemail", {
                userName: user.username,
                email: user.email,
                emailType: "verify",
                userId: user._id,
              });
              toast.success("Verification E-mail sent");
            }}
            className="flex items-center gap-1 duration-300 bg-sky-500 text-sm w-max px-4 py-1 rounded-full font-semibold mt-2 active:scale-90"
          >
            Click to get verification E-mail
          </button>
        ) : (
          <p
            className={`flex items-center gap-1 w-max px-4 py-1 rounded-full font-semibold mt-2 bg-lime-500 select-none`}
          >
            <TiTick className="text-xl" />
            Verification E-mail sent
          </p>
        )}
      </div>
    </>
  );
};

export default ProfileDetails;
