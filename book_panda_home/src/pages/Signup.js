import React, { useState, useEffect } from 'react';
import { Form, Input, Inputs, Title, Wrapper, Button, ButtonB, CustomLink, Error, Red } from '../components/Common';
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
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const router = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    return passwordRegex.test(password);
  };

  const validateName = (name) => {
    const notBlankRegex = /^(?!\s*$).+/;
    return notBlankRegex.test(name);
  };

  const sendEmail = async (e) => {
    e.preventDefault();  // 인증코드 유효시간은 5분입니다.
    if (!validateEmail(email)) {
      setErrors({ ...errors, email: '유효한 이메일 주소를 입력해주세요.' });
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/users/sign-up/send-email', {
        userEmail: email
      });
      setErrors({ ...errors, message: response.data });

      // 타이머 설정
      setTimeLeft(300); // 5분 = 300초
    } catch (error) {
      console.error("코드 전송에 실패 :", error);
      setErrors({ ...errors, message: '코드 전송에 실패했습니다.' });
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    if (!code) {
      setErrors({ ...errors, code: '인증번호를 입력해주세요.' });
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/users/sign-up/verify-code', {
        userEmail: email,
        authCode: code
      });
      setErrors({ ...errors, message: response.data });
    } catch (error) {
      console.error("코드 인증 실패 :", error);
      setErrors({ ...errors, message: '코드 인증 실패.' });
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const onClickSignUp = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validatePassword(pw)) {
      newErrors.pw = '비밀번호 형식이 올바르지 않습니다.';
    }
    if (pw !== confirmPw) {
      newErrors.confirmPw = '비밀번호가 일치하지 않습니다.';
    }
    if (!validateName(name)) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await signUp(email, pw, name, address, phoneNumber);
      alert('회원가입에 성공했습니다.');
      router('/signin');
    } catch (error) {
      console.error("회원가입 실패 :", error);
      setErrors({ ...errors, message: '회원가입 실패.' });
    }
  };

  useEffect(() => {
    if (timeLeft === null || timeLeft === 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((timeLeft) => timeLeft - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Wrapper>
      <Form>
        <Title>회원가입</Title>
        <Inputs>
          <div className="custom-text">이메일 &nbsp; <Red>*</Red> &nbsp; {errors.email && <Error>{errors.email}</Error>}</div>
          <div className="email-input-wrapper">
            <Input
              placeholder="bookpanda@elice.com"
              value={email}
              onChange={onChangeEmail}
              error={errors.email}
            />
            <ButtonB onClick={sendEmail}>인증코드 받기</ButtonB>
          </div>
          <div className="custom-text">인증코드 &nbsp; <Red>*</Red> &nbsp;
          {errors.code && <Error>{errors.code}</Error>} &nbsp;
          {timeLeft !== null && <div>인증코드 유효 시간: {formatTime(timeLeft)}</div>}
          </div>
          <div className="code-input-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              placeholder="인증번호 입력"
              value={code}
              onChange={handleCodeChange}
              error={errors.code}
            />
            <ButtonB onClick={verifyCode}>확인</ButtonB>
          </div>
          <div className="custom-text">비밀번호 &nbsp; <Red>*</Red> &nbsp; {errors.pw && <Error>{errors.pw}</Error>}</div>
          <Input
            placeholder="특수문자, 영어 대, 소문자 숫자를 포함시켜 주세요"
            type="password"
            value={pw}
            onChange={onChangePW}
            error={errors.pw}
          />
          <div className="custom-text">비밀번호 재확인 &nbsp; <Red>*</Red> &nbsp; {errors.confirmPw && <Error>{errors.confirmPw}</Error>}</div>
          <Input
            placeholder="특수문자, 영어 대, 소문자 숫자를 포함시켜 주세요"
            type="password"
            value={confirmPw}
            onChange={onChangeConfirmPW}
            error={errors.confirmPw}
          />
          <div className="custom-text">이름 &nbsp; <Red>*</Red> &nbsp; {errors.name && <Error>{errors.name}</Error>}</div>
          <Input
            placeholder="홍길둥"
            value={name}
            onChange={onChangeName}
            error={errors.name}
          />
          <div className="custom-text">주소</div>
          <Input
            placeholder="서울특별시 종로구 청와대로 1"
            value={address}
            onChange={onChangeAddress}
          />
          <div className="custom-text">휴대전화</div>
          <Input
            placeholder="하이픈, 띄어쓰기를 제외한 숫자만 입력해주세요."
            value={phoneNumber}
            onChange={onChangePhoneNumber}
            error={errors.phoneNumber}
          />
          {errors.phoneNumber && <Error>{errors.phoneNumber}</Error>}
        </Inputs>
        <Button onClick={onClickSignUp}>가입하기</Button>
        {errors.message && <Error>{errors.message}</Error>}
      </Form>
    </Wrapper>
  );
};

export default Signup;
