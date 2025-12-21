import "./SkillSelector.css";

const MOTION_MAP = {
  // Research
  "literature review": "stack",
  "paper reading": "underline",
  "data analysis": "bars",
  "statistical methods": "curve",
  "critical thinking": "branch",
  "experiment design": "flow",
  "scientific writing": "cursor",
  "domain knowledge": "halo",

  // Quiz
  "logical reasoning": "snap",
  "concept clarity": "focus",
  "quick thinking": "pulse",
  "communication": "ripple",
};

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
          const motionClass = active ? MOTION_MAP[skill] : "";

          return (
            <button
              key={skill}
              type="button"
              onClick={() => onToggle(skill)}
              className={`skill-pill ${motionClass || ""}`}
              style={{
                padding: "8px 14px",
                borderRadius: "999px",
                border: active
                  ? "1px solid #818cf8"
                  : "1px solid rgba(255,255,255,0.15)",
                background: active
                  ? "rgba(129,140,248,0.15)"
                  : "rgba(255,255,255,0.05)",
                color: active ? "#e0e7ff" : "#cbd5f5",
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.25s ease",
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
