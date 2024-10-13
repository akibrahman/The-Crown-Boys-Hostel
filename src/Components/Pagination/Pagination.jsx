import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

const SystemPagination = ({
  page,
  setPage,
  pages,
  totalPages,
  onlyNumbers = false,
  onlyButtons = false,
}) => {
  return (
    <div className="flex items-center justify-center gap-3 py-10 p-1">
      {onlyNumbers || (
        <button
          onClick={() => setPage(page - 1)}
          className="bg-dashboard text-white rounded-full px-3 py-[2px] transition-all active:scale-90 disabled:bg-slate-400 border border-slate-300 disabled:border-slate-400 flex items-center gap-1"
          disabled={page == 0 ? true : false}
        >
          <FaAnglesLeft />
          Prev
        </button>
      )}
      {onlyButtons ||
        pages.map((_, index) => (
          <button
            key={index}
            onClick={() => setPage(index)}
            className={`px-3 rounded-full aspect-square py-[2px] transition-all active:scale-90 border border-slate-300 ${
              page != index
                ? "bg-dashboard text-white"
                : "bg-white text-dashboard"
            }`}
          >
            {index + 1}
          </button>
        ))}
      {onlyNumbers || (
        <button
          onClick={() => setPage(page + 1)}
          className="bg-dashboard text-white rounded-full px-3 py-[2px] transition-all active:scale-90 disabled:bg-slate-400 border border-slate-300 disabled:border-slate-400 flex items-center gap-1"
          disabled={page == totalPages - 1 ? true : false}
        >
          Next
          <FaAnglesRight />
        </button>
      )}
    </div>
  );
};

export default SystemPagination;
