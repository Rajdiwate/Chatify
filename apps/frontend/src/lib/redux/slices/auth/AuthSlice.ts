import { createSlice } from "@reduxjs/toolkit";
import {
  getCurrentUserThunk,
  getPendingInvitesThunk,
  getPendingRequestsThunk,
  signinThunk,
  signupThunk,
} from "./thunks";
import type { IAuth } from "./types";

const initialState: IAuth = {
  loading: false,
  pendingRequests: [],
  pendingInvites: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reducePendingReq: (state) => {
      if (state.user && state.user.pendingRequestsNumber > 0) {
        state.user.pendingRequestsNumber -= 1;
      }
    },
    increasePendingReq: (state) => {
      if (state.user) {
        state.user.pendingRequestsNumber += 1;
      }
    },
    addToPendingRequests: (state, action) => {
      state.pendingRequests?.push(action.payload);
    },
    onRequestAccept: (state, action) => {
      const initialLength = state.pendingRequests?.length || 0;
      state.pendingRequests =
        state.pendingRequests?.filter((req) => req.id !== action.payload) || [];

      // Keep counter in sync
      const removedCount = initialLength - state.pendingRequests.length;
      if (removedCount > 0 && state.user?.pendingRequestsNumber) {
        state.user.pendingRequestsNumber = Math.max(
          0,
          state.user.pendingRequestsNumber - removedCount
        );
      }
    },
    resetAuth: () => {
      return initialState;
    },
  },
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
          state.pendingRequests = action.payload;
        }
      })
      .addCase(getPendingRequestsThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
    
    builder
      .addCase(getPendingInvitesThunk.pending, (state) => {
        state.error = "";
      })
      .addCase(getPendingInvitesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        if (state.user) {
          state.pendingInvites = action.payload;
        }
      })
      .addCase(getPendingInvitesThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
  },
});

export default authSlice.reducer;
export const {
  reducePendingReq,
  onRequestAccept,
  resetAuth,
  increasePendingReq,
  addToPendingRequests,
} = authSlice.actions;
