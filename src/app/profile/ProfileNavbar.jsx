import { CgSpinner } from "react-icons/cg";

const ProfileNavbar = ({
  logout,
  loggingOut,
  user,
  breakfastCount,
  lunchCount,
  dinnerCount,
}) => {
  return (
    <div className="p-6 flex flex-col-reverse gap-3 items-center md:flex-row-reverse md:gap-0 justify-between dark:bg-gradient-to-r dark:from-primary dark:to-secondary dark:text-white">
      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 text-stone-900 font-bold px-4 py-1 flex items-center gap-3 rounded-lg duration-300 active:scale-90"
      >
        Logout
        {loggingOut && <CgSpinner className="animate-spin text-2xl" />}
      </button>
      {user.role === "client" && user.isVerified && user.isClientVerified && (
        <>
          <p className="text-lg border rounded-xl border-sky-500 px-8 py-1.5">
            Dinner: {dinnerCount}
          </p>
          <p className="text-lg border rounded-xl border-sky-500 px-8 py-1.5">
            Lunch: {lunchCount}
          </p>
          <p className="text-lg border rounded-xl border-sky-500 px-8 py-1.5">
            Breakfast: {breakfastCount}
          </p>
        </>
      )}
      <p className="text-lg text-sky-500 rounded-xl font-semibold px-6 py-1.5">
        My Profile
      </p>
    </div>
  );
};

export default ProfileNavbar;
