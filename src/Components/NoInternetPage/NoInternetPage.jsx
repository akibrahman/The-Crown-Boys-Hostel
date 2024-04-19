import Image from "next/image";

const NoInternetPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-800">
      <h1 className="text-2xl md:text-4xl font-bold text-sky-500 mb-4">
        No Internet Connection
      </h1>
      <p className="text-sm md:text-lg text-gray-600 mb-8">
        Please check your connection and try again.
      </p>
      <Image
        src="/images/no-wifi.png"
        width={700}
        height={700}
        alt="No Internet Connection"
        className="w-72 h-7w-72 mb-8"
      />
      <button
        onClick={() => window.location.reload()}
        className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
      >
        Retry
      </button>
    </div>
  );
};

export default NoInternetPage;
