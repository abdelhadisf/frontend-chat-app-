import { api } from "./axios";

// DTOs
export type ConversationSummary = {
  id: string;
  updatedAt: string;
  users: { id: string; firstname: string | null }[];
  messages: { id: string; content: string; sender: { id: string; firstname: string | null } }[];
};

export type ConversationFull = {
  id: string;
  updatedAt: string;
  users: { id: string; firstname: string | null }[];
  messages: { id: string; content: string; sender: { id: string; firstname: string | null } }[];
};

export async function getConversations() {
  const r = await api.get<ConversationSummary[]>("/chat");
  return r.data;
}

export async function getConversation(conversationId: string) {
  const r = await api.get<ConversationFull>(`/chat/${conversationId}`);
  return r.data;
}

export async function createConversation(recipientId: string) {
  const r = await api.post<{ error: boolean; conversationId?: string; message: string }>(
    "/chat",
    { recipientId }
  );
  return r.data;
}

export async function sendChat(conversationId: string, content: string) {
  const r = await api.post<{ error: boolean; message: string }>(`/chat/${conversationId}`, { content });
  return r.data;
}
