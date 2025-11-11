import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getConversation, sendChat} from "../api/chat";
import type {ConversationFull} from "../api/chat";
import { useJoinRoom } from "../hooks/useChatSocket";
import { useAuth } from "../context/AuthContext";

export default function ChatRoom() {
  const { conversationId = "" } = useParams();
  const { user } = useAuth();

  const [conv, setConv] = useState<ConversationFull | null>(null);
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function load() {
    try {
      const data = await getConversation(conversationId);
      setConv(data);
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Failed to load conversation");
    }
  }

  useEffect(() => { if (conversationId) load(); }, [conversationId]);

  // auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conv?.messages]);

  // join room + live updates
  useJoinRoom(conversationId, (messages) => {
    setConv((c) => (c ? { ...c, messages } : c));
  });

  const title = useMemo(() => {
    if (!conv) return "Chat";
    const other = conv.users.find((u) => u.id !== user?.id);
    return other?.firstname ?? "Chat";
  }, [conv, user]);

  async function onSend() {
    setMsg("");
    const content = input.trim();
    if (!content) return;
    try {
      await sendChat(conversationId, content);
      setInput(""); // server will push updated messages via socket
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Send failed");
    }
  }

  return (
    <div className="flex flex-col h-full text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
            {(title?.[0] ?? "?").toUpperCase()}
          </div>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {conv?.messages.map((m) => {
          const isMe = m.sender.id === user?.id;
          return (
            <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow
                 ${isMe ? "bg-blue-600 text-white rounded-br-sm" : "bg-white/10 border border-white/10 rounded-bl-sm"}`}
              >
                <div className="text-xs opacity-80 mb-1">{m.sender.firstname ?? "User"}</div>
                <div>{m.content}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {msg && <div className="text-sm text-red-400 mt-2">{msg}</div>}

      {/* Input */}
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSend(); }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-xl bg-gray-800/70 border border-gray-700 outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={onSend}
          className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
