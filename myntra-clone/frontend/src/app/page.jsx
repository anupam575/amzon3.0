"use client";

import { useSelector } from "react-redux";
import HomeItem from "./components/HomeItem";
import FetchItems from "./components/Fetchitems";
import LoadingSpinner from "./components/LoadingSpinner"; // ✅ import

const Home = () => {
  const items = useSelector((state) => state.items);
  const fetchDone = useSelector((state) => state.fetchStatus.fetchDone);

  return (
    <main className="bg-gray-50 min-h-screen py-8">
      {/* Fetch items */}
      <FetchItems />

      {/* Loading */}
      {!fetchDone ? (
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner /> {/* ✅ spinner use */}
        </div>
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500 text-lg">No items found.</p>
        </div>
      ) : (
        // Items Grid
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <HomeItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;