import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/OrderHistory.module.css';
import OrderItem from './OrderItem';

function OrderHist() {
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState({});
    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if (orders.length > 0) {
            orders.forEach(order => fetchOrderItems(order.id));
        }
    }, [orders]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No access token found');
            }
            const response = await axios.get('/api/orders', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchOrderItems = async (orderId) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No access token found');
            }
            const response = await axios.get('/api/order/items', {
                params: { orderId },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });
            setOrderItems(prevItems => ({
                ...prevItems,
                [orderId]: response.data
            }));
        } catch (error) {
            console.error('주문 항목 요청 실패:', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString || isNaN(Date.parse(dateString))) {
            return '유효하지 않은 날짜';
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Intl.DateTimeFormat('ko-KR', options).format(new Date(dateString));
    };

    const handleCancelPayment = async (orderId) => {
        // 결제 취소 로직 구현
    };

    const handleOrderDetailsClick = (orderId) => {
        navigate(`/order?orderId=${orderId}`);
    };

    return (
        <div className={styles.orderHistoryContainer}>
            <div className={styles.selectPage}>
                <div className={styles.selectPageButton}>
                    <Link to="/mypage">회원정보관리</Link>
                </div>
                <div className={styles.selectPageButton}>
                    <Link to="/mypage/ordered">주문내역</Link>
                </div>
            </div>
            <div className={styles.orderHistory}>
                <h2>주문 내역</h2>
                {orders.length === 0 ? (
                    <div className={styles.noOrders}>주문한 내역이 없습니다.</div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className={styles.order}>
                            <div className={styles.orderHeader}>
                                <span className={styles.orderDate}>{formatDate(order.orderDate)} 주문</span>
                                <button
                                    onClick={() => handleOrderDetailsClick(order.id)}
                                    className={styles.trackOrderButton}
                                >
                                    주문 상세보기
                                </button>
                            </div>
                            <div className={styles.orderBody}>
                                <div className={styles.orderStatus}>
                                    배송중
                                </div>
                                <table className={styles.orderItems}>
                                    <tbody>
                                        {orderItems[order.id] ? (
                                            orderItems[order.id].map(item => (
                                                <OrderItem key={item.id} item={item} />
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4">주문 항목 불러오는 중...</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <div className={styles.orderActions}>
                                    {/* 결제 취소 버튼 등 추가 가능 */}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default OrderHist;
