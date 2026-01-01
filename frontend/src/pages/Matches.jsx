import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin, FaCode, FaFire, FaTerminal, FaCommentDots } from "react-icons/fa";
import { MdCheckCircle, MdChevronRight } from "react-icons/md";
import api from "../api";
import NotificationBell from "../components/NotificationBell";

const getAvailabilityGreeting = (availability) => {
  switch (availability) {
    case "hackathon":
      return "Hi fellow hackathon participants 👋";
    case "research":
      return "Hi fellow researchers 🔬";
    case "project":
      return "Hi project builders 🛠️";
    case "quiz":
      return "Hi quiz enthusiasts 🧠";
    default:
      return "Hi collaborators 👋";
  }
};

function Matches({ socket }) {
  const [sentRequests, setSentRequests] = useState([]);
  const [matches, setMatches] = useState([]);
  const [conversationsByUser, setConversationsByUser] = useState({});
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get(`/match/${user._id}`);
        setMatches(res.data);
      } catch (err) {
        console.error("Error fetching matches", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchMatches();
  }, [user]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?._id) return;
      try {
        const res = await api.get(`/chat/conversations/${user._id}`);
        const map = {};
        res.data.forEach((conv) => {
          const other = conv.participants.find((p) => p._id !== user._id);
          if (other) map[other._id] = conv._id;
        });
        setConversationsByUser(map);
      } catch (err) {
        console.error("Error fetching conversations", err);
      }
    };

    fetchConversations();
  }, [user]);

  if (!user) {
    return (
      <div style={{ ...containerStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "12px" }}>You need to log in 🔐</h2>
        <p style={{ opacity: 0.8, marginBottom: "20px" }}>Already registered? Continue to your matches.</p>
        <button
          onClick={() => window.location.href = "/login"}
          style={{ padding: "12px 24px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={topGradient} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={headerCard}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={profilePill}>{(user?.name || "U").split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc" }}>{user?.name || "You"}</div>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>{user?.availability || "Looking for collaborators"}</div>
            </div>
          </div>

          {/* IN-APP NOTIFICATION BELL AND LOGOUT */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <NotificationBell socket={socket} />
            <button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              style={logoutButtonStyle}
            >
              Logout
            </button>
          </div>
        </div>

        <header style={{ marginBottom: "50px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={statusBadge}>
              <span style={pulseDot}></span> IDEA · CODE · PARTICIPATE
            </div>
            <h1 style={titleStyle}>{getAvailabilityGreeting(user?.availability)}</h1>
            <p style={subtitleStyle}>Matches curated for your {user?.availability || "collaboration"} goals.</p>
          </motion.div>
        </header>

        {loading ? (
          <div style={{ color: "#9ca3af", fontWeight: "600" }}>Fetching data...</div>
        ) : (
          <div style={gridStyle}>
            <AnimatePresence>
              {matches.map((m, i) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ borderColor: "rgba(148,163,184,0.18)" }}
                  style={cardStyle}
                >
                  <div style={cardHeaderAlt}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={avatarCircle}>{m.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
                      <div>
                        <h3 style={nameStyle}>{m.name}</h3>
                        <div style={matchScore}><FaFire /> {85 + Math.floor(Math.random() * 14)}% Compatibility</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{m.portfolio?.github ? "Open to collaboration" : "Available"}</div>
                  </div>

                  <div style={skillBox}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px", color: "#64748b", fontSize: "11px", fontWeight: "700", letterSpacing: "1px" }}>
                      <FaTerminal /> CORE STACK
                    </div>
                    <div style={skillContainerStyle}>
                      {m.skills.map((skill, idx) => (
                        <span key={idx} style={pillStyle}>{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div style={footerStyle}>
                    <div style={socialGroupStyle}>
                      {m.portfolio?.github && <SocialIcon icon={<FaGithub />} url={m.portfolio.github} />}
                      {m.portfolio?.linkedin && <SocialIcon icon={<FaLinkedin />} url={m.portfolio.linkedin} color="#0a66c2" />}
                      {m.portfolio?.codingProfile && <SocialIcon icon={<FaCode />} url={m.portfolio.codingProfile} color="#10b981" />}
                    </div>

                    {conversationsByUser[m._id] ? (
                      <a href={`/chat/${conversationsByUser[m._id]}`} style={{ textDecoration: "none" }}>
                        <button style={chatButton}><FaCommentDots style={{ marginRight: 8 }} />Chat</button>
                      </a>
                    ) : (
                      <button
                        disabled={sentRequests.includes(m._id)}
                        onClick={async () => {
                          await api.post("/requests", { fromUser: user._id, toUser: m._id });
                          setSentRequests([...sentRequests, m._id]);
                        }}
                        style={sentRequests.includes(m._id) ? sentButtonStyle : actionButtonStyle}
                      >
                        {sentRequests.includes(m._id) ? <MdCheckCircle /> : <><span style={{marginRight: '4px'}}>Connect</span> <MdChevronRight /></>}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

/** MODERN UI STYLES **/
const containerStyle = { minHeight: "100vh", padding: "80px 40px", backgroundColor: "#0b0d0f", backgroundImage: "radial-gradient(at 0% 0%, rgba(255,255,255,0.02) 0, transparent 30%)", color: "#eef2f6", fontFamily: "'Inter', system-ui, sans-serif" };
const topGradient = { position: "fixed", left: 0, right: 0, height: 200, background: "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))", filter: "blur(40px)", pointerEvents: "none", zIndex: 0 };
const headerCard = { display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0.01))", padding: "14px 20px", borderRadius: 14, marginBottom: 22, border: "1px solid rgba(255,255,255,0.04)" };
const profilePill = { width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#157a43,#34d399)", color: "#061117", fontWeight: 800 };
const avatarCircle = { width: 50, height: 50, borderRadius: 12, background: "#1f2933", color: "#e6edf3", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 };
const cardHeaderAlt = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 };
const chatButton = { padding: "8px 14px", background: "linear-gradient(90deg,#86efac,#34d399)", color: "#042014", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center" };
const statusBadge = { display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(34,197,94,0.06)", padding: "6px 12px", borderRadius: "20px", fontSize: "10px", fontWeight: "800", letterSpacing: "1px", color: "#065f46", border: "1px solid rgba(34,197,94,0.12)", marginBottom: "16px" };
const pulseDot = { height: "6px", width: "6px", backgroundColor: "#10b981", borderRadius: "50%", boxShadow: "0 0 8px rgba(16,185,129,0.9)" };
const titleStyle = { fontSize: "2.8rem", fontWeight: "800", marginBottom: "12px", letterSpacing: "-1px" };
const subtitleStyle = { color: "#9ae6b4", fontSize: "1.1rem", maxWidth: "500px" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" };
const cardStyle = { background: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "border-color 0.3s ease" };
const nameStyle = { fontSize: "1.25rem", fontWeight: "700", color: "#fff" };
const matchScore = { fontSize: "12px", color: "#86efac", fontWeight: "600", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" };
const skillBox = { background: "rgba(34,197,94,0.02)", padding: "16px", borderRadius: "12px", marginBottom: "24px" };
const skillContainerStyle = { display: "flex", flexWrap: "wrap", gap: "6px" };
const pillStyle = { background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.06)", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "600", color: "#cbd5e1" };
const footerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const actionButtonStyle = { padding: "8px 18px", background: "#e6edf3", color: "#0b1220", border: "none", borderRadius: "10px", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", transition: "0.12s" };
const sentButtonStyle = { padding: "8px 18px", background: "rgba(34,197,94,0.08)", color: "#065f46", border: "1px solid rgba(34,197,94,0.12)", borderRadius: "10px", fontSize: "16px", cursor: "default" };
const socialGroupStyle = { display: "flex", gap: "12px" };
const logoutButtonStyle = { background: "rgba(255,255,255,0.06)", color: "#e5e7eb", border: "1px solid rgba(255,255,255,0.1)", padding: "8px 16px", borderRadius: "10px", fontSize: "13px", fontWeight: "600", cursor: "pointer" };

const SocialIcon = ({ icon, url, color = "#475569" }) => (
  <a href={url} target="_blank" rel="noreferrer" style={{ color, fontSize: "1.1rem" }}>
    {icon}
  </a>
);

export default Matches;