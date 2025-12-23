import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email });

      // save auth
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/matches");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Try again."
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #020617, #000)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#e5e7eb",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "rgba(15, 23, 42, 0.7)",
          padding: "30px",
          borderRadius: "16px",
          width: "320px",
          backdropFilter: "blur(16px)",
          boxShadow: "0 0 30px rgba(99,102,241,0.2)",
        }}
      >
        <h2 style={{ marginBottom: "12px", color: "#e0e7ff" }}>
          Welcome back
        </h2>

        <p style={{ fontSize: "14px", opacity: 0.75, marginBottom: "20px" }}>
          Enter your registered email
        </p>

        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            marginBottom: "14px",
          }}
        />

        {error && (
          <p style={{ color: "#f87171", fontSize: "13px" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
