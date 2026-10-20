"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import { apiFetch } from "@/lib/apiFetch";
import {
  getChatUsers,
  getMyConversations,
  getConversationMessages,
  sendChatMessage,
  type ChatMessage,
  type ChatUser,
} from "./messageApi";

import BackButton from "../ui/BackButton";

type CurrentUserResponse = {
  user: {
    id: string;
    _id?: string;
    name: string;
    role: "admin" | "agency" | "agent" | "owner-client";
  };
};

type UserWithAvatar = ChatUser & {
  avatar?: string | { url?: string };
  avatarUrl?: string;
  image?: string;
  email?: string;
};

function getAvatarUrl(user: ChatUser): string {
  const userWithAvatar = user as UserWithAvatar;
  const avatar = userWithAvatar.avatar;

  if (typeof avatar === "string" && avatar) {
    return avatar;
  }

  if (typeof avatar === "object" && avatar?.url) {
    return avatar.url;
  }

  return (
    userWithAvatar.avatarUrl || userWithAvatar.image || "/default-avatar.png"
  );
}

export default function ChatPage() {
  const searchParams = useSearchParams();
  const userIdFromUrl = searchParams.get("userId");

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [availableUsers, setAvailableUsers] = useState<ChatUser[]>([]);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Отримуємо ID авторизованого користувача.
  useEffect(() => {
    let cancelled = false;

    async function loadCurrentUser() {
      try {
        const response = await apiFetch("/api/auth/me");

        if (!response.ok) {
          throw new Error("Не вдалося завантажити профіль");
        }

        const data: CurrentUserResponse = await response.json();
        const userId = data.user.id || data.user._id;

        if (!userId) {
          throw new Error("Не вдалося визначити ID користувача");
        }

        if (!cancelled) {
          setCurrentUserId(userId);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Не вдалося завантажити профіль",
          );
          setLoadingUsers(false);
        }
      }
    }

    void loadCurrentUser();

    return () => {
      cancelled = true;
    };
  }, []);

  // Завантажуємо користувачів і залишаємо лише наявні переписки.
  const loadUsers = useCallback(async () => {
    if (!currentUserId) return;

    try {
      setError("");

      const [conversations, allUsers] = await Promise.all([
        getMyConversations(),
        getChatUsers(),
      ]);

      const conversationUserIds = new Set<string>();

      for (const conversation of conversations) {
        const senderId =
          typeof conversation.sender === "string"
            ? conversation.sender
            : conversation.sender._id;

        const recipientId =
          typeof conversation.recipient === "string"
            ? conversation.recipient
            : conversation.recipient._id;

        const otherUserId: string =
          senderId === currentUserId ? recipientId : senderId;

        if (otherUserId !== currentUserId) {
          conversationUserIds.add(otherUserId);
        }
      }

      setUsers(allUsers.filter((user) => conversationUserIds.has(user._id)));

      // Усі користувачі потрібні для переходу з оголошення.
      setAvailableUsers(allUsers);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не вдалося завантажити переписки",
      );
    } finally {
      setLoadingUsers(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    const timer = setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => clearTimeout(timer);
  }, [currentUserId, loadUsers]);

  // Відкриваємо співрозмовника з URL ?userId=...
  useEffect(() => {
    if (!userIdFromUrl || availableUsers.length === 0) return;

    const user = availableUsers.find((item) => item._id === userIdFromUrl);

    if (!user) return;

    const timer = setTimeout(() => {
      setSelectedUser(user);
      setMessages([]);
      setError("");
    }, 0);

    return () => clearTimeout(timer);
  }, [userIdFromUrl, availableUsers]);

  // Завантажуємо повідомлення вибраного співрозмовника.
  useEffect(() => {
    if (!selectedUser) return;

    const selectedUserId = selectedUser._id;
    let cancelled = false;

    async function loadMessages() {
      try {
        setLoadingMessages(true);
        setError("");

        const result = await getConversationMessages(selectedUserId);

        if (!cancelled) {
          setMessages(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Не вдалося завантажити повідомлення",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingMessages(false);
        }
      }
    }

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, [selectedUser]);

  // Надсилаємо повідомлення.
  async function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedText = text.trim();

    if (!selectedUser || !normalizedText || sending) return;

    try {
      setSending(true);
      setError("");

      const message = await sendChatMessage(selectedUser._id, normalizedText);

      setMessages((current) => [...current, message]);
      setText("");

      // Додаємо співрозмовника після першого повідомлення.
      setUsers((current) =>
        current.some((user) => user._id === selectedUser._id)
          ? current
          : [selectedUser, ...current],
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Не вдалося надіслати повідомлення",
      );
    } finally {
      setSending(false);
    }
  }

  function handleSelectUser(user: ChatUser) {
    setSelectedUser(user);
    setMessages([]);
    setError("");
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mx-1 mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Повідомлення</h1>
        <BackButton />
      </div>

      <div className="grid min-h-[600px] overflow-hidden rounded-xl border border-gray-200 bg-white md:grid-cols-[280px_1fr]">
        {/* Ліва панель зі списком переписок */}
        <aside className="border-b border-gray-200 md:border-b-0 md:border-r">
          <div className="border-b border-gray-200 p-4">
            <h2 className="font-semibold">Переписки</h2>
          </div>

          {loadingUsers ? (
            <p className="p-4 text-sm text-gray-500">Завантаження...</p>
          ) : users.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">
              У вас поки немає переписок.
            </p>
          ) : (
            <ul className="max-h-[520px] overflow-y-auto">
              {users.map((user) => (
                <li key={user._id}>
                  <button
                    type="button"
                    onClick={() => handleSelectUser(user)}
                    aria-pressed={selectedUser?._id === user._id}
                    className={`flex w-full items-center gap-3 border-b border-gray-100 p-1 text-left transition hover:bg-gray-50 ${
                      selectedUser?._id === user._id ? "bg-blue-50" : ""
                    }`}
                  >
                    {/* Аватар співрозмовника */}
                    <Image
                      src={getAvatarUrl(user)}
                      alt={`Фото: ${user.name}`}
                      width={44}
                      height={44}
                      unoptimized
                      className="h-20 w-20 shrink-0 rounded-full border border-gray-200 object-cover"
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-gray-900">
                        {user.name}
                      </span>

                      <span className="mt-1 block text-xs text-gray-500">
                        {user.role}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Права панель чату */}
        <div className="flex min-w-0 flex-col">
          {selectedUser ? (
            <>
              {/* Заголовок чату з аватаром */}
              <div className="flex items-center gap-3 border-b border-gray-200 p-4">
                <Image
                  src={getAvatarUrl(selectedUser)}
                  alt={`Фото: ${selectedUser.name}`}
                  width={44}
                  height={44}
                  unoptimized
                  className="h-30 w-30 shrink-0 rounded-4xl border border-gray-200 object-cover"
                />

                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">
                    {selectedUser.name}
                  </p>

                  <p className="text-xs text-gray-500">{selectedUser.role}</p>
                </div>
              </div>

              {/* Повідомлення */}
              <div
                className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4"
                aria-live="polite"
              >
                {loadingMessages ? (
                  <p className="text-sm text-gray-500">
                    Завантаження повідомлень...
                  </p>
                ) : messages.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-500">
                    Це початок вашої розмови. Напишіть перше повідомлення!
                  </p>
                ) : (
                  messages.map((message) => {
                    const senderId =
                      typeof message.sender === "string"
                        ? message.sender
                        : message.sender._id;

                    const isOwnMessage = senderId === currentUserId;

                    return (
                      <div
                        key={message._id}
                        className={`flex ${
                          isOwnMessage ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            isOwnMessage
                              ? "bg-blue-600 text-white"
                              : "border border-gray-200 bg-white text-gray-900"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">
                            {message.text}
                          </p>

                          <time
                            className={`mt-1 block text-right text-xs ${
                              isOwnMessage ? "text-blue-100" : "text-gray-400"
                            }`}
                            dateTime={message.createdAt}
                          >
                            {new Date(message.createdAt).toLocaleTimeString(
                              "uk-UA",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </time>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Форма надсилання */}
              <form
                onSubmit={handleSend}
                className="flex gap-3 border-t border-gray-200 p-4"
              >
                <input
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  placeholder="Напишіть повідомлення..."
                  maxLength={5000}
                  aria-label="Текст повідомлення"
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="submit"
                  disabled={!text.trim() || sending}
                  className="shrink-0 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? "Надсилання..." : "Надіслати"}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-center text-gray-500">
              {userIdFromUrl && !loadingUsers
                ? "Автор не знайдений серед доступних користувачів."
                : "Оберіть переписку зліва або відкрийте автора з оголошення."}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
    </section>
  );
}
