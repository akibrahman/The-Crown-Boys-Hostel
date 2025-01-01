"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { FaExchangeAlt, FaPlus, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { useRouter, useSearchParams } from "next/navigation";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

const ManagerBooksComponent = ({ user }) => {
  const route = useRouter();

  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");

  const [reloadBook, setReloadBook] = useState(false);
  const [pages, setPages] = useState([]);

  const selectedBookInitialState = {
    title: "",
    subTitle: "",
    color: "",
    isLoading: false,
  };

  const [selectedBook, setSelectedBook] = useState(selectedBookInitialState);
  const [selectedPage, setSelectedPage] = useState(null);
  const [pageSaving, setPageSaving] = useState(false);
  const [amount, setAmount] = useState(0);
  const [dateSearch, setDateSearch] = useState("");

  useEffect(() => {
    if (bookId) {
      setSelectedBook((prevData) => ({
        ...prevData,
        isLoading: true,
      }));
      axios
        .get(`/api/book?bookId=${bookId}`)
        .then((data) => {
          setPages(data.data.pages);
          setSelectedBook({
            title: data.data.book.title,
            subTitle: data.data.book.subTitle,
            color: data.data.book.color,
            isLoading: false,
          });
        })
        .catch((e) => {
          toast.error(e.message);
          setSelectedBook((prevData) => ({
            ...prevData,
            isLoading: false,
          }));
          route.back();
        });
    } else setSelectedBook(selectedBookInitialState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, reloadBook]);

  const initialState = {
    showPopup: false,
    isCreating: false,
    title: "",
    subTitle: "",
    color: "",
  };

  const [createBookData, setCreateBookData] = useState(initialState);

  const initialStatePage = {
    showPopup: false,
    isCreating: false,
    date: "",
  };

  const [createPageData, setCreatePageData] = useState(initialStatePage);

  const {
    data: books,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["books", "manager", user?._id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/books`);
      if (data.success) {
        return data.books.reverse();
      } else {
        return [];
      }
    },
    enabled: user?._id && user?.role == "manager" ? true : false,
  });

  if (!user) return <PreLoader />;
  if (user?.success == false) return route.push("/signin");
  if (user.role != "manager") return route.push("/");

  const createBook = async (e) => {
    try {
      console.log(createBookData);
      setCreateBookData((prevData) => ({
        ...prevData,
        isCreating: true,
      }));
      const { data } = await axios.post("/api/book", createBookData);
      if (!data.success) throw new Error(data.msg);
      await refetch();
      toast.success(data.msg);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.msg || error?.message || "Something Went Wrong!"
      );
    } finally {
      setCreateBookData(initialState);
    }
  };

  const createPage = async (e) => {
    try {
      setCreatePageData((prevData) => ({
        ...prevData,
        isCreating: true,
      }));
      const { data } = await axios.post("/api/page", {
        date: createPageData.date,
        bookId,
      });
      if (!data.success) throw new Error(data.msg);
      setReloadBook(!reloadBook);
      toast.success(data.msg);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.msg || error?.message || "Something Went Wrong!"
      );
    } finally {
      setCreatePageData(initialStatePage);
    }
  };

  const deletePage = async (id) => {
    const swalData = await Swal.fire({
      title: "Do you want to Delete this Page?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1493EA",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      background: "#141E30",
      color: "#fff",
    });
    if (!swalData.isConfirmed) return;
    try {
      const { data } = await axios.delete(`/api/page?pageId=${id}`);
      if (!data.success) throw new Error(data.msg);
      setReloadBook(!reloadBook);
      toast.success("Page Deleted");
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.msg || error?.message || "Something Went Wrong!"
      );
    } finally {
      setSelectedPage(null);
    }
  };

  const calculateTotalAmount = (textData) => {
    const lines = textData.trim().split("\n");
    const totalAmount = lines.reduce((sum, line) => {
      const match = line.match(/-?\d+(\.\d+)?$/); // Match a number (including negative or decimal)
      const amount = match ? parseFloat(match[0]) : 0;
      return sum + amount;
    }, 0);
    return totalAmount;
  };

  const writting = (updatedValue) => {
    if (!selectedPage) return;
    try {
      setPageSaving(true);
      setSelectedPage((prevData) => ({
        ...prevData,
        textArea: updatedValue,
      }));
      setPages((prevPages) =>
        prevPages.map((page) =>
          page._id === selectedPage._id
            ? { ...page, textArea: updatedValue }
            : page
        )
      );
      setAmount(calculateTotalAmount(updatedValue));
      axios
        .put("/api/page", {
          textArea: updatedValue,
          pageId: selectedPage._id,
        })
        .then(() => setPageSaving(false))
        .catch();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.msg || error?.message || "Something Went Wrong!"
      );
    }
  };

  if (bookId) {
    return (
      <>
        {createPageData.showPopup && (
          <div className="fixed z-50 top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.5)]">
            <motion.div
              initial={{ scale: 0.5, x: "-50%", y: "-50%", opacity: 0 }}
              whileInView={{ scale: 1, x: "-50%", y: "-50%", opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="absolute text-pink-600 top-[45%] md:top-1/2 left-1/2 bg-white md:h-[80%] w-[95%] md:w-[60%] rounded-xl flex flex-col items-center justify-center gap-4 font-medium py-5 md:py-0"
            >
              <FaTimes
                onClick={() =>
                  setCreatePageData({ ...initialStatePage, showPopup: false })
                }
                className="absolute top-5 right-5 text-slate-800 cursor-pointer aspect-square text-lg"
              />

              <h2 className="text-2xl font-semibold text-gray-800">
                Create a New Page
              </h2>

              {/* Form for creating a book */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createPage(e);
                }}
                className="flex flex-col w-[90%] md:w-[80%] gap-4"
              >
                {/* Title field */}
                <label className="flex flex-col text-left text-gray-700">
                  Date:
                  <input
                    required
                    type="text"
                    placeholder="Enter Date"
                    className="border p-2 rounded-md outline-none"
                    onChange={(e) =>
                      setCreatePageData((prevData) => ({
                        ...prevData,
                        date: e.target.value,
                      }))
                    }
                  />
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600 active:scale-90 duration-300 w-max px-10 mx-auto flex items-center gap-2"
                >
                  Create Page
                  {createPageData.isCreating && (
                    <CgSpinner className="animate-spin text-lg" />
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
        <div className="relative min-h-full p-5 bg-dashboard text-slate-100">
          <button
            onClick={() => {
              setPages([]);
              setSelectedPage(null);
              setAmount(0);
              route.back();
            }}
            className="flex items-center absolute top-5 right-5 gap-2 font-semibold text-white bg-blue-500 px-4 py-1 rounded-md active:scale-90 duration-300"
          >
            Change Book <FaExchangeAlt className="text-l" />
          </button>
          <p className="text-center font-semibold text-xl dark:text-white">
            {selectedBook.title}
          </p>
          {selectedBook.isLoading ? (
            <p className="text-center text-lg font-semibold mt-10 flex items-center justify-center gap-2">
              Loading Book <CgSpinner className="animate-spin text-lg" />
            </p>
          ) : (
            <div className="w-full borde border-white rounded-md mt-4 h-[65vh] flex items-center gap-2">
              {/* Left Side of a Book  */}
              <div className="w-[25%] bg-slate-600 h-full rounded-md p-4 overflow-y-scroll">
                {/* Search and Add  */}
                <div className="flex items-center justify-between sticky top-0">
                  <input
                    onChange={(e) => setDateSearch(e.target.value)}
                    type="text"
                    placeholder="Search"
                    className="w-[80%] px-4 py-0.5 rounded-full text-slate-400 font-medium bg-dashboard outline-none"
                  />
                  <div
                    onClick={() => {
                      setCreatePageData((prevData) => ({
                        ...prevData,
                        showPopup: true,
                      }));
                    }}
                    className="bg-dashboard rounded-full h-8 w-8 flex items-center justify-center aspect-square cursor-pointer active:scale-90 duration-300 hover:scale-105"
                  >
                    <FaPlus className="text-slate-400" />
                  </div>
                </div>
                {/* All Dates  */}
                {pages.length == 0 && (
                  <p className="text-center font-semibold mt-5 text-slate-400 flex items-center justify-center gap-2">
                    No Pages
                  </p>
                )}
                {pages.length > 0 && (
                  <div className="grid grid-cols-1 mt-3 gap-2">
                    {pages
                      .filter((p) =>
                        dateSearch ? p.date.split("/")[0] == dateSearch : true
                      )
                      .map((page) => (
                        <p
                          key={page._id}
                          className={`border-2 border-double rounded-md font-bold py-0.5 duration-300 hover:shadow-2xl shadow-dashboard flex items-center justify-evenly select-none ${
                            selectedPage?.date == page?.date
                              ? "text-slate-600 bg-slate-300"
                              : "text-slate-300 bg-transparent"
                          }`}
                        >
                          <p
                            onClick={() => {
                              setSelectedPage(page);
                              setAmount(calculateTotalAmount(page.textArea));
                            }}
                            className="px-5 py-0.5 cursor-pointer active:scale-95 duration-300"
                          >
                            {page.date}
                          </p>
                          <div className="flex items-center justify-center gap-3">
                            <MdDelete
                              onClick={() => deletePage(page._id)}
                              className="cursor-pointer text-red-500 text-xl duration-300 active:scale-90 hover:scale-105"
                            />
                          </div>
                        </p>
                      ))}
                  </div>
                )}
              </div>
              {/* Right Side of a Book  */}
              <div className="w-[75%] relative border border-slate-600 h-full rounded-md p-4">
                {pageSaving ? (
                  <p className="absolute top-5 font-semibold right-6 flex items-center gap-1 text-slate-500 ">
                    Saving <CgSpinner className="animate-spin" />
                  </p>
                ) : (
                  <p className="absolute top-5 font-semibold right-6 flex items-center gap-1 text-slate-500 ">
                    ৳ {amount} BDT
                  </p>
                )}
                {selectedPage ? (
                  <textarea
                    onChange={(e) => writting(e.target.value)}
                    value={selectedPage ? selectedPage?.textArea : ""}
                    className="h-full w-full rounded-md bg-slate-900 outline-none p-4 text-slate-200 font-semibold resize-none"
                  ></textarea>
                ) : (
                  <div className="flex items-center justify-center text-center w-full h-full">
                    <p>Select Page</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </>
    );
  } else
    return (
      <>
        {createBookData.showPopup && (
          <div className="fixed z-50 top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.5)]">
            <motion.div
              initial={{ scale: 0.5, x: "-50%", y: "-50%", opacity: 0 }}
              whileInView={{ scale: 1, x: "-50%", y: "-50%", opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="absolute text-pink-600 top-[45%] md:top-1/2 left-1/2 bg-white md:h-[80%] w-[95%] md:w-[60%] rounded-xl flex flex-col items-center justify-center gap-4 font-medium py-5 md:py-0"
            >
              <FaTimes
                onClick={() =>
                  setCreateBookData((prevData) => ({
                    ...initialState,
                    showPopup: !prevData.showPopup,
                  }))
                }
                className="absolute top-5 right-5 text-slate-800 cursor-pointer aspect-square text-lg"
              />

              <h2 className="text-2xl font-semibold text-gray-800">
                Create a New Book
              </h2>

              {/* Form for creating a book */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createBook(e);
                }}
                className="flex flex-col w-[90%] md:w-[80%] gap-4"
              >
                {/* Title field */}
                <label className="flex flex-col text-left text-gray-700">
                  Title:
                  <input
                    required
                    type="text"
                    placeholder="Enter Title"
                    className="border p-2 rounded-md outline-none"
                    onChange={(e) =>
                      setCreateBookData((prevData) => ({
                        ...prevData,
                        title: e.target.value,
                      }))
                    }
                  />
                </label>

                {/* Subtitle field */}
                <label className="flex flex-col text-left text-gray-700">
                  Subtitle:
                  <input
                    required
                    type="text"
                    placeholder="Enter Subtitle"
                    className="border p-2 rounded-md outline-none"
                    onChange={(e) =>
                      setCreateBookData((prevData) => ({
                        ...prevData,
                        subTitle: e.target.value,
                      }))
                    }
                  />
                </label>

                {/* Color field */}
                <label className="flex flex-col text-left text-gray-700">
                  Color:
                  <input
                    required
                    type="color"
                    className="border p-2 rounded-md outline-none"
                    onChange={(e) =>
                      setCreateBookData((prevData) => ({
                        ...prevData,
                        color: e.target.value,
                      }))
                    }
                    value={createBookData.color || "000000"} // default to black if color is empty
                  />
                </label>

                {/* Submit button */}
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600 active:scale-90 duration-300 w-max px-10 mx-auto flex items-center gap-2"
                >
                  Create Book
                  {createBookData.isCreating && (
                    <CgSpinner className="animate-spin text-lg" />
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        <div className="relative min-h-full p-5 bg-dashboard text-slate-100">
          <button
            onClick={() =>
              setCreateBookData((prevData) => ({
                ...prevData,
                showPopup: !prevData.showPopup,
              }))
            }
            className="flex items-center absolute top-5 right-5 gap-2 font-semibold text-white bg-blue-500 px-4 py-1 rounded-md active:scale-90 duration-300"
          >
            Create <FaPlus className="text-l" />
          </button>
          <p className="text-center font-semibold text-xl dark:text-white">
            Books
          </p>
          {books?.length == 0 && (
            <p className="text-center text-lg font-semibold mt-10">
              No Books Found, Try Creating One
            </p>
          )}
          {isLoading && (
            <p className="text-center text-lg font-semibold mt-10 flex items-center justify-center gap-2">
              Loading Books <CgSpinner className="animate-spin text-lg" />
            </p>
          )}
          {books?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 mt-6">
              {books.map((book) => (
                <div
                  onClick={() => {
                    toast.success("Loading Book.......");
                    const currentParams = new URLSearchParams(
                      window.location.search
                    );
                    currentParams.set("bookId", book._id);
                    route.push(
                      `${window.location.pathname}?${currentParams.toString()}`
                    );
                  }}
                  className="px-6 py-2 rounded-md border duration-300 hover:scale-105 cursor-pointer active:scale-90 select-none"
                  style={{
                    boxShadow: `5px 10px 10px ${book.color}`,
                  }}
                  key={book._id}
                >
                  <p className="text-xl text-white font-semibold mb1">
                    {book.title}
                  </p>
                  <p className="text-sm text-slate-400">
                    {book.subTitle}
                    <span className="ml-2 font-bold">৳ {book.totalAmount}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
};

export default ManagerBooksComponent;
