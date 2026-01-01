import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { useSocket } from "../context/SocketContext"; // Required for real-time sync
import { MdDone, MdDoneAll } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";

function Chat() {
  const { conversationId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const socket = useSocket(); // Retrieve the shared socket connection
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!conversationId || !socket) return;

    // 1. Join the unique room for this conversation
    socket.emit("joinConversation", conversationId);

    // 2. Initial fetch of conversation details and history
    const fetchChatData = async () => {
      try {
        const [convRes, msgRes] = await Promise.all([
          api.get(`/chat/conversation/${conversationId}`),
          api.get(`/chat/messages/${conversationId}`)
        ]);
        setConversation(convRes.data);
        setMessages(msgRes.data);
      } catch (err) {
        console.error("Failed to load chat data", err);
      }
    };
    fetchChatData();

    // 3. Setup real-time listeners
    socket.on("receiveMessage", (message) => {
      // Ensure the message belongs to the current conversation room
      if (message.conversation === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("messageSeen", ({ messageIds }) => {
      setMessages((prev) =>
        prev.map((m) => (messageIds.includes(m._id) ? { ...m, seen: true } : m))
      );
    });

    // Cleanup listeners when leaving the chat or changing conversations
    return () => {
      socket.off("receiveMessage");
      socket.off("messageSeen");
    };
  }, [conversationId, socket]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as seen when the window is active or opened
  useEffect(() => {
    if (!conversationId || !user?._id) return;
    const markSeen = async () => {
      try {
        await api.patch(`/chat/messages/${conversationId}/seen`, { userId: user._id });
      } catch (err) {
        console.error("Error marking seen", err);
      }
    };
    markSeen();
  }, [conversationId, messages.length, user?._id]);

  const send = async () => {
    if (!input.trim() || !socket) return;

    try {
      const res = await api.post(`/chat/messages`, {
        conversationId,
        senderId: user._id,
        content: input,
      });

      const newMessage = res.data;
      // Update local state for the sender immediately
      setMessages((prev) => [...prev, newMessage]);
      
      // Emit to socket so the recipient receives it in real-time
      socket.emit("sendMessage", { conversationId, message: newMessage });
      setInput("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const otherName = conversation?.participants?.find((p) => p._id !== user._id)?.name || "Chat";

  return (
    <div style={chatPage}>
      <div style={chatHeader}>
        <Link to="/matches" style={backLink}><FaArrowLeft /></Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={headerAvatar}>{otherName.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>
          <div>
            <div style={{ fontWeight: 800, color: "#fff" }}>{otherName}</div>
            <div style={{ fontSize: 12, color: "#34d399" }}>Online</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18, maxWidth: "820px", width: "100%" }}>
        <div style={messageContainer}>
          {messages.map((m) => {
            const isMine = m.sender._id === user._id || m.sender === user._id;
            const time = new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            return (
              <div key={m._id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", marginBottom: 12 }}>
                {!isMine && (
                  <div style={smallAvatar}>
                    {otherName.split(" ").map((n) => n[0]).slice(0, 1)}
                  </div>
                )}
                <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start" }}>
                  <div style={{ 
                    background: isMine ? "linear-gradient(90deg,#4f46e5,#6366f1)" : "#1e293b", 
                    padding: "10px 16px", 
                    borderRadius: isMine ? "16px 16px 2px 16px" : "16px 16px 16px 2px", 
                    color: "#fff", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
                  }}>
                    {m.content}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, fontSize: 10, color: "#94a3b8" }}>
                    {time}
                    {isMine && (
                      m.seen ? <MdDoneAll style={{ color: "#34d399" }} /> : <MdDone />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div style={composer}>
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Type a message..." 
            style={composerInput} 
            onKeyDown={(e) => { if (e.key === "Enter") send(); }} 
          />
          <button onClick={send} style={composerButton}>Send</button>
        </div>
      </div>
    </div>
  );
}

// STYLES
const chatPage = {
  padding: 20,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "100vh",
  background: "linear-gradient(180deg,#020617,#000)",
};

const chatHeader = {
  width: "100%",
  maxWidth: 820,
  display: "flex",
  alignItems: "center",
  gap: 16,
  padding: "12px 20px",
  borderRadius: "16px",
  background: "rgba(15, 23, 42, 0.8)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.05)",
};

const backLink = { color: "#94a3b8", fontSize: "20px", textDecoration: "none" };

const headerAvatar = {
  width: 44,
  height: 44,
  borderRadius: "12px",
  background: "linear-gradient(135deg,#4f46e5,#6366f1)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: "18px"
};

const messageContainer = {
  padding: "20px",
  borderRadius: "16px",
  background: "rgba(15, 23, 42, 0.4)",
  minHeight: "65vh",
  maxHeight: "65vh",
  overflowY: "auto",
  border: "1px solid rgba(255,255,255,0.03)"
};

const smallAvatar = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: "#334155",
  color: "#e2e8f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 8,
  fontSize: "12px",
  fontWeight: "bold"
};

const composer = {
  display: "flex",
  gap: 12,
  marginTop: 16,
  width: "100%",
  maxWidth: 820,
};

const composerInput = {
  flex: 1,
  padding: "14px 18px",
  borderRadius: "12px",
  background: "#0f172a",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.1)",
  outline: "none",
  fontSize: "15px"
};

const composerButton = {
  padding: "0 24px",
  borderRadius: "12px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontWeight: "700",
  transition: "0.2s"
};

export default Chat;