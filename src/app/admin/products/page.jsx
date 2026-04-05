"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";

import { AppButton } from "../../components/UI/Button";
import { AlertDialogModal } from "../../components/UI/AlertDialogModal";

// ✅ TanStack Table
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

// MUI Icons
import InventoryIcon from "@mui/icons-material/Inventory";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const AdminProductsPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [error, setError] = useState("");

  // ================= FETCH =================
  const fetchAdminProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/admin/products");
      setProducts(data.products || []);
      setError("");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load products";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  // ================= DELETE =================
  const confirmDelete = async () => {
    if (!deleteProductId) return;

    const original = [...products];
    setProducts((prev) =>
      prev.filter((p) => p._id !== deleteProductId)
    );

    try {
      await API.delete(`/admin/product/${deleteProductId}`);
      toast.success("Product deleted successfully");
    } catch (err) {
      setProducts(original);
      toast.error("Failed to delete product");
    }

    setDeleteProductId(null);
  };

  // ================= COLUMNS =================
  const columns = useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "Product ID",
        cell: ({ getValue }) => (
          <span className="break-words">{getValue()}</span>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ getValue }) => (
          <span className="break-words">{getValue()}</span>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ getValue }) => (
          <span className="text-green-400 font-semibold">
            ₹{getValue()}
          </span>
        ),
      },
      {
        accessorKey: "stock",
        header: "Stock",
        cell: ({ getValue }) => (
          <span className="text-yellow-300 font-medium">
            {getValue()}
          </span>
        ),
      },
      {
        id: "edit",
        header: "Edit",
        cell: ({ row }) => (
          <Link
            href={`/admin/products/${row.original._id}/update`}
            className="rounded-full p-2 border border-blue-400 hover:bg-blue-600 hover:text-white inline-flex transition"
          >
            <EditIcon fontSize="small" />
          </Link>
        ),
      },
      {
        id: "delete",
        header: "Delete",
        cell: ({ row }) => (
          <AppButton
            color="error"
            variant="outlined"
            className="rounded-full p-2 border border-red-500 text-red-500 hover:bg-red-600 hover:text-white"
            onClick={() => setDeleteProductId(row.original._id)}
          >
            <DeleteIcon fontSize="small" />
          </AppButton>
        ),
      },
    ],
    [products]
  );

  // ================= TABLE INSTANCE =================
  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto bg-gray-900 shadow-lg border border-gray-700 text-white">

      {/* HEADER */}
      <div className="flex items-center gap-2 p-5 border-b border-gray-700 bg-gray-800">
        <InventoryIcon className="text-yellow-400" />
        <h2 className="text-lg font-semibold">Admin Products Panel</h2>
      </div>

      {loading ? (
        <p className="p-6 flex items-center gap-2 text-gray-400">
          <AccessTimeIcon fontSize="small" /> Loading products...
        </p>
      ) : error ? (
        <p className="p-6 text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="p-6 text-gray-400">No products found.</p>
      ) : (
        <table className="w-full text-sm border-collapse">

          {/* CAPTION */}
          <caption className="p-5 text-left bg-gray-900">
            Our Products
            <p className="text-sm text-gray-300 mt-1">
              Manage stock, edit and delete products.
            </p>
          </caption>

          {/* HEAD */}
          <thead className="bg-gray-800 text-gray-200">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 border">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* BODY */}
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`border ${
                  index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                } hover:bg-gray-700`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 border">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      )}

      {/* DELETE MODAL */}
      <AlertDialogModal
        open={!!deleteProductId}
        onClose={() => setDeleteProductId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AdminProductsPanel;