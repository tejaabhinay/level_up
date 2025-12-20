function AvailabilitySelect({ value, onChange }) {
  return (
    <div>
      <h4>Availability</h4>

      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="hackathon">Hackathon</option>
        <option value="project">Project</option>
        <option value="research">Research</option>
        <option value="quiz">Quiz</option>
      </select>
    </div>
  );
}

export default AvailabilitySelect;
