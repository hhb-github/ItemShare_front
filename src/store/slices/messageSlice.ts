import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
  senderNickname?: string;
  receiverNickname?: string;
}

interface MessageState {
  messages: Message[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  currentConversation: Message[];
}

const initialState: MessageState = {
  messages: [],
  unreadCount: 0,
  loading: false,
  error: null,
  currentConversation: []
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
      state.loading = false;
      state.error = null;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    setCurrentConversation: (state, action: PayloadAction<Message[]>) => {
      state.currentConversation = action.payload;
    },
    markAsRead: (state, action: PayloadAction<number>) => {
      const message = state.messages.find(msg => msg.id === action.payload);
      if (message && !message.isRead) {
        message.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.messages.forEach(message => {
        message.isRead = true;
      });
      state.unreadCount = 0;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setLoading,
  setMessages,
  addMessage,
  setCurrentConversation,
  markAsRead,
  markAllAsRead,
  setUnreadCount,
  setError,
  clearError
} = messageSlice.actions;

export default messageSlice.reducer;