import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin, FaCode, FaFire, FaTerminal } from "react-icons/fa";
import { MdCheckCircle, MdChevronRight } from "react-icons/md";
import api from "../api";
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


function Matches() {
  const [sentRequests, setSentRequests] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
console.log("USER FROM LOCALSTORAGE:", user);

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

 if (!user) {
  return (
    <div
      style={{
        ...containerStyle,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: "12px" }}>
        You need to log in 🔐
      </h2>
      <p style={{ opacity: 0.8, marginBottom: "20px" }}>
        Already registered? Continue to your matches.
      </p>
      <button
        onClick={() => window.location.href = "/login"}
        style={{
          padding: "12px 24px",
          background: "#4f46e5",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        Go to Login
      </button>
    </div>
  );
}


  return (
    <div style={containerStyle}>
      {/* Background Glow */}
      <div style={glowEffectStyle} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
<header
  style={{
    marginBottom: "50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  }}
>
  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
    <div style={statusBadge}>
      <span style={pulseDot}></span> LIVE MATCHMAKING
    </div>

    <h1 style={titleStyle}>
      {getAvailabilityGreeting(user?.availability)}
    </h1>

    <p style={subtitleStyle}>
      Matches curated for your {user?.availability || "collaboration"} goals.
    </p>
  </motion.div>

  {/* 🔐 LOGOUT BUTTON */}
  <button
    onClick={() => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }}
    style={{
      background: "rgba(255,255,255,0.06)",
      color: "#e5e7eb",
      border: "1px solid rgba(255,255,255,0.1)",
      padding: "8px 16px",
      borderRadius: "10px",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
    }}
  >
    Logout
  </button>
</header>


        {loading ? (
          <div style={{ color: "#6366f1", fontWeight: "600" }}>Fetching data...</div>
        ) : (
          <div style={gridStyle}>
            <AnimatePresence>
              {matches.map((m, i) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ borderColor: "rgba(99, 102, 241, 0.5)" }}
                  style={cardStyle}
                >
                  <div style={cardHeader}>
                    <div>
                      <h3 style={nameStyle}>{m.name}</h3>
                      <div style={matchScore}>
                        <FaFire /> {85 + Math.floor(Math.random() * 14)}% Compatibility
                      </div>
                    </div>
                  </div>

                  {/* Skills Section - High Contrast */}
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

const containerStyle = {
  minHeight: "100vh",
  padding: "80px 40px",
  backgroundColor: "#020617",
  backgroundImage: "radial-gradient(at 0% 0%, rgba(30, 58, 138, 0.3) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(76, 29, 149, 0.2) 0, transparent 50%)",
  color: "#f8fafc",
  fontFamily: "'Inter', system-ui, sans-serif"
};

const statusBadge = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  background: "rgba(255,255,255,0.03)",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "10px",
  fontWeight: "800",
  letterSpacing: "1px",
  color: "#94a3b8",
  border: "1px solid rgba(255,255,255,0.05)",
  marginBottom: "16px"
};

const pulseDot = {
  height: "6px",
  width: "6px",
  backgroundColor: "#10b981",
  borderRadius: "50%",
  boxShadow: "0 0 8px #10b981"
};

const titleStyle = {
  fontSize: "2.8rem",
  fontWeight: "800",
  marginBottom: "12px",
  letterSpacing: "-1px"
};

const subtitleStyle = {
  color: "#64748b",
  fontSize: "1.1rem",
  maxWidth: "500px"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "24px"
};

const cardStyle = {
  background: "#0f172a",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  borderRadius: "20px",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "border-color 0.3s ease"
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "24px"
};

const nameStyle = { fontSize: "1.25rem", fontWeight: "700", color: "#fff" };

const matchScore = {
  fontSize: "12px",
  color: "#fbbf24",
  fontWeight: "600",
  marginTop: "4px",
  display: "flex",
  alignItems: "center",
  gap: "4px"
};

const skillBox = {
  background: "rgba(0,0,0,0.2)",
  padding: "16px",
  borderRadius: "12px",
  marginBottom: "24px"
};

const skillContainerStyle = { display: "flex", flexWrap: "wrap", gap: "6px" };

const pillStyle = {
  background: "rgba(99, 102, 241, 0.1)",
  border: "1px solid rgba(99, 102, 241, 0.2)",
  padding: "4px 10px",
  borderRadius: "6px",
  fontSize: "11px",
  fontWeight: "600",
  color: "#a5b4fc"
};

const footerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center" };

const actionButtonStyle = {
  padding: "8px 18px",
  background: "#fff",
  color: "#000",
  border: "none",
  borderRadius: "10px",
  fontWeight: "700",
  fontSize: "13px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  transition: "0.2s"
};

const sentButtonStyle = {
  padding: "8px 18px",
  background: "rgba(34, 197, 94, 0.1)",
  color: "#4ade80",
  border: "1px solid rgba(34, 197, 94, 0.2)",
  borderRadius: "10px",
  fontSize: "16px",
  cursor: "default"
};

const socialGroupStyle = { display: "flex", gap: "12px" };

const SocialIcon = ({ icon, url, color = "#475569" }) => (
  <a href={url} target="_blank" rel="noreferrer" style={{ color, fontSize: "1.1rem" }}>
    {icon}
  </a>
);

const glowEffectStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: "300px",
  background: "radial-gradient(circle at 50% -20%, rgba(99, 102, 241, 0.15), transparent 70%)",
  pointerEvents: "none"
};

export default Matches;