
import { useState } from "react";
import SkillSelector from "../components/SkillSelector";
import AvailabilitySelect from "../components/AvailabilitySelect.jsx";
import TextInput from "../components/TextInput.jsx";
import InteractiveBackground from "../components/InteractiveBackground";
import ComplimentPopup from "../components/ComplimentPopup";
import SkillCinematic from "../components/SkillCinematic";



const SKILLS = [
  "frontend",
  "backend",
  "database",
  "management",
  "presentation",
  "design",
  "ml"
];

function Register() {
const [cinematic, setCinematic] = useState(null);
const [showCompliment, setShowCompliment] = useState(false);
const [complimentText, setComplimentText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState([]);
  const [lookingFor, setLookingFor] = useState("");
  const [availability, setAvailability] = useState("hackathon");

const toggleSkill = (skill) => {
  setSkills((prev) => {
    const updated = prev.includes(skill)
      ? prev.filter((s) => s !== skill)
      : [...prev, skill];

if (!prev.includes(skill)) {
  if (skill === "ml") setCinematic("ml");
  if (skill === "database") setCinematic("database");
  if (skill === "backend") setCinematic("backend");
  if (skill === "management") setCinematic("management");
  if (skill === "frontend") setCinematic("frontend");

if (skill === "design") setCinematic("design");
if (skill === "presentation") setCinematic("presentation");

  setTimeout(() => setCinematic(null), 1200);
}




    return updated;
  });
};

const compliments = [
  "Great to have you here,",
  "Nice name!",
  "You're going to build something awesome,",
  "That’s a strong name!",
  "Welcome aboard,"
];

const triggerCompliment = (enteredName) => {
  if (!enteredName.trim()) return;

  const random =
    compliments[Math.floor(Math.random() * compliments.length)];

  setComplimentText(`${random} ${enteredName} 🚀`);
  setShowCompliment(true);

  setTimeout(() => {
    setShowCompliment(false);
  }, 2500);
};

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name,
      email,
      skills,
      lookingFor,
      availability
    });
  };

return (
  <>
    <ComplimentPopup
      message={complimentText}
      visible={showCompliment}
    />
<SkillCinematic effect={cinematic} trigger={cinematic !== null} />

    <InteractiveBackground />

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: `
          radial-gradient(circle at 20% 20%, rgba(99,102,241,0.15), transparent 40%),
          radial-gradient(circle at 80% 80%, rgba(168,85,247,0.15), transparent 40%),
          linear-gradient(135deg, #020617, #020617)
        `,
        overflow: "hidden",
      }}
    >
<div
  style={{
  background: "rgba(15, 23, 42, 0.55)",
  backdropFilter: "blur(22px)",
  WebkitBackdropFilter: "blur(22px)",
  borderRadius: "24px",
  padding: "40px",
  width: "420px",
  color: "#e5e7eb",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: `
    0 0 40px rgba(99,102,241,0.25),
    inset 0 0 0 1px rgba(255,255,255,0.03)
  `,
  zIndex: 2,
}
}
>

      <h2
  style={{
    textAlign: "center",
    color: "#e0e7ff",
    letterSpacing: "2px",
    fontWeight: "600",
    marginBottom: "24px",
  }}
>
  LEVEL_UP
</h2>



        <form onSubmit={handleSubmit}>
 <TextInput
  label="Name"
  value={name}
  placeholder="Enter your name"
  onChange={setName}
  onBlur={() => {
    console.log("BLUR FIRED:", name);
    triggerCompliment(name);
  }}
/>



          <TextInput
            label="Email"
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={setEmail}
          />

          <SkillSelector
            skills={SKILLS}
            selectedSkills={skills}
            onToggle={toggleSkill}
          />

          <div style={{ marginTop: "10px" }}>
            <h4>Looking for</h4>
            <input
              placeholder="e.g. backend"
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <AvailabilitySelect
            value={availability}
            onChange={setAvailability}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "15px",
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  </>
);


}

export default Register;
