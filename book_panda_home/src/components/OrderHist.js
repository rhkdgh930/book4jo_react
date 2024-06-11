import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/OrderHist.module.css';

function OrderHist() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders', {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            setOrders(response.data);
        } catch (error) {
            console.error('err :', error);
        }
    };

    return (
        <div className={styles.orderHistContainer}>
            <h2>주문 내역</h2>
            {orders.length === 0 ? (
                <div>주문한 내역이 없습니다.</div>
            ) : (
                <table className={styles.orderTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>주문 날짜</th>
                            <th>총액</th>
                            <th>배송 상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td>{order.totalPrice.toLocaleString()}원</td>
                                <td>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default OrderHist;