// /src/utils/validateAlert.js
export async function validateForm(data, rules) {
  const errors = {};

  for (const field in rules) {
    const rule = rules[field];
    const value = data ? data[field] : undefined;

    // Detect nested object rules (e.g., address: { street: {...}, zip: {...} })
    const isNestedObject =
      typeof rule === "object" &&
      !rule.required &&
      !rule.minLength &&
      !rule.custom &&
      !rule.async &&
      !rule.numeric;

    if (isNestedObject) {
      // If the corresponding value is missing, pass an empty object to avoid runtime errors
      const nestedValue = value || {};
      const nestedErrors = await validateForm(nestedValue, rule);
      if (Object.keys(nestedErrors).length > 0) {
        errors[field] = nestedErrors;
      }
      continue;
    }

    // Basic required validation
    if (rule.required) {
      if (value === undefined || value === null || value === "") {
        errors[field] = "This field is required";
        // continue; // don't continue here because we may still want to run other checks only if value exists
      }
    }

    // minLength (only apply when value exists)
    if (rule.minLength && value !== undefined && value !== null) {
      if (String(value).length < rule.minLength) {
        errors[field] = `Must be at least ${rule.minLength} characters`;
      } else if (field === "password") {
        // ✅ Strong password check
        const strongPasswordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

        if (!strongPasswordRegex.test(value)) {
          errors[field] =
            "Password must contain at least one uppercase letter, lowercase letter, number, and one special character.";
        }
      }
    }

    // numeric check (ZIP code) — only if value provided
    if (rule.numeric && value !== undefined && value !== null && value !== "") {
      // allow only digits
      if (!/^\d+$/.test(String(value))) {
        errors[field] = "This entry can only contain numbers. Please try again.";
      }
    }

    // custom validation function (only if value exists or custom expects empty)
    if (rule.custom) {
      const ok = rule.custom(value, data);
      if (!ok) {
        errors[field] = "Invalid value";
      }
    }

    // async checks (e.g. username uniqueness) — only when value exists
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
        // network/server failure — return friendly message
        errors[field] = "Server validation failed";
      }
    }
  }

  //
  // Dependent address validation policy
  // - If region is missing → show only region error (plus keep independent nested errors like street/zip)
  // - If region present but province missing → show only province error (plus keep independent nested errors)
  // - If province present but city missing → show only cityMunicipal error
  // - If city present but barangay missing → show only barangay error
  //
  if (data && data.address) {
    const addr = data.address;
    const addrErrors = errors.address ? { ...errors.address } : {};

    // Keep independent address errors (like street/zip), but remove dependent-level errors unless appropriate.
    const independentAddrKeys = Object.keys(addrErrors).filter(
      (k) => !["region", "province", "cityMunicipal", "barangay"].includes(k)
    );
    // Build a base object that keeps independent address errors (street/zip)
    const baseAddrErrors = {};
    independentAddrKeys.forEach((k) => {
      baseAddrErrors[k] = addrErrors[k];
    });

    if (!addr.region) {
      // only show region error (plus independent address errors)
      errors.address = { ...baseAddrErrors, region: "Region is required." };
    } else if (!addr.province) {
      // region present, only show province error
      errors.address = { ...baseAddrErrors, province: "Province is required." };
    } else if (!addr.cityMunicipal) {
      // region & province present, only show city/municipality error
      errors.address = { ...baseAddrErrors, cityMunicipal: "City/Municipality is required." };
    } else if (!addr.barangay) {
      // region, province, city present — require barangay
      errors.address = { ...baseAddrErrors, barangay: "Barangay is required." };
    } else {
      // all dependent address levels filled — keep any existing independent errors (street/zip)
      if (Object.keys(baseAddrErrors).length > 0) {
        errors.address = baseAddrErrors;
      } else {
        // no address errors at all
        if (errors.address) delete errors.address;
      }
    }
  }

  return errors;
}
