import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatterContact, ConversationMessage } from '../types';
import { INITIAL_CONTACTS } from '../data/initialData';

interface DialogueState {
  contacts: ChatterContact[];
  activeContactId: string | null;
  conversations: Record<string, ConversationMessage[]>; // contactId -> messages
  currentNodeId: Record<string, string | null>; // contactId -> current dialogue node
  isTyping: boolean;
  pendingChoices: boolean; // Whether we're waiting for player to make a choice
}

const initialState: DialogueState = {
  contacts: INITIAL_CONTACTS,
  activeContactId: null,
  conversations: {},
  currentNodeId: {},
  isTyping: false,
  pendingChoices: false,
};

const dialogueSlice = createSlice({
  name: 'dialogue',
  initialState,
  reducers: {
    // Set active contact in Chatter
    setActiveContact: (state, action: PayloadAction<string | null>) => {
      state.activeContactId = action.payload;
      // Mark as read when opening
      if (action.payload) {
        const contact = state.contacts.find((c) => c.id === action.payload);
        if (contact) {
          contact.hasUnreadMessages = false;
        }
      }
    },

    // Unlock a contact (make them visible in sidebar)
    unlockContact: (state, action: PayloadAction<string>) => {
      const contact = state.contacts.find((c) => c.id === action.payload);
      if (contact) {
        contact.isUnlocked = true;
      }
    },

    // Set unread status for a contact
    setContactUnread: (
      state,
      action: PayloadAction<{ contactId: string; hasUnread: boolean; lastMessage?: string }>
    ) => {
      const contact = state.contacts.find((c) => c.id === action.payload.contactId);
      if (contact) {
        contact.hasUnreadMessages = action.payload.hasUnread;
        if (action.payload.lastMessage) {
          contact.lastMessage = action.payload.lastMessage;
        }
      }
    },

    // Start a dialogue tree for a contact
    startDialogue: (
      state,
      action: PayloadAction<{ contactId: string; startNodeId: string }>
    ) => {
      state.currentNodeId[action.payload.contactId] = action.payload.startNodeId;
    },

    // Add a message to a conversation
    addMessage: (
      state,
      action: PayloadAction<{
        contactId: string;
        message: ConversationMessage;
      }>
    ) => {
      const { contactId, message } = action.payload;
      if (!state.conversations[contactId]) {
        state.conversations[contactId] = [];
      }
      state.conversations[contactId].push(message);

      // Update contact's last message preview
      const contact = state.contacts.find((c) => c.id === contactId);
      if (contact) {
        contact.lastMessage = message.text.substring(0, 50) + (message.text.length > 50 ? '...' : '');
      }
    },

    // Set typing indicator
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },

    // Set pending choices (waiting for player input)
    setPendingChoices: (state, action: PayloadAction<boolean>) => {
      state.pendingChoices = action.payload;
    },

    // Advance to next dialogue node
    advanceDialogue: (
      state,
      action: PayloadAction<{ contactId: string; nextNodeId: string | null }>
    ) => {
      state.currentNodeId[action.payload.contactId] = action.payload.nextNodeId;
      state.pendingChoices = false;
    },

    // Player selected a choice
    selectChoice: (
      state,
      action: PayloadAction<{
        contactId: string;
        choiceLabel: string;
        nextNodeId: string | null;
      }>
    ) => {
      const { contactId, choiceLabel, nextNodeId } = action.payload;

      // Add player's choice as a message
      if (!state.conversations[contactId]) {
        state.conversations[contactId] = [];
      }
      state.conversations[contactId].push({
        nodeId: 'player_choice',
        speaker: 'Player',
        text: choiceLabel,
        timestamp: Date.now(),
        isPlayerChoice: true,
      });

      // Advance to next node
      state.currentNodeId[contactId] = nextNodeId;
      state.pendingChoices = false;
    },

    // Clear conversation (for game reset)
    clearConversation: (state, action: PayloadAction<string>) => {
      delete state.conversations[action.payload];
      delete state.currentNodeId[action.payload];
    },

    // Reset all dialogue state (for game restart)
    resetDialogue: (state) => {
      state.contacts = INITIAL_CONTACTS;
      state.activeContactId = null;
      state.conversations = {};
      state.currentNodeId = {};
      state.isTyping = false;
      state.pendingChoices = false;
    },
  },
});

export const {
  setActiveContact,
  unlockContact,
  setContactUnread,
  startDialogue,
  addMessage,
  setTyping,
  setPendingChoices,
  advanceDialogue,
  selectChoice,
  clearConversation,
  resetDialogue,
} = dialogueSlice.actions;

export default dialogueSlice.reducer;
