 "use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { bagActions } from "../../redux/slices/bagSlice";

// ✅ MUI Icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

const HomeItem = ({ item }) => {
  const dispatch = useDispatch();
  const bagItems = useSelector((state) => state.bag);

  const elementFound = bagItems.includes(item.id);

  const handleAddToBag = () => {
    dispatch(bagActions.addToBag(item.id));
  };

  const handleRemove = () => {
    dispatch(bagActions.removeFromBag(item.id));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 flex flex-col">
      
      {/* Image */}
      <div className="w-full h-72 md:h-80 lg:h-96 mb-4 rounded-xl overflow-hidden flex items-center justify-center">
        <Image
          src={`/${item.image}`}
          alt={item.item_name}
          width={500}          // original image width के हिसाब से adjust करें
          height={500}         // original image height के हिसाब से adjust करें
          className="object-contain w-full h-full transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Rating */}
      <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
        <span>{item.rating?.stars || 0} ⭐</span>
        <span className="text-gray-400">|</span>
        <span>{item.rating?.count || 0} reviews</span>
      </div>

      {/* Company Name */}
      <h3 className="text-gray-600 text-sm font-medium truncate mb-1">
        {item.company}
      </h3>

      {/* Item Name */}
      <h2 className="text-gray-800 text-sm font-normal truncate mb-2">
        {item.item_name}
      </h2>

      {/* Price */}
      <div className="flex items-center gap-2 text-sm mb-4">
        <span className="text-gray-900 font-semibold">₹{item.current_price}</span>
        <span className="line-through text-gray-400 text-xs">₹{item.original_price}</span>
        <span className="text-green-600 text-xs font-medium">({item.discount_percentage}% OFF)</span>
      </div>

      {/* Button */}
      {elementFound ? (
        <button
          onClick={handleRemove}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-xl transition"
        >
          <DeleteIcon fontSize="small" />
          Remove
        </button>
      ) : (
        <button
          onClick={handleAddToBag}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-xl transition"
        >
          <AddCircleOutlineIcon fontSize="small" />
          Add to Bag
        </button>
      )}
    </div>
  );
};

export default HomeItem;