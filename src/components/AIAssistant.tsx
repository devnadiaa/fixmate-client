"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  RotateCcw,
  MessageCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function AIAssistant() {
  const { data: session, isPending } = authClient.useSession();

  const userRole = (
    session?.user as { role?: string } | undefined
  )?.role;

  const allowedRoles = ["customer", "technician", "admin"];

  const isAuthorized = allowedRoles.includes(userRole || "");

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  if (isPending || isAuthorized === false) {
    return null;
  }

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = input.trim();

    if (trimmedMessage.length === 0 || isLoading) {
      return;
    }

    if (trimmedMessage.length > 2000) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: trimmedMessage,
    };

    const updatedMessages = [...messages, userMessage].slice(-12);

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const tokenResponse = await fetch(
        `${backendURL}/api/auth/token`,
        {
          credentials: "include",
        }
      );

      const tokenData = await tokenResponse.json();

      if (tokenResponse.ok === false || tokenData.token === undefined) {
        throw new Error("Please sign in again to use AI Assistant.");
      }

      const response = await fetch(
        `${backendURL}/api/ai-assistant/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            messages: updatedMessages,
          }),
        }
      );

      const data = await response.json();

      if (response.ok === false) {
        throw new Error(
          data.message || "AI Assistant is temporarily unavailable."
        );
      }

      if (typeof data.reply !== "string") {
        throw new Error("AI Assistant could not generate a response.");
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100]">
      {isOpen && (
        <div className="mb-4 flex h-[520px] w-[calc(100vw-40px)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between bg-gradient-to-r from-violet-700 to-indigo-600 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Bot size={23} />
              </div>

              <div>
                <h3 className="font-semibold">FixMate AI Assistant</h3>
                <p className="text-xs text-violet-100">
                  Your smart repair assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearChat}
                aria-label="Clear chat"
                title="Clear chat"
                className="rounded-lg p-2 transition hover:bg-white/20"
              >
                <RotateCcw size={17} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="rounded-lg p-2 transition hover:bg-white/20"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-950">
            {messages.length === 0 && (
              <div className="flex min-h-full flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                  <Sparkles size={30} />
                </div>

                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Hello! Welcome to FixMate
                </h4>

                <p className="mt-2 max-w-[260px] text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Ask me anything about repair services, bookings,
                  payments, or troubleshooting. I'm here to help!
                </p>

                <div className="mt-5 rounded-xl border border-violet-100 bg-white px-4 py-3 text-left text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                  <p className="font-medium text-violet-700 dark:text-violet-400">
                    Try asking:
                  </p>
                  <p className="mt-2">• What can I do on FixMate?</p>
                  <p className="mt-1">• How does booking work?</p>
                  <p className="mt-1">• Help me troubleshoot my device.</p>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-sm bg-violet-700 text-white"
                      : "rounded-bl-sm border border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-violet-600" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-violet-600 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-violet-600 [animation-delay:300ms]" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 border-t border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask me anything..."
              maxLength={2000}
              disabled={isLoading}
              className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-violet-950"
            />

            <button
              type="submit"
              disabled={input.trim().length === 0 || isLoading}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-700 text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-700 to-indigo-600 text-white shadow-lg transition duration-300 hover:scale-105 hover:shadow-xl"
        >
          {isOpen ? (
            <X size={25} />
          ) : (
            <MessageCircle size={26} />
          )}
        </button>
      </div>
    </div>
  );
}