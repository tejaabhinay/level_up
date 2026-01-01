import { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api";

function NotificationBell({ socket }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;

    // 1. Fetch existing pending requests from database to populate bell on load
    const fetchInitialRequests = async () => {
      try {
        const res = await api.get(`/requests/incoming/${user._id}`);
        // Format backend data to match the notification structure
        const formatted = res.data.map(req => ({
          id: req._id,
          title: "Team Request",
          body: `${req.fromUser.name} wants to collaborate.`,
          url: `/request/${req.token}`
        }));
        setNotifications(formatted);
      } catch (err) {
        console.error("Error fetching initial notifications", err);
      }
    };
    fetchInitialRequests();

    // 2. Listen for real-time notifications via Socket.io
    if (socket) {
      socket.on("new_notification", (data) => {
        // Add new notification to the top of the list
        setNotifications((prev) => [data, ...prev]);
      });
    }

    return () => {
      if (socket) socket.off("new_notification");
    };
  }, [socket, user?._id]);

  const handleNotificationClick = (url) => {
    setShowDropdown(false);
    navigate(url);
  };

  return (
    <div style={{ position: "relative", zIndex: 1000 }}>
      <div 
        onClick={() => setShowDropdown(!showDropdown)} 
        style={{ cursor: "pointer", padding: "8px", position: "relative", display: "flex", alignItems: "center" }}
      >
        <FaBell size={22} color={notifications.length > 0 ? "#818cf8" : "#94a3b8"} />
        {notifications.length > 0 && (
          <span style={badgeStyle}>{notifications.length}</span>
        )}
      </div>

      {showDropdown && (
        <div style={dropdownStyle}>
          <div style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.1)", fontWeight: "bold", fontSize: "14px" }}>
            Notifications
          </div>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ ...itemStyle, cursor: "default", opacity: 0.6 }}>No new requests</div>
            ) : (
              notifications.map((notif, idx) => (
                <div 
                  key={idx} 
                  style={itemStyle} 
                  onClick={() => handleNotificationClick(notif.url)}
                  onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#fff" }}>{notif.title}</div>
                  <div style={{ fontSize: "12px", opacity: 0.8, marginTop: "2px" }}>{notif.body}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const badgeStyle = {
  position: "absolute",
  top: "4px",
  right: "4px",
  background: "#ef4444",
  color: "#fff",
  borderRadius: "50%",
  width: "16px",
  height: "16px",
  fontSize: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  border: "2px solid #0b0d0f"
};

const dropdownStyle = {
  position: "absolute",
  top: "100%",
  right: 0,
  width: "260px",
  background: "#1e293b",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  marginTop: "12px",
  color: "#e2e8f0",
  textAlign: "left"
};

const itemStyle = {
  padding: "12px",
  cursor: "pointer",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  transition: "background 0.2s"
};

export default NotificationBell;