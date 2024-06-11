import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button } from '../components/Common';

const FindPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,16}$/;

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
      setCodeVerified(true);
    } catch (error) {
      console.error("코드 인증 실패 :", error);
      setMessage('코드 인증 실패.');
    }
  };

  const changePassword = async () => {
    if (!passwordPattern.test(newPassword)) {
      setMessage('비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/users/change-password', {
        userEmail: email,
        newPassword: newPassword
      });
      setMessage('비밀번호 변경에 성공했습니다.');
    } catch (error) {
      console.error("비밀번호 변경 실패 :", error);
      setMessage('비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <div>
      <div className="custom-text">이메일 * :</div>
      <div className="email-input-wrapper">
        <Input placeholder="bookpanda@elice.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button className="styled-button" onClick={sendEmail}>인증번호 받기</Button>
      </div>
      {codeSent && !codeVerified && (
        <div>
          <div className="custom-text">인증번호 * :</div>
          <div>
            <Input placeholder="인증번호 입력" value={code} onChange={(e) => setCode(e.target.value)} />
            <Button onClick={verifyCode}>확인</Button>
          </div>
        </div>
      )}
      {codeVerified && (
        <div>
          <div className="custom-text">새 비밀번호 * :</div>
          <div>
            <Input type="password" placeholder="새 비밀번호 입력" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Button onClick={changePassword}>비밀번호 변경</Button>
          </div>
        </div>
      )}
      {message && <div>{message}</div>}
    </div>
  );
};

export default FindPassword;
