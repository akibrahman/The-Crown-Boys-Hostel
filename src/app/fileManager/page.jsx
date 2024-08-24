"use client";

import PreLoader from "@/Components/PreLoader/PreLoader";
import { AuthContext } from "@/providers/ContextProvider";
import axios from "axios";

import { motion } from "framer-motion";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";
import { storage } from "../../../firebase.config";

const FileUpload = () => {
  const { user, userRefetch } = useContext(AuthContext);
  const route = useRouter();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleAction = async (e) => {
    if (!file || !user) return;
    try {
      const fileType = file.type.split("/")[0];
      const storageRef = ref(storage, `${user._id}/${fileType}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progresss =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(parseInt(progresss));
        },
        (error) => {
          console.error(error);
          toast.error("Try again!");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
            const dataa = {
              path: `${user._id}/${fileType}/${file.name}`,
              link: url,
              userId: user._id,
              type: file.type,
            };
            await axios.post("/api/filemanager", dataa);
            console.log("Upload Completed");
            await userRefetch();
            toast.success("File uploaded successfully");
            setProgress(0);
            setFile(null);
          });
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  const downloadAll = (url) => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "Test";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadImage = (url) => {
    // Fetch the image
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a Blob URL for the image
        const blobUrl = URL.createObjectURL(blob);

        // Create a hidden anchor element
        const a = document.createElement("a");
        a.style.display = "none"; // Hide the anchor element

        // Set the href and download attributes
        a.href = blobUrl;
        a.download = "Test";

        // Append the anchor to the body
        document.body.appendChild(a);

        // Trigger a click event on the anchor
        a.click();

        // Clean up: remove the anchor from the DOM and revoke the Blob URL
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  };

  const deleteFile = async (path) => {
    console.log(path);
    const dataa = {
      path,
      userId: user._id,
    };
    await axios.put("/api/filemanager", dataa);
    const desertRef = ref(storage, path);
    deleteObject(desertRef)
      .then(async () => {
        // File deleted successfully
        await userRefetch();
        toast.success("File deleted");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        toast.error("Try again!");
        console.log(error);
      });
  };

  if (!user) return <PreLoader />;
  if (user?.success == false) {
    route.push("/");
    return;
  }
  return (
    <div className="min-h-screen pb-20 bg-dashboard text-slate-100 overflow-x-hidden">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
      >
        <p className="text-center py-8 text-2xl">File Manager</p>
        <input
          type="file"
          name="file"
          id="file"
          onChange={(e) => {
            console.log(e.target.files?.[0]);
            setFile(e.target.files?.[0]);
          }}
          className="hidden"
        />
      </motion.div>
      {file ? (
        <div className="flex items-center justify-center gap-3 py-10">
          <Image
            alt="File type icon"
            width={30}
            height={30}
            src={
              file.type.split("/")[0] == "image"
                ? file.type.split("/")[1] == "png"
                  ? "/images/fileType/png.png"
                  : "/images/fileType/jpg.png"
                : file.type.split("/")[0] == "application"
                ? file.type.split("/")[1] == "pdf"
                  ? "/images/fileType/pdf.png"
                  : file.name.split(".")[file.name.split(".").length - 1] ==
                      "doc" ||
                    file.name.split(".")[file.name.split(".").length - 1] ==
                      "docx"
                  ? "/images/fileType/doc.png"
                  : "/images/fileType/all.png"
                : "/images/fileType/all.png"
            }
          />
          <p className="">{file?.name}</p>
          <FaTimes
            className="text-2xl text-red-500 cursor-pointer"
            onClick={() => setFile(null)}
          />
        </div>
      ) : (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className="w-[300px] md:w-[500px] py-4 mx-auto rounded-xl border-2 border-dotted flex flex-col items-center justify-center gap-3"
        >
          <IoCloudUploadOutline className="font-semibold text-6xl" />
          <p>Drag and Drop Files Here</p>
          <p>or</p>
          <label
            htmlFor="file"
            className="text-sky-500 px-4 py-1 border border-sky-500 rounded-sm cursor-pointer duration-300 active:scale-90"
          >
            Browse here
          </label>
        </motion.div>
      )}
      {progress != 0 ? (
        <div className="flex items-center justify-center mt-5">
          <div class="relative w-20 h-20">
            <svg class="w-full h-full" viewBox="0 0 100 100">
              <circle
                class="text-gray-200 stroke-current"
                stroke-width="10"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              ></circle>
              <circle
                class="text-sky-500  progress-ring__circle stroke-current"
                stroke-width="10"
                stroke-linecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke-dasharray="251.2"
                stroke-dashoffset={`calc(251.2 - (251.2 * ${progress}) / 100)`}
              ></circle>
              <text
                x="50"
                y="50"
                fill="white"
                font-family="Verdana"
                font-size="14"
                text-anchor="middle"
                alignment-baseline="middle"
              >
                {progress} %
              </text>
            </svg>
          </div>
        </div>
      ) : file ? (
        <button
          onClick={handleAction}
          className="font-semibold px-4 py-1 duration-300 text-white bg-sky-500 active:scale-90 mx-auto block my-6"
        >
          Upload
        </button>
      ) : null}
      <p className="text-center py-8 text-2xl">Your Files</p>
      {!user?.files || user?.files.length == 0 ? (
        <p className="text-center">No uploaded files</p>
      ) : (
        <div className="space-y-5">
          {user?.files.map((file) => (
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              key={file.link}
              className="flex items-center justify-center gap-3"
            >
              <Image
                alt="File type icon"
                width={30}
                height={30}
                src={
                  file.fileType.split("/")[0] == "image"
                    ? file.fileType.split("/")[1] == "png"
                      ? "/images/fileType/png.png"
                      : "/images/fileType/jpg.png"
                    : file.fileType.split("/")[0] == "application"
                    ? file.fileType.split("/")[1] == "pdf"
                      ? "/images/fileType/pdf.png"
                      : file.path.split("/")[2].split(".")[
                          file.path.split("/")[2].split(".").length - 1
                        ] == "doc" ||
                        file.path.split("/")[2].split(".")[
                          file.path.split("/")[2].split(".").length - 1
                        ] == "docx"
                      ? "/images/fileType/doc.png"
                      : "/images/fileType/all.png"
                    : "/images/fileType/all.png"
                }
              />
              <p>{file.path.split("/")[2]}</p>
              <button
                onClick={
                  file.fileType.split("/")[0] == "image"
                    ? () => downloadImage(file.link)
                    : () => downloadAll(file.link)
                }
                className="bg-green-500 px-4 py-1 duration-300 text-white active:scale-90"
              >
                Download
              </button>
              <button
                onClick={() => deleteFile(file.path)}
                className="bg-red-500 px-4 py-1 duration-300 text-white active:scale-90"
              >
                Delete
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
