"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { RiWhatsappFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const pathname = usePathname();
  const showFooter =
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/signin") &&
    !pathname.startsWith("/signup");
  if (showFooter)
    return (
      <>
        {/* <hr className="border-slate-400" /> */}
        <footer className="bg-bg-color-dark lg:grid lg:grid-cols-5">
          <div className="relative block h-32 lg:col-span-2 lg:h-full p-10">
            <Image
              src="/images/logo.png"
              alt="Building image"
              className="absolute h-full w-full object-cover scale-50 md:scale-[0.6]"
              layout="fill"
              objectFit="cover"
              // placeholder="blur"
              // blurDataURL="/images/building-blur.png"
            />
          </div>

          <div className="px-4 py-16 sm:px-6 lg:col-span-3 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <p>
                  <span className="text-xs uppercase tracking-wide text-slate-200">
                    Call us
                  </span>

                  <Link
                    href="tel:+8801709605097"
                    className="block text-2xl font-medium text-slate-400 hover:opacity-75 sm:text-3xl"
                  >
                    01709605097
                  </Link>
                </p>

                <ul className="mt-8 space-y-1 text-sm text-slate-100">
                  <li>Everyday: 9am - 11pm</li>
                  <li>Weekend: 11am - 1am</li>
                </ul>

                <ul className="mt-8 flex items-center gap-6">
                  <li>
                    <Link
                      href="https://www.facebook.com/thecrownboyshostel/"
                      rel="noreferrer"
                      target="_blank"
                      className="text-slate-100 transition hover:opacity-75"
                    >
                      <span className="sr-only">Facebook</span>

                      <FaFacebook className="text-xl" />
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="https://wa.me/+8801788422002"
                      rel="noreferrer"
                      target="_blank"
                      className="text-slate-100 transition hover:opacity-75"
                    >
                      <span className="sr-only">WhatsApp</span>

                      <RiWhatsappFill className="text-2xl" />
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="https://youtube.com/@thecrownboyshostel?si=sbY2XfHdB-V1FYRo"
                      rel="noreferrer"
                      target="_blank"
                      className="text-slate-100 transition hover:opacity-75"
                    >
                      <span className="sr-only">Youtube</span>

                      <FaYoutube className="text-2xl" />
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="mailto:info@thecrownboyshostel.com"
                      rel="noreferrer"
                      target="_blank"
                      className="text-slate-100 transition hover:opacity-75"
                    >
                      <span className="sr-only">Gmail</span>

                      <MdEmail className="text-2xl" />
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-medium text-slate-400">Services</p>

                  <ul className="mt-6 space-y-4 text-sm">
                    <li>
                      <Link
                        href="#"
                        className="text-slate-100 transition hover:opacity-75"
                      >
                        1on1 Coaching
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="#"
                        className="text-slate-100 transition hover:opacity-75"
                      >
                        Company Review
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="#"
                        className="text-slate-100 transition hover:opacity-75"
                      >
                        Accounts Review
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="#"
                        className="text-slate-100 transition hover:opacity-75"
                      >
                        HR Consulting
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="#"
                        className="text-slate-100 transition hover:opacity-75"
                      >
                        SEO Optimisation
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-slate-400">Company</p>

                  <ul className="mt-6 space-y-4 text-sm">
                    <li>
                      <Link
                        href="#"
                        className="text-slate-100 transition hover:opacity-75"
                      >
                        About
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="#"
                        className="text-slate-100 transition hover:opacity-75"
                      >
                        Meet the Team
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="#"
                        className="text-slate-100 transition hover:opacity-75"
                      >
                        Accounts Review
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-gray-100 pt-12">
              <div className="sm:flex sm:items-center sm:justify-between">
                <ul className="flex flex-wrap gap-4 text-xs">
                  <li>
                    <Link
                      href="#"
                      className="text-slate-200 transition hover:opacity-75"
                    >
                      Terms & Conditions
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="#"
                      className="text-slate-200 transition hover:opacity-75"
                    >
                      Privacy Policy
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="#"
                      className="text-slate-200 transition hover:opacity-75"
                    >
                      Cookies
                    </Link>
                  </li>
                </ul>

                <p className="mt-8 text-xs text-slate-200 sm:mt-0">
                  &copy; 2024. The Crown Boys Hostel. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </>
    );
  else return <></>;
};

export default Footer;
