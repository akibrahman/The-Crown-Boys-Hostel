import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import Image from "next/image";
import toast from "react-hot-toast";
import { storage } from "../../firebase.config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import axios from "axios";

const TempCom = ({ user }) => {
  const [selectedOption, setSelectedOption] = useState("NID");
  const [pp, setpp] = useState(null);
  const [id, setid] = useState(null);
  const [nidf, setnidf] = useState(null);
  const [nidb, setnidb] = useState(null);
  const [bc, setbc] = useState(null);
  const [p, setp] = useState(0);
  const [u, setu] = useState(false);

  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const uploadFile = (file, path) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setp(progress);
        },
        (error) => {
          console.log(error);
          toast.error("Firebase error");
          reject(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url + "__urlpathdevider__" + path);
        }
      );
    });
  };

  const handleSubmit = async () => {
    if (!user?.email || !user?._id) {
      toast.error("Server Busy, Try Reloading!");
      window.location.reload();
      return;
    }
    if (!pp) return toast.error("Please Submit Profile Picture");
    if (!id) return toast.error("Please Submit ID Card");
    if (selectedOption == "NID" && (!nidf || !nidb))
      return toast.error("Please Submit NID Card");
    if (selectedOption == "Birth Certificate" && !bc)
      return toast.error("Please Submit Birth Certificate");
    setu(true);
    const ppUrl = await uploadFile(
      pp,
      `user_info/${user.email + "_profile_picture.jpg"}`
    );
    const idUrl = await uploadFile(id, `user_info/${user.email + "_id.jpg"}`);
    let nidfUrl = "";
    let nidbUrl = "";
    let bcUrl = "";
    if (selectedOption == "NID") {
      nidfUrl = await uploadFile(
        nidf,
        `user_info/${user.email + "_nid_front.jpg"}`
      );
      nidbUrl = await uploadFile(
        nidb,
        `user_info/${user.email + "_nid_back.jpg"}`
      );
    } else if (selectedOption == "Birth Certificate") {
      bcUrl = await uploadFile(
        bc,
        `user_info/${user.email + "_birth_certificate.jpg"}`
      );
    }
    setp(99);
    await axios.put("/api/clients/editclient", {
      changedData: {
        profilePicture: ppUrl,
        idPicture: idUrl,
        nidFrontPicture: selectedOption == "NID" ? nidfUrl : "",
        nidBackPicture: selectedOption == "NID" ? nidbUrl : "",
        birthCertificatePicture: selectedOption == "NID" ? "" : bcUrl,
        nidAuth: selectedOption == "NID" ? true : false,
      },
      _id: user._id,
    });
    setu(false);
    window.location.reload();
  };
  return (
    <motion.div
      initial={{ scale: 0.5, x: "-50%", y: "-50%", opacity: 0 }}
      whileInView={{ scale: 1, x: "-50%", y: "-50%", opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="absolute text-purple-600 top-[45%] md:top-1/2 left-1/2 bg-white md:h-[80%] w-[95%] md:w-[60%] rounded-xl flex flex-col items-center justify-start gap-2 font-medium overflow-y-scroll p-10"
    >
      <p className="font-bold text-2xl underline">E-KYC Data Update</p>
      <p className="font-bold text-xs underline">
        Only JPG or PNG Format is Acceptable
      </p>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <div className="flex flex-col items-center justify-center gap-3 border rounded-md p-3 border-purple-600">
          <p>Profile Picture : </p>
          <input
            type="file"
            accept=".jpg,.png"
            onChange={(e) => setpp(e.target.files[0])}
            className="hidden"
            id="pp"
          />
          {pp ? (
            <Image
              src={URL.createObjectURL(pp)}
              alt="pp"
              width="100"
              height="80"
              className="aspect-square"
            />
          ) : (
            <label
              htmlFor="pp"
              className="px-6 py-4 rounded-md border border-dashed border-purple-600 flex items-center justify-center cursor-pointer duration-300 active:scale-90"
            >
              <FaPlus />
            </label>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-3 border rounded-md p-3 border-purple-600">
          <p>Institutional ID Card (College/University/Office) : </p>
          <input
            type="file"
            accept=".jpg,.png"
            onChange={(e) => setid(e.target.files[0])}
            className="hidden"
            id="id"
          />
          {id ? (
            <Image
              src={URL.createObjectURL(id)}
              alt="id"
              width="80"
              height="50"
              className="aspect-auto"
            />
          ) : (
            <label
              htmlFor="id"
              className="px-6 py-4 rounded-md border border-dashed border-purple-600 flex items-center justify-center cursor-pointer duration-300 active:scale-90"
            >
              <FaPlus />
            </label>
          )}
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              value="NID"
              checked={selectedOption === "NID"}
              onChange={handleRadioChange}
            />
            NID
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              value="Birth Certificate"
              checked={selectedOption === "Birth Certificate"}
              onChange={handleRadioChange}
            />
            Birth Certificate
          </label>
        </div>
        {selectedOption == "NID" && (
          <div className="flex flex-col items-center justify-center gap-3 border rounded-md p-3 border-purple-600">
            <p>NID Front Side : </p>
            <input
              type="file"
              accept=".jpg,.png"
              onChange={(e) => setnidf(e.target.files[0])}
              className="hidden"
              id="nidf"
            />
            {nidf ? (
              <Image
                src={URL.createObjectURL(nidf)}
                alt="nidf"
                width="100"
                height="80"
                className="aspect-video"
              />
            ) : (
              <label
                htmlFor="nidf"
                className="px-6 py-4 rounded-md border border-dashed border-purple-600 flex items-center justify-center cursor-pointer duration-300 active:scale-90"
              >
                <FaPlus />
              </label>
            )}
          </div>
        )}
        {selectedOption == "NID" && (
          <div className="flex flex-col items-center justify-center gap-3 border rounded-md p-3 border-purple-600">
            <p>NID Back Side : </p>
            <input
              type="file"
              accept=".jpg,.png"
              onChange={(e) => setnidb(e.target.files[0])}
              className="hidden"
              id="nidb"
            />
            {nidb ? (
              <Image
                src={URL.createObjectURL(nidb)}
                alt="nidb"
                width="100"
                height="80"
                className="aspect-video"
              />
            ) : (
              <label
                htmlFor="nidb"
                className="px-6 py-4 rounded-md border border-dashed border-purple-600 flex items-center justify-center cursor-pointer duration-300 active:scale-90"
              >
                <FaPlus />
              </label>
            )}
          </div>
        )}
        {selectedOption == "Birth Certificate" && (
          <div className="flex flex-col items-center justify-center gap-3 border rounded-md p-3 border-purple-600">
            <p>Birth certificate : </p>
            <input
              type="file"
              accept=".jpg,.png"
              onChange={(e) => setbc(e.target.files[0])}
              className="hidden"
              id="bc"
            />
            {bc ? (
              <Image
                src={URL.createObjectURL(bc)}
                alt="bc"
                width="100"
                height="80"
                className="aspect-auto"
              />
            ) : (
              <label
                htmlFor="bc"
                className="px-6 py-4 rounded-md border border-dashed border-purple-600 flex items-center justify-center cursor-pointer duration-300 active:scale-90"
              >
                <FaPlus />
              </label>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          disabled={u}
          onClick={handleSubmit}
          className="px-6 py-1 bg-purple-600 font-semibold text-white duration-300 active:scale-90 cursor-pointer disabled:bg-purple-200"
        >
          Submit
        </button>
        <button
          disabled={u}
          onClick={() => {
            setpp(null);
            setid(null);
            setnidf(null);
            setnidb(null);
            setbc(null);
          }}
          className="px-6 py-1 bg-orange-600 font-semibold text-white duration-300 active:scale-90 cursor-pointer disabled:bg-orange-200"
        >
          Reset
        </button>
        {u && <p className="font-bold text-purple-600">{p} %</p>}
      </div>
    </motion.div>
  );
};

export default TempCom;
