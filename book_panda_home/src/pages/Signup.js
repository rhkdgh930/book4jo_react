import React, { useState } from 'react';
import { Form, Input, Inputs, Title, Wrapper, Button, CustomLink } from '../components/Common';
import { useNavigate } from 'react-router-dom';
import Login from '../apis/login.js';
import { useForm } from '../hooks/useForm';
import { SignUp } from '../apis/SignUp';

const Signup = () => {
  const [email, onChangeEmail] = useForm();
  const [pw, onChangePW] = useForm();
  const [name, onChangeName] = useForm();
  const [address, onChangeAddress] = useForm();
  const [phoneNumber, onChangePhoneNumber] = useForm();
  const router = useNavigate();
  const onClick = async () => {
    await SignUp(email, pw, name, address, phoneNumber);
    router('/');
  };
  return (
    <Wrapper>
      <Title>회원가입</Title>
      <Inputs>
        <Input placeholder="ex)bookpanda@elice.com" value={email} onChange={onChangeEmail} />
        <Input placeholder="비밀번호" type="password" value={pw} onChange={onChangePW} />
        <Input placeholder="이름" value={name} onChange={onChangeName} />
        <Input placeholder="주소" value={address} onChange={onChangeAddress} />
        <Input placeholder="전화번호" value={phoneNumber} onChange={onChangePhoneNumber} />
      </Inputs>
      <Button onClick={onClick}>회원 가입하기</Button>
    </Wrapper>
  );
};

export default Signup;