function AvailabilitySelect({ value, onChange }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <h4 style={{ color: "#c7d2fe", marginBottom: "8px" }}>Availability</h4>
      <div
        style={{
          background: "rgba(255,255,255,0.10)",
          borderRadius: "12px",
          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.15)",
          backdropFilter: "blur(8px)",
          padding: "6px 14px",
          border: "1.5px solid rgba(255,255,255,0.18)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "none",
            background: "rgba(30,41,59,0.7)",
            color: "#e5e7eb",
            fontSize: "1rem",
            outline: "none",
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          <option value="">-- Select event --</option>
          <option value="hackathon">Hackathon</option>
          <option value="project">Project</option>
          <option value="research">Research</option>
          <option value="quiz">Quiz</option>
        </select>
      </div>
    </div>
  );
}

export default AvailabilitySelect;
