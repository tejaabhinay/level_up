import { useEffect, useState } from "react";
import api from "../api";

function Matches() {
  const [matches, setMatches] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get(`/match/${user._id}`);
        console.log("Matches response:", res.data);
        setMatches(res.data);
      } catch (err) {
        console.error("Error fetching matches", err);
      }
    };

    if (user?._id) {
      fetchMatches();
    }
  }, [user]);

  if (!user) {
    return <p>Please register first.</p>;
  }

  if (matches.length === 0) {
    return (
      <div>
        <h2>Your Matches</h2>
        <p>People who complement your skills</p>
        <p>No teammates found yet 🚀</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Your Matches</h2>
      <p>People who complement your skills</p>

      {matches.map((m) => (
        <div
          key={m._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <h3>{m.name}</h3>
          <p>Skills: {m.skills.join(", ")}</p>

          {m.portfolio?.github && (
            <a href={m.portfolio.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          {" "}
          {m.portfolio?.linkedin && (
            <a href={m.portfolio.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}

          <br /><br />
          <button
            onClick={async () => {
              await api.post("/requests", {
                fromUser: user._id,
                toUser: m._id,
              });
              alert("Team request sent!");
            }}
          >
            Team up
          </button>
        </div>
      ))}
    </div>
  );
}

export default Matches;
