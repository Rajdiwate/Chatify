import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TCreateGroup } from "../../components/ui/create-group-modal";

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

export type TInvite =  {
    id: string;
    createdAt: Date;
    senderId: string;
    receiverId: string;
    conversationId: string;
}


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

    sendGroupInvite: builder.mutation<
      { success: boolean , invites: TInvite[]},
      { conversationId: string; receiverIds: string[] }
    >({
      query: (data: { conversationId: string; receiverIds: string[] }) => ({
        url: "/group/invite",
        method: "POST",
        body: data,
        headers: { "Content-type": "application/json" },
        credentials: "include",
      }),
    }),
    acceptGroupInvite: builder.mutation<
      { success: boolean },
      { inviteId: string; conversationId: string }
    >({
      query: (data: { inviteId: string; conversationId: string }) => ({
        url: "/group/invite/accept",
        method: "POST",
        body: data,
        headers: { "Content-type": "application/json" },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useSendGroupInviteMutation,
  useAcceptGroupInviteMutation,
} = groupApi;
