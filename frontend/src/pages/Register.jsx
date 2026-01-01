
import { useState, useEffect } from "react";
import SkillSelector from "../components/SkillSelector";
import AvailabilitySelect from "../components/AvailabilitySelect.jsx";
import TextInput from "../components/TextInput.jsx";
import InteractiveBackground from "../components/InteractiveBackground";
import ComplimentPopup from "../components/ComplimentPopup";
import SkillCinematic from "../components/SkillCinematic";
import DnaBackground from "../components/DnaBackground";
import api from "../api";
import { useNavigate } from "react-router-dom";



const SKILLS_BY_AVAILABILITY = {
  hackathon: [
    "frontend",
    "backend",
    "database",
    "ml",
    "design",
    "management",
    "presentation",
  ],
  project: [
    "frontend",
    "backend",
    "database",
    "ml",
    "design",
    "management",
  ],
  research: [
    "literature review",
    "paper reading",
    "data analysis",
    "statistical methods",
    "critical thinking",
    "experiment design",
    "scientific writing",
    "domain knowledge",
  ],
  quiz: [
    "logical reasoning",
    "concept clarity",
    "quick thinking",
    "communication",
  ],
};

function Register() {
const navigate = useNavigate();
const [cinematic, setCinematic] = useState(null);
const [showCompliment, setShowCompliment] = useState(false);
const [complimentText, setComplimentText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState([]);
  const [lookingFor, setLookingFor] = useState("");
 const [availability, setAvailability] = useState("");

const [github, setGithub] = useState("");
const [linkedin, setLinkedin] = useState("");
const [codingProfile, setCodingProfile] = useState("");

  useEffect(() => {
  setSkills([]);        // clear previous skills
  setCinematic(null);  // stop any running effect
}, [availability]);

const toggleSkill = (skill) => {
  setSkills((prev) => {
    const updated = prev.includes(skill)
      ? prev.filter((s) => s !== skill)
      : [...prev, skill];

    // trigger cinematic only on first select
    if (!prev.includes(skill)) {
      setCinematic(skill);

      setTimeout(() => {
        setCinematic(null);
      }, 1200);
    }

    return updated;
  });
};


const compliments = [
  "Great to have you here,",
  "Good to see you,",
  "Welcome — let’s build something real,",
  "This feels like a strong start,",
  "You’re in the right place,",
  "Nice choice joining LEVEL_UP,",
  "Looks like you’re ready to collaborate,",
  "Let’s find the right team for you,",
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

const handleSubmit = async (e) => {
  e.preventDefault();
if (!github || !linkedin) {
  alert("GitHub and LinkedIn profiles are required");
  return;
}

  try {
   const res = await api.post("/users/register", {
  name,
  email,
  availability, // ✅ ADD THIS LINE
  skills,
  lookingFor: lookingFor.split(",").map((s) => s.trim().toLowerCase()),
  portfolio: {
    github,
    linkedin,
    codingProfile: codingProfile || undefined,
  },
});


    // Save logged-in user (temporary auth)
    localStorage.setItem("user", JSON.stringify(res.data));

    // Redirect to matches page
  navigate("/intro");

  } catch (err) {
    alert(err.response?.data?.message || "Registration failed");
  }
};

const availableSkills =
  SKILLS_BY_AVAILABILITY[availability] || [];

return (
  
  <>
    <ComplimentPopup
      message={complimentText}
      visible={showCompliment}
    />
<SkillCinematic effect={cinematic} trigger={cinematic !== null} />

    <InteractiveBackground />
 <DnaBackground />

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
     background: `
  radial-gradient(circle at 30% 20%, rgba(88, 101, 242, 0.18), transparent 40%),
  radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.18), transparent 45%),
  radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.12), transparent 50%),
  linear-gradient(180deg, #020617 0%, #000000 100%)
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
<TextInput
  label="GitHub Profile *"
  value={github}
  placeholder="https://github.com/username"
  onChange={setGithub}
/>

<TextInput
  label="LinkedIn Profile *"
  value={linkedin}
  placeholder="https://linkedin.com/in/username"
  onChange={setLinkedin}
/>

<TextInput
  label="Coding Profile (optional)"
  value={codingProfile}
  placeholder="LeetCode / CodeChef / CodingNinjas link"
  onChange={setCodingProfile}
/>
<AvailabilitySelect
  value={availability}
  onChange={setAvailability}
/>

{availability && (
  <>
    <h4 style={{ marginTop: "16px" }}>Your skills</h4>

    <SkillSelector
      skills={availableSkills}
      selectedSkills={skills}
      onToggle={toggleSkill}
    />
  </>
)}



          <div style={{ marginTop: "10px" }}>
            <h4 style={{ color: "#c7d2fe", marginBottom: "8px" }}>Looking for</h4>
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
              <span style={{ marginRight: "8px", color: "#818cf8", fontSize: "1.2em" }}>
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.5 2.75a5.75 5.75 0 1 1 0 11.5 5.75 5.75 0 0 1 0-11.5Zm0 1.5a4.25 4.25 0 1 0 0 8.5 4.25 4.25 0 0 0 0-8.5Zm7.03 11.22a.75.75 0 0 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l2.25-2.25Z" fill="currentColor"/></svg>
              </span>
              <input
                placeholder="e.g. backend"
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
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
                  transition: "background 0.2s, color 0.2s",
                }}
              />
            </div>
          </div>

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
        <p
  style={{
    marginTop: "20px",
    fontSize: "14px",
    opacity: 0.85,
    textAlign: "center",
  }}
>
  Already registered?{" "}
  <span
    onClick={() => navigate("/login")}
    style={{
      color: "#6366f1",
      cursor: "pointer",
      fontWeight: 500,
    }}
  >
    Login here
  </span>
</p>

      </div>
    </div>
  </>
);


}

export default Register;
