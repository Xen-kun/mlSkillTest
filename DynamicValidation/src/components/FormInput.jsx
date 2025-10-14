// src/components/FormInput.jsx
function FormInput({ label, name, type = "text", value, onChange, error }) {
  return (
    <div>
      <label>{label}:</label>
      <input name={name} type={type} value={value} onChange={onChange} />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default FormInput;
