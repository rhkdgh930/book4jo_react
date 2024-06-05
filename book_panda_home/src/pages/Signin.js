import React, { useState } from 'react';
import { Form, Input, Inputs, Title, Wrapper, Button, CustomLink } from '../components/Common';
import { useNavigate } from 'react-router-dom';
import { login } from '../apis/login.js';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [pw, setPW] = useState('');
  const router = useNavigate();

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePW = (e) => {
    setPW(e.target.value);
  };

  const onClick = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작을 막습니다.
    try {
      console.log("0 성공함");
      const result = login({ email, pw });
      console.log("1 성공함");
      const { accessToken, refreshToken } = result;
      console.log("2 성공함");
      localStorage.setItem('access', accessToken);
      localStorage.setItem('refresh', refreshToken);
      console.log("토큰삽입 성공함");
      router('/');
    } catch (error) {
      console.log("실패함");
      console.error('로그인 실패:', error);
    }
  };

  return (
    <Wrapper>
      <Title>로그인하기</Title>
      <Form>
        <Inputs>
          <Input placeholder="이메일" value={email} onChange={onChangeEmail} />
          <Input placeholder="비밀번호" type="password" value={pw} onChange={onChangePW} />
        </Inputs>
        <Button onClick={onClick}>로그인</Button>
      </Form>
      <CustomLink to="/signup">회원가입하기</CustomLink>
    </Wrapper>
  );
};

export default Signin;
