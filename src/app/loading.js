const loading = () => {
  return (
    <div className="w-full h-screen dark:bg-stone-900 dark:text-white flex items-center justify-center">
      <div className="text-right animate-pulse">
        <p className="text-5xl font-bold mb-3">Manager Expo</p>
        <p className="text-[12px]">A Quality Meal Management System</p>
        <p className="text-[12px] text-sky-500 leading-none">
          Designed & Developed by{" "}
          <a href="https://portfolio-akib.web.app" target="_blank">
            <span className="font-bold underline">Akib Rahman</span>
          </a>
        </p>
      </div>
    </div>
  );
};

export default loading;
