"use client";

import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

// ✅ MUI Icons
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SearchIcon from "@mui/icons-material/Search";

const Header = () => {
  const bag = useSelector((state) => state.bag);

  return (
    <header className="flex items-center justify-between px-6 py-3 shadow-md bg-white">
      
      {/* Logo */}
      <div>
        <Link href="/">
          <Image
            src="/images/myntra_logo.webp"
            alt="Myntra"
            width={50}
            height={40}
            priority
          />
        </Link>
      </div>

      {/* Nav */}
      <nav className="hidden md:flex gap-6 text-sm font-medium">
        <Link href="#">Men</Link>
        <Link href="#">Women</Link>
        <Link href="#">Kids</Link>
        <Link href="#">Home & Living</Link>
        <Link href="#">Beauty</Link>
        <Link href="#">
          Studio <sup className="text-pink-500">New</sup>
        </Link>
      </nav>

      {/* Search */}
      <div className="hidden lg:flex items-center bg-gray-100 px-3 py-1 rounded-md w-1/3">
        <SearchIcon className="text-gray-500 mr-2" fontSize="small" />
        <input
          className="bg-transparent outline-none w-full text-sm"
          placeholder="Search for products, brands and more"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 text-sm">
        
        <div className="flex flex-col items-center cursor-pointer">
          <PersonIcon fontSize="small" />
          <span>Profile</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer">
          <FavoriteIcon fontSize="small" />
          <span>Wishlist</span>
        </div>

        <Link href="/bag" className="relative flex flex-col items-center">
          <ShoppingBagIcon fontSize="small" />
          <span>Bag</span>

          {bag.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-pink-600 text-white text-xs px-1.5 rounded-full">
              {bag.length}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;