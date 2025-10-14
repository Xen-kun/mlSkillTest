import FormInput from "./FormInput";
import FormSelect from "./FormSelect";

function AddressFields({ address, errors, onChange, regionsData }) {
  const regionOptions = Object.keys(regionsData);
  const provinceOptions = address.region ? Object.keys(regionsData[address.region]) : [];
  const cityMunicipalOptions =
    address.region && address.province
      ? Object.keys(regionsData[address.region][address.province])
      : [];
  const barangayOptions =
    address.region && address.province && address.cityMunicipal
      ? regionsData[address.region][address.province][address.cityMunicipal]
      : [];

  return (
    <fieldset style={{ border: "1px solid #555", padding: "10px", borderRadius: "8px" }}>
      <legend>Address</legend>

      <FormInput
        label="Street"
        name="address.street"
        value={address.street}
        onChange={onChange}
        error={errors?.street}
      />

      <FormInput
        label="ZIP Code"
        name="address.zip"
        value={address.zip}
        onChange={onChange}
        error={errors?.zip}
      />

      <FormSelect
        label="Region"
        name="address.region"
        value={address.region}
        options={regionOptions}
        onChange={onChange}
        error={errors?.region}
      />

      <FormSelect
        label="Province"
        name="address.province"
        value={address.province}
        options={provinceOptions}
        onChange={onChange}
        disabled={!address.region}
        error={errors?.province}
      />

      <FormSelect
        label="City / Municipality"
        name="address.cityMunicipal"
        value={address.cityMunicipal}
        options={cityMunicipalOptions}
        onChange={onChange}
        disabled={!address.province}
        error={errors?.cityMunicipal}
      />

      <FormSelect
        label="Barangay"
        name="address.barangay"
        value={address.barangay}
        options={barangayOptions}
        onChange={onChange}
        disabled={!address.cityMunicipal}
        error={errors?.barangay}
      />
    </fieldset>
  );
}

export default AddressFields;
