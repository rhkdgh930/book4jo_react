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
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [deliveryType, setDeliveryType] = useState('default');
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
            console.log(cartData.userAddress1);
            console.log(cartData.userAddress2);
            console.log(cartData.userPostCode);
            setAddress(cartData.userAddress1);
            setDetailedAddress(cartData.userAddress2);
            setPostCode(cartData.userPostCode);
        } catch (error) {
            alert('주문 정보 요청 실패:', error.response.data);
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

    // const handlePayment = async () => {
    //     setLoading(true);
    //     const { IMP } = window;
    //     if (!IMP) {
    //         console.error('IAMPORT가 로드되지 않았습니다.');
    //         setLoading(false);
    //         return;
    //     }

    //     //        if (!cart || cart.totalPrice <= 0) {
    //     //            console.error('Invalid total price:', cart.totalPrice);
    //     //            setError('Invalid total price.');
    //     //            setLoading(false);
    //     //            return;
    //     //        }

    //     IMP.init('imp14170881');

    //     IMP.request_pay({
    //         pg: 'html5_inicis',
    //         pay_method: 'card',
    //         merchant_uid: `merchant_${new Date().getTime()}`,
    //         name: cart.cartItems.map(item => item.title).join(', '),
    //         amount: cart.totalPrice,
    //         buyer_email: cart.userEmail,
    //         buyer_name: cart.userName,
    //         buyer_tel: cart.userPhoneNumber,
    //         buyer_addr: address,
    //         buyer_postcode: postCode,
    //     }, async (rsp) => {
    //         if (rsp.success) {
    //             try {
    //                 const { data } = await axios.post('/api/payment/verify/' + rsp.imp_uid);
    //                 if (rsp.paid_amount === data.amount) {
    //                     const token = localStorage.getItem('accessToken');
    //                     if (!token) {
    //                         throw new Error('No access token found');
    //                     }

    //                     const getKoreanDate = () => {
    //                         const date = new Date();
    //                         const offset = 9 * 60; // 한국 시간은 UTC+9
    //                         const koreanDate = new Date(date.getTime() + offset * 60 * 1000);
    //                         return koreanDate;
    //                     };

    //                     const orderData = {
    //                         orderDate: getKoreanDate(),
    //                         address1: address,
    //                         address2: detailedAddress,
    //                         postCode: postCode,
    //                     };

    //                     const orderResponse = await axios.post(`/api/orders`, orderData, {
    //                         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    //                         withCredentials: true,
    //                     });

    //                     const paymentData = {
    //                         impUid: rsp.imp_uid,
    //                         merchantUid: rsp.merchant_uid,
    //                         amount: rsp.paid_amount,
    //                         buyerEmail: cart.userEmail,
    //                         buyerName: cart.userName,
    //                         buyerTel: cart.userPhoneNumber,
    //                         buyerAddr: address,
    //                         buyerPostcode: postCode,
    //                         status: rsp.status,
    //                     };

    //                     await axios.post('/api/payment/save', paymentData);

    //                     setPaymentInfo({
    //                         product_name: cart.cartItems.map(item => item.title).join(', '),
    //                         amount: rsp.paid_amount,
    //                         buyer_email: cart.userEmail,
    //                         buyer_name: cart.userName,
    //                         buyer_tel: cart.userPhoneNumber,
    //                         buyer_addr: address,
    //                         buyer_postcode: postCode,
    //                         status: rsp.status
    //                     });
    //                     setError(null);
    //                     alert('결제 성공');
    //                     navigate(`/order/orderId=${orderResponse.id}`);
    //                 } else {
    //                     setError('결제 검증 실패: 금액이 일치하지 않습니다.');
    //                     alert('결제 실패');
    //                 }
    //             } catch (error) {
    //                 console.error('결제 검증 및 저장 중 오류 발생:', error);
    //                 setError('결제 검증 및 저장 중 오류가 발생했습니다.');
    //                 alert('결제 실패');
    //             }
    //         } else {
    //             setError(`결제에 실패하였습니다: ${rsp.error_msg}`);
    //             alert('결제 실패');
    //         }

    //         setLoading(false);
    //     });
    // };

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
            address1: address,
            address2: detailedAddress,
            postCode: postCode,
        };
        try {
            const orderResponse = await axios.post(`/api/orders`, orderData, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
            <div className={styles.orderDetail}>사용자 이름: {cart && cart.userName}</div>
            <div className={styles.orderDetail}>전화번호: {cart && cart.userPhoneNumber}</div>

            <div>
                <label>
                    <input
                        type="radio"
                        value="default"
                        checked={deliveryType === 'default'}
                        onChange={() => {
                            setDeliveryType('default');
                            setAddress(cart.userAddress1);
                            setDetailedAddress(cart.userAddress2);
                            setPostCode(cart.userPostCode);
                        }}
                    />
                    기본 배송지
                </label>
                <label>
                    <input
                        type="radio"
                        value="new"
                        checked={deliveryType === 'new'}
                        onChange={() => {
                            setDeliveryType('new');
                            setAddress('');
                            setDetailedAddress('');
                            setPostCode('');
                        }}
                    />
                    새 배송지
                </label>
            </div>

            {deliveryType === 'default' ? (
                <div className={styles.addressInfo}>
                    <div>주소: {address}</div>
                    <div>상세 주소: {detailedAddress}</div>
                    <div>우편번호: {postCode}</div>
                </div>
            ) : (
                <div>
                    <div className="address-input-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            placeholder="주소를 검색해주세요."
                            defaultValue={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <button onClick={handlePostcode}>주소 검색</button>
                    </div>
                    <input
                        placeholder="상세 주소를 입력해주세요."
                        defaultValue={detailedAddress}
                        onChange={(e) => setDetailedAddress(e.target.value)}
                    />
                    <div className="custom-text">우편번호</div>
                    <input
                        placeholder="우편번호"
                        defaultValue={postCode}
                        onChange={(e) => setPostCode(e.target.value)}
                    />
                </div>
            )}

            <button className={styles.button} onClick={handlePayment}>결제하기</button>
        </div>
    );
}

export default CartOrder;
