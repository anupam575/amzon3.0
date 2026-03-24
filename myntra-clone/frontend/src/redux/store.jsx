import { configureStore } from "@reduxjs/toolkit";
import bagReducer from "./slices/bagSlice";
import itemsReducer from "./slices/itemsSlice";
import fetchStatusReducer from "./slices/fetchStatusSlice";

export const store = configureStore({
  reducer: {
    bag: bagReducer,
    items: itemsReducer,
    fetchStatus: fetchStatusReducer,
  },
});