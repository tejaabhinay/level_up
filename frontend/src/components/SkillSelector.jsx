function SkillSelector({ skills, selectedSkills, onToggle }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h4
        style={{
          fontSize: "13px",
          color: "#c7d2fe",
          marginBottom: "10px",
        }}
      >
        Your skills
      </h4>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {skills.map((skill) => {
          const active = selectedSkills.includes(skill);

          return (
            <button
              key={skill}
              type="button"
              onClick={() => onToggle(skill)}
              style={{
                padding: "8px 14px",
                borderRadius: "999px",
                border: active
                  ? "1px solid #818cf8"
                  : "1px solid rgba(255,255,255,0.15)",
                background: active
                  ? "rgba(129,140,248,0.2)"
                  : "rgba(255,255,255,0.05)",
                color: active ? "#e0e7ff" : "#cbd5f5",
                cursor: "pointer",
                fontSize: "13px",
                transition: "all 0.2s ease",
              }}
            >
              {skill}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SkillSelector;
