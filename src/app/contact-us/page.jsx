"use server";

import Image from "next/image";
import Link from "next/link";

const page = () => {
  return (
    <div className="min-h-screen pb-20 bg-gray-900 text-stone-300">
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center text-white">
          Contact Us
        </h2>
        <span className="block text-sm text-center text-gray-400 mb-8">
          Get in touch
        </span>
        <div className="container mx-auto grid gap-6 max-w-lg">
          <div>
            <div className="flex items-center mb-6">
              <i className="uil uil-phone text-2xl text-red-500 mr-4"></i>
              <div>
                <h3 className="text-xl font-medium">Call Us</h3>
                <span className="text-sm text-gray-400">
                  <a href="tel:+8801709605097">+88 01788-422002</a>
                  <br />
                  <a href="tel:+8801709605097">+88 01709-605097</a>
                </span>
              </div>
            </div>
            <div className="flex items-center mb-6">
              <i className="uil uil-envelope text-2xl text-red-500 mr-4"></i>
              <div>
                <h3 className="text-xl font-medium">Email</h3>
                <span className="text-sm text-gray-400">
                  <a href="mailto:info@thecrownboyshostel.com">
                    info@thecrownboyshostel.com
                  </a>
                  <br />
                  <a href="mailto:admin@thecrownboyshostel.com">
                    admin@thecrownboyshostel.com
                  </a>
                </span>
              </div>
            </div>
            <div className="flex items-center mb-6">
              <i className="uil uil-map-marker text-2xl text-red-500 mr-4"></i>
              <div>
                <h3 className="text-xl font-medium">Location</h3>
                <span className="text-sm text-gray-400">
                  Shaplar Mor - Kamarpara - Uttara - Dhaka - Bangladesh
                </span>
              </div>
            </div>

            <div className="my-10">
              <div className="flex items-center gap-5">
                <Link href="https://wa.me/01788422002" target="_blank">
                  <Image
                    width="36"
                    height="36"
                    className="w-9 h-9 hover:scale-110 transition ease-in-out duration-300 cursor-pointer"
                    src="/icons/whatsapp.png"
                    alt="linkedin"
                  />
                </Link>
                <Link
                  href="https://youtube.com/@thecrownboyshostel?si=sbY2XfHdB-V1FYRo"
                  target="_blank"
                >
                  <Image
                    width="36"
                    height="36"
                    className="w-11 h-9 hover:scale-110 transition ease-in-out duration-300 cursor-pointer"
                    src="/icons/youtube.png"
                    alt="github"
                  />
                </Link>
                <Link href="info@thecrownboyshostel.com" target="_blank">
                  <Image
                    width="36"
                    height="36"
                    className="w-9 h-7 hover:scale-110 transition ease-in-out duration-300 cursor-pointer"
                    src="/icons/gmail.png"
                    alt="gmail"
                  />
                </Link>
                <Link
                  href="https://www.facebook.com/thecrownboyshostel/"
                  target="_blank"
                >
                  <Image
                    width="36"
                    height="36"
                    className="w-9 h-9 hover:scale-110 transition ease-in-out duration-300 cursor-pointer"
                    src="/icons/facebook.png"
                    alt="facebook"
                  />
                </Link>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10318.026380387855!2d90.37922014003685!3d23.890568612945046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c50029e3d6a9%3A0xb3fab592c2f157d9!2sThe%20Crown%20Boys%20Hostel!5e0!3m2!1sen!2sbd!4v1714991040841!5m2!1sen!2sbd"
                width="285"
                height="252"
                className="w-full rounded-lg"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          <form action="" className="hidden grid gap-6">
            <div className="grid gap-4">
              <div className="w-[90%] md:w-full bg-white p-4 rounded-xl border border-red-500">
                <label className="text-sm font-medium text-white">Name</label>
                <input
                  name="name"
                  type="text"
                  className="w-full bg-transparent outline-none mt-2 text-gray-900"
                  required
                />
              </div>
              <div className="w-[90%] md:w-full bg-white p-4 rounded-xl border border-red-500">
                <label className="text-sm font-medium text-white">Email</label>
                <input
                  name="email"
                  type="email"
                  className="w-full bg-transparent outline-none mt-2 text-gray-900"
                  required
                />
              </div>
            </div>
            <div className="w-[90%] md:w-full bg-white p-4 rounded-xl border border-red-500">
              <label className="text-sm font-medium text-white">Project</label>
              <input
                name="project"
                type="text"
                className="w-full bg-transparent outline-none mt-2 text-gray-900"
                required
              />
            </div>
            <div className="w-[90%] md:w-full bg-white p-4 rounded-xl border border-red-500">
              <label className="text-sm font-medium text-white">Message</label>
              <textarea
                name="message"
                rows="7"
                className="w-full bg-transparent outline-none mt-2 text-gray-900"
                required
              ></textarea>
            </div>
            <button className="flex items-center justify-center bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition duration-300">
              Send Message
              <i className="uil uil-message ml-3"></i>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default page;
