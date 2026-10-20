
import { Suspense } from "react";
import ChatPage from "@/components/messages/ChatPage";

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          Завантаження чату...
        </div>
      }
    >
      <ChatPage />
    </Suspense>
  );
}
