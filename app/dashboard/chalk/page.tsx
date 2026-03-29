"use client";

import { FormEvent, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export default function DashboardChalkPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Ask me about trades on your campus boards and I will break down opportunities, risks, and sizing cautions.",
    },
  ]);
  const [input, setInput] = useState(
    "What are the best opportunities on my campus right now?",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      if (!viewportRef.current) return;
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt || loading) return;

    setError(null);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: prompt }]);
    setLoading(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/chalk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const data = (await res.json()) as { answer?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Request failed.");
        return;
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer ?? "No response." },
      ]);
      scrollToBottom();
    } catch (submitError) {
      const submitMessage =
        submitError instanceof Error ? submitError.message : "Network error.";
      setError(submitMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bb-grain mx-auto flex h-[calc(100vh-64px)] w-full max-w-4xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-bb-muted">
          Gemini assistant
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-bb-chalk">
          Chalk Chat
        </h1>
        <p className="mt-1 text-sm text-bb-dim">
          Campus boards only. Educational analysis, not financial advice.
        </p>
      </header>

      <section
        ref={viewportRef}
        className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-bb-border bg-bb-surface p-4"
      >
        {messages.map((message, index) => (
          <article
            key={`${message.role}-${index}`}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
              message.role === "user"
                ? "ml-auto bg-bb-raised text-bb-chalk"
                : "mr-auto border border-bb-border bg-bb-bg text-bb-dim"
            }`}
          >
            {message.role === "assistant" ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => (
                    <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">
                      {children}
                    </ol>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-bb-chalk">{children}</strong>
                  ),
                }}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              <p className="whitespace-pre-wrap">{message.text}</p>
            )}
          </article>
        ))}

        {loading ? (
          <article className="mr-auto max-w-[85%] rounded-2xl border border-bb-border bg-bb-bg px-4 py-3 text-sm text-bb-muted">
            Chalk is thinking...
          </article>
        ) : null}
      </section>

      {error ? (
        <p className="mt-3 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {error}
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="mt-3 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Chalk about specific campus trades..."
          rows={2}
          className="min-h-20 flex-1 resize-y rounded-xl border border-bb-border bg-bb-surface px-3 py-2 text-sm text-bb-chalk outline-none focus:ring-2 focus:ring-bb-chalk/40"
        />
        <button
          type="submit"
          disabled={loading || input.trim().length === 0}
          className="rounded-xl bg-bb-chalk px-4 py-2 text-sm font-bold text-bb-bg transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </main>
  );
}
