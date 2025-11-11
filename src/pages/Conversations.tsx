import { useEffect, useState } from "react";
import { getConversations, createConversation } from "../api/chat";
import type { ConversationSummary } from "../api/chat";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Conversations() {
  const [list, setList] = useState<ConversationSummary[]>([]);
  const [recipientId, setRecipientId] = useState("");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();
  const { user } = useAuth();

  // Utility to remove duplicate conversations (same ID)
  function uniqueById(arr: ConversationSummary[]) {
    const seen = new Set<string>();
    return arr.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }

  async function load() {
    try {
      const data = await getConversations();
      setList(uniqueById(data)); // filter duplicates here
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Failed to load conversations");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStart() {
    setMsg("");
    if (!recipientId.trim()) return setMsg("Enter recipientId");
    try {
      const r = await createConversation(recipientId.trim());
      if (r.error) return setMsg(r.message);
      if (r.conversationId) nav(`/chat/${r.conversationId}`);
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? "Error creating conversation");
    }
  }

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Conversations</h1>
        <div className="flex items-center gap-2">
          <input
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            placeholder="Recipient userId"
            className="px-3 py-2 rounded-lg bg-gray-800/70 border border-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleStart}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Start
          </button>
        </div>
      </div>

      {msg && <p className="text-sm text-blue-300 mb-3">{msg}</p>}

      {/* List */}
      {list.length === 0 ? (
        <p className="text-gray-400 text-sm">No conversations found.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((c) => {
            const other = c.users.find((u) => u.id !== user?.id);
            const last = c.messages?.[0];

            return (
              <li
                key={c.id}
                onClick={() => nav(`/chat/${c.id}`)}
                className="cursor-pointer bg-white/10 backdrop-blur border border-white/10 rounded-xl p-4 hover:bg-white/15 transition"
              >
                <div className="flex items-center justify-between">
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
                      {(other?.firstname?.[0] ?? "?").toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium capitalize">
                        {other?.firstname ?? "Unknown"}
                      </div>
                      <div className="text-xs text-gray-300 truncate max-w-xs">
                        {last
                          ? `${last.sender.firstname ?? "You"}: ${last.content}`
                          : "No messages yet"}
                      </div>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="text-xs text-gray-400 ml-2 shrink-0">
                    {c.updatedAt
                      ? new Date(c.updatedAt).toLocaleString()
                      : ""}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
