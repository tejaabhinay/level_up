function ComplimentPopup({ message, visible }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: visible
          ? "translateX(-50%) scale(1)"
          : "translateX(-50%) scale(0.9)",
        opacity: visible ? 1 : 0,
        background:
          "linear-gradient(135deg, #22d3ee, #818cf8, #a855f7)",
        color: "#020617",
        padding: "14px 24px",
        borderRadius: "14px",
        fontWeight: "600",
        boxShadow: "0 0 30px rgba(168,85,247,0.8)",
        transition: "all 0.4s ease",
        zIndex: 999,
        pointerEvents: "none",
      }}
    >
      {message}
    </div>
  );
}

export default ComplimentPopup;
