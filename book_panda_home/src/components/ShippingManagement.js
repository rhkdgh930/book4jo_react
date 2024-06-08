import { useState, useEffect } from 'react';
import axios from 'axios';
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
        // 테스트 데이터 추가
        const testData = [
            { id: '1', status: '배송 대기', completedAt: null },
            { id: '2', status: '배송 중', completedAt: null },
            { id: '3', status: '배송 완료', completedAt: new Date(new Date().setDate(new Date().getDate() - 8)) },
            { id: '4', status: '주문 취소', completedAt: null },
            { id: '5', status: '배송 대기', completedAt: null },
            { id: '6', status: '배송 중', completedAt: null },
            { id: '7', status: '배송 완료', completedAt: new Date() },
            { id: '8', status: '주문 취소', completedAt: null },
            { id: '9', status: '배송 대기', completedAt: null },
            { id: '10', status: '배송 중', completedAt: null },
            { id: '11', status: '배송 완료', completedAt: new Date() },
            { id: '12', status: '주문 취소', completedAt: null },
            { id: '13', status: '배송 대기', completedAt: null },
            { id: '14', status: '배송 중', completedAt: null },
            { id: '15', status: '배송 완료', completedAt: new Date(new Date().setDate(new Date().getDate() - 9)) },
            { id: '16', status: '주문 취소', completedAt: null },
            { id: '17', status: '배송 대기', completedAt: null },
            { id: '18', status: '배송 중', completedAt: null },
            { id: '19', status: '배송 완료', completedAt: new Date(new Date().setDate(new Date().getDate() - 3)) },
            { id: '20', status: '주문 취소', completedAt: null },
            { id: '21', status: '배송 대기', completedAt: null },
            { id: '22', status: '배송 중', completedAt: null },
            { id: '23', status: '배송 완료', completedAt: new Date() },
            { id: '24', status: '주문 취소', completedAt: null },
            { id: '25', status: '배송 대기', completedAt: null },
            { id: '26', status: '배송 중', completedAt: null },
            { id: '27', status: '배송 완료', completedAt: new Date(new Date().setDate(new Date().getDate() - 4)) },
            { id: '28', status: '주문 취소', completedAt: null },
            { id: '29', status: '배송 대기', completedAt: null },
            { id: '30', status: '배송 중', completedAt: null }
        ];
        setOrders(testData);

        // 실제 API 호출 코드
        // try {
        //     const response = await axios.get('http://localhost:8080/api/orders');
        //     setOrders(response.data);
        // } catch (error) {
        //     console.error('Failed to fetch orders:', error);
        // }
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

    const updateOrderStatus = async (orderId) => {
        const newStatus = statusChanges[orderId];
        if (newStatus) {
            // 테스트 데이터
            const updatedOrders = orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus, completedAt: newStatus === '배송 완료' ? new Date() : order.completedAt } : order
            );
            setOrders(updatedOrders);

            // 실제 API 호출 코드
            // try {
            //     await axios.put(`http://localhost:8080/api/orders/${orderId}`, { status: newStatus });
            //     fetchOrders();
            // } catch (error) {
            //     console.error('Failed to update order status:', error);
            // }
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
    };

    const filteredOrders = orders.filter(order => {
        const isWithin7Days = order.completedAt ? (new Date() - new Date(order.completedAt)) / (1000 * 60 * 60 * 24) <= 7 : true;
        return (order.id.includes(searchTerm)) &&
            (filterStatus === '' || order.status === filterStatus) &&
            isWithin7Days;
    });

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>주문 배송 관리</h2>
            <div className={styles.searchContainer}>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="주문 번호 검색"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button onClick={fetchOrders}>검색</button>
                </div>
                <div className={styles.filterButtons}>
                    <button
                        className={filterStatus === '' ? styles.active : ''}
                        onClick={() => handleFilterChange('')}
                    >전체</button>
                    <button
                        className={filterStatus === '배송 대기' ? styles.active : ''}
                        onClick={() => handleFilterChange('배송 대기')}
                    >배송 대기</button>
                    <button
                        className={filterStatus === '배송 중' ? styles.active : ''}
                        onClick={() => handleFilterChange('배송 중')}
                    >배송 중</button>
                    <button
                        className={filterStatus === '배송 완료' ? styles.active : ''}
                        onClick={() => handleFilterChange('배송 완료')}
                    >배송 완료
                    </button>
                    <button
                        className={filterStatus === '주문 취소' ? styles.active : ''}
                        onClick={() => handleFilterChange('주문 취소')}
                    >주문 취소</button>
                </div>
            </div>

            
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
                        {filteredOrders.map(order => (
                            <tr key={order.id}>
                                <td>
                                    <Link to={`/mypage/order/${order.id}`}>{order.id}</Link>
                                </td>
                                <td>{order.status}</td>
                                <td>
                                    <select
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        value={statusChanges[order.id] || order.status}
                                    >
                                        <option value="배송 대기">배송 대기</option>
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
