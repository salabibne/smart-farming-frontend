"use client";

import React from "react";
import Image from "next/image";
import logo from "../../public/smartFarming.png";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  console.log("pathname",pathname);
  return (
    <div className="navbar  shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow "
          >
            <li className="text-[24px]">Home</li>
            <li>
              <a>About</a>
            </li>
            <li>
              <a>Weather Forcast</a>
            </li>
          </ul>
        </div>

        <Image src={logo} alt="Logo" width={70} height={70} />
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-[18px] gap-8">
          <li>
            <Link
              href="/"
              className={pathname === "/" ? "text-[#6BBF59] font-semibold" : ""}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={
                pathname === "/about"
                  ? "text-[#6BBF59] font-semibold"
                  : ""
              }
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/weatherforcast"
              className={
                pathname === "/weatherforcast"
                  ? "text-[#6BBF59] font-semibold"
                  : ""
              }
            >
              Weather Forcast
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end gap-4 mr-10 ">
        <div className="flex items-center justify-center gap-4 menu menu-horizontal text-[18px] ">
          <p>Login</p>
          <p className="border-2 p-2 rounded-xl text-white bg-[#6BBF59]">
            Get Started{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
