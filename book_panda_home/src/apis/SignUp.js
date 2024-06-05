import axios from 'axios';

export const SignUp = async (email, pw, name, address, phoneNumber) => {
  const result = await axios.post('http://localhost:8080/api/users/sign-up', {
    email,
    pw,
    name,
    address,
    phoneNumber,
  });
  return result.data;
};