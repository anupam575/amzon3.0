import { createSlice } from "@reduxjs/toolkit";

const itemsSlice = createSlice({
  name: "items",
  initialState: [],
  reducers: {
    addInitialItems: (state, action) => {
      return action.payload;
    },
    clearItems: () => {
      return [];
    },
  },
});

export const itemsActions = itemsSlice.actions;

export default itemsSlice.reducer; // ✅ IMPORTANT