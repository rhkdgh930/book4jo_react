import { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import styles from '../styles/ShippingManagement.module.css';

function ShippingManagement() {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [statusChanges, setStatusChanges] = useState({});

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            console.log(response.data);
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const handleStatusChange = (orderId, newStatus) => {
        const updatedOrders = orders.map(order => {
            if (order.id === orderId) {
                return { ...order, status: newStatus, completedAt: newStatus === '배송 완료' ? new Date() : order.completedAt };
            }
            return order;
        });
        setStatusChanges({ ...statusChanges, [orderId]: newStatus });
        setOrders(updatedOrders);
    };

    const getKoreanDate = () => {
        const date = new Date();
        const offset = 9 * 60; // 한국 시간은 UTC+9
        const koreanDate = new Date(date.getTime() + offset * 60 * 1000);
        return koreanDate;
    };

    const updateOrderStatus = async (orderId) => {
        const newStatus = statusChanges[orderId];
        console.log(newStatus);
        if (newStatus) {
            try {
                await api.put(`/order?orderId=${orderId}`, { statusLabel: newStatus });
                fetchOrders();

                await api.put(`/shipping?orderId=${orderId}`, { statusLabel: newStatus, date: getKoreanDate() });
            } catch (error) {
                console.error('Failed to update order status:', error);
            }
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>주문 배송 관리</h2>

            <div className={styles.ordersTable}>
                <table>
                    <thead>
                        <tr>
                            <th>주문 번호</th>
                            <th>현재 상태</th>
                            <th>상태 변경</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>
                                    <Link to={`/order?orderId=${order.id}`}>{order.id}</Link>
                                </td>
                                <td>{order.statusLabel}</td>
                                <td>
                                    <select
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        value={statusChanges[order.id] || order.status}
                                    >
                                        <option value="주문 완료">주문 완료</option>
                                        <option value="배송 중">배송 중</option>
                                        <option value="배송 완료">배송 완료</option>
                                        <option value="주문 취소">주문 취소</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => updateOrderStatus(order.id)}>적용</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ShippingManagement;
