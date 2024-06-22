const PreLoader = () => {
  return (
    <div className="w-full h-screen text-slate-100 bg-dashboard flex items-center justify-center">
      <div className="text-right animate-pulse">
        <p className="text-5xl font-bold mb-3">The Crown</p>
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

export default PreLoader;
