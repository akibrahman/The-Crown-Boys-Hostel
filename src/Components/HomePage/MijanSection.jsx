import Image from "next/image";

const MijanSection = () => {
  return (
    <section className="py-6 md:py-8 lg:py-10 bg-dark-black flex items-center justify-center px-4">
      <div className="container">
        <div className="flex flex-wrap items-center">
          {/* Left Side */}
          <div className="w-full px-4 lg:w-1/2">
            <div className="relative mx-auto mb-12 aspect-[25/24] max-w-[500px] text-center lg:m-0">
              <Image
                src="/images/mijan.jpg"
                alt="Mijanur Rahman - Owner of The Crown Boys Hostel"
                className="drop-shadow-none h-[300px] w-full rounded-lg"
                layout="responsive"
                width={500}
                height={300}
              />
              <div className="mt-3 flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Mijanur Rahman
                </h3>
                <p className="text-xs font-medium text-body-color">
                  Owner - The Crown Boys Hostel
                </p>
              </div>
            </div>
          </div>
          {/* Right Side */}
          <div className="w-full px-4 lg:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-9 flex flex-col items-center">
                <h3 className="text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  Trade Licence
                </h3>
                <Image
                  src="/doc/trade.jpg"
                  alt="Trade Licence of The Crown Boys Hostel"
                  height={300}
                  width={160}
                  className="cursor-pointer rounded-md w-[120px] md:w-[160px] py-3 text-center"
                />
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                  The Trade License of **The Crown Boys Hostel** reflects its
                  commitment to compliance and professionalism. It ensures that
                  the hostel operates within legal boundaries and provides
                  reliable and quality services to its residents.
                </p>
              </div>
              <div className="mb-9 flex flex-col items-center">
                <h3 className="text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                  TIN Licence
                </h3>
                <Image
                  src="/doc/tin.jpg"
                  alt="TIN Certificate of The Crown Boys Hostel"
                  height={300}
                  width={160}
                  className="cursor-pointer rounded-md w-[120px] md:w-[160px] py-3"
                />
                <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed text-center">
                  The TIN (Tax Identification Number) Certificate ensures that
                  The Crown Boys Hostel meets its financial and tax obligations,
                  contributing to the national economy while maintaining
                  transparent business practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MijanSection;
