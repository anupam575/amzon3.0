"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchUser } from "@/redux/slices/authSlice";
import NotificationsListener from "./components/Section/SocketListener"; 

import ButtonAppBar from "./components/Header/Header";
import Panel from "./components/Header/Panel";
import { ToastContainer } from "react-toastify";

export default function ClientLayout({ children }) {
  const dispatch = useDispatch();

  const { authChecked, loading } = useSelector((state) => state.auth);

  // 🔐 ENSURE fetchUser runs ONLY ONCE
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current && !authChecked) {
      hasFetchedRef.current = true;
      dispatch(fetchUser());
    }
  }, [authChecked, dispatch]);

  return (
    <>
      {/* 🔔 GLOBAL SOCKET LISTENER */}
      <NotificationsListener />

      {/* 🔝 HEADER */}
      <ButtonAppBar />
      <Panel />

      {/* 📄 MAIN CONTENT */}
      <main>
        {/* ⏳ Optional: show loader until auth checked */}
        {!authChecked && loading ? (
          <div style={{ padding: "20px" }}>Loading...</div>
        ) : (
          children
        )}
      </main>

      {/* 🔔 TOAST NOTIFICATIONS */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        theme="colored"
      />
    </>
  );
}