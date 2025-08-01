import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { TgetMessagesResponse } from "./types";
import { getMessagesRequest } from "../../../../api/conversation";

type getMessagesInput = {
  conversationId: string;
};

export const getMessagesThunk = createAsyncThunk<
  Pick<TgetMessagesResponse, "messages" | "members">,
  getMessagesInput,
  { rejectValue: string; state: RootState }
>("/getChat", async ({ conversationId}, { rejectWithValue, getState }) => {
  const data = await getMessagesRequest(conversationId );
  if (data.success) {
    // take the messages from the directConvo messages
    // merge the incomming messages with that of directConvo messages based on createdAt and return
    console.log("http messages", data.messages);
    const { conversation, chat } = getState();

    if (!chat.id || !conversation.directConversations.length)
      return rejectWithValue("No conversation");

    const directConvoMessages = conversation.directConversations.find(
      (c) => c.id === chat.id,
    );

    const mergedMessages = [
      ...(directConvoMessages?.messages ?? []),
      ...data.messages,
    ];
    const uniqueMessages = Array.from(
      new Map(mergedMessages.map((msg) => [msg.createdAt, msg])).values(),
    );
    return {
      members: data.members,
      messages: uniqueMessages.sort((a, b) => {
        return a.createdAt < b.createdAt ? -1 : 1;
      }),
    };
  } else return rejectWithValue("not implemented" + conversationId);
});
