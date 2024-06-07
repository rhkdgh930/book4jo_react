import React, { useState } from 'react';
import { Form, Input, Inputs, Title, Wrapper, Button, CustomLink } from '../components/Common';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { signUp } from '../apis/signUp';
import { login } from '../apis/login'; // 로그인 API 추가
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
      console.error("코드 전송에 실패 :", error);
      setMessage('코드 전송에 실패했습니다.');
    }
  };

  const verifyCode = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/sign-up/verify-code', {
        userEmail: email,
        authCode: code
      });
      setMessage(response.data);
    } catch (error) {
      console.error("코드 인증 실패 :", error);
      setMessage('코드 인증 실패.');
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

      // 회원가입 후 자동으로 로그인 처리
      const loginResponse = await login({ email, pw });
      const { accessToken, refreshToken } = loginResponse;
      localStorage.setItem('access', accessToken);
      localStorage.setItem('refresh', refreshToken);

      router('/');
    } catch (error) {
      console.error("회원가입 실패 :", error);
      setMessage('회원가입 실패.');
    }
  };

  return (
    <Wrapper>
      <Title>회원가입</Title>
      <Inputs>
        <h3>이메일(필수)</h3>
        <Input placeholder="ex)bookpanda@elice.com" value={email} onChange={onChangeEmail} />
        <Button onClick={sendEmail}>인증번호 전송</Button>
        {codeSent && (
          <div>
            <h3>인증번호(필수)</h3>
            <div>
              <Input placeholder="인증번호 입력" value={code} onChange={handleCodeChange} />
              <Button onClick={verifyCode}>확인</Button>
            </div>
          </div>
        )}
        <h3>비밀번호(필수)</h3>
        <Input placeholder="특수문자, 영어 대, 소문자 숫자를 포함시켜 주세요" type="password" value={pw} onChange={onChangePW} />
        <h3>비밀번호 확인(필수)</h3>
        <Input placeholder="비밀번호 확인" type="password" value={confirmPw} onChange={onChangeConfirmPW} />
        <h3>이름(필수)</h3>
        <Input placeholder="이름" value={name} onChange={onChangeName} />
        <h3>주소</h3>
        <Input placeholder="주소" value={address} onChange={onChangeAddress} />
        <h3>전화번호</h3>
        <Input placeholder="하이픈, 띄어쓰기를 제외한 숫자만 입력해주세요." value={phoneNumber} onChange={onChangePhoneNumber} />
      </Inputs>
      <Button onClick={onClickSignUp}>회원 가입하기</Button>
      {message && <p>{message}</p>}
    </Wrapper>
  );
};

export default Signup;
