const BlockMsg = () => {
  return (
    <div className="text-white bg-dashboard min-h-full flex flex-col gap-2 items-center justify-center">
      <p className="text-xl text-red-600 font-semibold">
        Your are blocked currently
      </p>
      <p className="">If you are continuing, try to contact with the manager</p>
    </div>
  );
};

export default BlockMsg;
