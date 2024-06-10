const BlockMsg = () => {
  return (
    <div className="dark:bg-gradient-to-r dark:from-primary dark:to-secondary dark:text-white min-h-screen flex flex-col gap-2 items-center justify-center">
      <p className="text-xl text-red-600 font-semibold">
        Your are blocked currently
      </p>
      <p className="">If you are continuing, try to contact with the manager</p>
    </div>
  );
};

export default BlockMsg;
