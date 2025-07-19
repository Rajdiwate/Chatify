import { createSlice } from "@reduxjs/toolkit";
import { signupThunk } from "./thunks";
import type { IAuth } from "./types";

const initialState: IAuth = {
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(signupThunk.fulfilled, () => {})
      .addCase(signupThunk.rejected, () => {});
  },
});

export default authSlice.reducer;
// export const {}  = authSlice.actions
