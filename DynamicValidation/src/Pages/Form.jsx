// src/components/DynamicForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateForm } from "../utils/validateAlert";
import { validationRules } from "../utils/validationRules";
import regionsData from "../data/regionsData.json";
import FormInput from "../components/FormInput";
import AddressFields from "../components/AddressFields";

function DynamicForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    address: {
      street: "",
      zip: "",
      region: "",
      province: "",
      cityMunicipal: "",
      barangay: "",
    },
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.replace("address.", "");

      setFormData((prev) => {
        const updatedAddress = { ...prev.address, [field]: value };

        if (field === "region") {
          updatedAddress.province = "";
          updatedAddress.cityMunicipal = "";
          updatedAddress.barangay = "";
        } else if (field === "province") {
          updatedAddress.cityMunicipal = "";
          updatedAddress.barangay = "";
        } else if (field === "cityMunicipal") {
          updatedAddress.barangay = "";
        }

        return { ...prev, address: updatedAddress };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = await validateForm(formData, validationRules);
    setErrors(newErrors);

    const hasErrors =
      Object.keys(newErrors).length > 0 &&
      Object.values(newErrors).some(
        (v) => typeof v === "string" || (typeof v === "object" && Object.keys(v).length > 0)
      );

    if (!hasErrors) {
      console.log("✅ Valid Form Data:", formData);
      navigate("/welcome", { state: { username: formData.username } });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registration Form</h2>

      <FormInput
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
      />

      <FormInput
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />

      <AddressFields
        address={formData.address}
        errors={errors.address || {}}
        onChange={handleChange}
        regionsData={regionsData}
      />

      <button type="submit">Submit</button>
    </form>
  );
}

export default DynamicForm;
