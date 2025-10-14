export async function validateForm(data, rules) {
  const errors = {};

  for (const field in rules) {
    const rule = rules[field];
    const value = data ? data[field] : undefined;

    const isNestedObject =
      typeof rule === "object" &&
      !rule.required &&
      !rule.minLength &&
      !rule.custom &&
      !rule.async &&
      !rule.numeric;

    if (isNestedObject) {
      const nestedValue = value || {};
      const nestedErrors = await validateForm(nestedValue, rule);
      if (Object.keys(nestedErrors).length > 0) {
        errors[field] = nestedErrors;
      }
      continue;
    }

    if (rule.required) {
      if (value === undefined || value === null || value === "") {
        errors[field] = "This field is required";
      }
    }

    if (rule.minLength && value !== undefined && value !== null) {
      if (String(value).length < rule.minLength) {
        errors[field] = `Must be at least ${rule.minLength} characters`;
      } else if (field === "password") {
        const strongPasswordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

        if (!strongPasswordRegex.test(value)) {
          errors[field] =
            "Password must contain at least one uppercase letter, lowercase letter, number, and one special character.";
        }
      }
    }

    if (rule.numeric && value !== undefined && value !== null && value !== "") {
      if (!/^\d+$/.test(String(value))) {
        errors[field] = "This entry can only contain numbers. Please try again.";
      }
    }

    if (rule.custom) {
      const ok = rule.custom(value, data);
      if (!ok) {
        errors[field] = "Invalid value";
      }
    }

    if (rule.async === "checkUsernameUnique" && value) {
      try {
        const res = await fetch(
          `http://localhost:3001/check-username?username=${encodeURIComponent(value)}`
        );
        const json = await res.json();
        if (!json.available) {
          errors[field] = "Username is already taken";
        }
      } catch (err) {
        errors[field] = "Server validation failed";
      }
    }
  }

  if (data && data.address) {
    const addr = data.address;
    const addrErrors = errors.address ? { ...errors.address } : {};

    const independentAddrKeys = Object.keys(addrErrors).filter(
      (k) => !["region", "province", "cityMunicipal", "barangay"].includes(k)
    );

    const baseAddrErrors = {};
    independentAddrKeys.forEach((k) => {
      baseAddrErrors[k] = addrErrors[k];
    });

    if (!addr.region) {
      errors.address = { ...baseAddrErrors, region: "Region is required." };
    } else if (!addr.province) {
      errors.address = { ...baseAddrErrors, province: "Province is required." };
    } else if (!addr.cityMunicipal) {
      errors.address = { ...baseAddrErrors, cityMunicipal: "City/Municipality is required." };
    } else if (!addr.barangay) {
      errors.address = { ...baseAddrErrors, barangay: "Barangay is required." };
    } else {
      if (Object.keys(baseAddrErrors).length > 0) {
        errors.address = baseAddrErrors;
      } else {
        if (errors.address) delete errors.address;
      }
    }
  }

  return errors;
}
