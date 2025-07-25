export interface IMessage {
  content: string;
  senderId: string;
  senderName: string;
  createdAt: Date;
  conversationId: string;
}

export interface IMessageStore {
  messages: IMessage[];
  length: number;
  addMessage: (message: IMessage) => void;
  clearStore: () => void;
}

export class MessageStore implements IMessageStore {
  // Properties must be public to implement IMessageStore, but you can expose them via getters
  private static instance: MessageStore | null = null;

  private _messages: IMessage[] = [];
  private _length: number = 0;

  private constructor() {}

  // Singleton accessor
  static getInstance(): MessageStore {
    if (!MessageStore.instance) {
      MessageStore.instance = new MessageStore();
    }
    return MessageStore.instance;
  }

  // Provide access via getters for singleton usage
  get messages() {
    return this._messages;
  }

  get length() {
    return this._length;
  }

  addMessage(message: IMessage) {
    this._messages.push(message);
    this._length = this._messages.length;
  }

  clearStore() {
    this._messages = [];
    this._length = 0;
  }
}
