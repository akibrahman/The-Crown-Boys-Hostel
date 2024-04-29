"use client";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import toast from "react-hot-toast";
const Help = () => {
  const test = async () => {
    try {
      const res = await axios.post("/api/sms/managersendssmstoall", {
        sms: "The Crown Boys Hostel Inc.",
      });
      if (res.data.success) toast.success("SMS sent successfully");
      else toast.error("Something went wrong, Try again!");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <div className="dark:bg-gradient-to-r dark:from-primary dark:to-secondary dark:text-white p-6">
      <p className="font-semibold text-lg">Help Desk</p>

      <Editor
        apiKey="6qkxmc7gg27khy7m84ey8ukzmafgxuhp35k6aire02g6u5tl"
        init={{
          plugins:
            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          tinycomments_mode: "embedded",
          tinycomments_author: "Author name",
          mergetags_list: [
            { value: "First.Name", title: "First Name" },
            { value: "Email", title: "Email" },
          ],
          ai_request: (request, respondWith) =>
            respondWith.string(() =>
              Promise.reject("See docs to implement AI Assistant")
            ),
        }}
        initialValue="Welcome to TinyMCE!"
      />
      <button
        onClick={test}
        className="font-semibold px-3 py-1 duration-300 bg-sky-500 text-white active:scale-90"
      >
        Action
      </button>
    </div>
  );
};

export default Help;
