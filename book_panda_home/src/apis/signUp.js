import axios from 'axios';

export const signUp = async (email, pw, name, address, phoneNumber) => {
  const result = await axios.post('http://localhost:8080/api/users/sign-up', {
    userEmail: email,
    userPassword: pw,
    userName: name,
    address: address || '', // 주소와 전화번호를 선택적으로 보내도록 처리
    phoneNumber: phoneNumber || '',
  });
  return result.data;
};
