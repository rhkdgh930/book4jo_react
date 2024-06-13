import React, { useState } from 'react';
import { Form, Input, Inputs, Title, Wrapper, Button, ButtonB, CustomLink } from '../components/Common';
import { useNavigate } from 'react-router-dom';
import { login } from '../apis/auth.js';

const Signin = ({setIsLoggedIn}) => {
  const [email, setEmail] = useState('');
  const [pw, setPW] = useState('');
  const navigate = useNavigate();

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePW = (e) => {
    setPW(e.target.value);
  };

  const onClick = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ userEmail: email, userPassword: pw });
      console.log('Login successful:', result);
      const accessToken = result.accessToken;
      localStorage.setItem('accessToken', accessToken);
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      alert('아이디 비밀번호를 확인해주세요.');
      console.error('로그인 실패:', error);
    }
  };

  return (
    <Wrapper>
      <Form>
        <Title>로그인</Title>
        <Inputs>
          <Input placeholder="이메일" value={email} onChange={onChangeEmail} />
          <Input placeholder="비밀번호" type="password" value={pw} onChange={onChangePW} />
        </Inputs>
        <Button onClick={onClick}>로그인</Button>
        <div className="custom-links">
          <p className="the-custom-link">아직 회원가입을 안하셨나요? <CustomLink to="/signup">회원가입하기</CustomLink></p>
          <p className="the-custom-link">비밀번호를 잊어버리셨나요? <CustomLink to="/find-password">네!</CustomLink></p>
        </div>
      </Form>
    </Wrapper>
  );
};

export default Signin;
