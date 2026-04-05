"use client";
export const dynamic = "force-dynamic";

import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

import {
  ErrorOutline,
  CheckCircle,
  Cancel,
  ShoppingCart,
} from "@mui/icons-material";
import { Rating } from "@mui/material";

import API from "../../../utils/axiosInstance";
import { addCartItem } from "../../../redux/slices/cartSlice";
import ReviewSection from "../../components/Section/Reviewsection";
import ImageZoom from "../../components/Header/ImageZoom";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [mainImage, setMainImage] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [numOfReviews, setNumOfReviews] = useState(0);

  /* ===================== FETCH PRODUCT ===================== */
  const fetchProduct = async () => {
    const { data } = await API.get(`/product/${id}`);
    return data;
  };

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: fetchProduct,
    enabled: !!id,
  });

  /* ===================== SET DATA ===================== */
  useEffect(() => {
    if (product) {
      setMainImage(product.mainImage || "/placeholder.png");
      setRatingValue(product.ratings || 0);
      setNumOfReviews(product.numOfReviews || 0);
    }
  }, [product]);

  /* ===================== REVIEW UPDATE ===================== */
  const handleUpdateSummary = useCallback((avg, total) => {
    setRatingValue(avg);
    setNumOfReviews(total);
  }, []);

  /* ===================== ADD TO CART ===================== */
  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await dispatch(
        addCartItem({ productId: product._id, quantity: 1 })
      ).unwrap();

      toast.success("Product added to cart!");
    } catch (err) {
      toast.error(err.message || "Failed to add product");
    }
  };

  /* ===================== STATES ===================== */
  if (isLoading)
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  if (isError) {
    toast.error("Failed to fetch product");
    return null;
  }

  if (!product)
    return <p className="text-gray-600">Product not found.</p>;

  return (
    <div className="p-6 -mt-16 space-y-8">

      {/* ===================== PRODUCT ===================== */}
      <div className="md:flex md:gap-8">

        {/* LEFT IMAGE */}
        <div className="md:w-1/2">
          {mainImage && <ImageZoom src={mainImage} />}

          <div className="flex mt-4 space-x-2 overflow-x-auto">
            {(product.thumbnails?.length || 0) > 0 ? (
              product.thumbnails.map((url, idx) => (
                <img
                  key={idx}
                  src={url || "/placeholder.png"}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    mainImage === url
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(url)}
                />
              ))
            ) : (
              <img
                src="/placeholder.png"
                className="w-20 h-20 object-cover"
              />
            )}
          </div>
        </div>

        {/* RIGHT INFO */}
        <div className="md:w-1/2 mt-6 md:mt-0 flex flex-col gap-4">

          <h2 className="text-2xl font-bold text-gray-800">
            {product.name || "No Name"}
          </h2>

          <p className="text-gray-700">
            {product.description || "No Description Available"}
          </p>

          <div className="flex items-center space-x-2">
            <Rating value={ratingValue} precision={0.1} readOnly size="small" />
            <span className="text-gray-600">
              ({numOfReviews} reviews)
            </span>
          </div>

          <p className="text-2xl font-bold text-blue-600">
            ₹{product.price ?? 0}
          </p>

          <div className="flex flex-wrap gap-2">

            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {product.category?.name || "Uncategorized"}
            </span>

            {product.inStock ? (
              product.lowStock ? (
                <span className="flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800">
                  <ErrorOutline fontSize="small" />
                  Only {product.stock} left!
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                  <CheckCircle fontSize="small" />
                  In Stock
                </span>
              )
            ) : (
              <span className="flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-red-100 text-red-800">
                <Cancel fontSize="small" />
                Out of Stock
              </span>
            )}

          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`mt-4 w-full py-3 rounded-xl text-white font-semibold ${
              product.inStock
                ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                : "bg-gray-400 cursor-not-allowed"
            } flex items-center justify-center gap-2`}
          >
            <ShoppingCart />
            {product.inStock ? "Add to Cart" : "Unavailable"}
          </button>

        </div>
      </div>

      {/* ===================== REVIEWS ===================== */}
      <div className="mt-12">
        <ReviewSection
          initialReviews={product.reviews || []}
          initialRating={product.ratings || 0}
          initialTotal={product.numOfReviews || 0}
          onUpdateSummary={handleUpdateSummary}
        />
      </div>
    </div>
  );
};

export default ProductDetails;