import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Layout {
  codeList: any[];
}

const initialState: Layout = {
  codeList: [],
};

export const sidebarSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setValue: (
      state,
      {
        payload: { key, value },
      }: PayloadAction<{ key: keyof Layout; value: any }>
    ) => {
      state[key] = value;
    },
  },
});

export const { setValue } = sidebarSlice.actions;

export default sidebarSlice.reducer;
