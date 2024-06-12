import React, { useState } from 'react';
import { Form, Input, Inputs, Title, Wrapper, Button, ButtonB, CustomLink } from '../components/Common';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { signUp } from '../apis/signUp';
import { login } from '../apis/login';
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

  const sendEmail = async (e) => {
    e.preventDefault();
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

  const verifyCode = async (e) => {
    e.preventDefault();
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

  const onClickSignUp = async (e) => {
    e.preventDefault();
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
      <Form>
      <Title>회원가입</Title>
      <Inputs>
        <div className="custom-text">이메일 * :</div>
        <div className="email-input-wrapper">
          <Input placeholder="bookpanda@elice.com" value={email} onChange={onChangeEmail} />
          <ButtonB onClick={sendEmail}>인증번호 받기</ButtonB>
        </div>
        {codeSent && (
          <div>
            <div className="custom-text">인증번호 * :</div>
            <div>
              <Input placeholder="인증번호 입력" value={code} onChange={handleCodeChange} />
              <ButtonB onClick={verifyCode}>확인</ButtonB>
            </div>
          </div>
        )}
        <div className="custom-text">비밀번호 * :</div>
        <Input placeholder="특수문자, 영어 대, 소문자 숫자를 포함시켜 주세요" type="password" value={pw} onChange={onChangePW} />
        <div className="custom-text">비밀번호 재확인 * :</div>
        <Input placeholder="특수문자, 영어 대, 소문자 숫자를 포함시켜 주세요" type="password" value={confirmPw} onChange={onChangeConfirmPW} />
        <div className="custom-text">이름 * :</div>
        <Input placeholder="홍길둥" value={name} onChange={onChangeName} />
        <div className="custom-text">주소 :</div>
        <Input placeholder="서울특별시 종로구 청와대로 1" value={address} onChange={onChangeAddress} />
        <div className="custom-text">휴대전화 :</div>
        <Input placeholder="하이픈, 띄어쓰기를 제외한 숫자만 입력해주세요." value={phoneNumber} onChange={onChangePhoneNumber} />
      </Inputs>
      <Button onClick={onClickSignUp}>가입하기</Button>
      {message && <p>{message}</p>}
      </Form>
    </Wrapper>
  );
};

export default Signup;
