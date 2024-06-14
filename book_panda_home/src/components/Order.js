import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import OrderItem from './OrderItem';
import styles from '../styles/order.module.css'; // Ensure this path is correct

function Order() {
    const [searchParams] = useSearchParams();
    const [orderItems, setOrderItems] = useState([]);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const orderId = searchParams.get('orderId');
        console.log("search : ", orderId);

        if (orderId) {
            fetchOrder(orderId);
            fetchOrderItems(orderId);
        }

        const loadScripts = async () => {
            try {
                await loadScript("https://code.jquery.com/jquery-1.12.4.min.js");
                await loadScript("https://cdn.iamport.kr/js/iamport.payment-1.2.0.js");
                await loadScript("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");
            } catch (error) {
                console.error("스크립트 로딩 실패:", error);
            }
        };

        loadScripts();

        return () => {
            removeScript("https://code.jquery.com/jquery-1.12.4.min.js");
            removeScript("https://cdn.iamport.kr/js/iamport.payment-1.2.0.js");
            removeScript("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");
        };
    }, [searchParams]);

    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    const removeScript = (src) => {
        const scripts = document.querySelectorAll(`script[src="${src}"]`);
        scripts.forEach(script => script.parentNode.removeChild(script));
    };

    const fetchOrder = async (orderId) => {
        try {
            const response = await axios.get('http://localhost:8080/api/order', {
                params: { orderId },
                withCredentials: true,
            });
            console.log("주문 정보 요청 성공:", response.data);
            setOrder(response.data);
        } catch (error) {
            console.error("주문 정보 요청 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderItems = async (orderId) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No access token found');
            }
            const response = await axios.get('http://localhost:8080/api/order/items', {
                params: { orderId },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            console.log("주문 항목 요청 성공:", response.data);
            const orderItems = Array.isArray(response.data) ? response.data.map(item => ({
                ...item
            })) : [];
            setOrderItems(orderItems);
        } catch (error) {
            console.error('주문 항목 요청 실패:', error);
        }
    };

    const requestPay = () => {
        const { IMP } = window;
        if (!IMP) {
            console.error('Iamport가 로드되지 않았습니다.');
            return;
        }

        IMP.init('imp14170881'); // 상점 식별코드

        IMP.request_pay({
            pg: 'html5_inicis',
            pay_method: 'card',
            merchant_uid: `merchant_${new Date().getTime()}`,
            name: order.productName,
            amount: order.totalPrice,
            buyer_email: order.userEmail,
            buyer_name: order.userName,
            buyer_tel: order.userTel,
            buyer_addr: order.userAddress,
            buyer_postcode: order.userPostcode,
        }, async (rsp) => {
            if (rsp.success) {
                try {
                    const { data } = await axios.post('http://localhost:8080/api/payment/verify/' + rsp.imp_uid);
                    if (rsp.paid_amount === data.amount) {
                        const paymentData = {
                            impUid: rsp.imp_uid,
                            merchantUid: rsp.merchant_uid,
                            amount: rsp.paid_amount,
                            buyerEmail: order.userEmail,
                            buyerName: order.userName,
                            buyerTel: order.userTel,
                            buyerAddr: order.userAddress,
                            buyerPostcode: order.userPostcode,
                            status: rsp.status,
                        };

                        await axios.post('http://localhost:8080/api/payment/save', paymentData);

                        setPaymentInfo({
                            product_name: order.productName,
                            amount: rsp.paid_amount,
                            buyer_email: order.userEmail,
                            buyer_name: order.userName,
                            buyer_tel: order.userTel,
                            buyer_addr: order.userAddress,
                            buyer_postcode: order.userPostcode,
                        });
                        setError(null);
                        alert('결제 성공');
                    } else {
                        setError('결제 검증 실패: 금액이 일치하지 않습니다.');
                        alert('결제 실패');
                    }
                } catch (error) {
                    console.error('결제 검증 및 저장 중 오류 발생:', error);
                    setError('결제 검증 및 저장 중 오류가 발생했습니다.');
                    alert('결제 실패');
                }
            } else {
                setError(`결제에 실패하였습니다: ${rsp.error_msg}`);
                alert('결제 실패');
            }
        });
    };

    const handleCancelOrder = async () => {
        try {
            const orderId = order.id;
            await axios.delete(`http://localhost:8080/api/cancel`, {
                params: { orderId },
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            console.log("주문이 취소되었습니다.");
            navigate(-1);
        } catch (error) {
            console.error('주문 취소 실패:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Intl.DateTimeFormat('ko-KR', options).format(new Date(dateString));
    };

    const handleAddress = () => {
        new window.daum.Postcode({
            oncomplete: (data) => {
                const fullAddress = data.address;
                const extraAddress = data.bname ? ` (${data.bname})` : '';
                const fullAddrWithPostcode = `${fullAddress}${extraAddress} (${data.zonecode})`;
                setOrder({
                    ...order,
                    userAddress: fullAddrWithPostcode,
                    userPostcode: data.zonecode
                });
            }
        }).open();
    };

    const openPaymentWindow = () => {
        const width = 600;
        const height = 400;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);

        const paymentWindow = window.open("", "결제 정보", `width=${width},height=${height},top=${top},left=${left}`);
        paymentWindow.document.write(`
            <html>
            <head><title>결제 정보</title></head>
            <body>
                <h3>결제 정보</h3>
                <p><strong>상품명:</strong> ${paymentInfo.product_name}</p>
                <p><strong>결제 금액:</strong> ${paymentInfo.amount}</p>
                <p><strong>이메일:</strong> ${paymentInfo.buyer_email}</p>
                <p><strong>구매자 이름:</strong> ${paymentInfo.buyer_name}</p>
                <p><strong>구매자 전화번호:</strong> ${paymentInfo.buyer_tel}</p>
                <p><strong>구매자 주소:</strong> ${paymentInfo.buyer_addr}</p>
                <p><strong>우편번호:</strong> ${paymentInfo.buyer_postcode}</p>
            </body>
            </html>
        `);
    };

    useEffect(() => {
        if (paymentInfo) {
            openPaymentWindow();
        }
    }, [paymentInfo]);

    return (
        <div className={styles.orderInfo}>
            {order ? (
                <>
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
                            {orderItems.map((item) => (
                                <OrderItem key={item.id} item={item} />
                            ))}
                        </tbody>
                    </table>
                    <div className={styles.orderDetail}>주문 번호: {order.id}</div>
                    <div className={styles.orderDetail}>주문 날짜: {formatDate(order.orderDate)}</div>
                    <div className={styles.orderDetail}>총 가격: {order.totalPrice.toLocaleString()}원</div>
                    <div className={styles.orderDetail}>사용자 이름: {order.userName}</div>
                    <div className={styles.orderDetail}>주소: {order.userAddress}</div>
                    <button className={styles.button} onClick={handleAddress}>주소 검색</button>
                    <button className={styles.button} onClick={requestPay}>결제하기</button>
                    <button className={styles.button} onClick={handleCancelOrder}>주문 취소</button>
                    {error && (
                        <div className={styles.errorInfo}>
                            <h3>결제 오류</h3>
                            <p>{error}</p>
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.errorMessage}>주문 정보를 불러올 수 없습니다.</div>
            )}
        </div>
    );
}

export default Order;
