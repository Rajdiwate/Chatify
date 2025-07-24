
export type TChatState = {
  loading: boolean;
  error?: string;
  id?: string; // conversation Id set it when user clicks on the chat and fetch the messages using it
  messages?: TChatMessage[];
  members?: member[];
};

export type TgetMessagesResponse = {
  success : true , 
  messages : TChatMessage[],
  members : member[]
}

export type member = {
  id: string;
  conversationId: string;
  userId: string;
};
export type TChatMessage = {
  createdAt: Date;
  updatedAt: Date;
  senderId: string;
  senderName : string,
  conversationId: string;
  content: string;
};
