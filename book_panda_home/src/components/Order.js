import React, { useEffect, useState } from 'react';
import api from '../api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import OrderItem from './OrderItem';
import styles from '../styles/OrderDetail.module.css';

function Order() {
    const [searchParams] = useSearchParams();
    const [orderItems, setOrderItems] = useState([]);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shipping, setShipping] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const orderId = searchParams.get('orderId');
        console.log("search : ", orderId);

        if (orderId) {
            fetchOrder(orderId);
            fetchOrderItems(orderId);
            fetchShipping(orderId);
        }
    }, [searchParams]);

    const fetchOrder = async (orderId) => {
        try {
            const response = await api.get('/order', {
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

    const getKoreanDate = () => {
        const date = new Date();
        const offset = 9 * 60; // 한국 시간은 UTC+9
        const koreanDate = new Date(date.getTime() + offset * 60 * 1000);
        return koreanDate;
    };

    const fetchOrderItems = async (orderId) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No access token found');
            }
            const response = await api.get('/order/items', {
                params: { orderId },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            await api.put(`/shipping?orderId=${orderId}`, { statusLabel: "주문 취소", date: getKoreanDate() });

            console.log("주문 항목 요청 성공:", response.data);
            const orderItems = Array.isArray(response.data) ? response.data.map(item => ({
                ...item
            })) : [];
            setOrderItems(orderItems);
        } catch (error) {
            console.error('주문 항목 요청 실패:', error);
        }
    };

    const fetchShipping = async (orderId) => {
        try {
            const response = await api.get(`/shipping`, {
                params: { orderId },
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            console.log(response.data);
            setShipping(response.data);
            console.log(shipping);
        } catch (error) {
            console.error(error.data);
        }
    };

    const handleCancelOrder = async () => {
        try {
            const orderId = order.id;
            console.log(orderId);
            const response = await api.post('/order/cancel', null, {
                params: { orderId },
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            alert("주문이 취소되었습니다.");
            navigate(-1);
        } catch (error) {
            console.error('주문 취소 실패:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Intl.DateTimeFormat('ko-KR', options).format(new Date(dateString));
    };

    const canCancelOrder = shipping.statusLabel === '주문 완료';

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
                    <h3 className={styles.subheading}>주문 상세</h3>
                    <table className={styles.infoTable}>
                        <tbody>
                            <tr>
                                <th>주문 번호</th>
                                <td>{order.id}</td>
                            </tr>
                            <tr>
                                <th>주문 날짜</th>
                                <td>{formatDate(order.orderDate)}</td>
                            </tr>
                            <tr>
                                <th>총 가격</th>
                                <td>{order.totalPrice.toLocaleString()}원</td>
                            </tr>
                        </tbody>
                    </table>
                    <h3 className={styles.subheading}>배송 정보</h3>
                    <table className={styles.infoTable}>
                        <tbody>
                            <tr>
                                <th>배송 상태</th>
                                <td>{shipping.statusLabel}</td>
                            </tr>
                            <tr>
                                <th>받는 사람</th>
                                <td>{shipping.shippingUserName}</td>
                            </tr>
                            <tr>
                                <th>주소</th>
                                <td>{shipping.address1} {shipping.address2}</td>
                            </tr>
                            <tr>
                                <th>전화번호</th>
                                <td>{shipping.phoneNumber}</td>
                            </tr>
                        </tbody>
                    </table>
                    {canCancelOrder && (
                        <button className={styles.button} onClick={handleCancelOrder}>주문 취소</button>
                    )}
                </>
            ) : (
                <div className={styles.errorMessage}>주문 정보를 불러올 수 없습니다.</div>
            )}
        </div>
    );
}

export default Order;
