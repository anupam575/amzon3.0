"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { bagActions } from "../../../redux/slices/bagSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const bagItems = useSelector((state) => state.bag);

  const elementFound = bagItems.includes(id);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`http://localhost:8080/items/${id}`);
        const data = await res.json();
        setItem(data.item);
      } catch (err) {
        console.error("Failed to fetch product detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleAddToBag = () => {
    dispatch(bagActions.addToBag(item.id));
  };

  const handleRemove = () => {
    dispatch(bagActions.removeFromBag(item.id));
  };

  if (loading) return <LoadingSpinner />;
  if (!item) return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-6 bg-white rounded-xl shadow-md">
      {/* Product Image */}
      <div className="flex-shrink-0 w-full md:w-1/2">
        <img
          src={item.image}
          alt={item.item_name}
          className="w-full h-full object-contain rounded-md"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold">{item.item_name}</h1>
          <p className="text-gray-500 mt-1">{item.company}</p>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl font-semibold">₹{item.current_price}</span>
            <span className="line-through text-gray-400">₹{item.original_price}</span>
            <span className="text-green-600 font-medium">({item.discount_percentage}% OFF)</span>
          </div>

          <p className="mt-3 text-gray-500">
            Return period: <span className="font-medium">{item.return_period} days</span>
          </p>
          <p className="text-gray-500">Delivery by: <span className="font-medium">{item.delivery_date}</span></p>
        </div>

        {/* Add/Remove Bag */}
        {elementFound ? (
          <button
            onClick={handleRemove}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition"
          >
            <DeleteIcon fontSize="small" /> Remove from Bag
          </button>
        ) : (
          <button
            onClick={handleAddToBag}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl transition"
          >
            <AddCircleOutlineIcon fontSize="small" /> Add to Bag
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;