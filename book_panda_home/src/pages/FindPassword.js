import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Wrapper, Button, ButtonB } from '../components/Common';
import { useNavigate } from 'react-router-dom';

const FindPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const router = useNavigate();

  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,16}$/;

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
      setCodeVerified(true);
    } catch (error) {
      console.error("코드 인증 실패 :", error);
      setMessage('코드 인증 실패.');
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!passwordPattern.test(newPassword)) {
      setMessage('비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/users/change-password', {
        userEmail: email,
        newPassword: newPassword
      });
      setMessage('비밀번호 변경에 성공했습니다.');
      router('/');
    } catch (error) {
      console.error("비밀번호 변경 실패 :", error);
      setMessage('비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <Wrapper>
      <Form>
        <div>
          <div className="custom-text">이메일 :</div>
          <div className="email-input-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              placeholder="bookpanda@elice.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <ButtonB type="button" onClick={sendEmail}>인증번호 받기</ButtonB>
          </div>
          {codeSent && (
            <div>
              <div className="custom-text">인증번호 * :</div>
              <div className="code-input-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                  placeholder="인증번호 입력"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <ButtonB type="button" onClick={verifyCode}>확인</ButtonB>
              </div>
            </div>
          )}
          {codeVerified && (
            <div>
              <div className="custom-text">새 비밀번호 * :</div>
              <div>
                <Input
                  type="password"
                  placeholder="새 비밀번호 입력"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="custom-text">새 비밀번호 재확인 * :</div>
              <div>
                <Input
                  type="password"
                  placeholder="새 비밀번호 재확인"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
        </div>
      </Form>
    </Wrapper>
  );
};

export default FindPassword;
