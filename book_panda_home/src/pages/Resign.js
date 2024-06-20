import React, { useState } from 'react';
import { Form, Input, Title, Wrapper, Button, Error, Red } from '../components/Common';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Resign = () => {
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmTextChange = (e) => setConfirmText(e.target.value);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    return passwordRegex.test(password);
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validatePassword(password)) {
      newErrors.password = '비밀번호 형식이 올바르지 않습니다.';
    }
    if (confirmText !== "유저 삭제를 동의합니다") {
      newErrors.confirmText = '유저 삭제를 동의합니다를 입력해야 합니다.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await api.put('/users/delete-user',
        { password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // 쿠키를 함께 전송
        }
      );

      if (response.status === 200) {
        alert('유저 삭제가 완료되었습니다.');
        localStorage.removeItem('accessToken');
        navigate('/');
      }
    } catch (error) {
      console.error('유저 삭제 실패:', error);
      setErrors({ message: '유저 삭제 실패. 다시 시도해주세요.' });
    }
  };

  return (
    <Wrapper>
      <Form>
        <Title>회원 탈퇴</Title>
        <div className="custom-text">비밀번호 &nbsp; {errors.password && <Error>{errors.password}</Error>}</div>
        <Input
          placeholder="비밀번호를 입력해주세요."
          type="password"
          value={password}
          onChange={handlePasswordChange}
          error={errors.password}
        />
        <div className="custom-text">유저 삭제를 동의합니다 &nbsp; {errors.confirmText && <Error>{errors.confirmText}</Error>}</div>
        <Input
          placeholder="유저 삭제를 동의합니다를 입력해주세요."
          value={confirmText}
          onChange={handleConfirmTextChange}
          error={errors.confirmText}
        />
        <Red>주의* 탈퇴하면 다시는 동일한 이메일을 사용하실수 없습니다.</Red>
        <Button onClick={handleDeleteUser}>삭제하기</Button>
        {errors.message && <Error>{errors.message}</Error>}
      </Form>
    </Wrapper>
  );
};

export default Resign;
