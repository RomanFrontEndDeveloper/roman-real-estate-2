import { apiFetch } from "@/lib/apiFetch";

export type ChatUser = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "agency" | "agent" | "owner-client";
  avatar?: {
    url?: string;
  };
};

export type ChatMessage = {
  _id: string;
  sender: string | { _id: string; name?: string };
  recipient: string | { _id: string; name?: string };
  text: string;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};

async function readError(response: Response): Promise<string> {
  const data: { message?: string } = await response.json().catch(() => ({}));

  return data.message ?? "Сталася помилка під час запиту";
}

export async function getChatUsers(): Promise<ChatUser[]> {
  const response = await apiFetch("/api/messages/users");

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const data: { users: ChatUser[] } = await response.json();

  return data.users;
}

export async function getConversationMessages(
  userId: string,
): Promise<ChatMessage[]> {
  const response = await apiFetch(
    `/api/messages/conversations/${encodeURIComponent(userId)}`,
  );

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const data: { messages: ChatMessage[] } = await response.json();

  // Сервер повертає повідомлення від нових до старих.
  // Для відображення в чаті потрібен зворотний порядок.
  return data.messages.reverse();
}

export async function sendChatMessage(
  recipientId: string,
  text: string,
): Promise<ChatMessage> {
  const response = await apiFetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipientId,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const data: { message: ChatMessage } = await response.json();

  return data.message;
}

export type ChatConversation = {
  _id: string;
  sender: string | { _id: string; name?: string; avatar?: { url?: string } };
  recipient: string | { _id: string; name?: string; avatar?: { url?: string } };
  text: string;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getMyConversations(): Promise<ChatConversation[]> {
  const response = await apiFetch("/api/messages/conversations");

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const data: { conversations: ChatConversation[] } = await response.json();

  return data.conversations;
}
