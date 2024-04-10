import { getClient } from "@/lib/blogs";
import Image from "next/image";

const page = async ({ params }) => {
  const { id } = params;
  const client = await getClient(id);
  console.log(client);
  return (
    <div className="min-h-screen dark:bg-stone-900 dark:text-white font-semibold">
      <div class="bg-gray-100 dark:bg-stone-900">
        <div class="container mx-auto px-4 py-16">
          <div class="flex flex-wrap -mx-3">
            <div class="lg:w-1/3 md:w-1/2 px-3 mb-6 md:mb-0">
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
                  Father&apos;s Number: {client.mothersNumber}
                </p>
                <p class="text-gray-600 dark:text-gray-400">
                  Authentication: {client.nidAuth ? "NID" : "Birth Certificate"}
                </p>
              </div>
            </div>
            <div class="lg:w-2/3 md:w-1/2 px-3">
              <div class="flex flex-wrap">
                <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-gray-700 font-bold mb-2"
                    for="grid-city"
                  >
                    Mess Address
                  </label>
                  <input
                    readOnly
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-city"
                    type="text"
                    value={client.messAddress}
                    placeholder="1234 Main St"
                  />
                </div>
                <div class="lg:w-1/2 md:w-full px-3 mb-6">
                  <label
                    class="block tracking-wide text-gray-700 font-bold mb-2"
                    for="grid-state"
                  >
                    Institution
                  </label>
                  <input
                    readOnly
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-state"
                    type="text"
                    value={client.institution}
                    placeholder="XYZ University"
                  />
                </div>
                <div class="lg:w-1/2 md:w-full px-3 mb-6 md:mb-0">
                  <label
                    class="block tracking-wide text-gray-700 font-bold mb-2"
                    for="grid-zip"
                  >
                    Floor Number
                  </label>
                  <input
                    readOnly
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-zip"
                    type="text"
                    value={`${client.floor} th Floor`}
                    placeholder="5"
                  />
                </div>
                <div class="lg:w-1/2 md:w-full px-3 mb-6 md:mb-0">
                  <label
                    class="block tracking-wide text-gray-700 font-bold mb-2"
                    for="grid-state"
                  >
                    Room Number
                  </label>
                  <input
                    readOnly
                    class="select-none appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-state"
                    type="text"
                    placeholder="O+"
                    value={
                      client.roomNumber.split("")[0].toUpperCase() +
                      " " +
                      client.roomNumber.split("")[1]
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
