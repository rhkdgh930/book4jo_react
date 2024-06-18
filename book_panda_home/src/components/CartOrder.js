import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/order.module.css';
import style from '../styles/CartItem.module.css';

function CartOrder() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState('');
    const [detailedAddress, setDetailedAddress] = useState('');
    const [postCode, setPostCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userName, setUserName] = useState('');
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [errors, setErrors] = useState({});

    const [error, setError] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const daumPostcodeScript = document.createElement("script");

        const jquery = document.createElement("script");
        jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
        const iamport = document.createElement("script");
        iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.2.0.js";

        daumPostcodeScript.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        daumPostcodeScript.onload = () => setScriptLoaded(true);
        document.head.appendChild(jquery);
        document.head.appendChild(iamport);
        document.head.appendChild(daumPostcodeScript);

        fetchCartOrder(); // 주문 정보와 함께 주소 정보도 가져오도록 호출

        return () => {
            document.head.removeChild(daumPostcodeScript);
            document.head.removeChild(iamport);
        };
    }, []);

    const fetchCartOrder = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No access token found');
            }
            const response = await axios.get('/api/cart/order', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            const cartData = response.data;
            setCart(cartData);
            setAddress(cartData.userAddress1);
            setDetailedAddress(cartData.userAddress2);
            setPostCode(cartData.userPostCode);
            setPhoneNumber(cartData.userPhoneNumber);
            setUserName(cartData.userName);
        } catch (error) {
            console.error('주문 정보 요청 실패:', error.response.data);
            navigate("/cart");
        } finally {
            setLoading(false);
        }
    };

    const handlePostcode = (e) => {
        e.preventDefault();
        if (!scriptLoaded) {
            setErrors({ ...errors, address: '주소 검색 스크립트가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.' });
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data) {
                setAddress(data.address + (data.buildingName ? `, ${data.buildingName}` : ""));
                setPostCode(data.zonecode);
            },
        }).open();
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        } else {
            return text;
        }
    };

    const handlePayment = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No access token found');
        }

        const getKoreanDate = () => {
            const date = new Date();
            const offset = 9 * 60; // 한국 시간은 UTC+9
            const koreanDate = new Date(date.getTime() + offset * 60 * 1000);
            return koreanDate;
        };

        const orderData = {
            orderDate: getKoreanDate(),
        };

        const shippingData = {
            address1: address,
            address2: detailedAddress,
            payDoneDate: getKoreanDate(),
            postCode: postCode,
            shippingUserName: userName,
            phoneNumber: phoneNumber,
        };

        try {
            const orderResponse = await axios.post(`/api/orders`, orderData, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            const shippingResponse = await axios.post(`/api/shipping`, shippingData, {
                params: { orderId: orderResponse.data.id },
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
        } catch (error) {
            alert(error.response.data);
            navigate(-1);
        }

    }

    return (
        <div className={styles.orderInfo}>
            <h2 className={styles.heading}>주문 정보</h2>
            <h3 className={styles.subheading}>주문 상품</h3>
            <table className={styles.orderTable}>
                <thead>
                    <tr>
                        <th>상품</th>
                        <th>수량</th>
                        <th>가격</th>
                    </tr>
                </thead>
                <tbody>
                    {cart && cart.cartItems.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <div className={style.itemInfo}>
                                    <img src={item.image} alt={item.title} className={style.itemImage} />
                                    <span className={style.itemTitle}>{truncateText(item.title, 40)}</span>
                                </div>
                            </td>
                            <td>{item.quantity.toLocaleString()}</td>
                            <td>{(item.quantity * item.price).toLocaleString()}원</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.orderDetail}>총 가격: {cart && cart.totalPrice.toLocaleString()}원</div>

            <h3 className={styles.subheading}>배송지 정보 입력</h3>
            <table className={styles.addressTable}>
                <tbody>
                    <tr>
                        <th>받으시는 분</th>
                        <td>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>주소</th>
                        <td>
                            <div className={styles.addressInputWrapper}>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="주소를 입력해주세요."
                                    readOnly
                                />
                                <button onClick={handlePostcode}>주소 검색</button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>상세 주소</th>
                        <td>
                            <input
                                type="text"
                                value={detailedAddress}
                                onChange={(e) => setDetailedAddress(e.target.value)}
                                placeholder="상세 주소를 입력해주세요."
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>우편번호</th>
                        <td>
                            <input
                                type="text"
                                value={postCode}
                                onChange={(e) => setPostCode(e.target.value)}
                                placeholder="우편번호를 입력해주세요."
                                readOnly
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>휴대전화번호</th>
                        <td>
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>

            <button className={styles.button} onClick={handlePayment}>결제하기</button>
        </div>
    );
}

export default CartOrder;
