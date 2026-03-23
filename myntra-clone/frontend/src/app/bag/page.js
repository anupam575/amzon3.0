"use client";

import { useSelector } from "react-redux";
import BagItem from "../components/BagItem";
import BagSummary from "../components/BagSummary";

const Bag = () => {
  const bagItems = useSelector((state) => state.bag);
  const items = useSelector((state) => state.items);

  // Filter items that are in the bag
  const finalItems = items.filter((item) => bagItems.includes(item.id));

  if (!finalItems.length) {
    return (
      <main className="p-10 text-center">
        <h2 className="text-xl font-semibold">Your Bag is Empty 🛒</h2>
        <p className="text-gray-500 mt-2">Add items to see them here.</p>
      </main>
    );
  }

  return (
    <main className="p-5 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left: Items */}
        <div className="flex-1 space-y-4">
          {finalItems.map((item) => (
            <BagItem key={item.id} item={item} />
          ))}
        </div>

        {/* Right: Summary */}
        <div className="w-full lg:w-1/3">
          <BagSummary />
        </div>
      </div>
    </main>
  );
};

export default Bag;