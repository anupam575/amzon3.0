"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import API from "../../../utils/axiosInstance";
import OrderStatusUpdater from "../../components/Section/OrderStatusUpdater";
import { AppButton } from "../../components/UI/Button";
import { AlertDialogModal } from "../../components/UI/AlertDialogModal";

// ✅ TanStack Table
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Pagination
import UIPagination from "../../components/UI/UIPagination";

export default function AllOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [deleteOrderId, setDeleteOrderId] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  // ================= FETCH =================
  const fetchOrders = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const { data } = await API.get(
        `/admin/orders?page=${pageNumber}&limit=10`
      );
      setOrders(data.orders);
      setTotalAmount(data.totalAmount);
      setTotalPages(data.totalPages);
      setPage(data.currentPage);
      setError("");
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, []);

  // ================= DELETE =================
  const confirmDelete = async () => {
    if (!deleteOrderId) return;

    const original = [...orders];
    setOrders((prev) => prev.filter((o) => o._id !== deleteOrderId));

    try {
      await API.delete("/admin/orders", {
        data: { orderIds: [deleteOrderId] },
      });
      toast.success("Deleted");
      fetchOrders(page);
    } catch {
      setOrders(original);
      toast.error("Delete failed");
    }

    setDeleteOrderId(null);
  };

  const confirmBulkDelete = async () => {
    if (!selectedOrders.length) return;

    const original = [...orders];
    setOrders((prev) =>
      prev.filter((o) => !selectedOrders.includes(o._id))
    );

    try {
      await API.delete("/admin/orders", {
        data: { orderIds: selectedOrders },
      });
      setSelectedOrders([]);
      fetchOrders(page);
    } catch {
      setOrders(original);
    }
  };

  // ================= SELECT =================
  const toggleSelectOrder = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o._id));
    }
  };

  // ================= COLUMNS =================
  const columns = useMemo(
    () => [
      {
        id: "select",
        header: () => (
          <input
            type="checkbox"
            checked={
              selectedOrders.length === orders.length &&
              orders.length > 0
            }
            onChange={toggleSelectAll}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedOrders.includes(row.original._id)}
            onChange={() => toggleSelectOrder(row.original._id)}
          />
        ),
      },
      {
        accessorKey: "_id",
        header: "Order ID",
      },
      {
        accessorFn: (row) => row.user?.name,
        header: "User",
      },
      {
        accessorFn: (row) => row.user?.email,
        header: "Email",
      },
      {
        accessorKey: "totalPrice",
        header: "Total",
        cell: ({ getValue }) => `₹${getValue()}`,
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => (
          <OrderStatusUpdater
            orderId={row.original._id}
            currentStatus={row.original.orderStatus}
            onStatusChange={() => fetchOrders(page)}
          />
        ),
      },
      {
        id: "view",
        header: "View",
        cell: ({ row }) => (
          <AppButton
            onClick={() =>
              router.push(`/admin/all-orders/${row.original._id}`)
            }
          >
            View
          </AppButton>
        ),
      },
      {
        id: "delete",
        header: "Delete",
        cell: ({ row }) => (
          <AppButton
            color="error"
            onClick={() => setDeleteOrderId(row.original._id)}
          >
            <DeleteIcon />
          </AppButton>
        ),
      },
    ],
    [orders, selectedOrders, page]
  );

  // ================= TABLE INSTANCE =================
  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-900 text-white">

      <h2 className="text-2xl font-bold flex gap-2 mb-4">
        <InventoryIcon /> All Orders
      </h2>

      <p className="mb-4">Total Revenue: ₹{totalAmount}</p>

      {selectedOrders.length > 0 && (
        <div className="mb-4 flex gap-4">
          <OrderStatusUpdater orderIds={selectedOrders} />
          <AppButton onClick={confirmBulkDelete}>
            Delete Selected
          </AppButton>
        </div>
      )}

      {/* TABLE */}
      <table className="w-full border">

        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="border p-2">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2">
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

      {/* PAGINATION */}
      <div className="mt-6 flex justify-center">
        <UIPagination
          totalPages={totalPages}
          page={page}
          onChange={(e, val) => {
            setPage(val);
            fetchOrders(val);
          }}
        />
      </div>

      {/* MODAL */}
      <AlertDialogModal
        open={!!deleteOrderId}
        onClose={() => setDeleteOrderId(null)}
        onConfirm={confirmDelete}
      />

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}