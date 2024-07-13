import { getClient } from "@/lib/blogs";
import Image from "next/image";
import Link from "next/link";

const page = async ({ params }) => {
  const { id } = params;
  const client = await getClient(id);
  console.log(client);
  return (
    <div className="min-h-screen bg-dashboard text-white font-semibold">
      <div class="bg-dashboard text-white">
        <div class="container mx-auto px-4 pb-16 pt-16">
          <div class="flex flex-wrap -mx-3">
            <div class="lg:w-1/3 md:w-1/2 w-full px-3 mb-6 md:mb-0">
              <div class="flex flex-col items-center text-center">
                <Image
                  alt="User Profile"
                  width={100}
                  height={100}
                  class="w-48 h-48 rounded-full mb-3"
                  src={client.profilePicture}
                />
                <h3 class="text-2xl font-semibold text-gray-800 dark:text-white">
                  {client.username}
                </h3>
                <p class="text-gray-600 dark:text-gray-400">{client.email}</p>
                <p class="text-gray-600 dark:text-gray-400">
                  {client.contactNumber}
                </p>
                <p class="text-gray-600 dark:text-gray-400">
                  Father&apos;s Number: {client.fathersNumber}
                </p>
                <p class="text-gray-600 dark:text-gray-400">
                  Mother&apos;s Number: {client.mothersNumber}
                </p>
                <p class="text-gray-600 dark:text-gray-400">
                  Authentication: {client.nidAuth ? "NID" : "Birth Certificate"}
                </p>
                <Link href={`/userDetails/edit/${client._id}`}>
                  <button className="duration-300 transition-all px-4 py-1 rounded-md font-medium bg-red-500 active:scale-90 mt-3">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
            <div class="lg:w-2/3 md:w-1/2 w-full px-3">
              <div class="flex flex-col justify-center items-center">
                <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-white font-bold mb-2"
                    for="messAddress"
                  >
                    Mess Address
                  </label>
                  <input
                    readOnly
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    name="messAddress"
                    id="messAddress"
                    type="text"
                    defaultValue={client.messAddress}
                  />
                </div>
                <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-white font-bold mb-2"
                    for="institution"
                  >
                    Institution
                  </label>
                  <input
                    readOnly
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    name="institution"
                    id="institution"
                    type="text"
                    defaultValue={client.institution}
                  />
                </div>
                <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-white font-bold mb-2"
                    for="floor"
                  >
                    Floor Number
                  </label>
                  <input
                    readOnly
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="floor"
                    name="floor"
                    type="text"
                    defaultValue={`${client.floor} th Floor`}
                  />
                </div>
                <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-white font-bold mb-2"
                    for="roomNumber"
                  >
                    Room Number
                  </label>
                  <input
                    readOnly
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="roomNumber"
                    name="roomNumber"
                    type="text"
                    defaultValue={
                      client.roomNumber.split("")[0].toUpperCase() +
                      " " +
                      client.roomNumber.split("")[1]
                    }
                  />
                </div>
                {/* <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-white font-bold mb-2"
                    for="utilityCharge"
                  >
                    Utility Charge
                  </label>
                  <input
                    readOnly
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="utilityCharge"
                    name="utilityCharge"
                    type="text"
                    defaultValue={client.utilityCharge}
                  />
                </div>
                <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-white font-bold mb-2"
                    for="wifiCharge"
                  >
                    Wifi Charge
                  </label>
                  <input
                    readOnly
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="wifiCharge"
                    name="wifiCharge"
                    type="text"
                    defaultValue={client.wifiCharge}
                  />
                </div> */}
                <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-white font-bold mb-2"
                    for="bloodGroup"
                  >
                    Blood Group
                  </label>
                  <input
                    readOnly
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="bloodGroup"
                    name="bloodGroup"
                    type="text"
                    defaultValue={client.bloodGroup}
                  />
                </div>
                <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-white font-bold mb-2"
                    for="studentId"
                  >
                    Student or Job ID
                  </label>
                  <input
                    readOnly
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="studentId"
                    name="studentId"
                    type="text"
                    defaultValue={client.studentId}
                  />
                </div>
              </div>
              <div className="pb-16">
                <div className="flex items-center justify-center gap-4">
                  <p class="text-center tracking-wide text-white font-bold">
                    Charges
                  </p>
                </div>
                {client.charges.length == 0 && (
                  <p className="text-center text-sm mt-4 select-none">
                    No added charges
                  </p>
                )}
                {client.charges.length != 0 && (
                  <table className="w-[90%] md:w-[50%] mx-auto mt-4">
                    <thead className="bg-[rgba(0,0,200,0.2)]">
                      <tr>
                        <td className="border text-center py-1.5">Note</td>
                        <td className="border text-center py-1.5">Amount</td>
                      </tr>
                    </thead>
                    {client.charges.map((crg, i) => (
                      <tbody key={i} className="text-sm">
                        <tr>
                          <td className="border text-center py-1">
                            {crg.note}
                          </td>
                          <td className="border text-center py-1">
                            {crg.amount}
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                )}
              </div>
              {client.nidAuth ? (
                <div className="flex flex-col md:flex-row items-center justify-around">
                  <div>
                    <p className="mb-2">NID Front</p>
                    <Image
                      src={client.nidFrontPicture}
                      width={350}
                      height={60}
                      className="rounded-md"
                      alt={`NID front of ${client.username}`}
                    />
                  </div>
                  <div>
                    <p className="mb-2">NID Back</p>
                    <Image
                      src={client.nidBackPicture}
                      width={350}
                      height={60}
                      className="rounded-md"
                      alt={`NID back of ${client.username}`}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <p className="mb-2">Birth Certificate</p>
                  <Image
                    src={client.birthCertificatePicture}
                    width={400}
                    height={40}
                    className="rounded-md"
                    alt={`Birth Certificate of ${client.username}`}
                  />
                </div>
              )}
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-8 w-full">
                <p className="text-red-600 font-semibold">Block Date:</p>
                {client.blockDate ? (
                  <div className="flex items-center gap-3">
                    <p>
                      {new Date(client.blockDate).toLocaleDateString("en-BD", {
                        timeZone: "Asia/Dhaka",
                      })}
                    </p>
                    <p className="text-xs">(MM/DD/YYYY)</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <p>Not Scheduled</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
