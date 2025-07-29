import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TCreateGroup } from "../../components/ui/create-group-modal";
import type { TgetMessagesResponse } from "../redux/slices/chat/types";

export type TGroup = {
  id: string;
  groupName: string;
  members: {
    user: {
      username: string;
      id: string;
      email: string;
    };
  }[];
};

export type TGetGroupConversationsResponse = {
  success: true;
  conversations: TGroup[];
};

export const groupApi = createApi({
  reducerPath: "groupApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" }),
  tagTypes: ["Group"],
  endpoints: (builder) => ({
    createGroup: builder.mutation({
      query: (data: TCreateGroup) => ({
        url: "/group/create",
        method: "POST",
        body: data,
        headers: { "Content-type": "application/json" },
        credentials: "include",
      }),
      invalidatesTags: ["Group"],
    }),

    getGroupConversations: builder.query<TGetGroupConversationsResponse, void>({
      query: () => ({
        url: "/conversation",
        method: "POST",
        body: { type: "GROUP" },
        headers: { "Content-type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Group"],
    }),

    getGroupMessages: builder.query<TgetMessagesResponse, {conversationId: string}>({
      query: ({ conversationId }) => ({
        url: "/messages",
        method: "POST",
        body: { conversationId },
        headers: { "Content-type": "application/json" },
        credentials: "include",
      }),
      providesTags: ["Group"],
    }),
  }),
});

export const { useCreateGroupMutation, useGetGroupConversationsQuery , useLazyGetGroupMessagesQuery } =
  groupApi;
