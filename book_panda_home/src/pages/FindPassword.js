import React, { useState, useEffect } from 'react';
import api from '../api';
import { Form, Input, Inputs, Title, Wrapper, Button, ButtonB, CustomLink, Error } from '../components/Common';
import { useNavigate } from 'react-router-dom';

const FindPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [codeVerified, setCodeVerified] = useState(false);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const router = useNavigate();

  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,16}$/;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendEmail = async (e) => {
      e.preventDefault();  // 인증코드 유효시간은 5분입니다.
      if (!validateEmail(email)) {
        setErrors({ ...errors, email: '유효한 이메일 주소를 입력해주세요.' });
        return;
      }
      try {
        const response = await api.post('/users/sign-up/send-email', {
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
      setErrors({ code: '인증번호를 입력해주세요.' });
      return;
    }
    try {
      const response = await api.post('/users/sign-up/verify-code', {
        userEmail: email,
        authCode: code
      });
      setMessage(response.data);
      setCodeVerified(true);
    } catch (error) {
      console.error("코드 인증 실패 :", error);
      setMessage('코드 인증 실패.');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!passwordPattern.test(newPassword)) {
      newErrors.newPassword = '비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = '새 비밀번호와 비밀번호 확인이 일치하지 않습니다.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await api.post('/users/change-password', {
        userEmail: email,
        newPassword: newPassword
      });
      alert('비밀번호 변경에 성공했습니다.');
      router('/signin');
    } catch (error) {
      console.error("비밀번호 변경 실패 :", error);
      setMessage('비밀번호 변경에 실패했습니다.');
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
        <Title>비밀번호 재생성</Title>
        <Inputs>
          <div className="custom-text">이메일 &nbsp; {errors.email && <Error>{errors.email}</Error>}</div>
          <div className="email-input-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              placeholder="bookpanda@elice.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <ButtonB type="button" onClick={sendEmail}>인증코드 받기</ButtonB>
          </div>
          <div className="custom-text">인증코드 &nbsp; {errors.code && <Error>{errors.code}</Error>} &nbsp;
          {timeLeft !== null && <div>인증코드 유효 시간: {formatTime(timeLeft)}</div>}
          </div>
          <div className="code-input-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              placeholder="인증코드 입력"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              error={errors.code}
            />
            <ButtonB type="button" onClick={verifyCode}>확인</ButtonB>
          </div>
          {codeVerified && (
            <div>
              <div className="custom-text">새 비밀번호 &nbsp; {errors.newPassword && <Error>{errors.newPassword}</Error>}</div>
              <div>
                <Input
                  type="password"
                  placeholder="새 비밀번호 입력"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={errors.newPassword}
                />
              </div>
              <div className="custom-text">새 비밀번호 재확인 &nbsp; {errors.confirmPassword && <Error>{errors.confirmPassword}</Error>}</div>
              <div>
                <Input
                  type="password"
                  placeholder="새 비밀번호 재확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                />
              </div>
              <Button
                className="styled-button"
                type="button"
                onClick={changePassword}
              >
                비밀번호 변경
              </Button>
            </div>
          )}
          {message && <div>{message}</div>}
        </Inputs>
      </Form>
    </Wrapper>
  );
};

export default FindPassword;
