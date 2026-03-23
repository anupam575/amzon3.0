"use client";

import { useSelector } from "react-redux";

const BagSummary = () => {
  const bagItemIds = useSelector((state) => state.bag);
  const items = useSelector((state) => state.items);

  const finalItems = items.filter((item) => bagItemIds.includes(item.id));

  const CONVENIENCE_FEES = 99;

  const totalItem = bagItemIds.length;

  const { totalMRP, totalDiscount } = finalItems.reduce(
    (acc, item) => {
      acc.totalMRP += item.original_price;
      acc.totalDiscount += item.original_price - item.current_price;
      return acc;
    },
    { totalMRP: 0, totalDiscount: 0 }
  );

  const finalPayment = totalMRP - totalDiscount + CONVENIENCE_FEES;

  return (
    <div className="p-6 rounded-xl shadow-md bg-white">
      
      {/* Header */}
      <h2 className="text-lg font-semibold mb-5">
        PRICE DETAILS ({totalItem} {totalItem > 1 ? "Items" : "Item"})
      </h2>

      {/* Price Breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Total MRP</span>
          <span>₹{totalMRP}</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Discount on MRP</span>
          <span>-₹{totalDiscount}</span>
        </div>

        <div className="flex justify-between">
          <span>Convenience Fee</span>
          <span>₹{CONVENIENCE_FEES}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-5"></div>

      {/* Total */}
      <div className="flex justify-between font-semibold text-lg">
        <span>Total Amount</span>
        <span>₹{finalPayment}</span>
      </div>

      {/* Place Order Button */}
      <button className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium transition-colors duration-200">
        PLACE ORDER
      </button>
    </div>
  );
};

export default BagSummary;