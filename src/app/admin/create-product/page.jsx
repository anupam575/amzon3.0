"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import API from "../../../utils/axiosInstance";
import AppButton from "@/app/components/UI/Button";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

/* ---------------- VALIDATION SCHEMA ---------------- */
const schema = yup.object({
  name: yup.string().required("Product name is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Must be positive")
    .required("Price is required"),
  stock: yup
    .number()
    .typeError("Stock must be a number")
    .min(0, "Stock cannot be negative")
    .required("Stock is required"),
  category: yup.string().required("Category is required"),
  images: yup
    .mixed()
    .test("required", "At least one image is required", (value) => {
      return value && value.length > 0;
    }),
});

const CreateProduct = () => {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- RHF ---------------- */
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/categories");
        if (data.success) {
          setCategories(
            data.categories.map((c) => ({
              id: c._id,
              name: c.name,
            }))
          );
        }
      } catch {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  /* ---------------- IMAGE HANDLER ---------------- */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const valid = [];
    const prev = [];

    files.forEach((file) => {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error(`${file.name} must be JPG or PNG`);
        return;
      }
      valid.push(file);
      prev.push(URL.createObjectURL(file));
    });

    setValue("images", valid);
    setPreviews(prev);
  };

  /* ---------------- CLOUDINARY ---------------- */
  const uploadImagesToCloudinary = async (images) => {
    if (!images?.length) return [];

    const { data } = await API.get("/get-signature");
    const { signature, timestamp, folder, cloudName, apiKey } = data;

    const uploaded = [];

    for (const file of images) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("timestamp", timestamp);
      fd.append("signature", signature);
      fd.append("api_key", apiKey);
      fd.append("folder", folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: fd }
      );

      const img = await res.json();

      uploaded.push({
        public_id: img.public_id,
        url: img.secure_url,
      });
    }

    return uploaded;
  };

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const cloudImages = await uploadImagesToCloudinary(
        formData.images
      );

      const { data } = await API.post("/admin/product/new", {
        ...formData,
        images: cloudImages,
      });

      if (data.success) {
        toast.success("Product created successfully");
        router.push("/admin/products");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Error creating product");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="mx-auto max-w-2xl bg-white rounded-2xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold">Create Product</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <Input label="Product Name" error={errors.name?.message}>
            <input {...register("name")} />
          </Input>

          <Input label="Description" error={errors.description?.message}>
            <textarea {...register("description")} rows={4} />
          </Input>

          <Input label="Price" error={errors.price?.message}>
            <input type="number" {...register("price")} />
          </Input>

          <Input label="Stock" error={errors.stock?.message}>
            <input type="number" {...register("stock")} />
          </Input>

          <Input label="Category" error={errors.category?.message}>
            <select {...register("category")}>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </Input>

          {/* Images */}
          <div>
            <label className="block mb-2 text-sm">Product Images</label>
            <button
              type="button"
              onClick={() => document.getElementById("fileInput").click()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Upload Images
            </button>
            <input
              id="fileInput"
              type="file"
              hidden
              multiple
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.images?.message}
            </p>
          </div>

          {/* Preview */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {previews.map((img, i) => (
                <img key={i} src={img} className="h-32 object-cover rounded" />
              ))}
            </div>
          )}

          <AppButton type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Product"}
          </AppButton>
        </form>
      </div>
    </div>
  );
};

/* ---------------- INPUT ---------------- */
const Input = ({ label, error, children }) => (
  <div>
    <label className="block mb-1 text-sm">{label}</label>
    {React.cloneElement(children, {
      className:
        "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500",
    })}
    <p className="text-red-500 text-xs">{error}</p>
  </div>
);

export default CreateProduct;