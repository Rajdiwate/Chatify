import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUserThunk, getPendingRequestsThunk, signinThunk, signupThunk } from "./thunks";
import type { IAuth } from "./types";

const initialState: IAuth = {
  loading: false,
  pendingRequests: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signinThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(signinThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.user = action.payload;
      })
      .addCase(signinThunk.rejected, (state, action) => {
        state.loading = false;
        console.log("rejected", action);
        state.error = action.payload;
      });

    builder
      .addCase(signupThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.user = action.payload;
      })
      .addCase(signupThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getCurrentUserThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.user = action.payload;
      })
      .addCase(getCurrentUserThunk.rejected, (state) => {
        state.loading = false;
        state.error = "";
      });
    
    builder
      .addCase(getPendingRequestsThunk.pending, (state) => {  
        state.error = "";
      })
      .addCase(getPendingRequestsThunk.fulfilled, (state, action) => {  
        state.loading = false;
        state.error = "";
        if (state.user) {
          state.pendingRequests =action.payload;
        }
      })
      .addCase(getPendingRequestsThunk.rejected, (state, action) => {
        state.error = action.payload;
      }
    )
  },
});

export default authSlice.reducer;
// export const {}  = authSlice.actions
