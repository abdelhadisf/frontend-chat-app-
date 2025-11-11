import { useEffect } from "react";
import { getSocket } from "../socket";

export function useJoinRoom(conversationId: string, onMessagesUpdate?: (msgs: any) => void) {
  useEffect(() => {
    const s = getSocket();

    // join this conversation room
    s.emit("join-chat-room", conversationId);

    // listen to server push updates
    function handleUpdate(payload: any) {
      // server emits the full messages array
      onMessagesUpdate?.(payload);
    }

    s.on("send-chat-update", handleUpdate);

    return () => {
      s.off("send-chat-update", handleUpdate);
      // not leaving room explicitly; socket-io keeps it simple per mount
    };
  }, [conversationId, onMessagesUpdate]);
}
