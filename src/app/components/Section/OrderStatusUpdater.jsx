"use client";

import React, { useState, useEffect } from "react";
import API from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import { AppButton } from "../../components/UI/Button";
import SelectBasic from "../UI/Select";
import { AlertDialogModal } from "../../components/UI/AlertDialogModal";

// Allowed transitions
const allowedTransitions = {
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Soon", "Cancelled"],
  Soon: ["Delivered", "Cancelled"],
  Delivered: [],
  Cancelled: [],
};

const OrderStatusUpdater = ({
  socket, // ✅ ADD SOCKET HERE
  orderId,
  orderIds = [],
  currentStatus = "Processing",
  orderStatuses = {},
  onStatusChange,
}) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [highlight, setHighlight] = useState(false);

  const isMultiple = orderIds.length > 0;

  /* ================= SOCKET LISTENER ================= */
  useEffect(() => {
    if (!socket) return;

    const handleOrderUpdate = (updates) => {
      const match = updates.find((u) =>
        isMultiple
          ? orderIds.includes(u.orderId)
          : u.orderId === orderId
      );

      if (match && match.status !== status) {
        setStatus(match.status);

        setHighlight(true);
        setTimeout(() => setHighlight(false), 1200);
      }
    };

    socket.on("orderUpdated", handleOrderUpdate);

    return () => {
      socket.off("orderUpdated", handleOrderUpdate);
    };
  }, [socket, orderId, orderIds, isMultiple, status]);

  /* ================= SYNC PROP ================= */
  useEffect(() => {
    if (!isMultiple && currentStatus) {
      setStatus(currentStatus);
    }
  }, [currentStatus, isMultiple]);

  /* ================= OPTIONS ================= */
  const getStatusOptions = () => {
    if (!isMultiple) {
      return [currentStatus, ...(allowedTransitions[currentStatus] || [])];
    }

    const allOptions = orderIds
      .map((id) => {
        const st = orderStatuses[id] || "Processing";
        return [st, ...(allowedTransitions[st] || [])];
      })
      .filter(Boolean);

    if (!allOptions.length) return [];

    return allOptions.reduce((acc, options) =>
      acc.filter((s) => options.includes(s))
    );
  };

  const statusOptions = getStatusOptions();

  const isDropdownDisabled =
    loading ||
    statusOptions.length === 0 ||
    ["Delivered", "Cancelled"].includes(currentStatus);

  const isButtonDisabled =
    loading ||
    status === currentStatus ||
    ["Delivered", "Cancelled"].includes(currentStatus);

  const handleUpdateClick = () => {
    if (!status || status === currentStatus) return;
    setShowModal(true);
  };

  /* ================= API UPDATE ================= */
  const confirmUpdate = async () => {
    setLoading(true);

    try {
      const idsToUpdate = isMultiple ? orderIds : [orderId];

      await API.put("/admin/orders", {
        orderIds: idsToUpdate,
        status,
      });

      toast.success(
        isMultiple
          ? `Updated ${idsToUpdate.length} orders to "${status}"`
          : `Order updated to "${status}"`
      );

      setStatus(status);
      setHighlight(true);
      setTimeout(() => setHighlight(false), 1200);

      onStatusChange && onStatusChange();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div
      className={`flex items-center gap-2 w-full md:w-50 p-1 rounded transition-all ${
        highlight ? "bg-green-100 scale-105" : ""
      }`}
    >
      {/* STATUS DROPDOWN */}
      <SelectBasic
        value={status}
        onChange={setStatus}
        options={statusOptions}
        disabled={isDropdownDisabled}
      />

      {/* UPDATE BUTTON */}
      <AppButton
        variant="auto"
        color="primary"
        onClick={handleUpdateClick}
        disabled={isButtonDisabled}
      >
        {loading ? "Updating..." : "Update"}
      </AppButton>

      {/* CONFIRM MODAL */}
      <AlertDialogModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmUpdate}
        message={
          isMultiple
            ? `Update ${orderIds.length} orders to "${status}"?`
            : `Change status from "${currentStatus}" to "${status}"?`
        }
        confirmText="Update"
      />
    </div>
  );
};

export default OrderStatusUpdater;