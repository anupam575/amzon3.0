"use client";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="w-20 h-20 border-4 border-t-pink-500 border-gray-200 rounded-full animate-spin"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;