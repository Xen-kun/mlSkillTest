// src/components/FormSelect.jsx
function FormSelect({ label, name, value, options = [], onChange, disabled, error }) {
  return (
    <div>
      <label>{label}:</label>
      <select name={name} value={value} onChange={onChange} disabled={disabled}>
        <option value="">-- Select {label} --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default FormSelect;
