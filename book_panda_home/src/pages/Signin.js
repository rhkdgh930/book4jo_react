import React, { useState } from 'react';
import { Form, Input, Inputs, Title, Wrapper, Button, ButtonB, CustomLink, Error } from '../components/Common';
import { useNavigate } from 'react-router-dom';
import { login } from '../apis/auth.js';

const Signin = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [pw, setPW] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePW = (e) => {
    setPW(e.target.value);
  };

  const onClick = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrors({ email: '유효한 이메일 주소를 입력해주세요.' });
      return;
    }

    if (!pw) {
      setErrors({ pw: '비밀번호를 입력해주세요.' });
      return;
    }

    try {
      const result = await login({ userEmail: email, userPassword: pw });
      const accessToken = result.accessToken;
      localStorage.setItem('accessToken', accessToken);
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      setErrors({ message: '아이디 비밀번호를 확인해주세요.' });
      console.error('로그인 실패:', error);
    }
  };

  return (
    <Wrapper>
      <Form>
        <Title>로그인</Title>
        <Inputs>
          <div className="custom-text">이메일 &nbsp; {errors.email && <Error>{errors.email}</Error>}</div>
          <Input
            placeholder="이메일"
            value={email}
            onChange={onChangeEmail}
            error={errors.email}
          />
          <div className="custom-text">비밀번호 &nbsp; {errors.pw && <Error>{errors.pw}</Error>}</div>
          <Input
            placeholder="비밀번호"
            type="password"
            value={pw}
            onChange={onChangePW}
            error={errors.pw}
          />
        </Inputs>
        <Button onClick={onClick}>로그인</Button>
        {errors.message && <Error>{errors.message}</Error>}
        <div className="custom-links">
          <p className="the-custom-link">아직 회원가입을 안하셨나요? <CustomLink to="/signup">회원가입하기</CustomLink></p>
          <p className="the-custom-link">비밀번호를 잊어버리셨나요? <CustomLink to="/find-password">네!</CustomLink></p>
        </div>
      </Form>
    </Wrapper>
  );
};

export default Signin;