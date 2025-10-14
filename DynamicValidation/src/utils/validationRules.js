export const validationRules = {
  username: {
    required: true,
    async: 'checkUsernameUnique',
  },
  password: {
    required: true,
    minLength: 8,
  },
  address: {
    street: { required: true },
    zip: { required: true, numeric: true },
  },
};
