"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

import API from "../../utils/axiosInstance";
import UIPagination from "../components/UI/UIPagination";
import SliderSizes from "../components/UI/Slider";
import { addCartItem } from "../../redux/slices/cartSlice";
import CategoryFilter from "../components/UI/CategoryFilter";
import { Rating } from "@mui/material";

const Product = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 90000]);

  const keyword = useSelector((state) => state?.search?.keyword) || "";

  const [debouncedKeyword] = useDebounce(keyword, 300);
  const [debouncedPriceRange] = useDebounce(priceRange, 300);

  /* RESET PAGE */
  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, debouncedPriceRange, selectedCategory]);

  /* ===================== FETCH PRODUCTS ===================== */
  const fetchProducts = async () => {
    let query = `/products?page=${page}`;

    if (debouncedKeyword.trim())
      query += `&keyword=${debouncedKeyword.trim()}`;

    if (selectedCategory) query += `&categoryId=${selectedCategory}`;

    query += `&price[gte]=${debouncedPriceRange[0]}&price[lte]=${debouncedPriceRange[1]}`;

    const { data } = await API.get(query);
    return data;
  };

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "products",
      page,
      debouncedKeyword,
      selectedCategory,
      debouncedPriceRange,
    ],
    queryFn: fetchProducts,
    keepPreviousData: true,
  });

  const products = data?.products || [];
  const total = data?.filteredProductsCount || 0;
  const perPage = data?.resultPerPage || 1;
  const totalPages = Math.ceil(total / perPage);

  /* ===================== ADD TO CART ===================== */
  const handleAddToCart = async (productId) => {
    try {
      await dispatch(addCartItem({ productId, quantity: 1 })).unwrap();
      toast.success("🛒 Product added to cart!");
    } catch (err) {
      toast.error(err.message || "Failed to add product to cart");
    }
  };

  /* ===================== LOADING ===================== */
  if (isLoading)
    return (
      <div className="flex justify-center items-center mt-16">
        <div className="animate-spin border-4 border-gray-200 border-t-blue-500 rounded-full w-10 h-10"></div>
      </div>
    );

  /* ===================== ERROR ===================== */
  if (isError) {
    toast.error("❌ Failed to load products");
    return null;
  }

  /* ===================== NO PRODUCTS ===================== */
  if (!products.length)
    return (
      <div className="flex flex-col items-center mt-16">
        <h2 className="text-2xl font-bold text-gray-700">
          No products found 😔
        </h2>

        <button
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => router.push("/")}
        >
          Back to Shop
        </button>
      </div>
    );

  return (
    <div className="-mt-10 px-4 sm:px-6 lg:px-8">

      {/* SIDEBAR */}
      <div className="flex flex-col lg:flex-row gap-6">

        <div className="lg:w-1/4 bg-white p-5 rounded-2xl shadow-xl">
          <h3 className="font-bold mb-4 text-lg">Filters</h3>

          <CategoryFilter
            categories={categories}
            setCategories={setCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <p className="mt-4 mb-2 font-semibold">Price</p>

          <SliderSizes
            value={priceRange}
            onChange={(e, val) => setPriceRange(val)}
          />

          <div className="flex justify-between mt-2 text-sm">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">

          {products.map((p) => (
            <div
              key={p._id}
              className="rounded-2xl shadow-lg hover:shadow-2xl flex flex-col bg-white"
            >
              <div
                className="relative h-80 overflow-hidden cursor-pointer"
                onClick={() => router.push(`/product/${p._id}`)}
              >
                <img
                  src={p.images?.[0]?.url || "/placeholder.png"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 flex flex-col justify-between flex-1">

                <h3 className="font-semibold">{p.name}</h3>

                <p className="text-blue-600 font-bold">₹{p.price}</p>

                <Rating value={p.ratings || 0} readOnly size="small" />

                <button
                  disabled={!p.inStock}
                  className="mt-3 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={() => handleAddToCart(p._id)}
                >
                  {p.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* PAGINATION */}
      <div className="mt-10 flex justify-center">
        <UIPagination
          totalPages={totalPages}
          page={page}
          onChange={(e, val) => setPage(val)}
        />
      </div>
    </div>
  );
};

export default Product;