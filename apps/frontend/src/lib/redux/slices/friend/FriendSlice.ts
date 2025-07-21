import { createSlice } from "@reduxjs/toolkit";
import type { TFriendState } from "./types";
import { acceptFriendRequestThunk, getFriendsThunk } from "./thunks";


const initialState: TFriendState = {
  loading: false,
  fetched: false,
};

export const friendSlice = createSlice({
  name: "Friend",
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sendRequest: (state, action) => {
      // no-op: just a signal for middleware
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFriendsThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getFriendsThunk.fulfilled, (state, action) => {
        state.friends = action.payload;
        state.loading = false;
        state.fetched = true;
      })
      .addCase(getFriendsThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });

    builder
      .addCase(acceptFriendRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(acceptFriendRequestThunk.fulfilled, (state, action) => {
        state.friends = action.payload;
        state.loading = false;
        state.fetched = true;
      })
      .addCase(acceptFriendRequestThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default friendSlice.reducer;
export const {sendRequest} = friendSlice.actions
