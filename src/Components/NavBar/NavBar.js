"use client";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/providers/ContextProvider";
import StarButton from "../Buttons/StarButton";
import "./styleForNavBar.css";
import { useRouter } from "next/navigation";
import ColorButton from "../Buttons/ColorButton";
import { CgSpinner } from "react-icons/cg";

const NavBar = () => {
  const { user, loading } = useContext(AuthContext);
  const withOutToken = [
    { title: "Home", url: "/" },
    { title: "About Us", url: "/about-us" },
    { title: "Contact Us", url: "/contact-us" },
    { title: "Log In", url: "/signin" },
    { title: "Registration", url: "/signup" },
  ];

  const withToken = [
    { title: "Home", url: "/" },
    { title: "About Us", url: "/about-us" },
    { title: "Contact Us", url: "/contact-us" },
    // { title: "Order", url: "/order" },
    { title: "Dashboard", url: "/dashboard" },
  ];

  const whenLoading = [
    { title: "Home", url: "/" },
    { title: "About Us", url: "/about-us" },
    { title: "Contact Us", url: "/contact-us" },
  ];

  if (loading) {
    return <NavMenus loading={loading} items={whenLoading} />;
  } else if (user && user.success && !loading)
    return <NavMenus loading={loading} items={withToken} />;
  else return <NavMenus loading={loading} items={withOutToken} />;
};

export default NavBar;

const NavMenus = ({ items, loading }) => {
  const [sideBarIsOpen, setSideBarIsOpen] = useState(false);
  const burgerMenuButtonRef = useRef();
  const route = useRouter();
  const burgerMenuButtonClicked = () => {
    setSideBarIsOpen(!sideBarIsOpen);
    burgerMenuButtonRef.current.checked = !sideBarIsOpen;
  };
  // const menu
  return (
    <div className="relative">
      {/* Desktop View */}
      <div
        className={`hidden md:flex bg-dashboard text-stone-300 flex-col md:flex-row gap-5 md:gap-0 items-center justify-between px-10 py-3 border-b border-[#364050]`}
      >
        <div className="flex items-center">
          <Image
            src="/images/logo.png"
            width={"60"}
            height={"60"}
            alt="Logo"
            className="h-[60px] w-[60px]"
            unoptimized
          />
        </div>
        <div className="flex text-base items-center justify-center gap-5">
          {items.map((item, i) =>
            item.title == "Dashboard" ? (
              <StarButton
                key={i}
                isLink={true}
                link={item.url}
                lable={item.title}
              />
            ) : item.title == "Log In" ? (
              <ColorButton
                key={i}
                isLink={true}
                link={item.url}
                lable={"Log In"}
              />
            ) : item.title == "Registration" ? (
              <ColorButton
                key={i}
                isLink={true}
                link={item.url}
                lable={"Registration"}
              />
            ) : (
              <Link
                className="relative before:duration-300 before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-[2px] before:bg-white hover:before:w-full"
                key={i}
                href={item.url}
              >
                {item.title}
              </Link>
            )
          )}
          {loading && <CgSpinner className="text-xl animate-spin text-white" />}
        </div>

        <ThemeSwitch />
      </div>
      {/* Mobile View  */}
      <div
        className={`z-20 block md:hidden fixed top-0 right-0 h-screen w-[70vw] duration-300 bg-dashboard pt-20 ${
          sideBarIsOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mt-28 flex flex-col text-white text-base items-center justify-center gap-5">
          {items.map((item, i) =>
            item.title == "Dashboard" ? (
              <StarButton
                key={i}
                onClick={() => {
                  burgerMenuButtonClicked();
                  route.push(item.url);
                }}
                isLink={false}
                link={item.url}
                lable={"Dashboard"}
              />
            ) : item.title == "Log In" ? (
              <ColorButton
                key={i}
                isLink={false}
                onClick={() => {
                  burgerMenuButtonClicked();
                  route.push(item.url);
                }}
                lable={"Log In"}
              />
            ) : item.title == "Registration" ? (
              <ColorButton
                key={i}
                onClick={() => {
                  burgerMenuButtonClicked();
                  route.push(item.url);
                }}
                isLink={false}
                link={item.url}
                lable={"Registration"}
              />
            ) : (
              <Link
                onClick={burgerMenuButtonClicked}
                className="relative before:duration-300 before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-[2px] before:bg-white hover:before:w-full border px-10 py-2"
                key={i}
                href={item.url}
              >
                {item.title}
              </Link>
            )
          )}
          {loading && <CgSpinner className="text-xl animate-spin text-white" />}
        </div>
      </div>
      {/* Mobile View  */}
      <div
        className={`flex md:hidden bg-dashboard text-stone-300 flex-col md:flex-row gap-5 md:gap-0 items-center justify-between px-10 py-3 border-b border-[#364050]`}
      >
        <div className="flex items-center justify-between w-full">
          <Image
            src="/images/logo.png"
            width={"60"}
            height={"60"}
            alt="Logo"
            className="h-[60px] w-[60px]"
            unoptimized
          />
          <div className="burger-menu-button z-40">
            <input
              onClick={burgerMenuButtonClicked}
              type="checkbox"
              id="checkbox"
              ref={burgerMenuButtonRef}
            />
            <label for="checkbox" className="toggle">
              <span className="bars" id="bar1"></span>
              <span className="bars" id="bar2"></span>
              <span className="bars" id="bar3"></span>
            </label>
          </div>
        </div>
        {/*  */}
        <ThemeSwitch />
      </div>
    </div>
  );
};
