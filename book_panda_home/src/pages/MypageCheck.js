import React, { useState } from 'react';
import api from '../api';
import "../styles/MyPage.css";
import { Link, useNavigate } from 'react-router-dom';

function MypageCheck() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/mypage/checkingPassword', { password }, {
                withCredentials: true,
            });
            if (response.status === 200) {
                navigate('/mypage/user');
                alert('인증이 완료되었습니다.')
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('비밀번호가 틀렸습니다');
            } else {
                alert('오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="select-page">
                <div className="select-page-button">
                    <Link to="/mypage/check">회원정보관리</Link>
                </div>
                <div className="select-page-button">
                    <Link to="/mypage/ordered">주문내역</Link>
                </div>
            </div>
            <div className="mypage-container">
              <h2>비밀번호 확인</h2>
              <div className="inputs-row">
                <input
                    className="info-item"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="비밀번호를 입력해주세요."
                    required
                />
                <button type="submit">확인</button>
              </div>
            </div>
        </form>
    );
}

export default MypageCheck;
