"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import { FaUserPlus, FaShoppingCart, FaClipboard } from "react-icons/fa";
import SearchBar from "./SearchBar";
import ThreeDotDropdown from "../../components/Section/Dropdown";

export default function ButtonAppBar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-blue-600 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <div className="flex-shrink-0">
  <Link href="/" className="flex items-center gap-2 group">
    <img
      src="/logo.png"
      alt="Logo"
      className="h-12 sm:h-14 md:h-16 lg:h-44 xl:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
    />
  </Link>
</div>

            {/* SEARCH BAR */}
            <div className="flex-1 flex justify-center mx-3 sm:mx-6">
              <div className="w-full max-w-xl">
                <SearchBar />
              </div>
            </div>

            {/* RIGHT ICONS (DESKTOP ONLY) */}
            <div className="hidden md:flex items-center space-x-5 text-white">

              {isAuthenticated && user?.avatar && (
                <Link href="/me">
                  <img
                    src={user.avatar}
                    alt={user.name || "avatar"}
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/150x150?text=" + (user.name?.[0]?.toUpperCase() || "U");
                    }}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover cursor-pointer hover:scale-105 transition"
                  />
                </Link>
              )}

              <Link href="/auth" className="hover:text-gray-200 transition">
                <FaUserPlus size={24} />
              </Link>

              <Link href="/cart" className="hover:text-gray-200 transition">
                <FaShoppingCart size={24} />
              </Link>

              {isAuthenticated && user?.role === "admin" && (
                <Link href="/admin" className="hover:text-gray-200 transition">
                  <FaClipboard size={24} />
                </Link>
              )}

              <ThreeDotDropdown />
            </div>

          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVBAR */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-blue-600 text-white shadow-lg z-50">
        <div className="flex justify-around items-center py-3">

          {isAuthenticated && user?.avatar && (
            <Link href="/me">
              <img
                src={user.avatar}
                alt={user.name || "avatar"}
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
                className="w-full h-8 rounded-full border-2 border-white object-cover"
              />
            </Link>
          )}

          <Link href="/auth">
            <FaUserPlus size={22} />
          </Link>

          <Link href="/cart">
            <FaShoppingCart size={22} />
          </Link>

          {isAuthenticated && user?.role === "admin" && (
            <Link href="/admin">
              <FaClipboard size={22} />
            </Link>
          )}

          <ThreeDotDropdown />

        </div>
      </div>
    </>
  );
}