import React, { useState } from 'react';
import { Form, Input, Inputs, Title, Wrapper, Button, CustomLink } from '../components/Common';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { signUp } from '../apis/signUp';
import axios from 'axios';

const Signup = () => {
  const [email, onChangeEmail] = useForm();
  const [pw, onChangePW] = useForm();
  const [confirmPw, onChangeConfirmPW] = useForm();
  const [name, onChangeName] = useForm();
  const [address, onChangeAddress] = useForm();
  const [phoneNumber, onChangePhoneNumber] = useForm();
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [message, setMessage] = useState('');
  const router = useNavigate();

  const sendEmail = async () => {
      try {
          const response = await axios.post('http://localhost:8080/api/users/sign-up/send-email', {
              userEmail: email
          });
          setMessage(response.data);
          setCodeSent(true);
      } catch (error) {
          console.error("Error sending email:", error);
          setMessage('Failed to send email.');
      }
  };

  const verifyCode = async () => {
      try {
          const response = await axios.post('http://localhost:8080/api/users/sign-up/verify-code', {
              userEmail: email,
              authCode: code // authCode 필드 추가
          });
          setMessage(response.data);
      } catch (error) {
          console.error("Error verifying code:", error);
          setMessage('Failed to verify code.');
      }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const onClickSignUp = async () => {
    if (pw !== confirmPw) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await signUp(email, pw, name, address, phoneNumber);
      router('/');
    } catch (error) {
      console.error("Error signing up:", error);
      setMessage('Failed to sign up.');
    }
  };

  return (
    <Wrapper>
      <Title>회원가입</Title>
      <Inputs>
        <Input placeholder="ex)bookpanda@elice.com" value={email} onChange={onChangeEmail} />
        <Button onClick={sendEmail}>인증번호 전송</Button>
        {codeSent && (
          <div>
            <Input placeholder="인증번호 입력" value={code} onChange={handleCodeChange} />
            <Button onClick={verifyCode}>인증번호</Button>
          </div>
        )}
        <Input placeholder="비밀번호" type="password" value={pw} onChange={onChangePW} />
        <Input placeholder="비밀번호 확인" type="password" value={confirmPw} onChange={onChangeConfirmPW} />
        <Input placeholder="이름" value={name} onChange={onChangeName} />
        <Input placeholder="주소" value={address} onChange={onChangeAddress} />
        <Input placeholder="전화번호" value={phoneNumber} onChange={onChangePhoneNumber} />
      </Inputs>
      <Button onClick={onClickSignUp}>회원 가입하기</Button>
      {message && <p>{message}</p>}
    </Wrapper>
  );
};

export default Signup;