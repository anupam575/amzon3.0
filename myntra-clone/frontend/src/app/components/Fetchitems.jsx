
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { itemsActions } from "../../redux/slices/itemsSlice";
import { fetchStatusActions } from "../../redux/slices/fetchStatusSlice";

const FetchItems = () => {
  const fetchStatus = useSelector((state) => state.fetchStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchStatus.fetchDone) return;

    const controller = new AbortController();

    const fetchItems = async () => {
      try {
        dispatch(fetchStatusActions.markFetchingStarted());

        const res = await fetch("http://localhost:8080/items", {
          signal: controller.signal,
          cache: "no-store",
        });

        const data = await res.json();

        const items = Array.isArray(data.items[0])
          ? data.items[0]
          : data.items;

        dispatch(itemsActions.addInitialItems(items));
        dispatch(fetchStatusActions.markFetchDone());
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch failed:", error);
        }
      } finally {
        dispatch(fetchStatusActions.markFetchingFinished());
      }
    };

    fetchItems();

    return () => controller.abort();
  }, [fetchStatus.fetchDone, dispatch]);

  return null; // 👈 IMPORTANT
};

export default FetchItems;