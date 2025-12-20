function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  onBlur,
}) {

  return (
    <div style={{ marginBottom: "13px", color: "#c7d2fe" }}>
      <label>
        <div>{label}</div>
        <input
  type={type}
  value={value}
  placeholder={placeholder}
  onChange={(e) => onChange(e.target.value)}
  onBlur={(e) => {
    console.log("INPUT BLUR");
    onBlur && onBlur(e);
  }}
style={{
  width: "100%",
  padding: "12px",
  marginTop: "6px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)",
  color: "#e5e7eb",
  outline: "none",
}}

/>


      </label>
    </div>
  );
}

export default TextInput;
