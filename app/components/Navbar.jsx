"use client";

import React from "react";
import Image from "next/image";
import logo from "@/public/smartFarming.png";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  console.log("pathname",pathname);
  return (
    <div className="navbar bg-transparent py-4 px-6 md:px-12">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-3xl z-50 mt-3 w-64 p-4 shadow-2xl border border-gray-50"
          >
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/weatherforcast">Weather Forcast</Link></li>
          </ul>
        </div>

        <div className="flex items-center gap-2 group cursor-pointer">
           <Image src={logo} alt="Logo" width={45} height={45} className="group-hover:rotate-12 transition-transform duration-500" />
           <span className="font-bold text-gray-800 tracking-tight hidden md:block">Smart Farming</span>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex bg-white/50 backdrop-blur-md rounded-full px-6 py-1 border border-white/40 shadow-sm">
        <ul className="menu menu-horizontal text-[15px] font-bold gap-8 text-gray-600">
          <li>
            <Link
              href="/"
              className={pathname === "/" ? "text-[#6BBF59] !bg-transparent" : "hover:text-[#6BBF59] !bg-transparent"}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={
                pathname === "/about"
                  ? "text-[#6BBF59] !bg-transparent"
                  : "hover:text-[#6BBF59] !bg-transparent"
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
                  ? "text-[#6BBF59] !bg-transparent"
                  : "hover:text-[#6BBF59] !bg-transparent"
              }
            >
              Weather Forcast
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end gap-6">
          <div className="hidden sm:flex items-center gap-6 text-[15px] font-bold text-gray-600">
            <Link href="/login" className="hover:text-green-600 transition-colors">Login</Link>
            <Link href="/get-started" className="px-6 py-2.5 rounded-xl text-white bg-[#6BBF59] shadow-lg shadow-green-900/20 hover:bg-[#5aa84a] transition-all transform hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>
      </div>
    </div>
  );
};

export default Navbar;
