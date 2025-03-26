import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function FileUploadTest() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", "user/data"); // Change to "*" for default "/uploads"
    formData.append("size", "2"); // Max size in MB (change to "*" to allow any size)
    formData.append("fileType", "jpg,png,pdf"); // Allowed extensions (change to "*" for all)

    try {
      const { data } = await axios.post("/api/singleFileUpload", formData);
      toast.success(data.path);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || error?.message);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
    </div>
  );
}
